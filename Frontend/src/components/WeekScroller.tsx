// src/components/WeekScroller.tsx - UPDATED WITH AUTO-SCROLL TO TODAY
import React, { useState, useEffect, useRef } from "react";
import DayColumn from "./DayColumn";
import { 
  Box, 
  Paper,
  Typography,
  Chip,
  Alert,
  useTheme,
  useMediaQuery
} from "@mui/material";
import dayjs, { Dayjs } from "dayjs";

interface WeekScrollerProps {
  weeks: any[];
  onAddForDate: (date: string) => void;
  selectedDate: Dayjs | null;
  onAddException: (slotId: number, date: string, startTime: string, endTime: string) => void;
}

export default function WeekScroller({ weeks, onAddForDate, selectedDate, onAddException }: WeekScrollerProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const verticalScrollRef = useRef<HTMLDivElement>(null);
  const todayRef = useRef<HTMLDivElement>(null);
  const today = dayjs();

  // Get all days of the selected month
  const getAllDaysOfMonth = () => {
    if (!selectedDate) return [];
    
    const startOfMonth = selectedDate.startOf('month');
    const endOfMonth = selectedDate.endOf('month');
    const daysInMonth = endOfMonth.date();
    
    const allDays: any[] = [];
    
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = startOfMonth.date(day);
      const dateStr = currentDate.format('YYYY-MM-DD');
      const isPastDay = currentDate.isBefore(today, 'day');
      const isToday = currentDate.isSame(today, 'day');
      
      let dayData = null;
      for (const week of weeks) {
        const found = week.data.find((d: any) => d.date === dateStr);
        if (found) {
          dayData = found;
          break;
        }
      }
      
      if (!dayData) {
        dayData = {
          date: dateStr,
          slots: []
        };
      }
      
      dayData.isPastDay = isPastDay;
      dayData.isToday = isToday;
      
      allDays.push(dayData);
    }
    
    return allDays;
  };

  const monthDays = getAllDaysOfMonth();

  // Generate weeks for horizontal scrolling
  const generateWeeksForMonth = () => {
    if (!selectedDate) return [];
    
    const startOfMonth = selectedDate.startOf('month');
    const endOfMonth = selectedDate.endOf('month');
    
    const firstWeekStart = startOfMonth.startOf('week').day(1);
    
    const weeksArray: any[][] = [];
    let currentWeekStart = firstWeekStart;
    
    while (currentWeekStart.isBefore(endOfMonth) || currentWeekStart.isSame(endOfMonth, 'week')) {
      const weekDays = [];
      
      for (let i = 0; i < 7; i++) {
        const currentDay = currentWeekStart.add(i, 'day');
        const dateStr = currentDay.format('YYYY-MM-DD');
        const isPastDay = currentDay.isBefore(today, 'day');
        const isToday = currentDay.isSame(today, 'day');
        
        let dayData = null;
        for (const week of weeks) {
          const found = week.data.find((d: any) => d.date === dateStr);
          if (found) {
            dayData = found;
            break;
          }
        }
        
        weekDays.push({
          date: dateStr,
          dayObj: currentDay,
          isInSelectedMonth: currentDay.month() === selectedDate.month(),
          isPastDay: isPastDay,
          isToday: isToday,
          slots: dayData?.slots || []
        });
      }
      
      weeksArray.push(weekDays);
      currentWeekStart = currentWeekStart.add(1, 'week');
    }
    
    return weeksArray;
  };

  const monthWeeks = generateWeeksForMonth();

  // Auto-scroll to today when component mounts or month changes
  useEffect(() => {
    if (!selectedDate || monthWeeks.length === 0) return;

    const timer = setTimeout(() => {
      // Scroll horizontal container to today's week
      const todayWeekIndex = monthWeeks.findIndex(week => 
        week.some(day => day.isToday)
      );
      
      if (todayWeekIndex !== -1 && scrollContainerRef.current) {
        const weekWidth = isMobile ? 400 : 500; // Approximate week width
        const scrollPosition = todayWeekIndex * weekWidth;
        scrollContainerRef.current.scrollTo({
          left: scrollPosition,
          behavior: 'smooth'
        });
      }

      // Scroll vertical container to today's position
      const todayIndex = monthDays.findIndex(day => day.isToday);
      
      if (todayIndex !== -1 && verticalScrollRef.current && todayRef.current) {
        todayRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'nearest'
        });
      }
    }, 100); // Small delay to ensure rendering is complete

    return () => clearTimeout(timer);
  }, [selectedDate, monthWeeks.length, monthDays.length, isMobile]);

  if (!selectedDate) {
    return (
      <Alert severity="info" sx={{ mt: 2 }}>
        Please select a month to view the schedule
      </Alert>
    );
  }

  return (
    <Box>
      <Box
        ref={scrollContainerRef}
        sx={{
          display: 'flex',
          overflowX: 'auto',
          gap: 1,
          pb: 2,
          mb: 3,
          scrollBehavior: 'smooth',
          '&::-webkit-scrollbar': { 
            height: 6 
          },
          '&::-webkit-scrollbar-thumb': { 
            bgcolor: 'grey.400', 
            borderRadius: 3 
          },
          '&::-webkit-scrollbar-track': { 
            bgcolor: 'grey.100', 
            borderRadius: 3 
          }
        }}
        className="border-b-2 border-gray-200"
      >
        {monthWeeks.map((week, weekIndex) => (
          <Box
            key={weekIndex}
            sx={{
              display: 'flex',
              gap: isMobile ? 0.5 : 1,
              minWidth: 'fit-content',
              flexShrink: 0
            }}
          >
            {week.map((day: any) => {
              const isToday = day.isToday;
              const isInSelectedMonth = day.isInSelectedMonth;
              const isPastDay = day.isPastDay;
              
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
                        {day.dayObj.format('ddd')}
                      </Typography>
                      <Typography 
                        variant={isMobile ? "caption" : "body2"} 
                        fontWeight="bold"
                      >
                        {day.dayObj.format('DD')}
                      </Typography>
                    </Box>
                  }
                  className={
                    isToday 
                      ? "!bg-indigo-500 !text-white" 
                      : isPastDay
                        ? "!bg-gray-200 !text-gray-400"
                      : isInSelectedMonth 
                        ? "bg-white !text-gray-800" 
                        : "bg-white !text-gray-400"
                  }
                  sx={{ 
                    minWidth: isMobile ? 50 : 60, 
                    height: isMobile ? 50 : 60,
                    opacity: isPastDay ? 0.4 : (isInSelectedMonth ? 1 : 0.5),
                    cursor: isPastDay ? 'not-allowed' : 'default'
                  }}
                />
              );
            })}
          </Box>
        ))}
      </Box>

      {/* All days of the month - Vertically scrollable */}
      <Box 
        ref={verticalScrollRef}
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: isMobile ? 1 : 2,
          maxHeight: '70vh',
          overflowY: 'auto',
          pr: 1,
          scrollBehavior: 'smooth',
          '&::-webkit-scrollbar': { 
            width: 6 
          },
          '&::-webkit-scrollbar-thumb': { 
            bgcolor: 'grey.400', 
            borderRadius: 3 
          },
          '&::-webkit-scrollbar-track': { 
            bgcolor: 'grey.100', 
            borderRadius: 3 
          }
        }}
      >
        {monthDays.map((day: any, index) => (
          <Box
            key={day.date}
            ref={day.isToday ? todayRef : null}
            sx={{
              transition: 'all 0.3s ease-in-out',
              ...(day.isToday && {
                transform: 'scale(1.02)',
                boxShadow: '0 4px 12px rgba(79, 70, 229, 0.15)'
              })
            }}
          >
            <DayColumn
              date={day.date}
              slots={day.slots}
              isPastDay={day.isPastDay}
              onAdd={() => onAddForDate(day.date)}
              onAddException={onAddException}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
}
