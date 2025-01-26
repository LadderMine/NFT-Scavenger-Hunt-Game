import React from "react";
import { Star } from "lucide-react";

const Rating = ({
    
    totalStars = 5,
    filledStars,
    levelText,
   
    customstyles = ''
}) => {
    const getStarIcon = (isFilled) => (
        <Star 
            className={`w-6 h-6 transition-transform  transform hover:scale-110 cursor:pointer ${isFilled ? 'fill-current text-yellow-500' : 'text-gray-300'}`}
        />
    );

    return (
        <div className={` flex flex-col items-center justify-center w-full p-4 bg-white/10 font-bold border-2 border-purple-400/100 backdrop-blur-lg rounded-lg transition ease-in-out delay-150 `}>
            <div className="mr-4 text-white mb-2 text-center">
                {levelText}
            </div>
            <div className="flex">
                {Array.from({ length: totalStars }, (__, index) => (
                    <React.Fragment key={index}>
                        {getStarIcon(index < filledStars)}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default Rating;
