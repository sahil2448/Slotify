import toast from 'react-hot-toast';

const base = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

export async function fetchWeek(weekstart: string) {
  try {
    const response = await fetch(`${base}/slots?weekStart=${weekstart}`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error('fetchWeek error:', error);
    toast.error('Failed to fetch schedule data');
    throw error;
  }
}


// api/slots.ts - ADD THIS FUNCTION
export async function deleteSlot(slotId: number) {
  try {
    const url = `${base}/slots/${slotId}`;
    const res = await fetch(url, { method: "DELETE" });
    
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Failed to delete slot');
    }
    
    toast.success('Slot deleted successfully!');
    return res.json();
  } catch (error: any) {
    console.error('deleteSlot error:', error);
    toast.error(error.message || 'Failed to delete slot');
    throw error;
  }
}

export async function createSlot(body: {day_of_week: number, start_time: string, end_time: string}) {
  try {
    const res = await fetch(`${base}/slots`, {
      method: "POST",
      headers: {"content-type": "application/json"},
      body: JSON.stringify(body)
    });
    
    const data = await res.json();
    
    if (!res.ok) {
      throw new Error(data.error || 'Failed to create slot');
    }
    
    toast.success('Slot created successfully!');
    return data;
  } catch (error: any) {
    console.error('createSlot error:', error);
    toast.error(error.message || 'Failed to create slot');
    throw error;
  }
}

export async function createException(slotId:number, body:any) {
  const res = await fetch(`${base}/slots/${slotId}/exceptions`, {
    method: "POST",
    headers: {"content-type":"application/json"},
    body: JSON.stringify(body)
  });
  return res.json();
}


export async function deleteExceptionBySlotDate(slotId: number, exception_date: string) {
  const url = `${base}/slots/${slotId}/exceptions?exception_date=${encodeURIComponent(exception_date)}`;
  const res = await fetch(url, { method: "DELETE" });
  if (!res.ok) throw new Error(`Delete exception failed: ${res.status}`);
  return res.json();
}

export async function deleteExceptionById(id: number) {
  const url = `${base}/slots/exceptions/${id}`;
  const res = await fetch(url, { method: "DELETE" });
  if (!res.ok) throw new Error(`Delete exception failed: ${res.status}`);
  return res.json();
}