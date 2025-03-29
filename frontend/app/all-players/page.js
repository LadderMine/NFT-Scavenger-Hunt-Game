"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Search, Filter, Star, MapPin, ArrowUpRight } from "lucide-react"

export default function PlayersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [rankFilter, setRankFilter] = useState("all")
  const [countryFilter, setCountryFilter] = useState("all")

  const players = [
    {
      id: 1,
      name: "CryptoMaster",
      avatar: "/placeholder.svg?height=100&width=100",
      rank: 1,
      level: 42,
      xp: 15750,
      puzzlesSolved: 87,
      nftsEarned: 23,
      country: "United States",
      countryCode: "US",
      joinDate: "Jan 15, 2023",
      badges: ["Early Adopter", "Puzzle Master", "NFT Collector"],
      featured: true,
    },
    {
      id: 2,
      name: "BlockchainWizard",
      avatar: "/placeholder.svg?height=100&width=100",
      rank: 2,
      level: 39,
      xp: 14200,
      puzzlesSolved: 79,
      nftsEarned: 19,
      country: "Canada",
      countryCode: "CA",
      joinDate: "Jan 20, 2023",
      badges: ["Crypto Expert", "Challenge Champion"],
      featured: false,
    },
    {
      id: 3,
      name: "StarkHunter",
      avatar: "/placeholder.svg?height=100&width=100",
      rank: 3,
      level: 37,
      xp: 13800,
      puzzlesSolved: 75,
      nftsEarned: 18,
      country: "Germany",
      countryCode: "DE",
      joinDate: "Jan 18, 2023",
      badges: ["StarkNet Pioneer", "Puzzle Solver"],
      featured: false,
    },
    {
      id: 4,
      name: "CryptoQueen",
      avatar: "/placeholder.svg?height=100&width=100",
      rank: 4,
      level: 35,
      xp: 12900,
      puzzlesSolved: 71,
      nftsEarned: 16,
      country: "United Kingdom",
      countryCode: "GB",
      joinDate: "Jan 25, 2023",
      badges: ["NFT Enthusiast", "Quick Solver"],
      featured: false,
    },
    {
      id: 5,
      name: "ZKProver",
      avatar: "/placeholder.svg?height=100&width=100",
      rank: 5,
      level: 33,
      xp: 12100,
      puzzlesSolved: 68,
      nftsEarned: 15,
      country: "France",
      countryCode: "FR",
      joinDate: "Feb 1, 2023",
      badges: ["Cryptography Expert"],
      featured: false,
    },
    {
      id: 6,
      name: "HashMaster",
      avatar: "/placeholder.svg?height=100&width=100",
      rank: 6,
      level: 31,
      xp: 11500,
      puzzlesSolved: 64,
      nftsEarned: 14,
      country: "Japan",
      countryCode: "JP",
      joinDate: "Feb 5, 2023",
      badges: ["Hash Cracker"],
      featured: false,
    },
    {
      id: 7,
      name: "BlockExplorer",
      avatar: "/placeholder.svg?height=100&width=100",
      rank: 7,
      level: 30,
      xp: 11200,
      puzzlesSolved: 62,
      nftsEarned: 13,
      country: "Australia",
      countryCode: "AU",
      joinDate: "Feb 10, 2023",
      badges: ["Explorer Badge"],
      featured: false,
    },
    {
      id: 8,
      name: "CipherBreaker",
      avatar: "/placeholder.svg?height=100&width=100",
      rank: 8,
      level: 29,
      xp: 10800,
      puzzlesSolved: 60,
      nftsEarned: 12,
      country: "Brazil",
      countryCode: "BR",
      joinDate: "Feb 15, 2023",
      badges: ["Code Breaker"],
      featured: false,
    },
    {
      id: 9,
      name: "TokenHunter",
      avatar: "/placeholder.svg?height=100&width=100",
      rank: 9,
      level: 28,
      xp: 10500,
      puzzlesSolved: 58,
      nftsEarned: 11,
      country: "India",
      countryCode: "IN",
      joinDate: "Feb 20, 2023",
      badges: ["Treasure Hunter"],
      featured: false,
    },
    {
      id: 10,
      name: "CryptoNinja",
      avatar: "/placeholder.svg?height=100&width=100",
      rank: 10,
      level: 27,
      xp: 10200,
      puzzlesSolved: 56,
      nftsEarned: 10,
      country: "South Korea",
      countryCode: "KR",
      joinDate: "Feb 25, 2023",
      badges: ["Stealth Solver"],
      featured: false,
    },
    {
      id: 11,
      name: "BlockchainPioneer",
      avatar: "/placeholder.svg?height=100&width=100",
      rank: 11,
      level: 26,
      xp: 9800,
      puzzlesSolved: 54,
      nftsEarned: 9,
      country: "Netherlands",
      countryCode: "NL",
      joinDate: "Mar 1, 2023",
      badges: ["Early Bird"],
      featured: false,
    },
    {
      id: 12,
      name: "CryptoSleuth",
      avatar: "/placeholder.svg?height=100&width=100",
      rank: 12,
      level: 25,
      xp: 9500,
      puzzlesSolved: 52,
      nftsEarned: 9,
      country: "Spain",
      countryCode: "ES",
      joinDate: "Mar 5, 2023",
      badges: ["Detective"],
      featured: false,
    },
  ]

  // Get unique countries
  const countries = ["all", ...new Set(players.map((player) => player.country))]

  // Apply filters
  const filteredPlayers = players.filter((player) => {
    const matchesSearch = player.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRank =
      rankFilter === "all" ||
      (rankFilter === "top10" && player.rank <= 10) ||
      (rankFilter === "top50" && player.rank <= 50) ||
      (rankFilter === "top100" && player.rank <= 100)
    const matchesCountry = countryFilter === "all" || player.country === countryFilter

    return matchesSearch && matchesRank && matchesCountry
  })

  // Featured players
  const featuredPlayers = players.filter((player) => player.featured)

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
            Leaderboard
          </h1>
          <p className="text-lg sm:text-xl mb-8 text-gray-300 max-w-2xl mx-auto">
            Discover the top players in our NFT Scavenger Hunt. Compete with others from around the world and climb the
            ranks.
          </p>
        </div>

        {/* Top players */}
        {featuredPlayers.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Trophy className="mr-2 h-5 w-5 text-yellow-500" /> Top Players
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {featuredPlayers.map((player) => (
                <Card
                  key={player.id}
                  className="overflow-hidden backdrop-blur-lg border border-yellow-500/30 bg-white/10 transition-all duration-300 hover:transform hover:scale-105"
                >
                  <div className="p-6 text-center">
                    <div className="relative inline-block mb-4">
                      <img
                        src={player.avatar || "/placeholder.svg"}
                        alt={player.name}
                        className="w-24 h-24 rounded-full object-cover mx-auto border-4 border-yellow-500"
                      />
                      <div className="absolute -top-2 -right-2 bg-yellow-500 text-black font-bold rounded-full w-8 h-8 flex items-center justify-center">
                        #{player.rank}
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-1">{player.name}</h3>
                    <div className="flex items-center justify-center mb-4">
                      <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                      <span className="text-gray-300">{player.country}</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mb-4">
                      <div className="bg-white/10 rounded-lg p-2">
                        <div className="text-xl font-bold text-white">{player.level}</div>
                        <div className="text-xs text-gray-400">Level</div>
                      </div>
                      <div className="bg-white/10 rounded-lg p-2">
                        <div className="text-xl font-bold text-white">{player.puzzlesSolved}</div>
                        <div className="text-xs text-gray-400">Puzzles</div>
                      </div>
                      <div className="bg-white/10 rounded-lg p-2">
                        <div className="text-xl font-bold text-white">{player.nftsEarned}</div>
                        <div className="text-xs text-gray-400">NFTs</div>
                      </div>
                    </div>

                    <div className="flex flex-wrap justify-center gap-2 mb-4">
                      {player.badges.map((badge, index) => (
                        <Badge key={index} className="bg-purple-500/20 text-purple-300 border border-purple-500/30">
                          <Star className="h-3 w-3 mr-1 text-yellow-500" /> {badge}
                        </Badge>
                      ))}
                    </div>

                    <Button className="bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-black font-bold">
                      View Profile <ArrowUpRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Search and filters */}
        <div className="backdrop-blur-lg bg-white/10 p-6 rounded-2xl border border-white/20 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search players..."
                className="w-full bg-white/10 border border-white/20 rounded-lg py-2 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <div className="relative">
                <select
                  className="appearance-none bg-white/10 border border-white/20 rounded-lg py-2 pl-4 pr-10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={rankFilter}
                  onChange={(e) => setRankFilter(e.target.value)}
                >
                  <option value="all" className="bg-gray-800">
                    All Ranks
                  </option>
                  <option value="top10" className="bg-gray-800">
                    Top 10
                  </option>
                  <option value="top50" className="bg-gray-800">
                    Top 50
                  </option>
                  <option value="top100" className="bg-gray-800">
                    Top 100
                  </option>
                </select>
                <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>

              <div className="relative">
                <select
                  className="appearance-none bg-white/10 border border-white/20 rounded-lg py-2 pl-4 pr-10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={countryFilter}
                  onChange={(e) => setCountryFilter(e.target.value)}
                >
                  {countries.map((country, index) => (
                    <option key={index} value={country} className="bg-gray-800">
                      {country === "all" ? "All Countries" : country}
                    </option>
                  ))}
                </select>
                <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Players table */}
        <div className="backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Player
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Level
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">XP</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Puzzles
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    NFTs
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Country
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredPlayers.map((player, index) => (
                  <tr
                    key={player.id}
                    className={`${index % 2 === 0 ? "bg-white/5" : "bg-white/10"} hover:bg-white/20 transition-colors`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div
                        className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${
                          player.rank <= 3 ? "bg-yellow-500 text-black" : "bg-white/20 text-white"
                        }`}
                      >
                        {player.rank}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          src={player.avatar || "/placeholder.svg"}
                          alt={player.name}
                          className="w-10 h-10 rounded-full mr-3"
                        />
                        <div>
                          <div className="font-medium text-white">{player.name}</div>
                          <div className="flex mt-1">
                            {player.badges.slice(0, 1).map((badge, i) => (
                              <Badge key={i} variant="outline" className="text-xs border-purple-500/30 text-purple-300">
                                <Star className="h-2 w-2 mr-1 text-yellow-500" /> {badge}
                              </Badge>
                            ))}
                            {player.badges.length > 1 && (
                              <Badge variant="outline" className="text-xs border-white/20 text-white ml-1">
                                +{player.badges.length - 1}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-white">{player.level}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-white">{player.xp.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-white">{player.puzzlesSolved}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-white">{player.nftsEarned}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-white">{player.country}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-300">{player.joinDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                        Profile
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredPlayers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-300 text-lg">No players match your search criteria.</p>
            <Button
              variant="outline"
              className="mt-4 border-white/20 text-white hover:bg-white/10"
              onClick={() => {
                setSearchTerm("")
                setRankFilter("all")
                setCountryFilter("all")
              }}
            >
              Reset Filters
            </Button>
          </div>
        )}

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Join the Competition</h2>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Create your account today and start solving puzzles to earn NFTs and climb the global leaderboard.
          </p>
          <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-8 rounded-lg">
            Start Your Journey
          </Button>
        </div>
      </div>
    </main>
  )
}

