// src/services/slotsService.ts
import db from "../db/knex";
import { getWeekDates, dateToDayOfWeek } from "../utils/dateUtils";

type RecurringSlot = {
  id: number;
  day_of_week: number;
  start_time: string;
  end_time: string;
};

type ExceptionRowRaw = {
  id: number;
  slot_id: number;
  exception_date: any;
  new_start_time: string | null;
  new_end_time: string | null;
  is_deleted: boolean;
};

type ExceptionRow = {
  id: number;
  slot_id: number;
  exception_date: string;
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
  const existing = await db("exceptions").where({ slot_id, exception_date }).first();
  if (existing) {
    await db("exceptions").where({ id: existing.id }).update(row);
    return existing.id;
  } else {
    const [id] = await db("exceptions").insert(row).returning("id");
    return id;
  }
}

export async function fetchSlotsForWeek(weekStartISO: string) {
  const dates = getWeekDates(weekStartISO);

  // 1) Recurring slots for the days in the week
  const daySet = Array.from(new Set(dates.map(dateToDayOfWeek)));
  const recurringSlots: RecurringSlot[] = await db("slots").whereIn("day_of_week", daySet).select("*");

  // 2) Raw exceptions in date range
  const rawExceptions: ExceptionRowRaw[] = await db("exceptions")
    .whereBetween("exception_date", [dates[0], dates[6]])
    .select("*");

  // 3) Normalize exceptions so comparison is reliable
  const exceptions: ExceptionRow[] = rawExceptions.map((e) => {
    let exDateStr: string;
    if (e.exception_date instanceof Date) {
  const dt = e.exception_date;
  const y = dt.getFullYear();
  const m = String(dt.getMonth() + 1).padStart(2, "0");
  const d = String(dt.getDate()).padStart(2, "0");
  exDateStr = `${y}-${m}-${d}`;
} else {
  exDateStr = String(e.exception_date).slice(0, 10);
}

    return {
      id: Number(e.id),
      slot_id: Number(e.slot_id),
      exception_date: exDateStr,
      new_start_time: e.new_start_time ?? null,
      new_end_time: e.new_end_time ?? null,
      is_deleted: Boolean(e.is_deleted),
    };
  });

  const result: { date: string; slots: Array<any> }[] = [];

  for (const date of dates) {
    const dow = dateToDayOfWeek(date);
    const baseSlots = recurringSlots.filter((s) => s.day_of_week === dow);

    const daySlots: any[] = [];

    for (const base of baseSlots) {
      const ex = exceptions.find((e) => Number(e.slot_id) === Number(base.id) && e.exception_date === date);
      if (ex) {
        if (ex.is_deleted) {
          continue; // skip this slot for this date
        } else {
          daySlots.push({
            slotId: base.id,
            start_time: ex.new_start_time ?? base.start_time,
            end_time: ex.new_end_time ?? base.end_time,
            isException: true,
            exceptionId: ex.id,
          });
        }
      } else {
        daySlots.push({
          slotId: base.id,
          start_time: base.start_time,
          end_time: base.end_time,
          isException: false,
        });
      }
    }

    result.push({ date, slots: daySlots });
  }

  return result;
}


export async function removeExceptionBySlotAndDate(slot_id: number, exception_date: string): Promise<boolean> {
  const existing = await db("exceptions").where({ slot_id, exception_date }).first();
  if (!existing) return false;
  await db("exceptions").where({ id: existing.id }).del();
  return true;
}

export async function deleteExceptionById(id: number): Promise<boolean> {
  const existing = await db("exceptions").where({ id }).first();
  if (!existing) return false;
  await db("exceptions").where({ id }).del();
  return true;
}