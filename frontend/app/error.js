"use client";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, RefreshCcw } from "lucide-react";
import AnimatedBlurBackground from "@/components/AnimatedBlurBackground";

export default function Error() {
  const reload = () => {
    window.location.reload();
  };

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-black via-purple-900 to-black">
      {/* Animated background blur */}
      <AnimatedBlurBackground />
      {/* Content */}
      <div className="relative flex min-h-screen flex-col items-center justify-center p-6">
        {/* Glass card container */}
        <div className="backdrop-blur-lg bg-white/10 p-8 sm:p-12 rounded-2xl shadow-2xl border border-white/20 max-w-2xl w-full text-center">
          {/* Grid effect */}
          <div
            className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/10 to-transparent opacity-20"
            style={{
              backgroundSize: "4px 4px",
              backgroundImage:
                "linear-gradient(to right, rgb(139, 92, 246, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgb(139, 92, 246, 0.1) 1px, transparent 1px)",
            }}
          />

          {/* Error Text */}
          <h1 className="text-8xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            Error
          </h1>

          {/* Error Message */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">Oh no!</h2>
            <p className="text-lg text-gray-300">Something went wrong.</p>
          </div>

          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              asChild
              className="w-full sm:w-auto bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-4 px-8 rounded-lg transform transition-all hover:scale-105 shadow-lg hover:shadow-purple-500/50"
            >
              <Link href="/" className="flex items-center gap-2">
                <Home size={20} />
                Return Home
              </Link>
            </Button>
            <Button
              onClick={reload}
              variant="outline"
              className="w-full sm:w-auto border-white/20 text-white hover:bg-white/10 hover:text-white bg-transparent font-bold py-4 px-8 rounded-lg transform transition-all hover:scale-105"
            >
              <div className="flex items-center gap-2">
                <RefreshCcw size={20} />
                Try Again
              </div>
            </Button>
          </div>

          {/* Easter Egg Text */}
          <p className="mt-8 text-sm text-gray-400 animate-pulse">
            Don't worry, even the best games crashes somethimes...
          </p>
        </div>
      </div>
    </main>
  );
}
