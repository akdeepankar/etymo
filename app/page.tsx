'use client';

import { useState } from 'react';
import Globe from '@/components/Globe';
import Timeline from '@/components/Timeline';
import ActionPanel from '@/components/ActionPanel';
import Settings from '@/components/Settings';
import Sidebar from '@/components/Sidebar';
import FuturePrediction from '@/components/results/FuturePrediction';

export default function Home() {
  const [year, setYear] = useState(2024);
  const [searchResult, setSearchResult] = useState<any>(null); // Replace 'any' with proper type
  const [predictionResult, setPredictionResult] = useState<any>(null);
  const [markers, setMarkers] = useState<any[]>([]);
  const [timelineRange, setTimelineRange] = useState<{ min: number; max: number } | null>(null);

  const handleSearch = async (term: string) => {
    console.log(`Searching for: ${term}`);

    // Reset results
    setSearchResult(null);
    setPredictionResult(null);
    setMarkers([]);
    setTimelineRange(null);

    const openaiKey = localStorage.getItem('openai_api_key');

    try {
      // Fetch Etymology
      const etymologyRes = await fetch('/api/etymology', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word: term, apiKey: openaiKey })
      });

      if (etymologyRes.ok) {
        const etymologyData = await etymologyRes.json();
        setSearchResult(etymologyData);

        // Process markers and timeline from etymology data
        const newMarkers = [];
        let minYear = 2024;
        const maxYear = 2024;

        if (etymologyData.root) {
          if (etymologyData.root.location) {
            newMarkers.push({ ...etymologyData.root.location, label: etymologyData.root.language });
          }
          if (etymologyData.root.year) minYear = Math.min(minYear, etymologyData.root.year);
        }

        if (etymologyData.path) {
          etymologyData.path.forEach((step: any) => {
            if (step.location) {
              newMarkers.push({ ...step.location, label: step.language });
            }
            if (step.year) minYear = Math.min(minYear, step.year);
          });
        }

        if (etymologyData.current) {
          if (etymologyData.current.location) {
            newMarkers.push({ ...etymologyData.current.location, label: etymologyData.current.language });
          }
          // Current is likely close to maxYear via logic, but if provided use it?
          if (etymologyData.current.year) minYear = Math.min(minYear, etymologyData.current.year);
        }

        setMarkers(newMarkers);
        setTimelineRange({ min: minYear, max: maxYear });
        setYear(maxYear); // Start at present

      } else {
        console.error("Etymology fetch failed");
      }

      // Fetch Prediction (mocking 2050 for now as default future)
      const predictionRes = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word: term, year: 2050, apiKey: openaiKey })
      });

      if (predictionRes.ok) {
        const predictionData = await predictionRes.json();
        setPredictionResult(predictionData);
      } else {
        console.error("Prediction fetch failed");
      }

    } catch (error) {
      console.error("Failed to fetch data", error);
    }
  };

  return (
    <main className="relative w-full h-screen overflow-hidden bg-black text-white">
      <Settings />

      {/* Sidebar for details */}
      <Sidebar data={searchResult} onClose={() => {
        setSearchResult(null);
        setTimelineRange(null);
      }} />

      <div className="absolute inset-0 z-0">
        <Globe markers={markers} />
      </div>

      <div className="relative z-10 flex flex-col h-full pointer-events-none">
        {/* Pointer events auto for interactive elements */}
        <div className="pointer-events-auto">
          <ActionPanel onSearch={handleSearch} />
        </div>

        {/* Results Area - Future styling can function similarly to Sidebar or float */}
        <div className="flex-1 w-full pointer-events-auto flex justify-end p-10">
          {year > 2024 && predictionResult && (
            <FuturePrediction data={{ ...predictionResult, year }} />
          )}
        </div>

        <div className="pointer-events-auto pb-10">
          {timelineRange && (
            <Timeline
              year={year}
              setYear={setYear}
              min={timelineRange.min}
              max={timelineRange.max}
            />
          )}
        </div>
      </div>
    </main>
  );
}
