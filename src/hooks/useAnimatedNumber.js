import { useEffect, useRef, useState } from 'react';

export default function useAnimatedNumber(targetValue, duration = 320) {
  const numericTarget = Number.isFinite(Number(targetValue)) ? Number(targetValue) : 0;
  const [displayValue, setDisplayValue] = useState(numericTarget);
  const currentRef = useRef(numericTarget);

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion || duration <= 0) {
      currentRef.current = numericTarget;
      setDisplayValue(numericTarget);
      return;
    }

    const startValue = currentRef.current;
    const delta = numericTarget - startValue;

    if (Math.abs(delta) < 0.0001) {
      currentRef.current = numericTarget;
      setDisplayValue(numericTarget);
      return;
    }

    let rafId = null;
    let startTime = null;

    const tick = (timestamp) => {
      if (startTime === null) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      const next = startValue + delta * eased;

      currentRef.current = next;
      setDisplayValue(next);

      if (progress < 1) {
        rafId = window.requestAnimationFrame(tick);
      } else {
        currentRef.current = numericTarget;
        setDisplayValue(numericTarget);
      }
    };

    rafId = window.requestAnimationFrame(tick);

    return () => {
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, [numericTarget, duration]);

  return displayValue;
}
