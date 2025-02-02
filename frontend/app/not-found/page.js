"use client";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Gamepad2 } from "lucide-react";

export default function NotFound() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-black via-purple-900 to-black">
      {/* Animated background blur */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse" />
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse delay-700" />
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse delay-1000" />
      </div>

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

          {/* 404 Text */}
          <h1 className="text-8xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            404
          </h1>

          {/* Game Over Text */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">oopps!!</h2>
            <p className="text-lg text-gray-300">
              Looks like you've wandered into uncharted territory. This page
              doesn't exist... yet!
            </p>
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
              asChild
              variant="outline"
              className="w-full sm:w-auto border-white/20 text-white hover:bg-white/10 hover:text-white bg-transparent font-bold py-4 px-8 rounded-lg transform transition-all hover:scale-105"
            >
              <Link href="/game" className="flex items-center gap-2">
                <Gamepad2 size={20} />
                Start New Game
              </Link>
            </Button>
          </div>

          {/* Easter Egg Text */}
          <p className="mt-8 text-sm text-gray-400 animate-pulse">
            Achievement Unlocked: Found the Secret Level!
          </p>
        </div>
      </div>
    </main>
  );
}
