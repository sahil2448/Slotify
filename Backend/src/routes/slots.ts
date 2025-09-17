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
    if (cnt >= 10) {
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

    const id = await service.addException(slotId, exception_date, { new_start_time, new_end_time, is_deleted });
    return res.json({ exceptionId: id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "server error" });
  }
});

export default router;
