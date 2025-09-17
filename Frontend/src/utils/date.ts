import {addDays,format,parseISO,startOfWeek} from "date-fns"

export function getWeekDates(weekStartISO:string){
    const start = parseISO(weekStartISO);
    const dates = Array.from({length:7},(_,i)=>format(addDays(start,i),"yyyy-MM-dd"));
    return dates
}

export function getWeekStartFormatDate(dateISO:string){
    const d = parseISO(dateISO);
    const monday = startOfWeek(d,{weekStartsOn:1});
    return format(monday,"yyyy-MM-dd");
}

export function nextWeekStart(weekStartISO:string){
    return format(addDays(parseISO(weekStartISO),7),"yyyy-MM-dd");
}

export function todayWeekStart(){
    return getWeekStartFormatDate(format(new Date(),"yyyy-MM-dd"));
}
