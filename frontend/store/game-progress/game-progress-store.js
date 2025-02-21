import create from 'zustand';
import { persist } from 'zustand/middleware';

const useGameStore = create(
  persist(
    (set) => ({
      completedPuzzles: [],
      score: 0,
      achievements: [],
      addCompletedPuzzle: (puzzleId) =>
        set((state) => ({
          completedPuzzles: [...state.completedPuzzles, puzzleId],
        })),
      incrementScore: (points) =>
        set((state) => ({
          score: state.score + points,
        })),
      addAchievement: (achievement) =>
        set((state) => ({
          achievements: [...state.achievements, achievement],
        })),
      resetProgress: () =>
        set({
          completedPuzzles: [],
          score: 0,
          achievements: [],
        }),
    }),
    {
      name: 'game-storage', // unique name for storage
      getStorage: () => localStorage, // (optional) by default, 'localStorage' is used
    }
  )
);

export default useGameStore;
