import React, { useState } from "react";
import { deleteExceptionBySlotDate, deleteExceptionById } from "../api/slots";

type Props = {
  slot: {
    slotId: number;
    exceptionId?: number;
    start_time: string;
    end_time: string;
    isException?: boolean;
  };
  date: string;
  onAddException?: (slotId: number) => void;
  onRefresh: () => void;
};

export default function SlotItem({ slot, date, onAddException, onRefresh }: Props) {
  const [loading, setLoading] = useState(false);

  const handleUndo = async () => {
    const ok = window.confirm("Remove exception and restore recurring slot for this date?");
    if (!ok) return;

    try {
      setLoading(true);
      if (slot.exceptionId) {
        await deleteExceptionById(slot.exceptionId);
      } else {
        await deleteExceptionBySlotDate(slot.slotId, date);
      }
      onRefresh();
    } catch (err: any) {
      console.error(err);
      alert("Failed to remove exception: " + (err?.message ?? err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-between bg-white/90 border rounded px-3 py-2 my-1">
      <div>
        <div className="text-sm font-medium">
          {slot.start_time} - {slot.end_time}
        </div>
        {slot.isException && <div className="text-xs text-indigo-600">Exception</div>}
      </div>

      <div className="flex items-center gap-2">
        <button
          className="p-2"
          title="Add exception"
          onClick={() => onAddException?.(slot.slotId)}
          disabled={loading}
        >
          <svg className="w-5 h-5 text-indigo-600" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {slot.isException && (
          <button
            onClick={handleUndo}
            className="text-red-500 text-xs ml-2 px-2 py-1 border rounded"
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? "Undoing…" : "Undo"}
          </button>
        )}
      </div>
    </div>
  );
}
