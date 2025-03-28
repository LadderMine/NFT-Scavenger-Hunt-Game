"use client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Star, Lock, Award, ArrowRight, ChevronRight, Check, XCircle } from "lucide-react"

export default function LevelsPage() {
  // Mock user data
  const userData = {
    currentLevel: 15,
    currentXP: 2750,
    nextLevelXP: 3000,
    completedLevels: 14,
  }

  const levels = [
    {
      level: 10,
      name: "Crypto Novice",
      xpRequired: 1000,
      rewards: ["Basic NFT Pack", "Forum Access"],
      challenges: [
        { name: "Complete the tutorial", completed: true },
        { name: "Solve your first puzzle", completed: true },
        { name: "Join the community", completed: true },
      ],
      completed: true,
    },
    {
      level: 15,
      name: "Blockchain Explorer",
      xpRequired: 3000,
      rewards: ["Explorer NFT", "Daily Bonus Increase"],
      challenges: [
        { name: "Complete 10 basic puzzles", completed: true },
        { name: "Participate in a weekly challenge", completed: true },
        { name: "Invite a friend", completed: false },
      ],
      completed: false,
      current: true,
    },
    {
      level: 20,
      name: "Crypto Enthusiast",
      xpRequired: 6000,
      rewards: ["Rare NFT Pack", "Access to Intermediate Puzzles"],
      challenges: [
        { name: "Complete 5 intermediate puzzles", completed: false },
        { name: "Earn 3 achievement badges", completed: false },
        { name: "Reach top 100 on leaderboard", completed: false },
      ],
      completed: false,
      locked: true,
    },
    {
      level: 25,
      name: "StarkNet Voyager",
      xpRequired: 10000,
      rewards: ["StarkNet Voyager NFT", "10% XP Boost"],
      challenges: [
        { name: "Complete the StarkNet basics course", completed: false },
        { name: "Solve a StarkNet-specific puzzle", completed: false },
        { name: "Deploy a simple contract on StarkNet", completed: false },
      ],
      completed: false,
      locked: true,
    },
    {
      level: 30,
      name: "Blockchain Adept",
      xpRequired: 15000,
      rewards: ["Epic NFT Pack", "Access to Advanced Puzzles"],
      challenges: [
        { name: "Complete 10 intermediate puzzles", completed: false },
        { name: "Win a weekly challenge", completed: false },
        { name: "Create and share a custom puzzle", completed: false },
      ],
      completed: false,
      locked: true,
    },
    {
      level: 40,
      name: "Crypto Master",
      xpRequired: 25000,
      rewards: ["Legendary NFT", "VIP Discord Access", "Custom Profile Badge"],
      challenges: [
        { name: "Complete all advanced puzzles", completed: false },
        { name: "Reach top 10 on leaderboard", completed: false },
        { name: "Help 5 new users complete their first puzzle", completed: false },
      ],
      completed: false,
      locked: true,
    },
  ]

  // Calculate progress percentage for current level
  const progressPercentage = Math.floor((userData.currentXP / userData.nextLevelXP) * 100)

  return (
    <main className="min-h-screen w-full overflow-hidden bg-gradient-to-br from-black via-purple-900 to-black py-16 px-4 sm:px-6 lg:px-8">
      {/* Animated background blur */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse" />
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse delay-700" />
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse delay-1000" />
      </div>

      <div className="relative max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            Your Journey
          </h1>
          <p className="text-lg sm:text-xl mb-8 text-gray-300 max-w-2xl mx-auto">
            Track your progress, unlock new levels, and earn exclusive rewards as you advance in your blockchain
            adventure.
          </p>
        </div>

        {/* Current level progress */}
        <div className="backdrop-blur-lg bg-white/10 p-8 rounded-2xl border border-purple-500/30 mb-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <div className="text-gray-300 mb-1">Current Level</div>
              <div className="text-4xl font-bold text-white mb-2">Level {userData.currentLevel}</div>
              <Badge className="bg-purple-500 text-white">
                {levels.find((l) => l.level === userData.currentLevel)?.name}
              </Badge>
            </div>

            <div className="flex-grow max-w-md w-full">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-300">{userData.currentXP} XP</span>
                <span className="text-gray-300">{userData.nextLevelXP} XP</span>
              </div>
              <Progress
                value={progressPercentage}
                className="h-3 bg-white/10"
                indicatorClassName="bg-gradient-to-r from-purple-500 to-pink-500"
              />
              <div className="text-center text-sm text-gray-300 mt-2">
                {userData.nextLevelXP - userData.currentXP} XP needed for next level
              </div>
            </div>

            <div className="text-center">
              <div className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                {userData.completedLevels}
              </div>
              <div className="text-gray-300">Levels Completed</div>
            </div>
          </div>
        </div>

        {/* Level progression */}
        <div className="space-y-8">
          {levels.map((level) => (
            <Card
              key={level.level}
              className={`overflow-hidden backdrop-blur-lg border ${
                level.current
                  ? "bg-white/15 border-purple-500/50"
                  : level.completed
                    ? "bg-white/10 border-green-500/30"
                    : "bg-white/5 border-white/20"
              } ${level.locked ? "opacity-70" : ""}`}
            >
              <div className="p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                  <div className="flex items-center mb-4 md:mb-0">
                    <div
                      className={`flex items-center justify-center w-12 h-12 rounded-full mr-4 ${
                        level.completed
                          ? "bg-green-500 text-white"
                          : level.current
                            ? "bg-purple-500 text-white"
                            : "bg-white/10 text-white"
                      }`}
                    >
                      {level.completed ? (
                        <Check className="h-6 w-6" />
                      ) : level.locked ? (
                        <Lock className="h-6 w-6" />
                      ) : (
                        <span className="text-lg font-bold">{level.level}</span>
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{level.name}</h3>
                      <div className="text-gray-300 text-sm">
                        Level {level.level} • {level.xpRequired} XP required
                      </div>
                    </div>
                  </div>

                  {level.locked ? (
                    <Badge variant="outline" className="border-white/20 text-white">
                      <Lock className="h-3 w-3 mr-1" /> Locked
                    </Badge>
                  ) : level.completed ? (
                    <Badge className="bg-green-500 text-white">
                      <Check className="h-3 w-3 mr-1" /> Completed
                    </Badge>
                  ) : level.current ? (
                    <Badge className="bg-purple-500 text-white">In Progress</Badge>
                  ) : (
                    <Badge variant="outline" className="border-white/20 text-white">
                      Upcoming
                    </Badge>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-white font-medium mb-3 flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 mr-2" /> Challenges
                    </h4>
                    <ul className="space-y-2">
                      {level.challenges.map((challenge, index) => (
                        <li key={index} className="flex items-start">
                          {challenge.completed ? (
                            <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          ) : (
                            <XCircle className="h-5 w-5 text-gray-500 mr-2 flex-shrink-0 mt-0.5" />
                          )}
                          <span className={`${challenge.completed ? "text-gray-300" : "text-gray-400"}`}>
                            {challenge.name}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-white font-medium mb-3 flex items-center">
                      <Award className="h-4 w-4 text-purple-400 mr-2" /> Rewards
                    </h4>
                    <ul className="space-y-2">
                      {level.rewards.map((reward, index) => (
                        <li key={index} className="flex items-center">
                          <div className="h-2 w-2 rounded-full bg-purple-500 mr-2"></div>
                          <span className="text-gray-300">{reward}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-6">
                  {level.locked ? (
                    <Button className="bg-white/10 text-white/70 cursor-not-allowed" disabled>
                      <Lock className="mr-2 h-4 w-4" /> Complete Previous Level to Unlock
                    </Button>
                  ) : level.completed ? (
                    <Button variant="outline" className="border-green-500/30 text-white hover:bg-green-500/10">
                      View Rewards <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  ) : level.current ? (
                    <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                      Continue Challenges <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                      View Details <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Earn XP Faster</h2>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Complete daily challenges, participate in weekly events, and invite friends to earn bonus XP and level up
            faster.
          </p>
          <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-8 rounded-lg">
            View Daily Challenges
          </Button>
        </div>
      </div>
    </main>
  )
}

