import React from "react";

const AchievementCard = ({ icon: Icon, value, label, color }) => {
  return (
    <div className="backdrop-blur-lg bg-white/10 border-white/20 text-white rounded-lg shadow-md p-4">
      <div className="text-center">
        <Icon className={`w-8 h-8 mx-auto mb-2 text-${color}-400`} />
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-sm text-gray-300">{label}</p>
      </div>
    </div>
  );
};

export default AchievementCard;
