"use client";

import { useEffect, useRef, useState } from "react";
import { HeartIcon, BanknotesIcon, TicketIcon } from "@heroicons/react/24/solid";

interface CounterItem {
  id: string;
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  icon: JSX.Element;
}

function useCountUp(target: number, durationMs = 1200) {
  const [value, setValue] = useState(0);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    let frameId: number;

    const step = (timestamp: number) => {
      if (startRef.current === null) startRef.current = timestamp;
      const progress = Math.min(1, (timestamp - startRef.current) / durationMs);
      setValue(Math.floor(progress * target));
      if (progress < 1) frameId = requestAnimationFrame(step);
    };

    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [target, durationMs]);

  return value;
}

function Counter({ item, delayMs = 0 }: { item: CounterItem; delayMs?: number }) {
  const [mounted, setMounted] = useState(false);
  const count = useCountUp(mounted ? item.value : 0, 1200);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), delayMs);
    return () => clearTimeout(t);
  }, [delayMs]);

  return (
    <div className="flex items-center gap-3 bg-gray-800/80 border border-gray-700 rounded-lg px-3 py-2 sm:px-4 sm:py-3 backdrop-blur animate-fade-in-up" style={{ animationDelay: `${delayMs}ms` }}>
      <div className="text-green-500">
        {item.icon}
      </div>
      <div className="leading-tight">
        <div className="text-white font-bold text-lg sm:text-xl">
          {item.prefix}{count.toLocaleString()}{item.suffix}
        </div>
        <div className="text-gray-400 text-xs sm:text-sm">{item.label}</div>
      </div>
    </div>
  );
}

export default function TopCounters() {
  const items: CounterItem[] = [
    {
      id: "likes",
      label: "Total Likes",
      value: 12847,
      icon: <HeartIcon className="h-5 w-5 sm:h-6 sm:w-6" />,
    },
    {
      id: "saved",
      label: "Money Saved",
      value: 342190,
      prefix: "$",
      icon: <BanknotesIcon className="h-5 w-5 sm:h-6 sm:w-6" />,
    },
    {
      id: "tickets",
      label: "Tickets Sold",
      value: 58723,
      icon: <TicketIcon className="h-5 w-5 sm:h-6 sm:w-6" />,
    },
  ];

  return (
    <div className="w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {items.map((item, i) => (
            <Counter key={item.id} item={item} delayMs={i * 150} />
          ))}
        </div>
      </div>
    </div>
  );
}
