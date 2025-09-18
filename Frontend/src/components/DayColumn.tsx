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
  
  const dayDisplay1 = dayObj.format('ddd, DD');
  const dayDisplay2 = dayObj.format('MMMM');

  return (
    <Paper elevation={1} sx={{ p: 2, bgcolor: 'white' }} className="flex justify-between">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography 
            variant="subtitle1" 
            className={isToday ? "text-indigo-500" : "text-gray-500"}
            fontWeight={isToday ? "bold" :  "bold"}
          >
            <p>{dayDisplay1} </p>
            <div className="flex justify-center items-center gap-4"><p>{dayDisplay2}</p>
                      {isToday && (
            <Chip 
              label="Today" 
              size="small" 
              className="!bg-indigo-500 !text-white" 
              variant="filled"
              sx={{ fontSize: '0.7rem', height: 20 }}
            />
          )}</div>

          </Typography>

        </Box>
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
