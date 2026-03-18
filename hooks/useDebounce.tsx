
import { useEffect, useState } from "react";

export default function useDebounce<T>(value: T, delay: number) : T{
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const timer = setTimeout(() => {
            console.log("in the timer")
            setDebouncedValue(value);
        }, delay)

        return () => {
            clearTimeout(timer);
        }
    },[value])
    return debouncedValue 
}