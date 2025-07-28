'use client';
import PuzzleTimeline from './PuzzleTimeline';
import { puzzleRoadmap } from './puzzleRoadmapData';

export default function PuzzleRoadmapPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0f0c29] via-[#302b63] to-[#24243e] text-white py-12 px-4 md:px-16">
      <h1 className="text-4xl md:text-5xl font-bold text-center mb-12">Puzzle Roadmap</h1>
      <PuzzleTimeline puzzles={puzzleRoadmap} />
    </main>
  );
}