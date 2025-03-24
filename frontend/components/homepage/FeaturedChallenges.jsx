import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Brain,
  Timer,
  Users,
  Zap,
  Trophy,
  ArrowRight,
  Lock,
  Sparkles,
} from "lucide-react";
const ChallengeCard = ({ challenge, isActive }) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div
      className={`relative group overflow-hidden rounded-xl backdrop-blur-sm border transition-all duration-300 ${
        isActive
          ? "bg-white/10 border-purple-500/50 hover:border-purple-500"
          : "bg-white/5 border-white/10 hover:border-white/30"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {" "}
      {/* Animated gradient background */}{" "}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        {" "}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-purple-500/10 animate-gradient" />{" "}
      </div>{" "}
      {/* Challenge content */}{" "}
      <div className="relative p-6">
        {" "}
        {/* Difficulty badge */}{" "}
        <div className="absolute top-4 right-4">
          {" "}
          <div
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              challenge.difficulty === "Easy"
                ? "bg-green-500/20 text-green-300"
                : challenge.difficulty === "Medium"
                ? "bg-yellow-500/20 text-yellow-300"
                : "bg-red-500/20 text-red-300"
            }`}
          >
            {" "}
            {challenge.difficulty}{" "}
          </div>{" "}
        </div>{" "}
        {/* Challenge status */}{" "}
        {isActive && (
          <div className="flex items-center space-x-2 mb-4">
            {" "}
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />{" "}
            <span className="text-green-400 text-sm">Active Challenge</span>{" "}
          </div>
        )}{" "}
        {/* Challenge type icon */}{" "}
        <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20 flex items-center justify-center mb-4">
          {" "}
          {challenge.type === "riddle" ? (
            <Brain className="w-6 h-6 text-purple-400" />
          ) : (
            <Lock className="w-6 h-6 text-pink-400" />
          )}{" "}
        </div>{" "}
        <h3 className="text-xl font-bold text-white mb-2">{challenge.title}</h3>{" "}
        <p className="text-gray-300 mb-4">{challenge.description}</p>{" "}
        {/* Challenge metadata */}{" "}
        <div className="flex items-center space-x-4 mb-6 text-sm text-gray-400">
          {" "}
          <div className="flex items-center">
            {" "}
            <Timer className="w-4 h-4 mr-1" /> {challenge.timeLeft}{" "}
          </div>{" "}
          <div className="flex items-center">
            {" "}
            <Users className="w-4 h-4 mr-1" /> {challenge.participants} players{" "}
          </div>{" "}
          <div className="flex items-center">
            {" "}
            <Trophy className="w-4 h-4 mr-1" /> {challenge.reward}{" "}
          </div>{" "}
        </div>{" "}
        {/* Preview or Start button */}{" "}
        <Button
          className={`w-full ${
            isActive
              ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              : "bg-white/10 hover:bg-white/20"
          }`}
        >
          {" "}
          <span className="mr-2">
            {" "}
            {isActive ? "Start Challenge" : "Preview"}{" "}
          </span>{" "}
          <ArrowRight className="w-4 h-4" />{" "}
        </Button>{" "}
      </div>{" "}
    </div>
  );
};
const FeaturedChallenges = () => {
  const challenges = [
    {
      title: "The Cryptic Key",
      description:
        "Decode the ancient StarkNet runes to unlock the hidden vault.",
      type: "riddle",
      difficulty: "Easy",
      timeLeft: "2 days left",
      participants: 1243,
      reward: "Rare NFT",
      isActive: true,
    },
    {
      title: "Blockchain Labyrinth",
      description:
        "Navigate through a maze of smart contracts to find the treasure.",
      type: "puzzle",
      difficulty: "Medium",
      timeLeft: "5 days left",
      participants: 856,
      reward: "Epic NFT",
      isActive: true,
    },
    {
      title: "The Zero-Knowledge Trial",
      description: "Master the art of ZK-proofs to claim your reward.",
      type: "puzzle",
      difficulty: "Hard",
      timeLeft: "Coming soon",
      participants: 0,
      reward: "Legendary NFT",
      isActive: false,
    },
  ];
  return (
    <div className="w-full max-w-6xl mx-auto my-24 px-6">
      {" "}
      <div className="flex justify-between items-center mb-12">
        {" "}
        <div>
          {" "}
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            {" "}
            Featured Challenges{" "}
          </h2>{" "}
          <p className="text-gray-400 mt-2">
            {" "}
            Solve puzzles, earn rewards, and climb the ranks{" "}
          </p>{" "}
        </div>{" "}
        <Button className="hidden sm:flex items-center space-x-2 bg-white/10 hover:bg-white/20">
          {" "}
          <Sparkles className="w-4 h-4" /> <span>View All Challenges</span>{" "}
        </Button>{" "}
      </div>{" "}
      {/* Challenge grid */}{" "}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {" "}
        {challenges.map((challenge, index) => (
          <ChallengeCard
            key={index}
            challenge={challenge}
            isActive={challenge.isActive}
          />
        ))}{" "}
      </div>{" "}
      {/* Mobile CTA */}{" "}
      <div className="mt-8 sm:hidden">
        {" "}
        <Button className="w-full bg-white/10 hover:bg-white/20">
          {" "}
          <Sparkles className="w-4 h-4 mr-2" /> <span>View All Challenges</span>{" "}
        </Button>{" "}
      </div>{" "}
    </div>
  );
};
export default FeaturedChallenges;
