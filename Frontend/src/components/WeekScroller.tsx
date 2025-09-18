// src/components/WeekScroller.tsx
import React, { useState, useEffect } from "react";
import DayColumn from "./DayColumn";
import { 
  Box, 
  Paper,
  IconButton,
  Typography,
  Chip,
  Alert
} from "@mui/material";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import dayjs, { Dayjs } from "dayjs";

interface WeekScrollerProps {
  weeks: any[];
  onAddForDate: (date: string) => void;
  selectedDate: Dayjs | null;
}

export default function WeekScroller({ weeks, onAddForDate, selectedDate }: WeekScrollerProps) {
  const [currentWeekIndex, setCurrentWeekIndex] = useState(0);

  useEffect(() => {
    setCurrentWeekIndex(0);
  }, [weeks]);

  const handlePrevWeek = () => {
    setCurrentWeekIndex(prev => Math.max(0, prev - 1));
  };

  const handleNextWeek = () => {
    setCurrentWeekIndex(prev => Math.min(weeks.length - 1, prev + 1));
  };

  if (!weeks.length) {
    return (
      <Alert severity="info" sx={{ mt: 2 }}>
        No schedule data available for {selectedDate?.format('MMMM YYYY')}
      </Alert>
    );
  }

  const currentWeek = weeks[currentWeekIndex];

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <IconButton onClick={handlePrevWeek} disabled={currentWeekIndex === 0}>
          <ChevronLeftIcon />
        </IconButton>
        
        <Typography variant="subtitle1" fontWeight="medium">
          Week {currentWeekIndex + 1} of {weeks.length}
        </Typography>
        
        <IconButton onClick={handleNextWeek} disabled={currentWeekIndex === weeks.length - 1}>
          <ChevronRightIcon />
        </IconButton>
      </Box>

      <Box sx={{ 
        display: 'flex', 
        gap: 1, 
        mb: 3, 
        overflowX: 'auto',
        pb: 1,
        '&::-webkit-scrollbar': { height: 4 },
        '&::-webkit-scrollbar-thumb': { bgcolor: 'grey.300', borderRadius: 2 }
      }}>
        {currentWeek.data.map((day: any) => {
          const dayObj = dayjs(day.date);
          const isToday = dayObj.isSame(dayjs(), 'day');
          const isInSelectedMonth = selectedDate ? 
            dayObj.month() === selectedDate.month() && dayObj.year() === selectedDate.year() : true;
          
          return (
            <Chip
              key={day.date}
              label={
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="caption" display="block">
                    {dayObj.format('ddd')}
                  </Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {dayObj.format('DD')}
                  </Typography>
                </Box>
              }
              variant={isToday ? "filled" : "outlined"}
              color={isToday ? "primary" : isInSelectedMonth ? "default" : "secondary"}
              sx={{ 
                minWidth: 60, 
                height: 60,
                borderRadius: 2,
                opacity: isInSelectedMonth ? 1 : 0.5
              }}
            />
          );
        })}
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {currentWeek.data
          .filter((day: any) => {
            if (!selectedDate) return true;
            const dayObj = dayjs(day.date);
            return dayObj.month() === selectedDate.month() && dayObj.year() === selectedDate.year();
          })
          .map((day: any) => (
            <DayColumn
              key={day.date}
              date={day.date}
              slots={day.slots}
              onAdd={() => onAddForDate(day.date)}
            />
          ))}
      </Box>
    </Box>
  );
}
