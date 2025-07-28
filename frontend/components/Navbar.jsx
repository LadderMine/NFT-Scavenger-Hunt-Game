"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X, Gamepad, Trophy, Book, User, Users } from "lucide-react";

const NavigationHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Gradient border bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />

      {/* Blur backdrop */}
      <div className="backdrop-blur-md bg-black/20 border-b border-white/5">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and brand */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                <Gamepad className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                NFT Hunt
              </span>
            </Link>

            {/* Desktop navigation */}
            <div className="hidden md:flex md:items-center md:space-x-6">
              <Link
                href="/game"
                className="text-gray-300 hover:text-white transition-colors flex items-center space-x-2"
              >
                <Gamepad className="w-4 h-4" />
                <span>Play Now</span>
              </Link>
              <Link
                href="/leaderboard"
                className="text-gray-300 hover:text-white transition-colors flex items-center space-x-2"
              >
                <Trophy className="w-4 h-4" />
                <span>Leaderboard</span>
              </Link>
              <Link
                href="/learn"
                className="text-gray-300 hover:text-white transition-colors flex items-center space-x-2"
              >
                <Book className="w-4 h-4" />
                <span>Learn</span>
              </Link>
              <Link
                href="/invite-friends"
                className="text-gray-300 hover:text-white transition-colors flex items-center space-x-2"
              >
                <Users className="w-4 h-4" />
                <span>Invite Friends</span>
              </Link>
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                <Link
                  href={"/connect-wallet"}
                  className="flex items-center space-x-2"
                >
                  <User className="w-4 h-4 mr-2" />
                  Connect Wallet
                </Link>
              </Button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-300 hover:text-white"
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </Button>
            </div>
          </div>
        </nav>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden backdrop-blur-md bg-black/40">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                href="/game"
                className="block px-3 py-2 rounded-md text-gray-300 hover:text-white hover:bg-white/10 transition-colors flex items-center space-x-2"
              >
                <Gamepad className="w-4 h-4" />
                <span>Play Now</span>
              </Link>
              <Link
                href="/leaderboard"
                className="block px-3 py-2 rounded-md text-gray-300 hover:text-white hover:bg-white/10 transition-colors flex items-center space-x-2"
              >
                <Trophy className="w-4 h-4" />
                <span>Leaderboard</span>
              </Link>
              <Link
                href="/learn"
                className="block px-3 py-2 rounded-md text-gray-300 hover:text-white hover:bg-white/10 transition-colors flex items-center space-x-2"
              >
                <Book className="w-4 h-4" />
                <span>Learn</span>
              </Link>
              <Link
                href="/invite-friends"
                className="block px-3 py-2 rounded-md text-gray-300 hover:text-white hover:bg-white/10 transition-colors flex items-center space-x-2"
              >
                <Users className="w-4 h-4" />
                <span>Invite Friends</span>
              </Link>
              <div className="px-3 py-2">
                <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                  <User className="w-4 h-4 mr-2" />
                  Connect Wallet
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default NavigationHeader;
