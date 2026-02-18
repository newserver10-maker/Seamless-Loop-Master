import React, { useRef, useEffect, useState } from 'react';
import { TrimState } from '../types';
import { formatTime, clamp } from '../utils/format';

interface TimelineProps {
  trim: TrimState;
  onTrimChange: (newStart: number, newEnd: number) => void;
  currentTime: number;
}

export const Timeline: React.FC<TimelineProps> = ({ trim, onTrimChange, currentTime }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState<'start' | 'end' | null>(null);

  const handlePointerDown = (type: 'start' | 'end') => (e: React.PointerEvent) => {
    e.preventDefault();
    setIsDragging(type);
    containerRef.current?.setPointerCapture(e.pointerId);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(null);
    containerRef.current?.releasePointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const percent = clamp((e.clientX - rect.left) / rect.width, 0, 1);
    const time = percent * trim.duration;
    
    // Minimum 0.5s segment
    const minGap = 0.5;

    if (isDragging === 'start') {
      onTrimChange(Math.min(time, trim.end - minGap), trim.end);
    } else {
      onTrimChange(trim.start, Math.max(time, trim.start + minGap));
    }
  };

  const leftPercent = (trim.start / trim.duration) * 100;
  const rightPercent = ((trim.duration - trim.end) / trim.duration) * 100;
  const currentPercent = (currentTime / trim.duration) * 100;

  return (
    <div className="w-full select-none touch-none">
      <div className="flex justify-between text-xs text-gray-400 mb-1">
        <span>{formatTime(trim.start)}</span>
        <span>{formatTime(trim.end)}</span>
      </div>
      
      <div 
        ref={containerRef}
        className="relative h-12 bg-gray-800 rounded-lg cursor-pointer overflow-hidden ring-1 ring-gray-700"
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        {/* Background track representing full video */}
        <div className="absolute inset-0 bg-gray-800" />
        
        {/* Active selected region */}
        <div 
          className="absolute h-full bg-blue-900/30 border-l border-r border-blue-500"
          style={{ left: `${leftPercent}%`, right: `${rightPercent}%` }}
        />

        {/* Playhead */}
        {currentTime >= 0 && (
          <div 
            className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10 pointer-events-none"
            style={{ left: `${currentPercent}%` }}
          />
        )}

        {/* Start Handle */}
        <div 
          className="absolute top-0 bottom-0 w-4 bg-blue-500 hover:bg-blue-400 cursor-ew-resize flex items-center justify-center z-20 group"
          style={{ left: `calc(${leftPercent}% - 8px)` }}
          onPointerDown={handlePointerDown('start')}
        >
          <div className="w-1 h-4 bg-white/50 rounded-full group-hover:bg-white" />
        </div>

        {/* End Handle */}
        <div 
          className="absolute top-0 bottom-0 w-4 bg-blue-500 hover:bg-blue-400 cursor-ew-resize flex items-center justify-center z-20 group"
          style={{ right: `calc(${rightPercent}% - 8px)` }}
          onPointerDown={handlePointerDown('end')}
        >
          <div className="w-1 h-4 bg-white/50 rounded-full group-hover:bg-white" />
        </div>
      </div>
    </div>
  );
};
