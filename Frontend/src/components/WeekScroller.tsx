// src/components/WeekScroller.tsx - ADD RESPONSIVE IMPROVEMENTS
import React, { useState, useEffect } from "react";
import DayColumn from "./DayColumn";
import { 
  Box, 
  Paper,
  IconButton,
  Typography,
  Chip,
  Alert,
  useTheme,
  useMediaQuery
} from "@mui/material";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import dayjs, { Dayjs } from "dayjs";

interface WeekScrollerProps {
  weeks: any[];
  onAddForDate: (date: string) => void;
  selectedDate: Dayjs | null;
  onAddException: (slotId: number, date: string, startTime: string, endTime: string) => void;
}

export default function WeekScroller({ weeks, onAddForDate, selectedDate, onAddException }: WeekScrollerProps) {
  const [currentWeekIndex, setCurrentWeekIndex] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        mb: 2,
        gap: 2
      }}>
        <IconButton 
          onClick={handlePrevWeek} 
          disabled={currentWeekIndex === 0}
          size={isMobile ? "small" : "medium"}
          sx={{
            bgcolor: 'primary.main',
            color: 'white',
            '&:hover': { bgcolor: 'primary.dark' },
            '&:disabled': { bgcolor: 'grey.300' }
          }}
        >
          <ChevronLeftIcon />
        </IconButton>
        
        <Box sx={{ 
          display: 'flex', 
          gap: isMobile ? 0.5 : 1, 
          overflowX: 'auto',
          pb: 1,
          px: 1,
          flex: 1,
          justifyContent: 'center',
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
                    <Typography 
                      variant="caption" 
                      display="block"
                      sx={{ fontSize: isMobile ? '0.6rem' : '0.7rem' }}
                    >
                      {dayObj.format('ddd')}
                    </Typography>
                    <Typography 
                      variant={isMobile ? "caption" : "body2"} 
                      fontWeight="bold"
                    >
                      {dayObj.format('DD')}
                    </Typography>
                  </Box>
                }
                variant={isToday ? "filled" : "outlined"}
                className={isToday ? "!bg-indigo-500 !text-white" : isInSelectedMonth ? "!bg-gray-200 !text-gray-800" : "!bg-gray-100 !text-gray-400"}
                sx={{ 
                  minWidth: isMobile ? 50 : 60, 
                  height: isMobile ? 50 : 60,
                  borderRadius: 2,
                  opacity: isInSelectedMonth ? 1 : 0.5
                }}
              />
            );
          })}
        </Box>

        <IconButton 
          onClick={handleNextWeek} 
          disabled={currentWeekIndex === weeks.length - 1}
          size={isMobile ? "small" : "medium"}
          sx={{
            bgcolor: 'primary.main',
            color: 'white',
            '&:hover': { bgcolor: 'primary.dark' },
            '&:disabled': { bgcolor: 'grey.300' }
          }}
        >
          <ChevronRightIcon />
        </IconButton>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: isMobile ? 1 : 2 }}>
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
              onAddException={onAddException}
            />
          ))}
      </Box>
    </Box>
  );
}
