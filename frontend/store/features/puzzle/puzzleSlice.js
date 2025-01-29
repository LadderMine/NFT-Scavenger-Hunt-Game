import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
const API_URL = "http://localhost:8000";
// api call
export const fetchPuzzle = createAsyncThunk(
  "user/puzzle",
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

const puzzleSlice = createSlice({
  name: "puzzle",
  initialState,
  reducers: {
    increment: (state) => {
      state.value++;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPuzzle.fulfilled, (state, action) => {
      state.loading = false;
      state.profile.push(...action.payload);
    });

    builder.addCase(fetchPuzzle.pending, (state, action) => {
      state.loading = true;
    });
  },
});

export const { increment } = puzzleSlice.actions;
export default puzzleSlice.reducer;