"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Trophy, 
  TrendingUp,
  Share2
} from "lucide-react";
import ReferralStats from "@/components/ReferralStats";
import ReferralLink from "@/components/ReferralLink";
import ReferralCard from "@/components/ReferralCard";

export default function InviteFriendsPage() {
  const [referralLink] = useState("https://nft-hunt.com/ref/user123");

  // Mock data for invited users
  const invitedUsers = [
    {
      id: 1,
      username: "crypto_explorer",
      avatar: "/placeholder.svg",
      joinedDate: "2024-01-15",
      status: "active",
      rewardEarned: "Rare NFT",
      xpBonus: 50
    },
    {
      id: 2,
      username: "blockchain_master",
      avatar: "/placeholder.svg",
      joinedDate: "2024-01-20",
      status: "active",
      rewardEarned: "Epic NFT",
      xpBonus: 100
    },
    {
      id: 3,
      username: "puzzle_solver",
      avatar: "/placeholder.svg",
      joinedDate: "2024-01-25",
      status: "pending",
      rewardEarned: null,
      xpBonus: 0
    }
  ];

  // Mock referral stats
  const referralStats = {
    totalInvites: 8,
    activeUsers: 5,
    totalRewards: 3,
    totalXPEarned: 250,
    nextMilestone: "10 invites for Legendary NFT"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-black">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 mb-4">
            Invite Friends
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Share the adventure! Invite friends to join the NFT scavenger hunt and earn exclusive rewards together.
          </p>
        </div>

        {/* Stats Cards */}
        <ReferralStats stats={referralStats} />

        {/* Referral Link Section */}
        <ReferralLink referralLink={referralLink} />

        {/* Invited Users Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="backdrop-blur-lg bg-white/10 border-white/20 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Invited Friends</h3>
                <Badge className="bg-purple-500/20 text-purple-300">
                  {invitedUsers.length} friends
                </Badge>
              </div>

              <div className="space-y-4">
                {invitedUsers.map((user) => (
                  <ReferralCard key={user.id} user={user} />
                ))}
              </div>
            </Card>
          </div>

          {/* Milestones & Rewards */}
          <div className="space-y-6">
            <Card className="backdrop-blur-lg bg-white/10 border-white/20 p-6">
              <h3 className="text-xl font-bold text-white mb-4">Next Milestone</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Legendary NFT</p>
                    <p className="text-gray-400 text-sm">10 invites needed</p>
                  </div>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                    style={{ width: `${(referralStats.totalInvites / 10) * 100}%` }}
                  ></div>
                </div>
                <p className="text-gray-300 text-sm">
                  {10 - referralStats.totalInvites} more invites to go!
                </p>
              </div>
            </Card>

            <Card className="backdrop-blur-lg bg-white/10 border-white/20 p-6">
              <h3 className="text-xl font-bold text-white mb-4">Reward Tiers</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">5 invites</span>
                  <Badge className="bg-green-500/20 text-green-300">Rare NFT</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">10 invites</span>
                  <Badge className="bg-purple-500/20 text-purple-300">Epic NFT</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">25 invites</span>
                  <Badge className="bg-yellow-500/20 text-yellow-300">Legendary NFT</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">50 invites</span>
                  <Badge className="bg-pink-500/20 text-pink-300">Mythic NFT</Badge>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-12">
          <Card className="backdrop-blur-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20 p-8">
            <h3 className="text-2xl font-bold text-white mb-4">
              Ready to Share the Adventure?
            </h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Invite your friends to join the NFT scavenger hunt and unlock exclusive rewards together. 
              The more friends you invite, the more rewards you'll earn!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={shareReferral}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share Now
              </Button>
              <Button
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                View Leaderboard
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
} 