// src/components/DayColumn.tsx - UPDATED WITH PAST DAY HANDLING
import React from "react";
import SlotItem from "./SlotItem";
import { 
  Box, 
  Typography, 
  Paper,
  IconButton,
  Chip,
  Tooltip,
  useTheme,
  useMediaQuery
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import dayjs from "dayjs";

interface DayColumnProps {
  date: string;
  slots: any[];
  isPastDay?: boolean;
  onAdd: () => void;
  onAddException: (slotId: number, date: string, startTime: string, endTime: string) => void;
}

export default function DayColumn({ date, slots, isPastDay = false, onAdd, onAddException }: DayColumnProps) {
  const dayObj = dayjs(date);
  const isToday = dayObj.isSame(dayjs(), 'day');
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  return (
    <Paper 
      elevation={isToday ? 3 : 1} 
      sx={{ 
        p: isMobile ? 1.5 : 2, 
        display: 'flex',
        justifyContent: 'space-between',
        bgcolor: isPastDay ? 'grey.50' : 'white',
        border: "none",
        boxShadow: isPastDay ? "none" : "default",
        mb: 2,
        transition: 'all 0.2s ease-in-out',
        opacity: isPastDay ? 0.6 : 1,
        position: 'relative'
      }}
    >
      {/* Past day overlay */}
      {isPastDay && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.05)',
            zIndex: 1,
            borderRadius: 1,
            pointerEvents: 'none'
          }}
        />
      )}
      
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start',
        flexDirection: 'column',
        gap: isMobile ? 1 : 2,
        border: "none",
        mb: 2,
        zIndex: 2,
        position: 'relative'
      }}>
        <Box sx={{ 
          display: 'flex',
          flexDirection: 'column', 
          alignItems: 'flex-start', 
          gap: 1,
          flexWrap: 'wrap'
        }}>
          <Typography 
            variant={isMobile ? "subtitle2" : "subtitle1"} 
            fontWeight="bold"
            className={isToday ? 'text-indigo-500' : isPastDay ? 'text-gray-400' : ''}
          >
            {dayObj.format(isMobile ? 'ddd, DD MMM' : 'ddd, DD MMMM')}
          </Typography>
          
          {isToday && (
            <Typography 
              variant={isMobile ? "subtitle2" : "subtitle1"} 
              fontWeight="bold"
              className="text-indigo-500"
            >
              (Today)
            </Typography>
          )}

          {isPastDay && (
            <Chip 
              label="Past" 
              size="small" 
              color="default"
              sx={{ 
                fontSize: '0.6rem',
                height: 20,
                bgcolor: 'grey.300',
                color: 'grey.600'
              }}
            />
          )}
        </Box>
        
        {/* Only show add button for future dates */}
        {!isPastDay && (
          <Tooltip title="Add new slot" arrow>
            <IconButton 
              onClick={onAdd}
              size={isMobile ? "small" : "medium"}
              sx={{ 
                color: 'white',
                width: 32,
                height: 32,
                borderRadius: 2,
                '&:hover': { 
                  transform: 'scale(1.03)'
                }
              }}
              className="!bg-indigo-400 !text-white hover:!bg-indigo-500 transition-all duration-200"
            >
              <AddIcon fontSize={isMobile ? "small" : "medium"} />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      {/* Slots Content */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: isMobile ? 0.5 : 1,
        zIndex: 2,
        position: 'relative'
      }}>
        {slots.length === 0 ? (
          <Box sx={{ 
            p: isMobile ? 2 : 3, 
            textAlign: 'center', 
            bgcolor: isPastDay ? 'grey.100' : 'grey.50', 
            borderRadius: 2,
            border: '2px dashed',
            borderColor: isPastDay ? 'grey.200' : 'grey.300',
            position: 'relative'
          }}
          className="w-[9rem] sm:w-[16rem]"
          >
            <Typography 
              variant={isMobile ? "caption" : "body2"} 
              color={isPastDay ? "text.disabled" : "text.secondary"} 
              sx={{ mb: 1 }}
            >
              00:00 - 00:00
            </Typography>
            <Typography 
              variant="caption" 
              color={isPastDay ? "text.disabled" : "text.secondary"}
            >
              {isPastDay ? "No slots (Past day)" : "No slots scheduled"}
            </Typography>
          </Box>
        ) : (
          slots.map((slot: any) => (
            <SlotItem 
              key={slot.slotId} 
              date={date} 
              slot={slot}
              isPastDay={isPastDay}
              onAddException={!isPastDay ? () => onAddException(slot.slotId, date, slot.start_time, slot.end_time) : undefined}
              onRefresh={() => window.location.reload()}
            />
          ))
        )}
      </Box>
    </Paper>
  );
}
