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

router.post("/:slotId/exceptions", async (req, res) => {
  try {
    const slotId = Number(req.params.slotId);
    const { exception_date, new_start_time, new_end_time, is_deleted } = req.body;

    if (!exception_date) return res.status(400).json({ error: "exception_date required" });

    const db = (await import("../db/knex")).default;

    const baseSlot = await db("slots").where({ id: slotId }).first();
    if (!baseSlot) return res.status(404).json({ error: "slot not found" });

    const { dateToDayOfWeek } = await import("../utils/dateUtils");
    const dow = dateToDayOfWeek(exception_date);

    const recurring = await db("slots").where({ day_of_week: dow }).select("*");

    const existingExceptionsRaw = await db("exceptions")
      .where({ exception_date })
      .andWhere("slot_id", "!=", slotId)
      .select("*");

    const existingExceptions: Record<number, any> = {};
    for (const e of existingExceptionsRaw) {
      existingExceptions[Number(e.slot_id)] = {
        new_start_time: e.new_start_time,
        new_end_time: e.new_end_time,
        is_deleted: Boolean(e.is_deleted),
      };
    }

    const resulting: Array<{ slotId: number; start_time: string; end_time: string }> = [];

    for (const base of recurring) {
      const id = Number(base.id);

      const exOther = existingExceptions[id];

      if (id === slotId) {
        if (is_deleted) {
          continue;
        } else {
          resulting.push({
            slotId: id,
            start_time: new_start_time ?? base.start_time,
            end_time: new_end_time ?? base.end_time,
          });
        }
      } else if (exOther) {
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
        resulting.push({ slotId: id, start_time: base.start_time, end_time: base.end_time });
      }
    }

    if (resulting.length > 2) {
      return res.status(400).json({ error: "Applying this exception would exceed 2 slots for that date" });
    }

    const id = await service.addException(slotId, exception_date, { new_start_time, new_end_time, is_deleted });
    return res.json({ exceptionId: id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "server error" });
  }
});

// DELETE /slots/:slotId/exceptions?exception_date=YYYY-MM-DD
router.delete("/:slotId/exceptions", async (req, res) => {
  try {
    const slotId = Number(req.params.slotId);
    const exception_date = String(req.query.exception_date || "");
    if (!exception_date) return res.status(400).json({ error: "exception_date query param required" });

    const removed = await service.removeExceptionBySlotAndDate(slotId, exception_date);
    if (!removed) return res.status(404).json({ error: "exception not found" });
    return res.json({ removed: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "server error" });
  }
});

// DELETE /slots/exceptions/:id
router.delete("/exceptions/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: "invalid id" });

    const removed = await service.deleteExceptionById(id);
    if (!removed) return res.status(404).json({ error: "exception not found" });
    return res.json({ removed: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "server error" });
  }
});


export default router;
