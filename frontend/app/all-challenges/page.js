"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Users,
  Award,
  Target,
  Filter,
  Search,
  ArrowUpRight,
  Flame,
} from "lucide-react";

export default function ChallengesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const challenges = [
    {
      id: 1,
      title: "StarkNet Expedition",
      description:
        "A week-long journey through the StarkNet ecosystem. Solve daily puzzles to earn points and climb the leaderboard.",
      status: "active",
      participants: 1243,
      startDate: "Mar 15, 2023",
      endDate: "Mar 22, 2023",
      rewards: ["Limited Edition NFT", "1000 XP", "StarkNet Tokens"],
      difficulty: "All Levels",
      image: "/placeholder.svg?height=200&width=350",
      featured: true,
    },
    {
      id: 2,
      title: "Crypto Art Hunt",
      description:
        "Find hidden clues in famous crypto art pieces. Each artwork contains a secret that leads to the next challenge.",
      status: "upcoming",
      participants: 0,
      startDate: "Apr 5, 2023",
      endDate: "Apr 12, 2023",
      rewards: ["Art Collector NFT", "500 XP"],
      difficulty: "Intermediate",
      image: "/placeholder.svg?height=200&width=350",
      featured: false,
    },
    {
      id: 3,
      title: "Smart Contract Hackathon",
      description:
        "Build and deploy a smart contract that solves a real-world problem. Community voting determines the winners.",
      status: "upcoming",
      participants: 0,
      startDate: "May 10, 2023",
      endDate: "May 17, 2023",
      rewards: ["Developer NFT", "2000 XP", "$5000 in ETH"],
      difficulty: "Advanced",
      image: "/placeholder.svg?height=200&width=350",
      featured: true,
    },
    {
      id: 4,
      title: "Blockchain Trivia Marathon",
      description:
        "Test your knowledge with daily blockchain trivia questions. Perfect for beginners looking to learn more.",
      status: "active",
      participants: 876,
      startDate: "Mar 1, 2023",
      endDate: "Mar 31, 2023",
      rewards: ["Knowledge Seeker NFT", "300 XP"],
      difficulty: "Beginner",
      image: "/placeholder.svg?height=200&width=350",
      featured: false,
    },
    {
      id: 5,
      title: "Crypto Puzzle Championship",
      description:
        "The ultimate test for puzzle solvers. Complex cryptographic challenges with increasing difficulty.",
      status: "completed",
      participants: 532,
      startDate: "Jan 15, 2023",
      endDate: "Feb 15, 2023",
      rewards: ["Champion NFT", "3000 XP", "Mystery Prize"],
      difficulty: "Expert",
      image: "/placeholder.svg?height=200&width=350",
      featured: false,
    },
    {
      id: 6,
      title: "NFT Treasure Hunt",
      description:
        "Follow the trail of clues hidden in various NFT collections across different marketplaces.",
      status: "completed",
      participants: 1089,
      startDate: "Feb 1, 2023",
      endDate: "Feb 14, 2023",
      rewards: ["Treasure Hunter NFT", "800 XP"],
      difficulty: "Intermediate",
      image: "/placeholder.svg?height=200&width=350",
      featured: false,
    },
  ];

  // Apply filters
  const filteredChallenges = challenges.filter((challenge) => {
    const matchesSearch =
      challenge.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      challenge.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || challenge.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const statusColors = {
    active: "bg-green-500",
    upcoming: "bg-blue-500",
    completed: "bg-gray-500",
  };

  const statusLabels = {
    active: "Active",
    upcoming: "Upcoming",
    completed: "Completed",
  };

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
            Blockchain Challenges
          </h1>
          <p className="text-lg sm:text-xl mb-8 text-gray-300 max-w-2xl mx-auto">
            Participate in time-limited events and competitions to earn
            exclusive rewards and climb the global leaderboard.
          </p>
        </div>

        {/* Featured challenges */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <Flame className="mr-2 h-5 w-5 text-orange-500" /> Featured
            Challenges
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {challenges
              .filter((c) => c.featured)
              .map((challenge) => (
                <Card
                  key={challenge.id}
                  className="overflow-hidden backdrop-blur-lg border border-purple-500/30 bg-white/10 transition-all duration-300 hover:transform hover:scale-105"
                >
                  <div className="relative">
                    <img
                      src={challenge.image || "/placeholder.svg"}
                      alt={challenge.title}
                      className="w-full h-64 object-cover"
                    />
                    <div className="absolute top-0 right-0 m-4">
                      <Badge
                        className={`${
                          statusColors[challenge.status]
                        } text-white`}
                      >
                        {statusLabels[challenge.status]}
                      </Badge>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                      <h3 className="text-2xl font-bold text-white mb-2">
                        {challenge.title}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        <Badge
                          variant="outline"
                          className="bg-black/50 border-white/20 text-white"
                        >
                          <Calendar className="h-3 w-3 mr-1" />{" "}
                          {challenge.startDate} - {challenge.endDate}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="bg-black/50 border-white/20 text-white"
                        >
                          <Users className="h-3 w-3 mr-1" />{" "}
                          {challenge.participants.toLocaleString()} participants
                        </Badge>
                        <Badge
                          variant="outline"
                          className="bg-black/50 border-white/20 text-white"
                        >
                          <Target className="h-3 w-3 mr-1" />{" "}
                          {challenge.difficulty}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <p className="text-gray-300 mb-4">
                      {challenge.description}
                    </p>

                    <div className="mb-4">
                      <p className="text-sm text-gray-400 mb-2">Rewards:</p>
                      <div className="flex flex-wrap gap-2">
                        {challenge.rewards.map((reward, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="border-purple-500/50 text-purple-300"
                          >
                            <Award className="h-3 w-3 mr-1" /> {reward}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Button
                      className={`w-full ${
                        challenge.status === "completed"
                          ? "bg-gray-600 hover:bg-gray-700 text-white"
                          : challenge.status === "upcoming"
                          ? "bg-blue-600 hover:bg-blue-700 text-white"
                          : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                      }`}
                    >
                      {challenge.status === "completed"
                        ? "View Results"
                        : challenge.status === "upcoming"
                        ? "Remind Me"
                        : "Join Challenge"}
                      <ArrowUpRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}
          </div>
        </div>

        {/* Search and filters */}
        <div className="backdrop-blur-lg bg-white/10 p-6 rounded-2xl border border-white/20 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search challenges..."
                className="w-full bg-white/10 border border-white/20 rounded-lg py-2 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="relative">
              <select
                className="appearance-none bg-white/10 border border-white/20 rounded-lg py-2 pl-4 pr-10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all" className="bg-gray-800">
                  All Challenges
                </option>
                <option value="active" className="bg-gray-800">
                  Active
                </option>
                <option value="upcoming" className="bg-gray-800">
                  Upcoming
                </option>
                <option value="completed" className="bg-gray-800">
                  Completed
                </option>
              </select>
              <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* All challenges */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredChallenges
            .filter((c) => !c.featured)
            .map((challenge) => (
              <Card
                key={challenge.id}
                className={`overflow-hidden backdrop-blur-lg border transition-all duration-300 hover:transform hover:scale-105 ${
                  challenge.status === "active"
                    ? "bg-white/15 border-green-500/30"
                    : challenge.status === "upcoming"
                    ? "bg-white/10 border-blue-500/30"
                    : "bg-white/5 border-white/20"
                }`}
              >
                <div className="relative">
                  <img
                    src={challenge.image || "/placeholder.svg"}
                    alt={challenge.title}
                    className={`w-full h-48 object-cover ${
                      challenge.status === "completed"
                        ? "filter grayscale opacity-80"
                        : ""
                    }`}
                  />
                  <div className="absolute top-0 right-0 m-3">
                    <Badge
                      className={`${statusColors[challenge.status]} text-white`}
                    >
                      {statusLabels[challenge.status]}
                    </Badge>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">
                    {challenge.title}
                  </h3>
                  <p className="text-gray-300 text-sm mb-4">
                    {challenge.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge
                      variant="outline"
                      className="border-white/20 text-white"
                    >
                      <Calendar className="h-3 w-3 mr-1" />{" "}
                      {challenge.startDate}
                    </Badge>
                    {challenge.status !== "upcoming" && (
                      <Badge
                        variant="outline"
                        className="border-white/20 text-white"
                      >
                        <Users className="h-3 w-3 mr-1" />{" "}
                        {challenge.participants.toLocaleString()}
                      </Badge>
                    )}
                    <Badge
                      variant="outline"
                      className="border-white/20 text-white"
                    >
                      <Target className="h-3 w-3 mr-1" /> {challenge.difficulty}
                    </Badge>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-400 mb-2">Rewards:</p>
                    <div className="flex flex-wrap gap-2">
                      {challenge.rewards.map((reward, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="border-purple-500/50 text-purple-300"
                        >
                          <Award className="h-3 w-3 mr-1" /> {reward}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button
                    className={`w-full ${
                      challenge.status === "completed"
                        ? "bg-gray-600 hover:bg-gray-700 text-white"
                        : challenge.status === "upcoming"
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                    }`}
                  >
                    {challenge.status === "completed"
                      ? "View Results"
                      : challenge.status === "upcoming"
                      ? "Remind Me"
                      : "Join Challenge"}
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
        </div>

        {filteredChallenges.filter((c) => !c.featured).length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-300 text-lg">
              No challenges match your search criteria.
            </p>
            <Button
              variant="outline"
              className="mt-4 border-white/20 text-white hover:bg-white/10"
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
              }}
            >
              Reset Filters
            </Button>
          </div>
        )}

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Create Your Own Challenge
          </h2>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Are you a developer or content creator? Design your own blockchain
            challenges and share them with our community.
          </p>
          <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-8 rounded-lg">
            Become a Creator
          </Button>
        </div>
      </div>
    </main>
  );
}
