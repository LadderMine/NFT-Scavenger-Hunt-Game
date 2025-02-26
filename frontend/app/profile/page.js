"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Brain, CheckCircle, Home, Star, User } from "lucide-react";
import { gameLevels } from "@/lib/gameData";
import useGameStore from "@/lib/store/useGameStore";

const ProfilePage = () => {
  const {
    user,
    completedPuzzles,
    completedDifficulties,
    score,
    nfts,
    loadUserData,
  } = useGameStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await loadUserData();
      setIsLoading(false);
    };
    fetchData();
  }, [loadUserData]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-black via-purple-900 to-black p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <Button
            asChild
            variant="ghost"
            className="text-white hover:bg-white/10 hover:text-[#f0f0f0]"
          >
            <Link href="/" className="flex items-center gap-2">
              <Home size={20} />
              Back to Home
            </Link>
          </Button>
        </div>

        <Card className="backdrop-blur-lg bg-white/10 border-white/20 text-white mb-8">
          <CardHeader>
            <CardTitle className="text-3xl text-purple-400 flex items-center gap-4">
              <User size={32} />
              {/* {user.username}'s Profile */}
            </CardTitle>
            <CardDescription className="text-gray-300">
              NFT Scavenger Hunt Progress
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <Trophy className="w-12 h-12 text-yellow-400 mx-auto mb-2" />
                <p className="text-2xl font-bold">{score}</p>
                <p className="text-sm text-gray-300">Total Score</p>
              </div>
              <div className="text-center">
                <Brain className="w-12 h-12 text-purple-400 mx-auto mb-2" />
                <p className="text-2xl font-bold">{completedPuzzles.length}</p>
                <p className="text-sm text-gray-300">Puzzles Solved</p>
              </div>
              <div className="text-center">
                <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-2" />
                <p className="text-2xl font-bold">
                  {completedDifficulties.length}
                </p>
                <p className="text-sm text-gray-300">Levels Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        
      </div>
    </div>
  );
};

export default ProfilePage;
