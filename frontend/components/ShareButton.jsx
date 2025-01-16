import React from "react";
import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const ShareButton = ({ message, className }) => {
  const shareContent = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "NFT Scavenger Hunt",
          text: message,
          url: window.location.href,
        });
      } catch (err) {
        // Fallback for desktop
        navigator.clipboard.writeText(`${message}\n${window.location.href}`);
        alert("Share link copied to clipboard!");
      }
    } else {
      // Fallback for browsers that don't support sharing
      navigator.clipboard.writeText(`${message}\n${window.location.href}`);
      alert("Share link copied to clipboard!");
    }
  };

  return (
    <Button
      onClick={shareContent}
      variant="outline"
      className={`flex items-center gap-2 border-white/20 text-white hover:bg-white/10 ${className}`}
    >
      <Share2 size={20} />
      Share
    </Button>
  );
};

export default ShareButton;
