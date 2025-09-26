// src/components/SchedulerPage.tsx - SMART LOADING VERSION
import React, { useRef, useCallback, useState, useMemo } from "react";
import { useSlotsInfinite } from "../hooks/useSlots";
import WeekScroller from "./WeekScroller";
import { createSlot } from "../api/slots";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import ExceptionDialog from './ExceptionDialog';

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { 
  Box, 
  Typography, 
  AppBar,
  Toolbar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Container,
  CircularProgress,
  Alert,
  Chip
} from "@mui/material";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import MenuIcon from '@mui/icons-material/Menu';
import dayjs, { Dayjs } from "dayjs";

export default function SchedulerPage() {
  const today = dayjs();
  const { 
    weeks, 
    loadNext, 
    loading, 
    loadWeeksForMonth, 
    shouldLoadMore, 
    hasLoadedInitialData,
    getLoadingStats
  } = useSlotsInfinite();
  
  const loaderRef = useRef<HTMLDivElement|null>(null);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(today);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [startTime, setStartTime] = useState<Dayjs | null>(today.hour(9).minute(0));
  const [endTime, setEndTime] = useState<Dayjs | null>(today.hour(10).minute(0));
  const [exceptionDialogOpen, setExceptionDialogOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{slotId: number, date: string, startTime: string, endTime: string} | null>(null);
  const [pastDateError, setPastDateError] = useState(false);
  const [monthLoadingComplete, setMonthLoadingComplete] = useState(false);

  const handleAddException = (slotId: number, date: string, startTime: string, endTime: string) => {
    const slotDate = dayjs(date);
    if (slotDate.isBefore(today, 'day')) {
      setPastDateError(true);
      setTimeout(() => setPastDateError(false), 3000);
      return;
    }

    setSelectedSlot({ slotId, date, startTime, endTime });
    setExceptionDialogOpen(true);
  };

  // Enhanced filtering
  const filteredWeeks = useMemo(() => {
    if (!selectedDate) return weeks;
    
    const targetMonth = selectedDate.month();
    const targetYear = selectedDate.year();
    
    return weeks.filter(week => {
      return week.data.some((day: any) => {
        const dayDate = dayjs(day.date);
        const dayMonth = dayDate.month();
        const dayYear = dayDate.year();
        
        if (dayYear === targetYear && dayMonth === targetMonth) {
          return true;
        }
        
        // Include adjacent month days that appear in week view
        if (Math.abs(dayMonth - targetMonth) <= 1 || 
            (targetMonth === 0 && dayMonth === 11) || 
            (targetMonth === 11 && dayMonth === 0)) {
          const firstOfMonth = selectedDate.startOf('month');
          const lastOfMonth = selectedDate.endOf('month');
          const firstWeekStart = firstOfMonth.startOf('week').day(1);
          const lastWeekStart = lastOfMonth.startOf('week').day(1);
          
          return dayDate.isSame(firstWeekStart, 'week') || dayDate.isSame(lastWeekStart, 'week');
        }
        
        return false;
      });
    });
  }, [weeks, selectedDate]);

  // Smart loading for month changes
  React.useEffect(() => {
    if (!selectedDate || !hasLoadedInitialData) return;

    setMonthLoadingComplete(false);
    
    const loadMonthData = async () => {
      if (loadWeeksForMonth) {
        await loadWeeksForMonth(selectedDate);
        
        // Check if we need to load more weeks
        if (shouldLoadMore && shouldLoadMore(selectedDate)) {
          console.log('Loading additional weeks for better coverage...');
          for (let i = 0; i < 4; i++) {
            await loadNext();
          }
        }
      }
      setMonthLoadingComplete(true);
    };

    loadMonthData();
  }, [selectedDate, hasLoadedInitialData]);

  // Remove the infinite scroll observer that was causing issues
  React.useEffect(() => {
    if (!loaderRef.current || !hasLoadedInitialData) return;

    const stats = getLoadingStats();
    if (stats.hasReachedLimit) return; // Don't observe if we've reached limit

    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && shouldLoadMore && selectedDate && shouldLoadMore(selectedDate)) {
        console.log('User scrolled to end, loading more weeks...');
        loadNext();
      }
    }, { rootMargin: "400px" }); // Larger margin to prevent frequent triggers

    obs.observe(loaderRef.current);
    return () => obs.disconnect();
  }, [hasLoadedInitialData, selectedDate]);

  const handleAddForDate = async (date: string) => {
    const selectedDateObj = dayjs(date);
    if (selectedDateObj.isBefore(today, 'day')) {
      setPastDateError(true);
      setTimeout(() => setPastDateError(false), 3000);
      return;
    }

    setSelectedDate(selectedDateObj);
    setDialogOpen(true);
  };

  const handleCreateSlot = async () => {
    if (!selectedDate || !startTime || !endTime) return;
    
    if (selectedDate.isBefore(today, 'day')) {
      setPastDateError(true);
      setTimeout(() => setPastDateError(false), 3000);
      setDialogOpen(false);
      return;
    }
    
    const dow = selectedDate.day();
    try {
      await createSlot({ 
        day_of_week: dow, 
        start_time: startTime.format('HH:mm:ss'), 
        end_time: endTime.format('HH:mm:ss') 
      });
      setDialogOpen(false);
      window.location.reload();
    } catch (err) {
      alert("Failed to create slot: " + String(err));
    }
  };

  const handleDateChange = (newDate: Dayjs | null) => {
    setSelectedDate(newDate);
    setMonthLoadingComplete(false);
  };

  const loadingStats = getLoadingStats();

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ border: "none", minHeight: '100vh' }} className="bg-gray-100">
        <Container maxWidth="sm" sx={{ px: 2, py: 2 }}>

          {pastDateError && (
            <Alert 
              severity="warning" 
              sx={{ mb: 2 }}
              onClose={() => setPastDateError(false)}
            >
              Cannot add slots or exceptions for past dates. Please select a future date.
            </Alert>
          )}

          <Box sx={{ mb: 3 }}>
            <DatePicker
              value={selectedDate}
              onChange={handleDateChange}
              views={['year', 'month']}
              format="MMMM YYYY"
              slotProps={{
                textField: {
                  variant: 'outlined',
                  fullWidth: true,
                  sx: { bgcolor: 'white' }
                }
              }}
            />
          </Box>

          {/* Show loading state while initial data or month data is loading */}
          {!hasLoadedInitialData || (selectedDate && !monthLoadingComplete) ? (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              minHeight: 200,
              flexDirection: 'column',
              gap: 2
            }}>
              <CircularProgress />
              <Typography>
                {!hasLoadedInitialData 
                  ? "Loading initial schedule data..." 
                  : `Loading ${selectedDate?.format('MMMM YYYY')} schedule...`
                }
              </Typography>
            </Box>
          ) : (
            <WeekScroller 
              weeks={filteredWeeks}
              onAddForDate={handleAddForDate}
              selectedDate={selectedDate}
              onAddException={handleAddException}
            />
          )}

          {/* Smart loading indicator */}
          {loading && hasLoadedInitialData && monthLoadingComplete && (
            <Box 
              ref={loaderRef} 
              sx={{ 
                height: 64, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                flexDirection: 'column',
                gap: 1
              }}
            >
              <CircularProgress size={20} />
              <Typography variant="caption" color="text.secondary">
                Loading more data... ({loadingStats.totalWeeksLoaded}/{loadingStats.maxLimit} weeks)
              </Typography>
            </Box>
          )}

          {/* Show message when limit is reached */}
          {loadingStats.hasReachedLimit && (
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="caption" color="text.secondary">
                📅 Loaded 6 months of data. Change month to load more specific dates.
              </Typography>
            </Box>
          )}
        </Container>

        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Add New Time Slot</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <TimePicker
                label="Start Time"
                value={startTime}
                onChange={setStartTime}
              />
              <TimePicker
                label="End Time"
                value={endTime}
                onChange={setEndTime}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateSlot} variant="contained">Create Slot</Button>
          </DialogActions>
        </Dialog>
      </Box>
      
      {selectedSlot && (
        <ExceptionDialog
          open={exceptionDialogOpen}
          onClose={() => {
            setExceptionDialogOpen(false);
            setSelectedSlot(null);
          }}
          slotId={selectedSlot.slotId}
          date={selectedSlot.date}
          originalStartTime={selectedSlot.startTime}
          originalEndTime={selectedSlot.endTime}
          onRefresh={() => window.location.reload()}
        />
      )}
    </LocalizationProvider>
  );
}
