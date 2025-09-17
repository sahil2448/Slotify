// src/components/DayCard.tsx
import React from "react";
import SlotItem from "./SlotItem";

export default function DayCard({ date, slots, onAdd }: {date:string; slots:any[]; onAdd?:()=>void}) {
  const display = new Date(date).toLocaleDateString(undefined, { weekday:"short", day:"2-digit", month:"short" });
  return (
    <div className="p-3 border-b">
      <div className="flex justify-between items-center">
        <div className="text-sm text-indigo-700 font-bold">{display}</div>
        <div className="flex gap-2">
          <button onClick={onAdd} className="bg-indigo-600 text-white px-2 py-1 rounded">+</button>
        </div>
      </div>

      <div className="mt-3">
        {slots.length===0 && <div className="text-gray-400 text-sm">No slots</div>}
        {slots.map((s:any)=> <SlotItem key={s.slotId} date={date} slot={s} onAddException={()=>onAdd?.()} />)}
      </div>
    </div>
  );
}
