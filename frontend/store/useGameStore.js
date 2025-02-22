import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";

const useGameStore = create(
  persist(
    (set, get) => ({
      // User state
      user: null,

      // Game progress
      currentDifficulty: "easy",
      currentPuzzleIndex: 0,
      completedPuzzles: [],
      completedDifficulties: [],
      score: 0,

      // NFT collection
      nfts: [],

      // Auth actions
      register: async (username, password) => {
        try {
          const response = await axios.post(
            "http://localhost:4001/auth/register",
            { username, password },
            { withCredentials: true }
          );
          set({ user: response.data });
        } catch (error) {
          console.error("Registration failed:", error);
          throw error;
        }
      },

      login: async (username, password) => {
        try {
          const response = await axios.post(
            "http://localhost:4001/auth/login",
            { username, password },
            { withCredentials: true }
          );
          set({ user: response.data });
        } catch (error) {
          console.error("Login failed:", error);
          throw error;
        }
      },

      logout: async () => {
        try {
          await axios.post(
            "http://localhost:4001/auth/logout",
            {},
            { withCredentials: true }
          );
          set({
            user: null,
            currentDifficulty: "easy",
            currentPuzzleIndex: 0,
            completedPuzzles: [],
            completedDifficulties: [],
            score: 0,
            nfts: [],
          });
        } catch (error) {
          console.error("Logout failed:", error);
        }
      },

      // Game actions
      completePuzzle: async (puzzleId) => {
        const {
          user,
          currentDifficulty,
          currentPuzzleIndex,
          completedPuzzles,
          completedDifficulties,
          score,
        } = get();
        if (!user) return;

        const newCompletedPuzzles = [...completedPuzzles, puzzleId];
        const currentDifficultyPuzzles = newCompletedPuzzles.filter((id) =>
          id.startsWith(currentDifficulty)
        );

        const isLevelCompleted = currentDifficultyPuzzles.length === 5;
        const newCompletedDifficulties = isLevelCompleted
          ? [...completedDifficulties, currentDifficulty]
          : completedDifficulties;

        let nextDifficulty = currentDifficulty;
        let nextPuzzleIndex = (currentPuzzleIndex + 1) % 5;

        if (isLevelCompleted) {
          const difficultyLevels = ["easy", "medium", "difficult", "advanced"];
          const currentIndex = difficultyLevels.indexOf(currentDifficulty);
          if (currentIndex < difficultyLevels.length - 1) {
            nextDifficulty = difficultyLevels[currentIndex + 1];
            nextPuzzleIndex = 0;
          }
        }

        const newScore = score + 100;

        // Update the backend
        try {
          await axios.post(
            "http://localhost:4001/game/update",
            {
              userId: user.id,
              completedPuzzles: newCompletedPuzzles,
              completedDifficulties: newCompletedDifficulties,
              currentDifficulty: nextDifficulty,
              currentPuzzleIndex: nextPuzzleIndex,
              score: newScore,
            },
            { withCredentials: true }
          );

          set({
            completedPuzzles: newCompletedPuzzles,
            completedDifficulties: newCompletedDifficulties,
            currentDifficulty: nextDifficulty,
            currentPuzzleIndex: nextPuzzleIndex,
            score: newScore,
          });
        } catch (error) {
          console.error("Failed to update game progress:", error);
        }
      },

      addNFT: async (nft) => {
        const { user, nfts } = get();
        if (!user) return;

        try {
          await axios.post(
            "http://localhost:4001/nft/add",
            {
              userId: user.id,
              nft,
            },
            { withCredentials: true }
          );

          set({ nfts: [...nfts, nft] });
        } catch (error) {
          console.error("Failed to add NFT:", error);
        }
      },

      // Load user data
      loadUserData: async () => {
        const { user } = get();
        if (!user) return;

        try {
          const response = await axios.get(
            `http://localhost:4001/user/${user.id}`,
            { withCredentials: true }
          );
          set(response.data);
        } catch (error) {
          console.error("Failed to load user data:", error);
        }
      },

      // Reset progress
      resetProgress: async () => {
        const { user } = get();
        if (!user) return;

        try {
          await axios.post(
            `http://localhost:4001/game/reset`,
            { userId: user.id },
            { withCredentials: true }
          );
          set({
            currentDifficulty: "easy",
            currentPuzzleIndex: 0,
            completedPuzzles: [],
            completedDifficulties: [],
            score: 0,
            nfts: [],
          });
        } catch (error) {
          console.error("Failed to reset progress:", error);
        }
      },
    }),
    {
      name: "game-storage",
      getStorage: () => localStorage,
    }
  )
);

export default useGameStore;
