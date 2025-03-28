"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, Star, Lock, Eye, Share2, Info } from "lucide-react"

export default function NFTsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [rarityFilter, setRarityFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")

  const nfts = [
    {
      id: 1,
      name: "Crypto Pioneer",
      image: "/placeholder.svg?height=300&width=300",
      description: "Awarded to early adopters who completed the first blockchain puzzle.",
      rarity: "Common",
      category: "Achievement",
      obtained: true,
      holders: 1243,
      createdAt: "Jan 15, 2023",
      attributes: [
        { trait: "Puzzle", value: "Genesis Block" },
        { trait: "Difficulty", value: "Beginner" },
        { trait: "XP Bonus", value: "+50" },
      ],
    },
    {
      id: 2,
      name: "StarkNet Voyager",
      image: "/placeholder.svg?height=300&width=300",
      description: "For explorers who've mastered the basics of StarkNet technology.",
      rarity: "Rare",
      category: "Achievement",
      obtained: true,
      holders: 587,
      createdAt: "Jan 20, 2023",
      attributes: [
        { trait: "Puzzle", value: "StarkNet Basics" },
        { trait: "Difficulty", value: "Intermediate" },
        { trait: "XP Bonus", value: "+100" },
      ],
    },
    {
      id: 3,
      name: "Quantum Codebreaker",
      image: "/placeholder.svg?height=300&width=300",
      description: "Reserved for those who solve the advanced cryptography challenge.",
      rarity: "Epic",
      category: "Achievement",
      obtained: false,
      holders: 124,
      createdAt: "Feb 1, 2023",
      attributes: [
        { trait: "Puzzle", value: "Quantum Encryption" },
        { trait: "Difficulty", value: "Advanced" },
        { trait: "XP Bonus", value: "+200" },
      ],
    },
    {
      id: 4,
      name: "Golden Key",
      image: "/placeholder.svg?height=300&width=300",
      description: "Unlocks special areas in the treasure hunt. Limited edition.",
      rarity: "Legendary",
      category: "Utility",
      obtained: false,
      holders: 50,
      createdAt: "Feb 15, 2023",
      attributes: [
        { trait: "Use", value: "Access Special Puzzles" },
        { trait: "Duration", value: "Permanent" },
        { trait: "Transferable", value: "No" },
      ],
    },
    {
      id: 5,
      name: "Time Traveler",
      image: "/placeholder.svg?height=300&width=300",
      description: "Complete all challenges in record time.",
      rarity: "Rare",
      category: "Achievement",
      obtained: false,
      holders: 312,
      createdAt: "Mar 1, 2023",
      attributes: [
        { trait: "Requirement", value: "Complete in <24h" },
        { trait: "Difficulty", value: "Intermediate" },
        { trait: "XP Bonus", value: "+150" },
      ],
    },
    {
      id: 6,
      name: "Digital Archaeologist",
      image: "/placeholder.svg?height=300&width=300",
      description: "Discover all hidden artifacts in the ancient code temple.",
      rarity: "Epic",
      category: "Achievement",
      obtained: false,
      holders: 98,
      createdAt: "Mar 10, 2023",
      attributes: [
        { trait: "Puzzle", value: "Ancient Code Temple" },
        { trait: "Difficulty", value: "Advanced" },
        { trait: "XP Bonus", value: "+250" },
      ],
    },
    {
      id: 7,
      name: "Membership Card",
      image: "/placeholder.svg?height=300&width=300",
      description: "Grants access to exclusive community events and discussions.",
      rarity: "Common",
      category: "Utility",
      obtained: true,
      holders: 2500,
      createdAt: "Jan 10, 2023",
      attributes: [
        { trait: "Use", value: "Community Access" },
        { trait: "Duration", value: "1 Year" },
        { trait: "Transferable", value: "Yes" },
      ],
    },
    {
      id: 8,
      name: "Cosmic Voyager",
      image: "/placeholder.svg?height=300&width=300",
      description: "Only awarded to those who complete all challenges in the universe.",
      rarity: "Legendary",
      category: "Achievement",
      obtained: false,
      holders: 12,
      createdAt: "Mar 15, 2023",
      attributes: [
        { trait: "Requirement", value: "100% Completion" },
        { trait: "Difficulty", value: "Expert" },
        { trait: "XP Bonus", value: "+500" },
      ],
    },
  ]

  // Get unique categories and rarities
  const categories = ["all", ...new Set(nfts.map((nft) => nft.category.toLowerCase()))]
  const rarities = ["all", ...new Set(nfts.map((nft) => nft.rarity.toLowerCase()))]

  // Apply filters
  const filteredNFTs = nfts.filter((nft) => {
    const matchesSearch =
      nft.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nft.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRarity = rarityFilter === "all" || nft.rarity.toLowerCase() === rarityFilter
    const matchesCategory = categoryFilter === "all" || nft.category.toLowerCase() === categoryFilter

    return matchesSearch && matchesRarity && matchesCategory
  })

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
            NFT Collection
          </h1>
          <p className="text-lg sm:text-xl mb-8 text-gray-300 max-w-2xl mx-auto">
            Explore and collect unique digital treasures earned through solving puzzles and completing challenges.
          </p>
        </div>

        {/* Search and filters */}
        <div className="backdrop-blur-lg bg-white/10 p-6 rounded-2xl border border-white/20 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search NFTs..."
                className="w-full bg-white/10 border border-white/20 rounded-lg py-2 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <div className="relative">
                <select
                  className="appearance-none bg-white/10 border border-white/20 rounded-lg py-2 pl-4 pr-10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={rarityFilter}
                  onChange={(e) => setRarityFilter(e.target.value)}
                >
                  {rarities.map((rarity, index) => (
                    <option key={index} value={rarity} className="bg-gray-800">
                      {rarity === "all" ? "All Rarities" : rarity.charAt(0).toUpperCase() + rarity.slice(1)}
                    </option>
                  ))}
                </select>
                <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>

              <div className="relative">
                <select
                  className="appearance-none bg-white/10 border border-white/20 rounded-lg py-2 pl-4 pr-10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  {categories.map((category, index) => (
                    <option key={index} value={category} className="bg-gray-800">
                      {category === "all" ? "All Categories" : category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
                <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* NFT grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredNFTs.map((nft) => (
            <Card
              key={nft.id}
              className={`overflow-hidden backdrop-blur-lg border transition-all duration-300 hover:transform hover:scale-105 ${
                nft.obtained ? "bg-white/15 border-purple-500/50" : "bg-white/10 border-white/20 opacity-80"
              }`}
            >
              <div className="relative">
                <div
                  className={`absolute top-0 right-0 m-4 px-2 py-1 rounded-full text-xs font-bold text-white ${rarityColors[nft.rarity]}`}
                >
                  {nft.rarity}
                </div>
                {!nft.obtained && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-t-lg">
                    <Lock className="h-12 w-12 text-white/70" />
                  </div>
                )}
                <img src={nft.image || "/placeholder.svg"} alt={nft.name} className="w-full h-64 object-cover" />
              </div>

              <div className="p-6">
                <div className="flex justify-between items-center mb-2">
                  <Badge variant="outline" className="bg-white/10 text-white border-white/20">
                    {nft.category}
                  </Badge>
                  <div className="text-xs text-gray-400 flex items-center">
                    <Star className="h-3 w-3 mr-1 text-yellow-500" /> {nft.holders} holders
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-2">{nft.name}</h3>
                <p className="text-gray-300 text-sm mb-4">{nft.description}</p>

                <div className="mb-4">
                  <div className="text-sm text-gray-400 mb-2">Attributes:</div>
                  <div className="grid grid-cols-2 gap-2">
                    {nft.attributes.map((attr, index) => (
                      <div key={index} className="bg-white/10 rounded-md p-2 text-xs">
                        <div className="text-gray-400">{attr.trait}</div>
                        <div className="text-white font-medium">{attr.value}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between">
                  {nft.obtained ? (
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                        <Eye className="h-4 w-4 mr-1" /> View
                      </Button>
                      <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                    >
                      <Info className="h-4 w-4 mr-1" /> How to Earn
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredNFTs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-300 text-lg">No NFTs match your search criteria.</p>
            <Button
              variant="outline"
              className="mt-4 border-white/20 text-white hover:bg-white/10"
              onClick={() => {
                setSearchTerm("")
                setRarityFilter("all")
                setCategoryFilter("all")
              }}
            >
              Reset Filters
            </Button>
          </div>
        )}

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Unlock More NFTs</h2>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Continue your adventure to collect all available NFT rewards. Some are extremely rare and only obtainable
            through special challenges.
          </p>
          <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-8 rounded-lg">
            Start Hunting
          </Button>
        </div>
      </div>
    </main>
  )
}

