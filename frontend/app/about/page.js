import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Brain, Users, Lightbulb, Blocks, Award } from "lucide-react";
import Link from "next/link";
import FeatureCard from "@/components/general/FeatureCard";
import TechCard from "@/components/general/TechCard";
import Footer from "@/components/Footer";

const AboutPage = () => {
  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-black via-purple-900 to-black">
      {/* Animated background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000" />
      </div>

      <div className="relative px-4 py-16 max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-2xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            About NFT Scavenger Hunt
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Embark on an educational adventure through the StarkNet ecosystem,
            where puzzle-solving meets blockchain technology in an exciting
            treasure hunt for exclusive NFT rewards.
          </p>
        </div>

        {/* Mission Statement */}
        <Card className="backdrop-blur-lg bg-white/10 border-white/20 text-white mb-16 p-8">
          <CardContent className="text-center">
            <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
            <p className="text-gray-300 text-lg">
              To create an engaging and educational platform that makes learning
              about blockchain technology fun and rewarding, while building a
              community of curious minds and innovative thinkers.
            </p>
          </CardContent>
        </Card>

        {/* Key Features Grid */}
       

        {/* Technology Stack */}
        

        {/* CTA Section */}
        
      </div>

      <Footer />
    </main>
  );
};

export default AboutPage;
