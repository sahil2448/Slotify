// src/routes/slots.ts
import express from "express";
import * as service from "../services/slotsService"; // ensure file name matches
const router = express.Router();


router.post("/", async (req, res) => {
  try {
    const { day_of_week, start_time, end_time } = req.body;
    if (typeof day_of_week !== "number") return res.status(400).json({ error: "day_of_week required" });
    if (!start_time || !end_time) return res.status(400).json({ error: "start_time and end_time required" });

    const existing = await (await import("../db/knex")).default("slots").where({ day_of_week }).count("* as cnt").first();
    const cnt = Number((existing as any).cnt);
    if (cnt >= 2) {
      return res.status(400).json({ error: "Max 2 recurring slots allowed for this weekday" });
    }
    const id = await service.createRecurringSlot(day_of_week, start_time, end_time);
    return res.status(201).json({ id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "server error" });
  }
});


router.get("/", async (req, res) => {
  try {
    const weekStart = (req.query.weekStart as string) || new Date().toISOString().slice(0, 10);
    const data = await service.fetchSlotsForWeek(weekStart);
    return res.json({ weekStart, data });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "server error" });
  }
});

// inside src/routes/slots.ts (replace existing router.post("/:slotId/exceptions", ...))
router.post("/:slotId/exceptions", async (req, res) => {
  try {
    const slotId = Number(req.params.slotId);
    const { exception_date, new_start_time, new_end_time, is_deleted } = req.body;

    if (!exception_date) return res.status(400).json({ error: "exception_date required" });

    const db = (await import("../db/knex")).default;

    // Ensure slot exists
    const baseSlot = await db("slots").where({ id: slotId }).first();
    if (!baseSlot) return res.status(404).json({ error: "slot not found" });

    // compute day-of-week for the date (use your util)
    const { dateToDayOfWeek } = await import("../utils/dateUtils");
    const dow = dateToDayOfWeek(exception_date);

    // 1) fetch all recurring slots for that day (array of base slots)
    const recurring = await db("slots").where({ day_of_week: dow }).select("*");

    // 2) fetch existing exceptions for that date EXCLUDING the current slot (we'll simulate current's change)
    const existingExceptionsRaw = await db("exceptions")
      .where({ exception_date })
      .andWhere("slot_id", "!=", slotId)
      .select("*");

    // normalize existing exceptions to a simple map: slot_id -> exception
    const existingExceptions: Record<number, any> = {};
    for (const e of existingExceptionsRaw) {
      // e.exception_date should be fine; we only need is_deleted and new times
      existingExceptions[Number(e.slot_id)] = {
        new_start_time: e.new_start_time,
        new_end_time: e.new_end_time,
        is_deleted: Boolean(e.is_deleted),
      };
    }

    // 3) Build the resulting slots for that date after applying existing exceptions AND the new one
    const resulting: Array<{ slotId: number; start_time: string; end_time: string }> = [];

    for (const base of recurring) {
      const id = Number(base.id);

      // existing exception for this base slot (other slots)
      const exOther = existingExceptions[id];

      if (id === slotId) {
        // simulate the new exception being applied for this slot
        if (is_deleted) {
          // it's deleted on this date — skip adding this slot
          continue;
        } else {
          // modified or unchanged times: if new_start_time provided use it else base.start_time
          resulting.push({
            slotId: id,
            start_time: new_start_time ?? base.start_time,
            end_time: new_end_time ?? base.end_time,
          });
        }
      } else if (exOther) {
        // if other exception deletes it, skip; if overrides, use override
        if (exOther.is_deleted) {
          continue;
        } else {
          resulting.push({
            slotId: id,
            start_time: exOther.new_start_time ?? base.start_time,
            end_time: exOther.new_end_time ?? base.end_time,
          });
        }
      } else {
        // no exception for this slot
        resulting.push({ slotId: id, start_time: base.start_time, end_time: base.end_time });
      }
    }

    // 4) Now check the count constraint
    if (resulting.length > 2) {
      return res.status(400).json({ error: "Applying this exception would exceed 2 slots for that date" });
    }

    // 5) all good — proceed to add or update exception
    const id = await service.addException(slotId, exception_date, { new_start_time, new_end_time, is_deleted });
    return res.json({ exceptionId: id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "server error" });
  }
});

export default router;
