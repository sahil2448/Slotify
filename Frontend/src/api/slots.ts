const base = import.meta.env.VITE_API_BASE_URL|| "http://localhost:4000";

export async function fetchWeek(weekstart:string){
    const response = await fetch(`${base}/slots?weekStart=${weekstart}`)
    if(!response.ok) throw new Error("Failed to fetch the week");
    return response.json();
}

export async function createSlot(body: {day_of_week:number,start_time:string,end_time:string}) {
  const res = await fetch(`${base}/slots`, {
    method: "POST",
    headers: {"content-type":"application/json"},
    body: JSON.stringify(body)
  });
  return res.json();
}

export async function createException(slotId:number, body:any) {
  const res = await fetch(`${base}/slots/${slotId}/exceptions`, {
    method: "POST",
    headers: {"content-type":"application/json"},
    body: JSON.stringify(body)
  });
  return res.json();
}