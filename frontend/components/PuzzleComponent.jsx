"use client";
import { useState } from "react";

// puzzle data to simulate data coming in
const puzzleData = {
  title: "Simple Math",
  puzzleNumber: 3,
  level: "Easy",
  levelReward: "Starknet Beginner NFT",
  puzzle:
    "How many  confirmations are typically recommended for StarkNet transactions?",
  hint: "StarkNet has faster finality than most L1s",
};

const PuzzleComponent = () => {
  const [showHint, setShowHint] = useState(false);

  const handleShowHint = () => {
    setShowHint((prev) => !prev);
  };
  return (
    <div className="">
      <div className="backdrop-blur-lg bg-white/10 max-w-3xl mx-auto border-0 rounded-md px-3 py-4 flex flex-col gap-1">
        <h3 className="text-lg text-[#BA7FF4] font-semibold">
          {puzzleData.level} - Puzzle {puzzleData.puzzleNumber}:{" "}
          {puzzleData.title}
        </h3>
        <p className="text-xs md:text-sm">
          Level Reward: {puzzleData.levelReward}
        </p>
        <form className="mt-4 flex flex-col gap-3">
          <label htmlFor="puzzle">{puzzleData.puzzle}</label>
          <input
            id="puzzle"
            name="puzzle"
            className="bg-transparent rounded-md h-8 border-[#BA7FF4]/40 border-2"
          />
          <button
            type="submit"
            className="h-8 rounded-md bg-gradient-to-r from-[#A955F6] to-[#EB489A]"
          >
            {" "}
            Submit
          </button>
          <button
            type="button"
            onClick={handleShowHint}
            className="rounded-md h-8 border-[#BA7FF4]/40 border-2 "
          >
            Need a hint?
          </button>

          {showHint && (
            <p className="flex items-center mx-auto text-center">
              {puzzleData.hint}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default PuzzleComponent;
