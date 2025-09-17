import React from "react";
type Props={
    slot:any
    onAddException?:(slotId:number)=>void
}

export default function SlotItem({slot,onAddException}:Props){
    return (
    <div className="flex items-center justify-between bg-white/90 border rounded px-3 py-2 my-1">
    <div>
        <div className="text-sm font-medium">
            {slot.start_time} - {slot.end_time} 
                </div>
                {slot.isException && <div className="text-xs text-indigo-600">Exception</div>}
        </div>
        <div className="flex items-center gap-2">
            <button className="p-2" title="Add exception" onClick={()=>onAddException?.(slot.slotId)}>
            <svg className="w-5 h-5 text-indigo-600" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
      </div>
    </div>
    )
}
