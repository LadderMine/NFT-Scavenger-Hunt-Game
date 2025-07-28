"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Gift, 
  Star, 
  Users, 
  ArrowRight, 
  CheckCircle,
  Sparkles,
  Trophy
} from "lucide-react";

export default function ReferralLandingPage() {
  const params = useParams();
  const router = useRouter();
  const [referrer, setReferrer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, you would fetch referrer data from the backend
    // For now, we'll simulate it
    setTimeout(() => {
      setReferrer({
        username: "crypto_explorer",
        avatar: "/placeholder.svg",
        totalInvites: 8,
        level: 15
      });
      setLoading(false);
    }, 1000);
  }, []);

  const handleGetStarted = () => {
    // Store referral info in localStorage or state management
    localStorage.setItem("referralId", params.referralId);
    router.push("/register");
  };

  const referralBonuses = [
    {
      icon: Gift,
      title: "Welcome NFT",
      description: "Get a free NFT just for joining through referral",
      color: "purple"
    },
    {
      icon: Star,
      title: "50 XP Bonus",
      description: "Start your journey with extra experience points",
      color: "yellow"
    },
    {
      icon: Trophy,
      title: "Exclusive Badge",
      description: "Show off your referral status with a special badge",
      color: "pink"
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading referral...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-black">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="mb-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-4">
              <Users className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 mb-4">
              You've Been Invited!
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              <span className="text-purple-400 font-semibold">{referrer?.username}</span> invited you to join the NFT Scavenger Hunt!
            </p>
          </div>
        </div>

        {/* Referrer Info */}
        <Card className="backdrop-blur-lg bg-white/10 border-white/20 p-6 mb-8">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
              <span className="text-white font-bold text-lg">
                {referrer?.username?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold text-white">{referrer?.username}</h3>
              <p className="text-gray-400">Level {referrer?.level} Explorer</p>
            </div>
          </div>
          <div className="flex justify-center space-x-6 text-center">
            <div>
              <p className="text-2xl font-bold text-white">{referrer?.totalInvites}</p>
              <p className="text-gray-400 text-sm">Friends Invited</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">8</p>
              <p className="text-gray-400 text-sm">Puzzles Solved</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">3</p>
              <p className="text-gray-400 text-sm">NFTs Collected</p>
            </div>
          </div>
        </Card>

        {/* Special Bonuses */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white text-center mb-6">
            <Sparkles className="w-6 h-6 inline mr-2 text-yellow-400" />
            Special Referral Bonuses
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {referralBonuses.map((bonus, index) => (
              <Card key={index} className="backdrop-blur-lg bg-white/10 border-white/20 p-6 text-center">
                <div className={`w-12 h-12 rounded-lg bg-${bonus.color}-500/20 flex items-center justify-center mx-auto mb-4`}>
                  <bonus.icon className={`w-6 h-6 text-${bonus.color}-400`} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{bonus.title}</h3>
                <p className="text-gray-300 text-sm">{bonus.description}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Game Preview */}
        <Card className="backdrop-blur-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20 p-8 mb-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-4">What Awaits You</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Embark on an epic digital treasure hunt where you'll solve cryptographic puzzles, 
              collect rare NFTs, and compete with players worldwide!
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-white">Solve challenging cryptographic puzzles</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-white">Collect exclusive NFT rewards</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-white">Compete on global leaderboards</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-white">Earn XP and level up</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-white">Join a vibrant community</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-white">Unlock special achievements</span>
              </div>
            </div>
          </div>
        </Card>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="backdrop-blur-lg bg-white/10 border-white/20 p-8">
            <h3 className="text-2xl font-bold text-white mb-4">
              Ready to Start Your Adventure?
            </h3>
            <p className="text-gray-300 mb-6 max-w-xl mx-auto">
              Join thousands of players in the ultimate NFT scavenger hunt. 
              Your friend's referral gives you exclusive bonuses to get started!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-lg px-8 py-3"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Get Started with Bonuses
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 text-lg px-8 py-3"
                onClick={() => router.push("/")}
              >
                Learn More
              </Button>
            </div>
            
            {/* Referral Code Display */}
            <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
              <p className="text-gray-300 text-sm mb-2">Referral Code:</p>
              <p className="text-purple-400 font-mono text-lg">{params.referralId}</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
} 