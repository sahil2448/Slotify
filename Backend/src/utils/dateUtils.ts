export function getWeekDates(startDateISO: string) {
  const d0 = new Date(startDateISO + "T00:00:00Z");
  const dates: string[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(d0);
    d.setUTCDate(d0.getUTCDate() + i);
    dates.push(d.toISOString().slice(0, 10)); 
  }
  return dates;
}

export function dateToDayOfWeek(dateISO: string) {
  const d = new Date(dateISO + "T00:00:00Z");
  // JS getUTCDay: 0=Sun .. 6=Sat
  return d.getUTCDay();
}
