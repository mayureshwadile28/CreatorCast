"use client";

import React, { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

interface AnimatedCounterProps {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}

export function AnimatedCounter({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  duration = 2.2,
  className = "",
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: false, amount: 0.1 });
  const [displayNumber, setDisplayNumber] = useState(0);

  useEffect(() => {
    if (!isInView) {
      setDisplayNumber(0);
      return;
    }

    let frame = 0;
    const totalFrames = Math.round(duration * 60);

    const timer = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      // Cubic ease-out
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = value * ease;

      setDisplayNumber(current);

      if (frame >= totalFrames) {
        clearInterval(timer);
        setDisplayNumber(value);
      }
    }, 1000 / 60);

    return () => clearInterval(timer);
  }, [isInView, value, duration]);

  const formatted =
    decimals > 0
      ? displayNumber.toFixed(decimals)
      : Math.floor(displayNumber).toLocaleString();

  return (
    <span ref={ref} className={`inline-flex items-baseline ${className}`}>
      {prefix && <span>{prefix}</span>}
      <span>{formatted}</span>
      {suffix && <span>{suffix}</span>}
    </span>
  );
}
