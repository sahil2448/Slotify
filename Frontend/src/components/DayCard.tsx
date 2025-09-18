// src/components/DayCard.tsx
import React from "react";
import SlotItem from "./SlotItem";
import { 
  Box, 
  Typography, 
  IconButton, 
  Divider,
  Chip
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';

export default function DayCard({ 
  date, 
  slots, 
  onAdd 
}: { 
  date: string; 
  slots: any[]; 
  onAdd?: () => void; 
}) {
  const display = new Date(date).toLocaleDateString(undefined, { 
    weekday: "short", 
    day: "2-digit", 
    month: "short" 
  });

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="subtitle1" color="primary" fontWeight="bold">
          {display}
        </Typography>
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
        {slots.length === 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
            No slots scheduled
          </Typography>
        )}
        {slots.map((s: any) => (
          <SlotItem 
            key={s.slotId} 
            date={date} 
            slot={s} 
            onAddException={() => onAdd?.()} 
            onRefresh={() => window.location.reload()}
          />
        ))}
      </Box>
      <Divider />
    </Box>
  );
}
