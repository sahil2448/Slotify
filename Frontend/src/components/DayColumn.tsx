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
        bgcolor: isToday ? '#e3f2fd' : 'white',
        mb: 2,
        transition: 'all 0.2s ease-in-out',
        borderLeft: isToday ? 4 : 0,
        borderLeftColor: 'primary.main'
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: isMobile ? 'flex-start' : 'center',
        flexDirection: isMobile ? 'column' : 'row',
        gap: isMobile ? 1 : 2,
        mb: 2 
      }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1,
          flexWrap: 'wrap'
        }}>
          <Typography 
            variant={isMobile ? "subtitle2" : "subtitle1"} 
            color={isToday ? "primary" : "text.primary"}
            fontWeight="bold"
          >
            {dayObj.format(isMobile ? 'ddd, DD MMM' : 'ddd, DD MMMM')}
          </Typography>
          
          {isToday && (
            <Chip
              label="Today" 
              size="small" 
              color="primary"
              variant="filled"
              sx={{ 
                fontSize: '0.7rem', 
                height: isMobile ? 18 : 20,
                fontWeight: 'bold'
              }}
            />
          )}
        </Box>
        
        {/* Add Button - Always Visible */}
        <Tooltip title="Add new slot" arrow>
          <IconButton 
            onClick={onAdd}
            color="primary" 
            size={isMobile ? "small" : "medium"}
            sx={{ 
              bgcolor: 'primary.main', 
              color: 'white',
              minWidth: isMobile ? 32 : 40,
              height: isMobile ? 32 : 40,
              '&:hover': { 
                bgcolor: 'primary.dark',
                transform: 'scale(1.1)'
              }
            }}
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
          }}>
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
            
            <Tooltip title="Click to add your first slot" arrow>
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
            </Tooltip>
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
