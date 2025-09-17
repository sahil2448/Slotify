// src/components/WeekView.tsx
import React, { useRef, useEffect } from "react";
import DayCard from "./DayCard";

export default function WeekView({ week, onAddForDate }: { week:any; onAddForDate:(date:string)=>void }) {
  return (
    <div className="bg-slate-50 rounded-lg overflow-hidden shadow-sm mb-4">
      {week.data.map((d:any) => (
        <DayCard key={d.date} date={d.date} slots={d.slots} onAdd={()=>onAddForDate(d.date)} />
      ))}
    </div>
  );
}