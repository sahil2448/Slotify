// src/components/SchedulerPage.tsx
import React, { useRef, useCallback } from "react";
import { useSlotsInfinite } from "../hooks/useSlots"; // if exported default adjust
import WeekView from "./WeekView";
import { createSlot, createException } from "../api/slots";

export default function SchedulerPage() {
  const { weeks, loadNext } = useSlotsInfinite();
  const loaderRef = useRef<HTMLDivElement|null>(null);

  React.useEffect(()=>{
    if (!loaderRef.current) return;
    const obs = new IntersectionObserver(entries=>{
      if (entries[0].isIntersecting) loadNext();
    }, { rootMargin: "200px" });
    obs.observe(loaderRef.current);
    return ()=>obs.disconnect();
  }, [loaderRef]);

  const handleAddForDate = async (date:string) => {
    const dow = new Date(date).getDay(); // 0 Sun..6 Sat -> your backend uses 0..6
    const start = prompt("Start time (HH:MM:SS)", "09:00:00");
    const end = prompt("End time (HH:MM:SS)", "10:00:00");
    if (!start || !end) return;
    try {
      await createSlot({ day_of_week: dow, start_time: start, end_time: end });
      window.location.reload();
    } catch (err) {
      alert("Failed to create slot: "+String(err));
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-xl font-bold text-indigo-700 mb-4">Your Schedule</h1>
      {weeks.map(w => <WeekView key={w.weekStart} week={w} onAddForDate={handleAddForDate} />)}
      <div ref={loaderRef} className="h-16 text-center text-gray-400">Loading more...</div>
    </div>
  );
}
