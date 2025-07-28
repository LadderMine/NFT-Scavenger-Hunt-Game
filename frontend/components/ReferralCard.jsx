import React from "react";
import { Badge } from "@/components/ui/badge";
import { Gift, UserPlus } from "lucide-react";

const ReferralCard = ({ user }) => {
  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500/20 text-green-300">Active</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500/20 text-yellow-300">Pending</Badge>;
      default:
        return <Badge className="bg-gray-500/20 text-gray-300">Inactive</Badge>;
    }
  };

  return (
    <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
          <UserPlus className="w-6 h-6 text-white" />
        </div>
        <div>
          <p className="text-white font-medium">{user.username}</p>
          <p className="text-gray-400 text-sm">Joined {user.joinedDate}</p>
          {user.xpBonus > 0 && (
            <p className="text-green-400 text-xs">+{user.xpBonus} XP earned</p>
          )}
        </div>
      </div>
      <div className="flex items-center space-x-3">
        {getStatusBadge(user.status)}
        {user.rewardEarned && (
          <div className="flex items-center space-x-1">
            <Gift className="w-4 h-4 text-yellow-400" />
            <span className="text-yellow-400 text-sm">{user.rewardEarned}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReferralCard; 