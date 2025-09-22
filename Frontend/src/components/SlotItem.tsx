import React, { useState } from "react";
import { deleteExceptionBySlotDate, deleteExceptionById, deleteSlot } from "../api/slots";
import {
  Box,
  Typography,
  IconButton,
  Chip,
  Tooltip,
  CircularProgress,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  useTheme,
  useMediaQuery
} from "@mui/material";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import dayjs from "dayjs";

type Props = {
  slot: {
    slotId: number;
    exceptionId?: number;
    start_time: string;
    end_time: string;
    isException?: boolean;
  };
  date: string;
  isPastDay?: boolean;
  onAddException?: (slotId: number) => void;
  onRefresh: () => void;
};

export default function SlotItem({ slot, date, isPastDay = false, onAddException, onRefresh }: Props) {
  const [loading, setLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const today = dayjs();
  const slotDate = dayjs(date);

  const handleDelete = async () => {
    try {
      setLoading(true);
      
      if (slot.isException) {
        if (slot.exceptionId) {
          await deleteExceptionById(slot.exceptionId);
        } else {
          await deleteExceptionBySlotDate(slot.slotId, date);
        }
      } else {
        await deleteSlot(slot.slotId);
      }
      
      setDeleteDialogOpen(false);
      onRefresh();
    } catch (err: any) {
      console.error(err);
      alert("Failed to delete: " + (err?.message ?? err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: 1,
          mb: 1
        }}
        className="w-[9rem] sm:w-[16rem]"
      >
        <Paper
          sx={{
            display: 'flex',
            flex: 1,
            border: "none",
            boxShadow: "none",
            alignItems: isMobile ? 'stretch' : 'center',
            gap: isMobile ? 1 : 2,
            flexDirection: isMobile ? 'column' : 'row',
          }}
        >
          {/* Time Display */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              flex: 1,
              minWidth: 0,
              bgcolor: isPastDay 
                ? 'grey.100' 
                : slot.isException 
                  ? 'warning.light' 
                  : 'grey.50',
              border: '1px solid #e0e0e0',
              borderRadius: 2,
              px: 1,
              py: 1,
              position: 'relative',
              justifyContent: 'center',
              minHeight: isMobile ? 'auto' : '40px',
              flexDirection: isMobile ? 'column' : 'row',
              opacity: isPastDay ? 0.7 : 1
            }}
          >
            <Typography 
              variant={isMobile ? "body2" : "body1"} 
              fontWeight="medium"
              color={isPastDay ? "text.disabled" : "text.primary"}
              sx={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {slot.start_time} - {slot.end_time}
            </Typography>
            
            {slot.isException && !isPastDay && (
              <Chip
                label="Exception"
                size={isMobile ? "small" : "medium"}
                color="warning"
                variant="filled"
                sx={{ 
                  fontSize: isMobile ? '0.65rem' : '0.75rem',
                  height: isMobile ? 20 : 24,
                  flexShrink: 0
                }}
              />
            )}

            {isPastDay && (
              <Chip
                label="Past"
                size={isMobile ? "small" : "medium"}
                color="default"
                variant="outlined"
                sx={{ 
                  fontSize: isMobile ? '0.65rem' : '0.75rem',
                  height: isMobile ? 20 : 24,
                  flexShrink: 0,
                  borderColor: 'grey.400',
                  color: 'grey.600'
                }}
              />
            )}
          </Box>

          {/* Action buttons - only show for future dates */}
          {!isPastDay && (
            <Box
              sx={{
                display: 'flex',
                alignItems: isMobile ? 'flex-end' : 'center',
                gap: 0.5,
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              {!slot.isException && onAddException && (
                <Tooltip title="Add exception for this date" arrow>
                  <IconButton
                    onClick={() => onAddException(slot.slotId)}
                    color="default"
                    size={isMobile ? "small" : "medium"}
                    disabled={loading}
                    sx={{
                      '&:hover': {
                        transform: 'scale(1.05)'
                      }
                    }}
                  >
                    <AddCircleOutlineOutlinedIcon fontSize={isMobile ? "small" : "medium"} />
                  </IconButton>
                </Tooltip>
              )}

              <Tooltip 
                title={slot.isException ? "Remove exception" : "Delete recurring slot"} 
                arrow
              >
                <IconButton
                  onClick={() => setDeleteDialogOpen(true)}
                  disabled={loading}
                  size={isMobile ? "small" : "medium"}
                  color="default"
                  sx={{
                    '&:hover': {
                      transform: 'scale(1.05)'
                    }
                  }}
                >
                  {loading ? (
                    <CircularProgress size={isMobile ? 16 : 20} />
                  ) : (
                    <DeleteOutlineOutlinedIcon fontSize={isMobile ? "small" : "medium"} />
                  )}
                </IconButton>
              </Tooltip>
            </Box>
          )}
        </Paper>
      </Box>

      <Dialog 
        open={deleteDialogOpen} 
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { 
            m: isMobile ? 1 : 3,
            width: isMobile ? 'calc(100% - 16px)' : 'auto'
          }
        }}
      >
        <DialogTitle>
          {slot.isException ? 'Remove Exception' : 'Delete Recurring Slot'}
        </DialogTitle>
        <DialogContent>
          <Typography>
            {slot.isException 
              ? `Remove the exception and restore the original recurring slot (${slot.start_time} - ${slot.end_time}) for ${date}?`
              : `Permanently delete the recurring slot (${slot.start_time} - ${slot.end_time}) for all days? This will also remove all its exceptions.`
            }
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: isMobile ? 2 : 3, gap: 1 }}>
          <Button 
            onClick={() => setDeleteDialogOpen(false)} 
            disabled={loading}
            fullWidth={isMobile}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDelete} 
            color="error" 
            variant="contained"
            disabled={loading}
            fullWidth={isMobile}
          >
            {loading ? 'Deleting...' : (slot.isException ? 'Remove Exception' : 'Delete Slot')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
