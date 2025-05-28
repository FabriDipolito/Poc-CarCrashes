'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronRight } from "lucide-react";
import { dialogLines } from '@/constants';

export default function TypingDialog({ currentSlide, totalRecords }: { currentSlide: number, totalRecords: { total: number, vehicles: number, accidents: number } }) {

  const [visibleText, setVisibleText] = useState('');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fullText = currentSlide === 1
    ? dialogLines[currentSlide].replace("${TOTAL}", totalRecords.total.toString())
    : dialogLines[currentSlide] || '';

  useEffect(() => {
    setVisibleText('');
    let index = 0;

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      if (index <= fullText.length) {
        setVisibleText(fullText.slice(0, index));
        index++;
      } else if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }, 30);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [currentSlide, fullText]);

  const handleSkip = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setVisibleText(fullText);
  };

  return (
    <div className="flex-1 overflow-y-hidden">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Dialog</h2>
        <button
          onClick={handleSkip}
          className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full hover:bg-gray-200 transition cursor-pointer"
        >
          Skip
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      <div className="h-[calc(100%-52px)]">
        <p className="h-full text-sm text-gray-700 whitespace-pre-line overflow-y-auto">
          {visibleText}
          <span className="animate-pulse">|</span>
        </p>
      </div>
    </div>
  );
}