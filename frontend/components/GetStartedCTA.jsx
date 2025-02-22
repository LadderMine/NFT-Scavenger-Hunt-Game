import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gamepad, Wallet } from "lucide-react";

const GetStartedCTA = () => {
  const [isConnecting, setIsConnecting] = useState(false);

  const handleWalletConnect = () => {
    setIsConnecting(true);
    // Here you would integrate your actual wallet connection logic
    setTimeout(() => setIsConnecting(false), 1000);
  };

  return (
    <Card className="backdrop-blur-lg bg-white/10 border-white/20 text-white max-w-2xl mx-auto overflow-hidden mb-24">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          Ready to Join the Hunt?
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-center text-gray-300 text-lg">
          Sign up now and start solving puzzles to earn exclusive NFT rewards!
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            onClick={handleWalletConnect}
            disabled={isConnecting}
            className="w-full sm:w-auto bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-6 px-8 rounded-lg transform transition-all hover:scale-105 shadow-lg hover:shadow-purple-500/50 flex items-center justify-center gap-2"
          >
            <Wallet className="w-5 h-5" />
            {isConnecting ? "Connecting..." : "Connect Wallet"}
          </Button>

          <Button
            variant="outline"
            className="w-full sm:w-auto border-white/20 text-white hover:bg-white/10 hover:text-white bg-transparent font-bold py-6 px-8 rounded-lg transform transition-all hover:scale-105 flex items-center justify-center gap-2"
          >
            <Gamepad className="w-5 h-5" />
            Learn How to Play
          </Button>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center text-sm text-gray-300">
          <div className="p-3 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
            🎮 Interactive Puzzles
          </div>
          <div className="p-3 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
            🏆 Earn NFT Rewards
          </div>
          <div className="p-3 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
            📈 Track Progress
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GetStartedCTA;
