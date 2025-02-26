import React from "react";
import NFTCard from "../NFTCard";


const getRarityColor = (rarity) => {
  const colors = {
    Common: "from-blue-400 to-blue-600",
    Rare: "from-purple-400 to-purple-600",
    Epic: "from-pink-400 to-pink-600",
    Legendary: "from-amber-400 to-amber-600",
  };
  return colors[rarity] || "from-gray-400 to-gray-600";
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

  // Collection stats data
  const collectionStats = [
    { value: "12", label: "Total NFTs" },
    { value: "4,231", label: "Claimed" },
    { value: "892", label: "Holders" },
    { value: "3.2 ETH", label: "Floor Price" },
  ];

  return (
    <div className="w-full max-w-6xl px-6 mx-auto mt-24">
      {/* Section Header */}
      <div className="mb-12 text-center">
        <h2 className="mb-4 text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          NFT Rewards Gallery
        </h2>
        <p className="max-w-2xl mx-auto text-gray-400">
          Complete challenges and unlock exclusive NFTs. Each reward tells a
          unique story of your achievements in the StarkNet universe.
        </p>
      </div>

      {/* Rarity Guide */}
      <div className="flex flex-wrap justify-center gap-4 mb-12">
        {["Common", "Rare", "Epic", "Legendary"].map((rarity) => (
          <div
            key={rarity}
            className="flex items-center px-4 py-2 space-x-2 rounded-full bg-white/5"
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
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {nfts.map((nft, index) => (
          <NFTCard key={index} nft={nft} />
        ))}
      </div>

      {/* Collection Stats */}
      <div className="grid grid-cols-2 gap-4 p-6 mt-12 sm:grid-cols-4 bg-white/5 rounded-xl backdrop-blur-sm">
        {collectionStats.map((stat, index) => (
          <div key={index} className="text-center">
            <div className="mb-1 text-2xl font-bold text-white">{stat.value}</div>
            <div className="text-sm text-gray-400">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NFTRewardsShowcase;