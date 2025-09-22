// hooks/useSlots.ts - SMART LOADING VERSION
import { useEffect, useRef, useState } from "react";
import { fetchWeek } from "../api/slots";
import { nextWeekStart, todayWeekStart, getWeekStartFormatDate } from "../utils/date";
import dayjs from 'dayjs';

export function useSlotsInfinite(initialWeek?: string) {
  const [weeks, setWeeks] = useState<{weekStart: string, data: any}[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasLoadedInitialData, setHasLoadedInitialData] = useState(false);
  const current = useRef(initialWeek ?? todayWeekStart());
  const loadedWeeks = useRef(new Set<string>());
  const maxWeeksLoaded = useRef(0);
  
  // Configuration
  const INITIAL_WEEKS_TO_LOAD = 8; // 2 months worth
  const MAX_WEEKS_LIMIT = 24; // 6 months maximum
  const LOAD_MORE_THRESHOLD = 4; // Load more when within 4 weeks of boundary

  const loadNext = async () => {
    if (loading) return;
    if (maxWeeksLoaded.current >= MAX_WEEKS_LIMIT) {
      console.log('Maximum weeks limit reached. Stopping automatic loading.');
      return;
    }

    setLoading(true);

    try {
      const weekStart = current.current;
      
      // Skip if already loaded
      if (loadedWeeks.current.has(weekStart)) {
        current.current = nextWeekStart(weekStart);
        setLoading(false);
        return;
      }
      
      console.log(`Loading week ${maxWeeksLoaded.current + 1}/${MAX_WEEKS_LIMIT}:`, weekStart);
      
      const week = await fetchWeek(weekStart);
      
      // Add to loaded weeks set
      loadedWeeks.current.add(weekStart);
      maxWeeksLoaded.current += 1;
      
      setWeeks(prev => {
        const exists = prev.some(w => w.weekStart === week.weekStart);
        if (exists) return prev;
        
        // Insert weeks in chronological order
        const newWeeks = [...prev, week];
        return newWeeks.sort((a, b) => a.weekStart.localeCompare(b.weekStart));
      });
      
      current.current = nextWeekStart(weekStart);
    } catch (error) {
      console.error('Failed to load week:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadInitialWeeks = async () => {
    console.log(`Loading initial ${INITIAL_WEEKS_TO_LOAD} weeks...`);
    
    for (let i = 0; i < INITIAL_WEEKS_TO_LOAD; i++) {
      await loadNext();
    }
    
    setHasLoadedInitialData(true);
    console.log(`Initial loading complete. ${maxWeeksLoaded.current} weeks loaded.`);
  };

  const loadWeeksForMonth = async (targetDate: dayjs.Dayjs) => {
    if (loading) return;
    
    console.log(`Loading weeks for month: ${targetDate.format('MMMM YYYY')}`);
    
    const startOfMonth = targetDate.startOf('month');
    const endOfMonth = targetDate.endOf('month');
    
    // Get the first Monday of the month view
    const firstWeekStart = startOfMonth.startOf('week').day(1);
    const lastWeekStart = endOfMonth.startOf('week').day(1);
    
    let currentWeek = firstWeekStart;
    const weeksNeeded: string[] = [];
    
    while (currentWeek.isBefore(lastWeekStart) || currentWeek.isSame(lastWeekStart)) {
      const weekStartStr = currentWeek.format('YYYY-MM-DD');
      
      if (!loadedWeeks.current.has(weekStartStr)) {
        weeksNeeded.push(weekStartStr);
      }
      
      currentWeek = currentWeek.add(1, 'week');
    }

    // Only load if we haven't hit the limit
    if (weeksNeeded.length > 0 && maxWeeksLoaded.current < MAX_WEEKS_LIMIT) {
      setLoading(true);
      
      for (const weekStart of weeksNeeded) {
        if (maxWeeksLoaded.current >= MAX_WEEKS_LIMIT) {
          console.log('Hit maximum weeks limit while loading month data');
          break;
        }
        
        try {
          console.log(`Loading specific week: ${weekStart}`);
          const week = await fetchWeek(weekStart);
          
          loadedWeeks.current.add(weekStart);
          maxWeeksLoaded.current += 1;
          
          setWeeks(prev => {
            const exists = prev.some(w => w.weekStart === week.weekStart);
            if (exists) return prev;
            
            const newWeeks = [...prev, week];
            return newWeeks.sort((a, b) => a.weekStart.localeCompare(b.weekStart));
          });
        } catch (error) {
          console.error('Failed to load week:', weekStart, error);
        }
      }
      
      setLoading(false);
    }
  };

  const shouldLoadMore = (selectedMonth: dayjs.Dayjs) => {
    if (!hasLoadedInitialData || maxWeeksLoaded.current >= MAX_WEEKS_LIMIT) {
      return false;
    }

    // Check if we're approaching the boundary of loaded data
    const latestWeek = weeks[weeks.length - 1];
    if (!latestWeek) return true;

    const latestWeekDate = dayjs(latestWeek.weekStart);
    const selectedMonthEnd = selectedMonth.endOf('month');
    
    // If selected month is within threshold of latest loaded week, load more
    const weeksUntilEnd = selectedMonthEnd.diff(latestWeekDate, 'week');
    
    return weeksUntilEnd <= LOAD_MORE_THRESHOLD;
  };

  const getLoadingStats = () => {
    return {
      totalWeeksLoaded: maxWeeksLoaded.current,
      maxLimit: MAX_WEEKS_LIMIT,
      hasReachedLimit: maxWeeksLoaded.current >= MAX_WEEKS_LIMIT,
      loadedWeekRange: weeks.length > 0 ? {
        start: weeks[0]?.weekStart,
        end: weeks[weeks.length - 1]?.weekStart
      } : null
    };
  };

  useEffect(() => {
    if (!hasLoadedInitialData) {
      loadInitialWeeks();
    }
  }, []);

  return { 
    weeks, 
    loadNext: maxWeeksLoaded.current < MAX_WEEKS_LIMIT ? loadNext : () => {}, 
    loading, 
    loadWeeksForMonth,
    shouldLoadMore,
    hasLoadedInitialData,
    getLoadingStats
  };
}
