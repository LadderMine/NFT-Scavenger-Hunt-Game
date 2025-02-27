import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Star, Crown, Shield, Eye, Lock, Info } from "lucide-react";

const getRarityColor = (rarity) => {
  const colors = {
    Common: "from-blue-400 to-blue-600",
    Rare: "from-purple-400 to-purple-600",
    Epic: "from-pink-400 to-pink-600",
    Legendary: "from-amber-400 to-amber-600",
  };
  return colors[rarity] || "from-gray-400 to-gray-600";
};

const NFTCard = ({ nft }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="group relative rounded-xl overflow-hidden transition-transform duration-300 hover:scale-105"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Card Background with Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/10" />

      {/* NFT Image Container */}
      <div className="relative p-4">
        <div className="relative aspect-square rounded-lg overflow-hidden mb-4">
          {/* Placeholder Image */}
          <div
            className={`w-full h-full bg-gradient-to-br ${getRarityColor(
              nft.rarity
            )} opacity-80`}
          >
            <img
              src={nft.src}
              alt={nft.name}
              className="w-full h-full object-cover mix-blend-overlay"
            />
          </div>

          {/* Locked Overlay */}
          {nft.locked && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <Lock className="w-12 h-12 text-white/50" />
            </div>
          )}

          {/* Rarity Badge */}
          <div
            className={`absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${getRarityColor(
              nft.rarity
            )} text-white`}
          >
            {nft.rarity}
          </div>
        </div>

        {/* NFT Details */}
        <div className="relative z-10">
          <h3 className="text-xl font-bold text-white mb-2">{nft.name}</h3>
          <p className="text-gray-300 text-sm mb-4">{nft.description}</p>

          {/* Requirements and Stats */}
          <div className="flex flex-wrap gap-3 mb-4 text-sm">
            {nft.requirements.map((req, index) => (
              <div
                key={index}
                className="flex items-center bg-white/5 rounded-full px-3 py-1"
              >
                <Shield className="w-4 h-4 mr-1 text-gray-400" />
                <span className="text-gray-300">{req}</span>
              </div>
            ))}
          </div>

          {/* Action Button */}
          <Button
            className={`w-full ${
              nft.locked
                ? "bg-white/10 text-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            }`}
            disabled={nft.locked}
          >
            {nft.locked ? (
              <span className="flex items-center">
                <Lock className="w-4 h-4 mr-2" />
                Complete Challenges to Unlock
              </span>
            ) : (
              <span className="flex items-center">
                <Sparkles className="w-4 h-4 mr-2" />
                Claim NFT
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

const NFTRewardsShowcase = () => {
  const nfts = [
    {
      name: "Stargazer's Compass",
      description:
        "A mystical artifact for those who navigate the blockchain cosmos.",
      rarity: "Common",
      requirements: ["Complete 3 Easy Challenges", "Score 1000 points"],
      locked: false,
      src: "/nftCompass.jpeg",
    },
    {
      name: "Cryptic Codex",
      description:
        "Ancient scrolls containing the secrets of StarkNet mysteries.",
      rarity: "Rare",
      requirements: ["Solve 5 Medium Puzzles", "Top 100 Leaderboard"],
      locked: true,
      src: "/nftCodex.jpeg",
    },
    {
      name: "Zero Knowledge Crown",
      description: "A legendary crown bestowed upon master puzzle solvers.",
      rarity: "Epic",
      requirements: ["Complete All Hard Challenges", "Achieve Perfect Score"],
      locked: true,
      src: "/nftCrown.jpeg",
    },
    {
      name: "Genesis Key",
      description: "The ultimate symbol of mastery over the StarkNet realm.",
      rarity: "Legendary",
      requirements: ["First Place on Leaderboard", "100% Completion"],
      locked: true,
      src: "/nftKey.jpeg",
    },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto mt-24 px-6">
      {/* Section Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 mb-4">
          NFT Rewards Gallery
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Complete challenges and unlock exclusive NFTs. Each reward tells a
          unique story of your achievements in the StarkNet universe.
        </p>
      </div>

      {/* Rarity Guide */}
      <div className="flex flex-wrap justify-center gap-4 mb-12">
        {["Common", "Rare", "Epic", "Legendary"].map((rarity) => (
          <div
            key={rarity}
            className="flex items-center space-x-2 bg-white/5 rounded-full px-4 py-2"
          >
            <div
              className={`w-2 h-2 rounded-full bg-gradient-to-r ${getRarityColor(
                rarity
              )}`}
            />
            <span className="text-sm text-gray-300">{rarity}</span>
          </div>
        ))}
      </div>

      {/* NFT Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {nfts.map((nft, index) => (
          <NFTCard key={index} nft={nft} />
        ))}
      </div>

      {/* Collection Stats */}
      <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 bg-white/5 rounded-xl p-6 backdrop-blur-sm">
        <div className="text-center">
          <div className="text-2xl font-bold text-white mb-1">12</div>
          <div className="text-sm text-gray-400">Total NFTs</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-white mb-1">4,231</div>
          <div className="text-sm text-gray-400">Claimed</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-white mb-1">892</div>
          <div className="text-sm text-gray-400">Holders</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-white mb-1">3.2 ETH</div>
          <div className="text-sm text-gray-400">Floor Price</div>
        </div>
      </div>
    </div>
  );
};

export default NFTRewardsShowcase;
