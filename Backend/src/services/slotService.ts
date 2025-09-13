import db from "../db/knex";
import { getWeekDates, dateToDayOfWeek } from "../utils/dateUtils";

type RecurringSlot = {
  id: number;
  day_of_week: number;
  start_time: string;
  end_time: string;
};

type ExceptionRow = {
  id: number;
  slot_id: number;
  exception_date: string; // 'YYYY-MM-DD'
  new_start_time: string | null;
  new_end_time: string | null;
  is_deleted: boolean;
};

export async function createRecurringSlot(day_of_week: number, start_time: string, end_time: string) {
  const [id] = await db("slots").insert({ day_of_week, start_time, end_time }).returning("id");
  return id;
}

export async function addException(slot_id: number, exception_date: string, payload: { new_start_time?: string | null, new_end_time?: string | null, is_deleted?: boolean }) {
  const row = {
    slot_id,
    exception_date,
    new_start_time: payload.new_start_time ?? null,
    new_end_time: payload.new_end_time ?? null,
    is_deleted: payload.is_deleted ?? false,
  };
  // Upsert: if unique exists, update
  const existing = await db("exceptions").where({ slot_id, exception_date }).first();
  if (existing) {
    await db("exceptions").where({ id: existing.id }).update(row);
    return existing.id;
  } else {
    const [id] = await db("exceptions").insert(row).returning("id");
    return id;
  }
}

/**
 * Fetch slots for a given week starting at `weekStartISO` (YYYY-MM-DD)
 * Returns: { date: 'YYYY-MM-DD', slots: [{slotId, start_time, end_time, isException}] }
 */
export async function fetchSlotsForWeek(weekStartISO: string) {
  const dates = getWeekDates(weekStartISO);
  // 1) Get recurring slots whose day_of_week matches any date's day
  const daySet = Array.from(new Set(dates.map(dateToDayOfWeek))); // e.g. [1,2,...]
  const recurringSlots: RecurringSlot[] = await db("slots").whereIn("day_of_week", daySet).select("*");

  // 2) Get exceptions in date range
  const exceptions: ExceptionRow[] = await db("exceptions").whereBetween("exception_date", [dates[0], dates[6]]).select("*");

  // 3) For each date, build slots
  const result: { date: string; slots: Array<any> }[] = [];

  for (const date of dates) {
    const dow = dateToDayOfWeek(date);
    // base slots for this day
    const baseSlots = recurringSlots.filter(s => s.day_of_week === dow);

    const daySlots: any[] = [];

    for (const base of baseSlots) {
      // check for exception for this base slot on this date
      const ex = exceptions.find(e => e.slot_id === base.id && e.exception_date === date);
      if (ex) {
        if (ex.is_deleted) {
          // skip this slot (deleted on this date)
          continue;
        } else {
          // replace times with new times if provided
          daySlots.push({
            slotId: base.id,
            start_time: ex.new_start_time ?? base.start_time,
            end_time: ex.new_end_time ?? base.end_time,
            isException: true,
            exceptionId: ex.id,
          });
        }
      } else {
        // normal recurring slot
        daySlots.push({
          slotId: base.id,
          start_time: base.start_time,
          end_time: base.end_time,
          isException: false,
        });
      }
    }

    // Note: requirement says max 2 slots per date. We won't enforce at read time,
    // enforce during create on the route.
    result.push({ date, slots: daySlots });
  }

  return result;
}
