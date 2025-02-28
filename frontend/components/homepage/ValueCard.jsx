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

export default ValueCard;
