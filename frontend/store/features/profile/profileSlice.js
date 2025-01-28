import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
const API_URL = "http://localhost:8000";
// api call
export const fetchProfile = createAsyncThunk(
  "user/profile",
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

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    increment: (state) => {
      state.value++;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchProfile.fulfilled, (state, action) => {
      state.loading = false;
      state.profile.push(...action.payload);
    });

    builder.addCase(fetchProfile.pending, (state, action) => {
      state.loading = true;
    });
  },
});

export const { increment } = profileSlice.actions;
export default profileSlice.reducer;