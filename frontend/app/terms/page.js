"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, ChevronDown, ChevronUp } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function TermsAndConditions() {
  const [expandAll, setExpandAll] = useState(false);

  const toggleExpandAll = () => {
    setExpandAll(!expandAll);
  };

  const lastUpdated = "February 26, 2025";

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-black via-purple-900 to-black">
      {/* Animated background blur - same as homepage */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse" />
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse delay-700" />
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse delay-1000" />
      </div>

      {/* Content */}
      <div className="relative min-h-screen flex flex-col items-start">
        {/* Header navigation */}
        <div className="w-full backdrop-blur-md bg-black/50 border-b border-white/10 p-4">
          <div className="container mx-auto flex items-center">
            <Link href="/">
              <Button
                variant="ghost"
                className="text-purple-300 hover:text-white hover:bg-white/10"
              >
                <ArrowLeft size={20} className="mr-2" />
                Back to Game
              </Button>
            </Link>
          </div>
        </div>

        {/* second issues code */}
        {/* Main content */}
        

        {/* Footer */}
        <div className="w-full backdrop-blur-md bg-black/50 border-t border-white/10 p-4 mt-8">
          <div className="container mx-auto text-center text-gray-400 text-sm">
            <p>&copy; 2025 NFT Scavenger Hunt. All rights reserved.</p>
            <div className="flex justify-center gap-4 mt-2">
              <Link
                href="/privacy"
                className="text-purple-400 hover:text-purple-300"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-purple-400 hover:text-purple-300"
              >
                Terms & Conditions
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
