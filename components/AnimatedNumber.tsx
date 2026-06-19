"use client";

import { useEffect, useState } from "react";
import { animate, useMotionValue } from "framer-motion";
import { formatEUR, formatPct } from "@/lib/format";

interface Props {
  value: number;
  format?: "eur" | "pct" | "raw";
  signed?: boolean;
  dp?: number;
  className?: string;
}

export default function AnimatedNumber({ value, format = "eur", signed = false, dp = 0, className }: Props) {
  const motionValue = useMotionValue(value);
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    const controls = animate(motionValue, value, {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1], // Custom spring-like easing
      onUpdate: (latest) => {
        setDisplayValue(latest);
      },
    });
    return controls.stop;
  }, [value, motionValue]);

  let formatted = "";
  if (format === "eur") {
    formatted = formatEUR(displayValue, { signed });
  } else if (format === "pct") {
    formatted = formatPct(displayValue, dp);
  } else {
    formatted = displayValue.toFixed(dp);
  }

  return <span className={className}>{formatted}</span>;
}
