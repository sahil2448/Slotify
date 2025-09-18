// src/components/DayColumn.tsx
import React from "react";
import SlotItem from "./SlotItem";
import { 
  Box, 
  Typography, 
  Paper,
  IconButton,
  Chip
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import dayjs from "dayjs";

interface DayColumnProps {
  date: string;
  slots: any[];
  onAdd: () => void;
}

export default function DayColumn({ date, slots, onAdd }: DayColumnProps) {
  const dayObj = dayjs(date);
  const isToday = dayObj.isSame(dayjs(), 'day');
  
  const dayDisplay = dayObj.format('ddd, DD MMMM');

  return (
    <Paper elevation={1} sx={{ p: 2, bgcolor: 'white' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography 
            variant="subtitle1" 
            color={isToday ? "primary" : "text.primary"}
            fontWeight="medium"
          >
            {dayDisplay}
          </Typography>
          {isToday && (
            <Chip 
              label="Today" 
              size="small" 
              color="primary" 
              variant="filled"
              sx={{ fontSize: '0.7rem', height: 20 }}
            />
          )}
        </Box>
        
        <IconButton 
          onClick={onAdd} 
          color="primary" 
          size="small"
          sx={{ 
            bgcolor: 'primary.main', 
            color: 'white',
            '&:hover': { bgcolor: 'primary.dark' }
          }}
        >
          <AddIcon fontSize="small" />
        </IconButton>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {slots.length === 0 ? (
          <Box sx={{ 
            p: 3, 
            textAlign: 'center', 
            bgcolor: 'grey.50', 
            borderRadius: 1,
            border: '1px dashed',
            borderColor: 'grey.300'
          }}>
            <Typography variant="body2" color="text.secondary">
              00:00 - 00:00
            </Typography>
            <Typography variant="caption" color="text.secondary">
              No slots scheduled
            </Typography>
          </Box>
        ) : (
          slots.map((slot: any) => (
            <SlotItem 
              key={slot.slotId} 
              date={date} 
              slot={slot} 
              onAddException={() => onAdd()} 
              onRefresh={() => window.location.reload()}
            />
          ))
        )}
      </Box>
    </Paper>
  );
}
