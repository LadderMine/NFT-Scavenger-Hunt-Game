import PuzzleComponent from "@/components/PuzzleComponent";
import ShareButton from "@/components/ShareButton";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Trophy, Brain, Lock, CheckCircle, Home, Star } from "lucide-react";
import Rating from "@/components/Rating";
import AchievementCard from "@/components/AchievementCard";

export const gameLevels = {
  easy: {
    name: "Easy",
  },
  medium: {
    name: "Medium",
  },
  hard: {
    name: "Hard",
  },
  expert: {
    name: "Expert",
  },
};

const Puzzle = () => {
  let currentDifficulty = "easy";
  let completedDifficulties = [];
  let completedPuzzles = [];
  let score = 0;
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-black via-purple-900 to-black p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <Button>
            <Link href="/" className="flex items-center gap-2">
              <Home size={20} />
              Back to Home
            </Link>
          </Button>
          <ShareButton />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {Object.entries(gameLevels).map(([difficulty, level]) => (
            <Card
              key={difficulty}
              className={`backdrop-blur-lg border-white/20 ${
                currentDifficulty === difficulty
                  ? "bg-purple-500/20 border-purple-500/50"
                  : completedDifficulties.includes(difficulty)
                  ? "bg-green-500/20 border-green-500/50"
                  : "bg-white/10"
              }`}
            >
              <CardContent className="p-4 text-center">
                <h3 className="text-white font-bold">{level.name}</h3>
                <Rating />
              </CardContent>
            </Card>
          ))}
        </div>
        <PuzzleComponent />
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <AchievementCard
            icon={Trophy}
            value={completedPuzzles.length}
            label="Puzzles Solved"
            color="yellow"
          />
          <AchievementCard
            icon={Brain}
            value={completedDifficulties.length}
            label="Levels Completed"
            color="purple"
          />
          <AchievementCard
            icon={CheckCircle}
            value={score}
            label="Score"
            color="green"
          />
        </div>
      </div>
    </div>
  );
};

export default Puzzle;
