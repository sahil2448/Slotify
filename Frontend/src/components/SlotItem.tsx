// src/components/SlotItem.tsx
import React, { useState } from "react";
import { deleteExceptionBySlotDate, deleteExceptionById } from "../api/slots";
import { 
  Box, 
  Typography, 
  IconButton, 
  Chip,
  Tooltip,
  CircularProgress,
  Paper
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

type Props = {
  slot: {
    slotId: number;
    exceptionId?: number;
    start_time: string;
    end_time: string;
    isException?: boolean;
  };
  date: string;
  onAddException?: (slotId: number) => void;
  onRefresh: () => void;
};

export default function SlotItem({ slot, date, onAddException, onRefresh }: Props) {
  const [loading, setLoading] = useState(false);

  const handleUndo = async () => {
    const ok = window.confirm("Remove exception and restore recurring slot for this date?");
    if (!ok) return;

    try {
      setLoading(true);
      if (slot.exceptionId) {
        await deleteExceptionById(slot.exceptionId);
      } else {
        await deleteExceptionBySlotDate(slot.slotId, date);
      }
      onRefresh();
    } catch (err: any) {
      console.error(err);
      alert("Failed to remove exception: " + (err?.message ?? err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper 
      variant="outlined" 
      sx={{ 
        p: 2, 
        bgcolor: 'grey.50',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="body1" fontWeight="medium">
          {slot.start_time} - {slot.end_time}
        </Typography>
        {slot.isException && (
          <Chip 
            label="Exception" 
            size="small" 
            color="primary" 
            variant="outlined"
          />
        )}
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <Tooltip title="Add exception">
          <IconButton
            onClick={() => onAddException?.(slot.slotId)}
            disabled={loading}
            size="small"
            color="primary"
          >
            <AddCircleOutlineIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        
        <Tooltip title="Delete slot">
          <IconButton
            onClick={handleUndo}
            disabled={loading}
            size="small"
            color="error"
          >
            {loading ? (
              <CircularProgress size={16} />
            ) : (
              <DeleteIcon fontSize="small" />
            )}
          </IconButton>
        </Tooltip>
      </Box>
    </Paper>
  );
}
