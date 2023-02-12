import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Image {
  imageId: string;
  ipfsUrl: string;
  rarity?: number;
}

interface Layer {
  name: string;
  rarity?: number;
  images: Image[];
}

interface GeneratorState {
  layers: Layer[];
  previews: Image[];
}

const initialState: GeneratorState = {
  layers: [],
  previews: [],
};

export const generatorSlice = createSlice({
  name: "generator",
  initialState,
  reducers: {
    addLayer(state, action: PayloadAction<string>) {
      const handleCreateLayer = async () => {
        await fetch("/api/layers/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            layerName: action.payload,
            userId: localStorage.getItem("userId"),
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            console.log(data);
          });
      };
      handleCreateLayer();
      const newLayer = { layerName: action.payload, layerImages: [] };

      state.layers.push(newLayer);
    },
  },
});

const generatorReducer = generatorSlice.reducer;

const store = configureStore({
  reducer: {
    user: generatorReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
