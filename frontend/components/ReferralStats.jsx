import React from "react";
import { Card } from "@/components/ui/card";
import { Users, CheckCircle, Gift, Star } from "lucide-react";

const ReferralStats = ({ stats }) => {
  const statItems = [
    {
      icon: Users,
      label: "Total Invites",
      value: stats.totalInvites,
      color: "purple"
    },
    {
      icon: CheckCircle,
      label: "Active Users",
      value: stats.activeUsers,
      color: "green"
    },
    {
      icon: Gift,
      label: "Rewards Earned",
      value: stats.totalRewards,
      color: "pink"
    },
    {
      icon: Star,
      label: "Total XP",
      value: stats.totalXPEarned,
      color: "yellow"
    }
  ];

  const getColorClasses = (color) => {
    const colorMap = {
      purple: "bg-purple-500/20 text-purple-400",
      green: "bg-green-500/20 text-green-400",
      pink: "bg-pink-500/20 text-pink-400",
      yellow: "bg-yellow-500/20 text-yellow-400"
    };
    return colorMap[color] || "bg-gray-500/20 text-gray-400";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {statItems.map((item, index) => (
        <Card key={index} className="backdrop-blur-lg bg-white/10 border-white/20 p-6">
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getColorClasses(item.color)}`}>
              <item.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">{item.label}</p>
              <p className="text-2xl font-bold text-white">{item.value}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ReferralStats; 