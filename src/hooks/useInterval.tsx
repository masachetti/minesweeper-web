import { useCallback, useEffect, useRef } from "react";

export default function useInterval(callback: () => void, delay: number | null) {

  const savedCallback = useCallback(callback, [callback])
  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}