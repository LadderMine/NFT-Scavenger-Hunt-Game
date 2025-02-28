import React from "react";
import { Brain, Target, Trophy, BarChart3 } from "lucide-react";
import HowItWorksStep from "@/components/HowItWorksStep";

const howItWorksSteps = [
  {
    icon: Brain,
    step: "1",
    title: "Solve Riddles",
    description:
      "Crack puzzles to unlock challenges and advance through the game.",
    delay: 0,
  },
  {
    icon: Target,
    step: "2",
    title: "Complete Challenges",
    description:
      "Use your blockchain knowledge to overcome exciting obstacles.",
    delay: 0.2,
  },
  {
    icon: Trophy,
    step: "3",
    title: "Earn NFTs",
    description:
      "Win exclusive StarkNet-powered NFT rewards for your achievements!",
    delay: 0.4,
  },
  {
    icon: BarChart3,
    step: "4",
    title: "Climb the Leaderboard",
    description: "Compete globally and showcase your puzzle-solving prowess.",
    delay: 0.6,
  },
];

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
        {howItWorksSteps.map(() => (
          <HowItWorksStep
            icon={howItWorksSteps.icon}
            key={howItWorksSteps.step}
            step={howItWorksSteps.step}
            title={howItWorksSteps.title}
            description={howItWorksSteps.description}
            delay={howItWorksSteps.delay}
          />
        ))}
      </div>
    </div>
  );
};

export default HowItWorks;
