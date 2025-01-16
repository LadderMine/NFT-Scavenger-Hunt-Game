"use client";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Trophy, Brain, Lock, CheckCircle } from "lucide-react";

const GamePage = () => {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [answer, setAnswer] = useState("");
  const [message, setMessage] = useState("");
  const [completedLevels, setCompletedLevels] = useState([]);

  // Example puzzles - in a real app, these would come from your backend
  const puzzles = [
    {
      level: 1,
      title: "Welcome to StarkNet",
      description:
        "Let's start with the basics! StarkNet is a ___ Layer 2 solution that helps Ethereum scale. Fill in the blank (hint: it starts with 'z').",
      answer: "zk",
      reward: "StarkNet Pioneer NFT",
      hint: "Think about zero-knowledge proofs...",
    },
    {
      level: 2,
      title: "Smart Contract Puzzle",
      description:
        "What's the most common programming language used for StarkNet smart contracts? (Hint: It starts with 'C')",
      answer: "cairo",
      reward: "Smart Contract Wizard NFT",
      hint: "Think about ancient Egyptian programming...",
    },
    {
      level: 3,
      title: "Blockchain Basics",
      description:
        "How many confirmations are typically recommended for StarkNet transactions? (Enter the number)",
      answer: "1",
      reward: "Transaction Master NFT",
      hint: "StarkNet has faster finality than most L1s...",
    },
  ];

  const currentPuzzle = puzzles[currentLevel - 1];

  const checkAnswer = () => {
    if (answer.toLowerCase().trim() === currentPuzzle.answer.toLowerCase()) {
      setCompletedLevels([...completedLevels, currentLevel]);
      setMessage("Correct! NFT reward being minted...");
      if (currentLevel < puzzles.length) {
        setTimeout(() => {
          setCurrentLevel(currentLevel + 1);
          setAnswer("");
          setMessage("");
        }, 2000);
      }
    } else {
      setMessage("Try again! Check the hint if you need help.");
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-black via-purple-900 to-black p-6">
      <div className="max-w-4xl mx-auto">
        {/* Progress tracker */}
        <div className="flex justify-between mb-8">
          {puzzles.map((puzzle, index) => (
            <div
              key={puzzle.level}
              className={`flex items-center gap-2 ${
                completedLevels.includes(puzzle.level)
                  ? "text-green-400"
                  : currentLevel === puzzle.level
                  ? "text-purple-400"
                  : "text-gray-600"
              }`}
            >
              {completedLevels.includes(puzzle.level) ? (
                <CheckCircle className="w-8 h-8" />
              ) : currentLevel > puzzle.level ? (
                <Lock className="w-8 h-8" />
              ) : (
                <Brain className="w-8 h-8" />
              )}
              <span className="hidden sm:inline">Level {puzzle.level}</span>
            </div>
          ))}
        </div>

        {/* Current puzzle */}
        <Card className="backdrop-blur-lg bg-white/10 border-white/20 text-white">
          <CardHeader>
            <CardTitle className="text-2xl text-purple-400">
              Level {currentPuzzle.level}: {currentPuzzle.title}
            </CardTitle>
            <CardDescription className="text-gray-300">
              Reward: {currentPuzzle.reward}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <p className="text-lg">{currentPuzzle.description}</p>

              <div className="space-y-4">
                <Input
                  type="text"
                  placeholder="Enter your answer"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  className="bg-white/5 border-white/20 text-white"
                />

                <Button
                  onClick={checkAnswer}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  Submit Answer
                </Button>

                <Button
                  variant="outline"
                  className="w-full border-white/20 text-white hover:bg-white/10"
                  onClick={() => setMessage(currentPuzzle.hint)}
                >
                  Need a Hint?
                </Button>
              </div>

              {message && (
                <Alert className="bg-white/5 border-white/20">
                  <AlertDescription className="text-white">
                    {message}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="backdrop-blur-lg bg-white/10 border-white/20 text-white">
            <CardContent className="pt-6">
              <div className="text-center">
                <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <p className="text-2xl font-bold">{completedLevels.length}</p>
                <p className="text-sm text-gray-300">Puzzles Solved</p>
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-lg bg-white/10 border-white/20 text-white">
            <CardContent className="pt-6">
              <div className="text-center">
                <Brain className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <p className="text-2xl font-bold">{currentLevel}</p>
                <p className="text-sm text-gray-300">Current Level</p>
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-lg bg-white/10 border-white/20 text-white">
            <CardContent className="pt-6">
              <div className="text-center">
                <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <p className="text-2xl font-bold">
                  {puzzles.length - completedLevels.length}
                </p>
                <p className="text-sm text-gray-300">Remaining Puzzles</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GamePage;
