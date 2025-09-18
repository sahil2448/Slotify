// src/components/WeekView.tsx - No longer needed, but keeping for compatibility
import React from "react";
import DayColumn from "./DayColumn";

export default function WeekView({ week, onAddForDate }: { week: any; onAddForDate: (date: string) => void }) {
  return (
    <div>
      {week.data.map((d: any) => (
        <DayColumn 
          key={d.date} 
          date={d.date} 
          slots={d.slots} 
          onAdd={() => onAddForDate(d.date)} 
        />
      ))}
    </div>
  );
}
