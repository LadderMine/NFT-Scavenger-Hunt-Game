import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

const API_URL = 'http://localhost:8000/api/rewards'; // Update with your actual API endpoint

const useRewardStore = create(
  devtools(
    (set) => ({
      rewards: [],
      loading: false,
      error: null,

      // Fetch rewards from the API
      fetchRewards: async () => {
        set({ loading: true, error: null }, false, 'rewards/fetch/pending');
        try {
          const response = await fetch(API_URL);
          if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
          }
          const data = await response.json();
          set({ rewards: data, loading: false }, false, 'rewards/fetch/fulfilled');
        } catch (error) {
          set({ loading: false, error: error.message }, false, 'rewards/fetch/rejected');
        }
      },

    
      addReward: (reward) => set((state) => ({
        rewards: [...state.rewards, reward],
      }), false, 'rewards/add'),

     
      removeReward: (rewardId) => set((state) => ({
        rewards: state.rewards.filter((reward) => reward.id !== rewardId),
      }), false, 'rewards/remove'),
    }),
    { name: 'RewardStore' }
  )
);

export default useRewardStore;
