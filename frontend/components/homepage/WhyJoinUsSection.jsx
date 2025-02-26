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

const ValueCard = ({ icon: Icon, title, description, stats, delay }) => {
  return (
    <div
      className="relative group"
      style={{
        animation: `fadeInUp 0.6s ease-out ${delay}s both`,
      }}
    >
      {/* Animated border gradient */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg blur opacity-0 group-hover:opacity-75 transition duration-500" />

      {/* Card content */}
      <div className="relative flex flex-col h-full p-6 bg-black/40 backdrop-blur-sm rounded-lg border border-white/10">
        {/* Icon container with gradient background */}
        <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
          <Icon className="w-7 h-7 text-purple-400 group-hover:text-purple-300" />
        </div>

        <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
        <p className="text-gray-400 mb-6 flex-grow">{description}</p>

        {/* Stats display */}
        {stats && (
          <div className="bg-white/5 rounded-lg p-4 backdrop-blur-sm">
            <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              {stats.value}
            </div>
            <div className="text-sm text-gray-400">{stats.label}</div>
          </div>
        )}
      </div>
    </div>
  );
};

const WhyJoinSection = () => {
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
        <ValueCard
          icon={BookOpen}
          title="Learn Blockchain"
          description="Master blockchain concepts through interactive puzzles and challenges. Perfect for beginners and experts alike."
          stats={{ value: "1,000+", label: "Learning Resources" }}
          delay={0}
        />

        <ValueCard
          icon={Palette}
          title="Own Unique NFTs"
          description="Earn and collect exclusive NFTs that showcase your achievements and knowledge in the StarkNet ecosystem."
          stats={{ value: "50+", label: "Unique NFT Designs" }}
          delay={0.2}
        />

        <ValueCard
          icon={Globe}
          title="Global Community"
          description="Join thousands of players worldwide. Compete, collaborate, and share your achievements with the community."
          stats={{ value: "10K+", label: "Active Players" }}
          delay={0.4}
        />

        <ValueCard
          icon={Zap}
          title="Web3 Innovation"
          description="Experience the future of gaming with cutting-edge blockchain technology and StarkNet integration."
          stats={{ value: "100%", label: "On-Chain Experience" }}
          delay={0.6}
        />
      </div>

      {/* Stats banner */}
      <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 p-8 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-sm border border-white/10">
        <div className="text-center">
          <div className="text-3xl font-bold text-white mb-2">$2.5M+</div>
          <div className="text-sm text-gray-400">Total Value Locked</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-white mb-2">24K+</div>
          <div className="text-sm text-gray-400">Challenges Completed</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-white mb-2">15K+</div>
          <div className="text-sm text-gray-400">NFTs Minted</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-white mb-2">98%</div>
          <div className="text-sm text-gray-400">Player Satisfaction</div>
        </div>
      </div>
    </div>
  );
};

export default WhyJoinSection;
