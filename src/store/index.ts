import { applyMiddleware, configureStore } from "@reduxjs/toolkit";
import generativeCollectionReducer from "./generativeCollectionReducer";
import generatorReducer from "./generatorReducer";
import thunkMiddleware from "redux-thunk";
import userReducer from "./userReducer";
import contractReducer from "./contractReducer";

const store = configureStore({
  reducer: {
    generativeCollection: generativeCollectionReducer,
    generator: generatorReducer,
    user: userReducer,
    contract: contractReducer,
  },
  middleware: [thunkMiddleware],
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
