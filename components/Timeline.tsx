'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';

import { Dispatch, SetStateAction } from 'react';

interface TimelineProps {
    year: number;
    setYear: Dispatch<SetStateAction<number>>;
    min?: number;
    max?: number;
}

export default function Timeline({ year, setYear, min = 1000, max = 2024 }: TimelineProps) {
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isPlaying) {
            interval = setInterval(() => {
                setYear((prevYear) => {
                    if (prevYear >= max) {
                        setIsPlaying(false);
                        return max;
                    }
                    return prevYear + 5; // Increment by 5 years for speed
                });
            }, 100);
        }
        return () => clearInterval(interval);
    }, [isPlaying, setYear, max]);

    const togglePlay = () => setIsPlaying(!isPlaying);

    return (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-2xl px-6 flex items-center gap-4">
            <button
                onClick={togglePlay}
                className="p-3 bg-blue-600 hover:bg-blue-500 rounded-full text-white shadow-lg shadow-blue-500/30 transition-all active:scale-95"
            >
                {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
            </button>

            <div className="flex-1 bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex flex-col items-center gap-2">
                <div className="flex justify-between w-full text-xs text-white/50 font-mono uppercase tracking-widest">
                    <span>Origin ({min < 0 ? `${Math.abs(min)} BC` : min})</span>
                    <span className={year === 2024 ? 'text-blue-400 font-bold' : ''}>Current ({year})</span>
                    <span>Future ({max})</span>
                </div>

                <input
                    type="range"
                    min={min}
                    max={max}
                    value={year}
                    onChange={(e) => setYear(parseInt(e.target.value))}
                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400 transition-all"
                />
            </div>
        </div>
    );
}
