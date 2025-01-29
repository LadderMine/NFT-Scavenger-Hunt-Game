import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
const API_URL = "http://localhost:8000";
// api call
export const fetchReward
 = createAsyncThunk(
  "user/reward",
  async (thunkApi) => {
    const response = await fetch(API_URL);
    const data = await response.json();
    return data;
  }
);

const initialState = {
  profile: [],
  loading: false,
  value: 10,
};

const rewardSlice = createSlice({
  name: "reward",
  initialState,
  reducers: {
    increment: (state) => {
      state.value++;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchReward
      .fulfilled, (state, action) => {
      state.loading = false;
      state.profile.push(...action.payload);
    });

    builder.addCase(fetchReward
      .pending, (state, action) => {
      state.loading = true;
    });
  },
});

export const { increment } = rewardSlice.actions;
export default rewardSlice.reducer;