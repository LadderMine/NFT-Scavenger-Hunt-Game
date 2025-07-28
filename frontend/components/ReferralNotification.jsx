import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Gift, Star, Award, X } from "lucide-react";

const ReferralNotification = ({ notification, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Auto-hide after 5 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!isVisible) return null;

  const getRewardIcon = (type) => {
    switch (type) {
      case "nft":
        return <Gift className="w-5 h-5 text-purple-400" />;
      case "xp":
        return <Star className="w-5 h-5 text-yellow-400" />;
      case "badge":
        return <Award className="w-5 h-5 text-pink-400" />;
      default:
        return <Gift className="w-5 h-5 text-purple-400" />;
    }
  };

  const getRewardColor = (type) => {
    switch (type) {
      case "nft":
        return "bg-purple-500/20 text-purple-300";
      case "xp":
        return "bg-yellow-500/20 text-yellow-300";
      case "badge":
        return "bg-pink-500/20 text-pink-300";
      default:
        return "bg-purple-500/20 text-purple-300";
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right-5 duration-300">
      <Card className="backdrop-blur-lg bg-white/10 border-white/20 p-4 max-w-sm">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            {getRewardIcon(notification.type)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold text-white">
                Referral Reward Earned!
              </h4>
              <button
                onClick={() => {
                  setIsVisible(false);
                  onClose();
                }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-gray-300 text-sm mb-2">
              {notification.message}
            </p>
            <div className="flex items-center space-x-2">
              <Badge className={getRewardColor(notification.type)}>
                {notification.reward}
              </Badge>
              {notification.xp && (
                <Badge className="bg-green-500/20 text-green-300">
                  +{notification.xp} XP
                </Badge>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ReferralNotification; 