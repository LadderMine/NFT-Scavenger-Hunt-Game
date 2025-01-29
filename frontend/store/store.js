import { configureStore } from '@reduxjs/toolkit'

export const makeStore = () => {
  return configureStore({
    reducer: {},
    middleware: [],
    devTools: process.env.NODE_ENV !== "production",
  });
};
