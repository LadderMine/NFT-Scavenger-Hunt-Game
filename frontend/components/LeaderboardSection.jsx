import React from "react";
import { Button } from "@/components/ui/button";
import {
  Trophy,
  Crown,
  Medal,
  ArrowRight,
  Sparkles,
  Flame,
  Star,
} from "lucide-react";
import Link from "next/link";

const RankBadge = ({ rank }) => {
  const getBadgeStyle = (rank) => {
    switch (rank) {
      case 1:
        return {
          icon: Crown,
          class: "bg-gradient-to-r from-yellow-400 to-amber-600",
          size: "w-12 h-12",
        };
      case 2:
        return {
          icon: Medal,
          class: "bg-gradient-to-r from-slate-300 to-slate-500",
          size: "w-10 h-10",
        };
      case 3:
        return {
          icon: Medal,
          class: "bg-gradient-to-r from-amber-700 to-amber-900",
          size: "w-10 h-10",
        };
      default:
        return {
          icon: Star,
          class: "bg-gradient-to-r from-purple-500 to-pink-500",
          size: "w-8 h-8",
        };
    }
  };

  const style = getBadgeStyle(rank);
  const Icon = style.icon;

  return (
    <div
      className={`${style.size} rounded-full ${style.class} flex items-center justify-center`}
    >
      <Icon className="w-5 h-5 text-white" />
    </div>
  );
};

const PlayerCard = ({ player, rank }) => {
  return (
    <div className="relative group">
      {/* Animated background on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/10 to-pink-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />

      <div className="relative flex items-center gap-4 p-4 backdrop-blur-sm bg-white/5 border border-white/10 rounded-lg">
        {/* Rank and Badge */}
        <div className="flex items-center gap-3">
          <RankBadge rank={rank} />
          <span className="text-2xl font-bold text-white/80">#{rank}</span>
        </div>

        {/* Player Info */}
        <div className="flex-grow">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-white">{player.name}</h3>
            {player.streak > 0 && (
              <div className="flex items-center text-orange-400 text-sm">
                <Flame className="w-4 h-4 mr-1" />
                {player.streak} day streak
              </div>
            )}
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <span>{player.challenges} challenges</span>
            <span>{player.nfts} NFTs</span>
          </div>
        </div>

        {/* Score */}
        <div className="text-right">
          <div className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
            {player.score.toLocaleString()} pts
          </div>
          <div className="text-sm text-gray-400">Level {player.level}</div>
        </div>
      </div>
    </div>
  );
};

const LeaderboardSection = () => {
  const topPlayers = [
    {
      name: "CryptoMaster",
      score: 156750,
      level: 42,
      challenges: 156,
      nfts: 23,
      streak: 15,
    },
    {
      name: "BlockNinja",
      score: 142300,
      level: 38,
      challenges: 143,
      nfts: 19,
      streak: 7,
    },
    {
      name: "StarkHunter",
      score: 138900,
      level: 35,
      challenges: 128,
      nfts: 17,
      streak: 12,
    },
    {
      name: "Web3Explorer",
      score: 125400,
      level: 31,
      challenges: 115,
      nfts: 15,
      streak: 0,
    },
    {
      name: "RiddleSolver",
      score: 118200,
      level: 29,
      challenges: 108,
      nfts: 14,
      streak: 5,
    },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto my-24 px-6">
      {/* Section Header */}
      <div className="flex justify-between items-end mb-12">
        <div>
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 mb-2">
            Top Hunters
          </h2>
          <p className="text-gray-400">
            The most skilled treasure hunters in the StarkNet realm
          </p>
        </div>
        <Button
          asChild
          className="hidden sm:flex items-center space-x-2 bg-white/10 hover:bg-white/20"
        >
          <Link href="/leaderboard">
            <Trophy className="w-4 h-4 mr-2" />
            View Full Leaderboard
          </Link>
        </Button>
      </div>

      {/* Prize Pool Banner */}
      <div className="mb-8 p-6 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-sm border border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Sparkles className="w-8 h-8 text-yellow-400" />
            <div>
              <h3 className="text-xl font-bold text-white mb-1">
                Monthly Prize Pool
              </h3>
              <p className="text-gray-400">
                Top hunters share rewards each month
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-600">
              10,000 STARK
            </div>
            <div className="text-sm text-gray-400">≈ $5,000 USD</div>
          </div>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="space-y-4">
        {topPlayers.map((player, index) => (
          <PlayerCard key={index} player={player} rank={index + 1} />
        ))}
      </div>

      {/* Mobile CTA */}
      <div className="mt-8 sm:hidden">
        <Button className="w-full bg-white/10 hover:bg-white/20">
          <Trophy className="w-4 h-4 mr-2" />
          View Full Leaderboard
        </Button>
      </div>

      {/* Rank Rewards */}
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-xl bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/20">
          <Crown className="w-8 h-8 text-yellow-400 mb-4" />
          <h3 className="text-lg font-bold text-white mb-2">1st Place</h3>
          <p className="text-gray-400 mb-4">5,000 STARK + Legendary NFT</p>
          <div className="text-sm text-yellow-400">Top Global Ranking</div>
        </div>
        <div className="p-6 rounded-xl bg-gradient-to-r from-slate-500/10 to-slate-400/10 border border-slate-400/20">
          <Medal className="w-8 h-8 text-slate-400 mb-4" />
          <h3 className="text-lg font-bold text-white mb-2">2nd Place</h3>
          <p className="text-gray-400 mb-4">3,000 STARK + Epic NFT</p>
          <div className="text-sm text-slate-400">Elite Hunter Status</div>
        </div>
        <div className="p-6 rounded-xl bg-gradient-to-r from-amber-900/10 to-amber-700/10 border border-amber-700/20">
          <Medal className="w-8 h-8 text-amber-700 mb-4" />
          <h3 className="text-lg font-bold text-white mb-2">3rd Place</h3>
          <p className="text-gray-400 mb-4">2,000 STARK + Rare NFT</p>
          <div className="text-sm text-amber-700">Master Hunter Badge</div>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardSection;
