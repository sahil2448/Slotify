// src/components/DayColumn.tsx - RESPONSIVE VERSION
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
  onAdd: () => void;
  onAddException: (slotId: number, date: string, startTime: string, endTime: string) => void;
}

export default function DayColumn({ date, slots, onAdd, onAddException }: DayColumnProps) {
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
        bgcolor:'white',
        border:"none",
        boxShadow:"none",
        mb: 2,
        transition: 'all 0.2s ease-in-out',
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems:'flex-start',
        flexDirection: 'column',

        gap: isMobile ? 1 : 2,
        border:"none",

        mb: 2 
      }}>
        <Box sx={{ 
          display: 'flex',
          flexDirection:'column', 
          alignItems: 'flex-start', 
          gap: 1,
          flexWrap: 'wrap'
        }}>
          <Typography 
            variant={isMobile ? "subtitle2" : "subtitle1"} 
            fontWeight="bold"
            className={isToday ? 'text-indigo-500' : ''}
          >
            {dayObj.format(isMobile ? 'ddd, DD MMM' : 'ddd, DD MMMM')}
          </Typography>
          
          {isToday && (
                      <Typography 
            variant={isMobile ? "subtitle2" : "subtitle1"} 
            fontWeight="bold"
            className={isToday ? 'text-indigo-500' : ''}
          >
            (Today)
          </Typography>
            
          )}
        </Box>
        
        <Tooltip title="Add new slot" arrow>
          <IconButton 
            onClick={onAdd}
            size={isMobile ? "small" : "medium"}
            sx={{ 
              color: 'white',
              width: 32,
              height:32,
              borderRadius:2,
              '&:hover': { 
                transform: 'scale(1.03)'
              }
            }}
            className="!bg-indigo-400 !text-white hover:!bg-indigo-500 transition-all duration-200"
          >
            <AddIcon fontSize={isMobile ? "small" : "medium"} />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Slots Content */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: isMobile ? 0.5 : 1 
      }}>
        {slots.length === 0 ? (
          <Box sx={{ 
            p: isMobile ? 2 : 3, 
            textAlign: 'center', 
            bgcolor: 'grey.50', 
            borderRadius: 2,
            border: '2px dashed',
            borderColor: 'grey.300',
            position: 'relative'
          }}
        className="w-[9rem] sm:w-[16rem]"
          >
            <Typography 
              variant={isMobile ? "caption" : "body2"} 
              color="text.secondary" 
              sx={{ mb: 1 }}
            >
              00:00 - 00:00
            </Typography>
            <Typography 
              variant="caption" 
              color="text.secondary"
            >
              No slots scheduled
            </Typography>
            
            {/* <Tooltip title="Click to add your first slot" arrow>
              <IconButton
                onClick={onAdd}
                color="primary"
                size={isMobile ? "small" : "medium"}
                sx={{
                  position: 'absolute',
                  top: '50%',
                  right: isMobile ? 4 : 8,
                  transform: 'translateY(-50%)',
                  opacity: 0.7,
                  '&:hover': {
                    opacity: 1,
                    transform: 'translateY(-50%) scale(1.1)'
                  }
                }}
              >
                <AddIcon fontSize={isMobile ? "small" : "medium"} />
              </IconButton>
            </Tooltip> */}
          </Box>
        ) : (
          slots.map((slot: any) => (
            <SlotItem 
              key={slot.slotId} 
              date={date} 
              slot={slot} 
              onAddException={() => onAddException(slot.slotId, date, slot.start_time, slot.end_time)}
              onRefresh={() => window.location.reload()}
            />
          ))
        )}
      </Box>
    </Paper>
  );
}
