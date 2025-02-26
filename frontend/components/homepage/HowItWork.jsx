import React from "react";
import { Brain, Target, Trophy, BarChart3 } from "lucide-react";

const HowItWorksStep = ({ icon: Icon, step, title, description, delay }) => (
  <div
    className="flex flex-col items-center p-6 backdrop-blur-sm bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300 transform hover:scale-105"
    style={{
      animation: `fadeInUp 0.6s ease-out ${delay}s both`,
    }}
  >
    <div className="relative mb-4">
      <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-xl animate-pulse" />
      <div className="relative w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-white/20">
        <Icon className="w-8 h-8 text-white" />
      </div>
    </div>
    <div className="absolute -top-4 -left-4 w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold">
      {step}
    </div>
    <h3 className="text-xl font-bold text-white mb-2 text-center">{title}</h3>
    <p className="text-gray-300 text-center text-sm">{description}</p>
  </div>
);

const HowItWorks = () => {
  return (
    <div className="w-full max-w-4xl mx-auto mt-16 px-6 mb-16">
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
        `}
      </style>
      <h2 className="text-3xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
        How It Works
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <HowItWorksStep
          icon={Brain}
          step="1"
          title="Solve Riddles"
          description="Crack puzzles to unlock challenges and advance through the game."
          delay={0}
        />
        <HowItWorksStep
          icon={Target}
          step="2"
          title="Complete Challenges"
          description="Use your blockchain knowledge to overcome exciting obstacles."
          delay={0.2}
        />
        <HowItWorksStep
          icon={Trophy}
          step="3"
          title="Earn NFTs"
          description="Win exclusive StarkNet-powered NFT rewards for your achievements!"
          delay={0.4}
        />
        <HowItWorksStep
          icon={BarChart3}
          step="4"
          title="Climb the Leaderboard"
          description="Compete globally and showcase your puzzle-solving prowess."
          delay={0.6}
        />
      </div>
    </div>
  );
};

export default HowItWorks;
