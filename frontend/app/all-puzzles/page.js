"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Brain,
  Code,
  Lock,
  Unlock,
  Clock,
  Award,
  ChevronRight,
  Filter,
  Search,
} from "lucide-react";

export default function PuzzlesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const puzzles = [
    {
      id: 1,
      title: "The Genesis Block",
      description: "Decode the message hidden in the first block of our chain.",
      difficulty: "Beginner",
      category: "Cryptography",
      timeEstimate: "10 min",
      rewards: ["Crypto Pioneer NFT", "50 XP"],
      completed: true,
      progress: 100,
      image: "/placeholder.svg?height=200&width=350",
    },
    {
      id: 2,
      title: "Hash Function Mystery",
      description: "Find the input that generates this specific hash output.",
      difficulty: "Intermediate",
      category: "Cryptography",
      timeEstimate: "20 min",
      rewards: ["Hash Master NFT", "100 XP"],
      completed: true,
      progress: 100,
      image: "/placeholder.svg?height=200&width=350",
    },
    {
      id: 3,
      title: "Smart Contract Maze",
      description:
        "Navigate through the logic of this contract to find the hidden treasure.",
      difficulty: "Advanced",
      category: "Smart Contracts",
      timeEstimate: "45 min",
      rewards: ["Contract Wizard NFT", "200 XP"],
      completed: false,
      progress: 60,
      image: "/placeholder.svg?height=200&width=350",
    },
    {
      id: 4,
      title: "The Lost Private Key",
      description: "Follow the clues to recover the lost private key.",
      difficulty: "Intermediate",
      category: "Security",
      timeEstimate: "30 min",
      rewards: ["Key Finder NFT", "150 XP"],
      completed: false,
      progress: 0,
      locked: true,
      image: "/placeholder.svg?height=200&width=350",
    },
    {
      id: 5,
      title: "Merkle Tree Challenge",
      description: "Reconstruct the Merkle tree from these leaf nodes.",
      difficulty: "Advanced",
      category: "Data Structures",
      timeEstimate: "40 min",
      rewards: ["Tree Climber NFT", "250 XP"],
      completed: false,
      progress: 0,
      locked: true,
      image: "/placeholder.svg?height=200&width=350",
    },
    {
      id: 6,
      title: "Zero Knowledge Proof",
      description: "Prove you know the secret without revealing it.",
      difficulty: "Expert",
      category: "Cryptography",
      timeEstimate: "60 min",
      rewards: ["ZK Master NFT", "300 XP", "Special Badge"],
      completed: false,
      progress: 0,
      locked: true,
      image: "/placeholder.svg?height=200&width=350",
    },
  ];

  // Apply filters
  const filteredPuzzles = puzzles.filter((puzzle) => {
    const matchesSearch =
      puzzle.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      puzzle.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty =
      difficultyFilter === "all" ||
      puzzle.difficulty.toLowerCase() === difficultyFilter.toLowerCase();
    const matchesCategory =
      categoryFilter === "all" ||
      puzzle.category.toLowerCase() === categoryFilter.toLowerCase();

    return matchesSearch && matchesDifficulty && matchesCategory;
  });

  const difficultyColors = {
    Beginner: "bg-green-500",
    Intermediate: "bg-blue-500",
    Advanced: "bg-purple-500",
    Expert: "bg-red-500",
  };

  const categoryIcons = {
    Cryptography: <Code className='h-4 w-4 mr-1' />,
    "Smart Contracts": <Brain className='h-4 w-4 mr-1' />,
    Security: <Lock className='h-4 w-4 mr-1' />,
    "Data Structures": <Brain className='h-4 w-4 mr-1' />,
  };

  return (
    <main className='min-h-screen w-full overflow-hidden bg-gradient-to-br from-black via-purple-900 to-black py-16 px-4 sm:px-6 lg:px-8'>
      {/* Animated background blur */}
      <div className='absolute inset-0 -z-10'>
        <div className='absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse' />
        <div className='absolute top-1/2 right-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse delay-700' />
        <div className='absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse delay-1000' />
      </div>

      <div className='relative max-w-7xl mx-auto'>
        <div className='text-center mb-12'>
          <h1 className='text-4xl sm:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600'>
            Blockchain Puzzles
          </h1>
          <p className='text-lg sm:text-xl mb-8 text-gray-300 max-w-2xl mx-auto'>
            Test your knowledge and problem-solving skills with these cryptic
            challenges. Each puzzle unlocks unique NFT rewards.
          </p>
        </div>

        {/* Search and filters */}
        <div className='backdrop-blur-lg bg-white/10 p-6 rounded-2xl border border-white/20 mb-8'>
          <div className='flex flex-col md:flex-row gap-4'>
            <div className='relative flex-grow'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
              <input
                type='text'
                placeholder='Search puzzles...'
                className='w-full bg-white/10 border border-white/20 rounded-lg py-2 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className='flex flex-wrap gap-2'>
              <div className='relative'>
                <select
                  className='appearance-none bg-white/10 border border-white/20 rounded-lg py-2 pl-4 pr-10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                  value={difficultyFilter}
                  onChange={(e) => setDifficultyFilter(e.target.value)}
                >
                  <option value='all' className='bg-gray-800'>
                    All Difficulties
                  </option>
                  <option value='beginner' className='bg-gray-800'>
                    Beginner
                  </option>
                  <option value='intermediate' className='bg-gray-800'>
                    Intermediate
                  </option>
                  <option value='advanced' className='bg-gray-800'>
                    Advanced
                  </option>
                  <option value='expert' className='bg-gray-800'>
                    Expert
                  </option>
                </select>
                <Filter className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none' />
              </div>

              <div className='relative'>
                <select
                  className='appearance-none bg-white/10 border border-white/20 rounded-lg py-2 pl-4 pr-10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <option value='all' className='bg-gray-800'>
                    All Categories
                  </option>
                  <option value='cryptography' className='bg-gray-800'>
                    Cryptography
                  </option>
                  <option value='smart contracts' className='bg-gray-800'>
                    Smart Contracts
                  </option>
                  <option value='security' className='bg-gray-800'>
                    Security
                  </option>
                  <option value='data structures' className='bg-gray-800'>
                    Data Structures
                  </option>
                </select>
                <Filter className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none' />
              </div>
            </div>
          </div>
        </div>

        {/* Puzzles grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {filteredPuzzles.map((puzzle) => (
            <Card
              key={puzzle.id}
              className={`overflow-hidden backdrop-blur-lg border transition-all duration-300 hover:transform hover:scale-105 ${
                puzzle.locked
                  ? "bg-white/5 border-white/10"
                  : puzzle.completed
                  ? "bg-white/15 border-purple-500/50"
                  : "bg-white/10 border-white/20"
              }`}
            >
              <div className='relative'>
                <img
                  src={puzzle.image || "/placeholder.svg"}
                  alt={puzzle.title}
                  className={`w-full h-48 object-cover ${
                    puzzle.locked ? "filter grayscale opacity-70" : ""
                  }`}
                />
                <div
                  className={`absolute top-0 right-0 m-3 px-2 py-1 rounded-full text-xs font-bold text-white ${
                    difficultyColors[puzzle.difficulty]
                  }`}
                >
                  {puzzle.difficulty}
                </div>
                {puzzle.locked && (
                  <div className='absolute inset-0 flex items-center justify-center bg-black/60'>
                    <Lock className='h-12 w-12 text-white/70' />
                  </div>
                )}
              </div>

              <div className='p-6'>
                <div className='flex items-center mb-2'>
                  <Badge className='bg-white/20 text-white'>
                    {categoryIcons[puzzle.category]} {puzzle.category}
                  </Badge>
                  <Badge
                    variant='outline'
                    className='ml-2 border-white/20 text-white'
                  >
                    <Clock className='h-3 w-3 mr-1' /> {puzzle.timeEstimate}
                  </Badge>
                </div>

                <h3 className='text-xl font-bold text-white mb-2'>
                  {puzzle.title}
                </h3>
                <p className='text-gray-300 text-sm mb-4'>
                  {puzzle.description}
                </p>

                {!puzzle.locked && (
                  <div className='mb-4'>
                    <div className='flex justify-between text-xs text-gray-400 mb-1'>
                      <span>Progress</span>
                      <span>{puzzle.progress}%</span>
                    </div>
                    <Progress
                      value={puzzle.progress}
                      className='h-2 bg-white/10'
                      indicatorClassName='bg-purple-500'
                    />
                  </div>
                )}

                <div className='mb-4'>
                  <p className='text-sm text-gray-400 mb-2'>Rewards:</p>
                  <div className='flex flex-wrap gap-2'>
                    {puzzle.rewards.map((reward, index) => (
                      <Badge
                        key={index}
                        variant='outline'
                        className='border-purple-500/50 text-purple-300'
                      >
                        <Award className='h-3 w-3 mr-1' /> {reward}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button
                  className={`w-full ${
                    puzzle.locked
                      ? "bg-white/10 text-white/70 cursor-not-allowed"
                      : puzzle.completed
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                  }`}
                >
                  {puzzle.locked ? (
                    <>
                      <Lock className='mr-2 h-4 w-4' /> Locked
                    </>
                  ) : puzzle.completed ? (
                    <>
                      <Unlock className='mr-2 h-4 w-4' /> Completed
                    </>
                  ) : (
                    <>
                      Continue <ChevronRight className='ml-2 h-4 w-4' />
                    </>
                  )}
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {filteredPuzzles.length === 0 && (
          <div className='text-center py-12'>
            <p className='text-gray-300 text-lg'>
              No puzzles match your search criteria.
            </p>
            <Button
              variant='outline'
              className='mt-4 border-white/20 text-white hover:bg-white/10'
              onClick={() => {
                setSearchTerm("");
                setDifficultyFilter("all");
                setCategoryFilter("all");
              }}
            >
              Reset Filters
            </Button>
          </div>
        )}

        <div className='mt-16 text-center'>
          <h2 className='text-2xl font-bold text-white mb-4'>
            Unlock More Challenges
          </h2>
          <p className='text-gray-300 mb-6 max-w-2xl mx-auto'>
            Complete the available puzzles to unlock more advanced challenges.
            Subscribe to our premium tier for exclusive expert-level puzzles.
          </p>
          <Button className='bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-8 rounded-lg'>
            View Subscription Plans
          </Button>
        </div>
      </div>
    </main>
  );
}
