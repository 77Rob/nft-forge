import { applyMiddleware, configureStore } from "@reduxjs/toolkit";
import configReducer from "./collectionReducer";
import generatorReducer from "./generatorReducer";
import thunkMiddleware from "redux-thunk";
import userReducer from "./userReducer";

const store = configureStore({
  reducer: {
    config: configReducer,
    generator: generatorReducer,
    user: userReducer,
  },
  middleware: [thunkMiddleware],
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
