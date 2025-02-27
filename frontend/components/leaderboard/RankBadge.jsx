import React from "react";
import { Crown, Medal, Star } from "lucide-react"; // Icons from Lucide


const RankBadge = ({ rank }) => {
    const getBadgeStyle = (rank) => {
      switch (rank) {
        case 1:
          return {
            icon: Crown,
            class: "bg-gradient-to-r from-yellow-400 to-amber-600",
            size: "w-12 h-12",
          };
        case 2:
          return {
            icon: Medal,
            class: "bg-gradient-to-r from-slate-300 to-slate-500",
            size: "w-10 h-10",
          };
        case 3:
          return {
            icon: Medal,
            class: "bg-gradient-to-r from-amber-700 to-amber-900",
            size: "w-10 h-10",
          };
        default:
          return {
            icon: Star,
            class: "bg-gradient-to-r from-purple-500 to-pink-500",
            size: "w-8 h-8",
          };
      }
    };
  
    const style = getBadgeStyle(rank);
    const Icon = style.icon;
  
    return (
      <div
        className={`${style.size} rounded-full ${style.class} flex items-center justify-center`}
      >
        <Icon className="w-5 h-5 text-white" />
      </div>
    );
  };

  export default RankBadge;