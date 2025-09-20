import React, { useRef, useCallback, useState, useMemo } from "react";
import { useSlotsInfinite } from "../hooks/useSlots";
import WeekScroller from "./WeekScroller";
import { createSlot } from "../api/slots";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import ExceptionDialog from './ExceptionDialog'; // Add import

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
  Container
} from "@mui/material";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import MenuIcon from '@mui/icons-material/Menu';
import dayjs, { Dayjs } from "dayjs";

export default function SchedulerPage() {
  const { weeks, loadNext } = useSlotsInfinite();
  const loaderRef = useRef<HTMLDivElement|null>(null);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [startTime, setStartTime] = useState<Dayjs | null>(dayjs().hour(9).minute(0));
  const [endTime, setEndTime] = useState<Dayjs | null>(dayjs().hour(10).minute(0));
  const [exceptionDialogOpen, setExceptionDialogOpen] = useState(false);
const [selectedSlot, setSelectedSlot] = useState<{slotId: number, date: string, startTime: string, endTime: string} | null>(null);



const handleAddException = (slotId: number, date: string, startTime: string, endTime: string) => {
  setSelectedSlot({ slotId, date, startTime, endTime });
  setExceptionDialogOpen(true);
};


  const filteredWeeks = useMemo(() => {
    if (!selectedDate) return weeks;
    
    return weeks.filter(week => {
      // Check if any day in the week belongs to the selected month/year
      return week.data.some((day: any) => {
        const dayDate = dayjs(day.date);
        return dayDate.month() === selectedDate.month() && 
               dayDate.year() === selectedDate.year();
      });
    });
  }, [weeks, selectedDate]);

  React.useEffect(() => {
    if (!loaderRef.current) return;
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) loadNext();
    }, { rootMargin: "200px" });
    obs.observe(loaderRef.current);
    return () => obs.disconnect();
  }, [loaderRef]);

  const handleAddForDate = async (date: string) => {
    setSelectedDate(dayjs(date));
    setDialogOpen(true);
  };

  const handleCreateSlot = async () => {
    if (!selectedDate || !startTime || !endTime) return;
    
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
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} >
      <Box sx={{ bgcolor: 'gray.50', border:"none",  minHeight: '100vh' }} >
        <Container maxWidth="sm" sx={{ px: 2, py: 2 }}>
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


          <WeekScroller 
            weeks={filteredWeeks}
            onAddForDate={handleAddForDate}
            selectedDate={selectedDate}
            onAddException={handleAddException}
          />


          <Box ref={loaderRef} sx={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Loading more...
            </Typography>
          </Box>
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
