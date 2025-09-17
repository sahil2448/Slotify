import { useEffect,useRef,useState } from "react";
import { fetchWeek } from "../api/slots";
import { nextWeekStart,todayWeekStart } from "../utils/date";

export function useSlotsInfinite(initialWeek?:string){
    const start = initialWeek ?? todayWeekStart();
    const [weeks,setWeeks] = useState<{weekStart:string,data:any}[]>([]);
    const current = useRef(start);

    const loadingRef = useRef(false);

    async function loadNext(){
        if(loadingRef.current) return;
        loadingRef.current = true;

        try{
            const weekStart = current.current
            const week = await fetchWeek(weekStart)
            setWeeks(prev => [...prev,week]);
            current.current = nextWeekStart(weekStart)
        } finally{
            loadingRef.current = false
        }
    }

    useEffect(()=>{
        loadNext();
    },[])


    return {weeks,loadNext}
}