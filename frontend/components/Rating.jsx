import React from "react";
import { Star } from "lucide-react";

const Rating = ({
  totalStars = 5,
  filledStars,

  customstyles = "",
}) => {
  const getStarIcon = (isFilled) => (
    <Star
      className={`w-6 h-6 transition-transform  transform hover:scale-110 cursor:pointer ${
        isFilled ? "fill-current text-yellow-500" : "text-gray-300"
      }`}
    />
  );

  return (
    <div className="flex justify-center gap-1 mt-2">
      {Array.from({ length: totalStars }, (__, index) => (
        <React.Fragment key={index}>
          {getStarIcon(index < filledStars)}
        </React.Fragment>
      ))}
    </div>
  );
};

export default Rating;
