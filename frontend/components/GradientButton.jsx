import React from "react";
import { Loader2 } from "lucide-react";

const GradientButton = ({
  type = "button",
  onClick,
  disabled = false,
  isLoading = false,
  icon: Icon,
  children,
  className = "",
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`
        w-full py-2 px-3 rounded-md
        bg-gradient-to-r from-purple-600 to-pink-500
        text-white font-bold
        flex items-center justify-center space-x-2
        hover:opacity-90 transition
        disabled:opacity-50
        ${className}
      `}
    >
      {isLoading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <>
          {Icon && <Icon className="w-5 h-5" />}
          <span>{children}</span>
        </>
      )}
    </button>
  );
};

export default GradientButton;
