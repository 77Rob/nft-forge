import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { configReducer, configSlice } from "./config";
import generatorReducer from "./generator";

export const { setConfig, updatePreview, handleLayerDown, handleLayerUp } =
  configSlice.actions;

const store = configureStore({
  reducer: {
    config: configReducer,
    generator: generatorReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
