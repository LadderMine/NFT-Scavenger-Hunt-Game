import React from "react";
import { CardContent, Card } from "./ui/card";
const AchievementCard = ({ icon: Icon, value, label, color }) => {
  const colorClasses = {
    yellow: "text-yellow-400",
    purple: "text-purple-400",
    green: "text-green-400",
  };
  return (
    <Card className="backdrop-blur-lg bg-white/10 border-white/20 text-white">
      <CardContent className="pt-6">
        <div className="text-center">
          <Icon className={`w-8 h-8 mx-auto mb-2 ${colorClasses[color]}`} />
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-sm text-gray-300">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AchievementCard;
