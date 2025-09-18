// hooks/useSlots.ts - REPLACE ENTIRE FILE
import { useEffect, useRef, useState } from "react";
import { fetchWeek } from "../api/slots";
import { nextWeekStart, todayWeekStart, getWeekStartFormatDate } from "../utils/date";
import dayjs from 'dayjs';

export function useSlotsInfinite(initialWeek?: string) {
  const [weeks, setWeeks] = useState<{weekStart: string, data: any}[]>([]);
  const [loading, setLoading] = useState(false);
  const current = useRef(initialWeek ?? todayWeekStart());

  const loadNext = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const weekStart = current.current;
      console.log('Loading week:', weekStart); // Debug log
      
      const week = await fetchWeek(weekStart);
      console.log('Loaded week data:', week); // Debug log
      
      setWeeks(prev => {
        const exists = prev.some(w => w.weekStart === week.weekStart);
        if (exists) return prev;
        return [...prev, week];
      });
      
      current.current = nextWeekStart(weekStart);
    } catch (error) {
      console.error('Failed to load week:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadInitialWeeks = async () => {
    for (let i = 0; i < 8; i++) {
      await loadNext();
    }
  };

  useEffect(() => {
    loadInitialWeeks();
  }, []);

  return { weeks, loadNext, loading };
}
