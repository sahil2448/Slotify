// src/components/ExceptionDialog.tsx - NEW FILE
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Box
} from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { createException, deleteExceptionBySlotDate } from '../api/slots';

interface ExceptionDialogProps {
  open: boolean;
  onClose: () => void;
  slotId: number;
  date: string;
  originalStartTime: string;
  originalEndTime: string;
  onRefresh: () => void;
}

export default function ExceptionDialog({
  open,
  onClose,
  slotId,
  date,
  originalStartTime,
  originalEndTime,
  onRefresh
}: ExceptionDialogProps) {
  const [exceptionType, setExceptionType] = useState<'cancel' | 'modify'>('cancel');
  const [flagForDelete, setFlagForDelete] = useState(false);
  const [newStartTime, setNewStartTime] = useState<Dayjs | null>(dayjs(`2000-01-01 ${originalStartTime}`));
  const [newEndTime, setNewEndTime] = useState<Dayjs | null>(dayjs(`2000-01-01 ${originalEndTime}`));
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    try {
      setLoading(true);
      
      if(exceptionType === 'cancel'){
        setFlagForDelete(true);
      }
      const payload = {
        exception_date: date,
        is_deleted: exceptionType === 'cancel',
        new_start_time: exceptionType === 'modify' ? newStartTime?.format('HH:mm:ss') : null,
        new_end_time: exceptionType === 'modify' ? newEndTime?.format('HH:mm:ss') : null,
      };

      await createException(slotId, payload);

      if(flagForDelete){
          setLoading(true);
          await deleteExceptionBySlotDate(slotId, date);
      }

      // onRefresh();
      
      onClose();
    } catch (error) {
      console.error('Failed to create exception:', error);
      alert('Failed to create exception');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Create Exception for {date}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <FormControl component="fieldset">
              <FormLabel component="legend">Exception Type</FormLabel>
              <RadioGroup
                value={exceptionType}
                onChange={(e) => setExceptionType(e.target.value as 'cancel' | 'modify')}
              >
                <FormControlLabel 
                  value="cancel" 
                  control={<Radio />} 
                  label={`Cancel slot for this date (${originalStartTime} - ${originalEndTime})`}
                />
                <FormControlLabel 
                  value="modify" 
                  control={<Radio />} 
                  label="Modify time for this date"
                />
              </RadioGroup>
            </FormControl>

            {exceptionType === 'modify' && (
              <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TimePicker
                  label="New Start Time"
                  value={newStartTime}
                  onChange={setNewStartTime}
                />
                <TimePicker
                  label="New End Time"
                  value={newEndTime}
                  onChange={setNewEndTime}
                />
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={loading}>Cancel</Button>
          <Button 
            onClick={handleSave} 
            variant="contained" 
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Exception'}
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
}
