"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";

const ShareButton = () => {
  const handleShare = async () => {
    const shareMessage =
      "Join me on NFT Scavenger Hunt - solve puzzles and earn exclusive NFTs! 🎮✨";

    if (navigator.share) {
      try {
        await navigator.share({
          title: "NFT Scavenger Hunt",
          text: shareMessage,
          url: window.location.href,
        });
      } catch (err) {
        navigator.clipboard.writeText(
          `${shareMessage}\n${window.location.href}`
        );
        alert("Share link copied to clipboard!");
      }
    } else {
      navigator.clipboard.writeText(`${shareMessage}\n${window.location.href}`);
      alert("Share link copied to clipboard!");
    }
  };

  return (
    <Button
      onClick={handleShare}
      variant="outline"
      className="w-full sm:w-auto border-white/20 text-white hover:bg-white/10 hover:text-white bg-transparent font-bold py-4 px-8 rounded-lg transform transition-all hover:scale-105"
    >
      <span className="flex items-center gap-2">
        <Share2 size={20} />
        Share
      </span>
    </Button>
  );
};

export default ShareButton;
