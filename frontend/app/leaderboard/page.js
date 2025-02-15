"use client";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trophy, Home, Medal } from "lucide-react";
import ShareButton from "@/components/ShareButton";

// Mock data for the leaderboard
const leaderboardData = [
  { rank: 1, name: "CryptoMaster", score: 5000, nfts: 4 },
  { rank: 2, name: "BlockchainWizard", score: 4800, nfts: 4 },
  { rank: 3, name: "NFTCollector", score: 4600, nfts: 3 },
  { rank: 4, name: "PuzzleSolver", score: 4400, nfts: 3 },
  { rank: 5, name: "Web3Explorer", score: 4200, nfts: 3 },
  { rank: 6, name: "TokenHunter", score: 4000, nfts: 2 },
  { rank: 7, name: "CipherBreaker", score: 3800, nfts: 2 },
  { rank: 8, name: "DAppDeveloper", score: 3600, nfts: 2 },
  { rank: 9, name: "SmartContractor", score: 3400, nfts: 1 },
  { rank: 10, name: "HashMaster", score: 3200, nfts: 1 },
];

const LeaderboardPage = () => {
  const getShareMessage = () => {
    return "Check out the NFT Scavenger Hunt leaderboard! Can you top the rankings? 醇式";
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-black via-purple-900 to-black p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <Button
            asChild
            variant="ghost"
            className="text-white hover:bg-white/10 hover:text-[#f0f0f0]"
          >
            <Link href="/" className="flex items-center gap-2">
              <Home size={20} />
              Back to Home
            </Link>
          </Button>

          <ShareButton message={getShareMessage()} className="bg-transparent" />
        </div>

        <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-center mb-4 text-purple-400">
            NFT Scavenger Hunt Leaderboard
          </h1>
          <p className="text-center text-gray-300 mb-6">
            Top players competing for glory and rare NFTs!
          </p>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-left text-purple-400">
                    Rank
                  </TableHead>
                  <TableHead className="text-left text-purple-400">
                    Name
                  </TableHead>
                  <TableHead className="text-right text-purple-400">
                    Score
                  </TableHead>
                  <TableHead className="text-right text-purple-400">
                    NFTs Collected
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaderboardData.map((player) => (
                  <TableRow
                    key={player.rank}
                    className="border-b border-white/10"
                  >
                    <TableCell className="font-medium text-white">
                      {player.rank <= 3 ? (
                        <div className="flex items-center gap-2">
                          <Medal
                            className={`w-5 h-5 ${
                              player.rank === 1
                                ? "text-yellow-400"
                                : player.rank === 2
                                ? "text-gray-400"
                                : "text-orange-400"
                            }`}
                          />
                          {player.rank}
                        </div>
                      ) : (
                        player.rank
                      )}
                    </TableCell>
                    <TableCell className="text-white">{player.name}</TableCell>
                    <TableCell className="text-right text-white">
                      {player.score}
                    </TableCell>
                    <TableCell className="text-right text-white">
                      {player.nfts}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;
