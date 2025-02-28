import React from "react";
import {
  Brain,
  Trophy,
  Users,
  Sparkles,
  BookOpen,
  Palette,
  Globe,
  Zap,
} from "lucide-react";

import ValueCard from "@/components/homepage/ValueCard";

// Define ValueCard component

const WhyJoinSection = () => {
  // Value cards data
  const valueCardsData = [
    {
      icon: BookOpen,
      title: "Learn Blockchain",
      description: "Master blockchain concepts through interactive puzzles and challenges. Perfect for beginners and experts alike.",
      stats: { value: "1,000+", label: "Learning Resources" },
      delay: 0
    },
    {
      icon: Palette,
      title: "Own Unique NFTs",
      description: "Earn and collect exclusive NFTs that showcase your achievements and knowledge in the StarkNet ecosystem.",
      stats: { value: "50+", label: "Unique NFT Designs" },
      delay: 0.2
    },
    {
      icon: Globe,
      title: "Global Community",
      description: "Join thousands of players worldwide. Compete, collaborate, and share your achievements with the community.",
      stats: { value: "10K+", label: "Active Players" },
      delay: 0.4
    },
    {
      icon: Zap,
      title: "Web3 Innovation",
      description: "Experience the future of gaming with cutting-edge blockchain technology and StarkNet integration.",
      stats: { value: "100%", label: "On-Chain Experience" },
      delay: 0.6
    }
  ];

  // Stats banner data
  const statsData = [
    { value: "$2.5M+", label: "Total Value Locked" },
    { value: "24K+", label: "Challenges Completed" },
    { value: "15K+", label: "NFTs Minted" },
    { value: "98%", label: "Player Satisfaction" }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto my-24 px-6">
      <style>
        {`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes float {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-10px);
            }
          }
        `}
      </style>

      {/* Section header */}
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 mb-4">
          Why Join Our Quest?
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Embark on an epic journey that combines learning, collecting, and
          competing in the world of Web3
        </p>
      </div>

      {/* Value propositions grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {valueCardsData.map((card, index) => (
          <ValueCard
            key={index}
            icon={card.icon}
            title={card.title}
            description={card.description}
            stats={card.stats}
            delay={card.delay}
          />
        ))}
      </div>

      {/* Stats banner */}
      {/* Stats banner */}
      {/* Stats banner */}
      <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 p-8 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-sm border border-white/10">
        {statsData.map((stat, index) => (
          <div key={index} className="text-center">
            <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
            <div className="text-sm text-gray-400">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WhyJoinSection;
