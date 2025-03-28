"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Award, Filter, Star, Lock } from "lucide-react"

export default function RewardsPage() {
  const [filter, setFilter] = useState("all")

  const rewards = [
    {
      id: 1,
      name: "Crypto Pioneer",
      image: "/placeholder.svg?height=300&width=300",
      rarity: "Common",
      description: "Awarded to those who complete the first blockchain puzzle.",
      obtained: true,
      category: "achievement",
    },
    {
      id: 2,
      name: "StarkNet Voyager",
      image: "/placeholder.svg?height=300&width=300",
      rarity: "Rare",
      description: "For explorers who've mastered the basics of StarkNet technology.",
      obtained: true,
      category: "achievement",
    },
    {
      id: 3,
      name: "Quantum Codebreaker",
      image: "/placeholder.svg?height=300&width=300",
      rarity: "Epic",
      description: "Reserved for those who solve the advanced cryptography challenge.",
      obtained: false,
      category: "achievement",
    },
    {
      id: 4,
      name: "Golden Key",
      image: "/placeholder.svg?height=300&width=300",
      rarity: "Legendary",
      description: "Unlocks special areas in the treasure hunt. Limited edition.",
      obtained: false,
      category: "utility",
    },
    {
      id: 5,
      name: "Time Traveler",
      image: "/placeholder.svg?height=300&width=300",
      rarity: "Rare",
      description: "Complete all challenges in record time.",
      obtained: false,
      category: "achievement",
    },
    {
      id: 6,
      name: "Digital Archaeologist",
      image: "/placeholder.svg?height=300&width=300",
      rarity: "Epic",
      description: "Discover all hidden artifacts in the ancient code temple.",
      obtained: false,
      category: "achievement",
    },
    {
      id: 7,
      name: "Membership Card",
      image: "/placeholder.svg?height=300&width=300",
      rarity: "Common",
      description: "Grants access to exclusive community events and discussions.",
      obtained: true,
      category: "utility",
    },
    {
      id: 8,
      name: "Cosmic Voyager",
      image: "/placeholder.svg?height=300&width=300",
      rarity: "Legendary",
      description: "Only awarded to those who complete all challenges in the universe.",
      obtained: false,
      category: "achievement",
    },
  ]

  const filteredRewards =
    filter === "all"
      ? rewards
      : filter === "obtained"
        ? rewards.filter((reward) => reward.obtained)
        : filter === "locked"
          ? rewards.filter((reward) => !reward.obtained)
          : rewards.filter((reward) => reward.category === filter)

  const rarityColors = {
    Common: "bg-gray-500",
    Rare: "bg-blue-500",
    Epic: "bg-purple-500",
    Legendary: "bg-gradient-to-r from-yellow-400 to-orange-500",
  }

  return (
    <main className="min-h-screen w-full overflow-hidden bg-gradient-to-br from-black via-purple-900 to-black py-16 px-4 sm:px-6 lg:px-8">
      {/* Animated background blur */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse" />
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse delay-700" />
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse delay-1000" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            Your NFT Rewards
          </h1>
          <p className="text-lg sm:text-xl mb-8 text-gray-300 max-w-2xl mx-auto">
            Collect unique digital treasures as you solve puzzles and complete challenges in your scavenger hunt
            journey.
          </p>

          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              onClick={() => setFilter("all")}
              className={
                filter === "all" ? "bg-purple-600 hover:bg-purple-700" : "border-white/20 text-white hover:bg-white/10"
              }
            >
              All Rewards
            </Button>
            <Button
              variant={filter === "obtained" ? "default" : "outline"}
              onClick={() => setFilter("obtained")}
              className={
                filter === "obtained"
                  ? "bg-green-600 hover:bg-green-700"
                  : "border-white/20 text-white hover:bg-white/10"
              }
            >
              <Award className="mr-2 h-4 w-4" />
              Obtained
            </Button>
            <Button
              variant={filter === "locked" ? "default" : "outline"}
              onClick={() => setFilter("locked")}
              className={
                filter === "locked" ? "bg-gray-600 hover:bg-gray-700" : "border-white/20 text-white hover:bg-white/10"
              }
            >
              <Lock className="mr-2 h-4 w-4" />
              Locked
            </Button>
            <Button
              variant={filter === "achievement" ? "default" : "outline"}
              onClick={() => setFilter("achievement")}
              className={
                filter === "achievement"
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "border-white/20 text-white hover:bg-white/10"
              }
            >
              <Star className="mr-2 h-4 w-4" />
              Achievements
            </Button>
            <Button
              variant={filter === "utility" ? "default" : "outline"}
              onClick={() => setFilter("utility")}
              className={
                filter === "utility"
                  ? "bg-amber-600 hover:bg-amber-700"
                  : "border-white/20 text-white hover:bg-white/10"
              }
            >
              <Filter className="mr-2 h-4 w-4" />
              Utility
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredRewards.map((reward) => (
            <div
              key={reward.id}
              className={`backdrop-blur-lg rounded-2xl shadow-xl border transition-all duration-300 hover:transform hover:scale-105 ${
                reward.obtained ? "bg-white/15 border-purple-500/50" : "bg-white/10 border-white/20 opacity-80"
              }`}
            >
              <div className="relative">
                <div
                  className={`absolute top-0 right-0 m-4 px-2 py-1 rounded-full text-xs font-bold text-white ${rarityColors[reward.rarity]}`}
                >
                  {reward.rarity}
                </div>
                {!reward.obtained && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-t-2xl">
                    <Lock className="h-12 w-12 text-white/70" />
                  </div>
                )}
                <img
                  src={reward.image || "/placeholder.svg"}
                  alt={reward.name}
                  className="w-full h-48 object-cover rounded-t-2xl"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">{reward.name}</h3>
                <p className="text-gray-300 text-sm mb-4">{reward.description}</p>
                <div className="flex justify-between items-center">
                  <Badge variant="outline" className="bg-white/10 text-white border-white/20">
                    {reward.category === "achievement" ? "Achievement" : "Utility"}
                  </Badge>
                  {reward.obtained ? (
                    <Badge className="bg-green-600 text-white">Obtained</Badge>
                  ) : (
                    <Badge variant="outline" className="border-white/20 text-white">
                      <Lock className="mr-1 h-3 w-3" /> Locked
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Unlock More Rewards</h2>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Continue your adventure to collect all available NFT rewards. Some are extremely rare and only obtainable
            through special challenges.
          </p>
          <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-8 rounded-lg">
            Continue Hunt
          </Button>
        </div>
      </div>
    </main>
  )
}

