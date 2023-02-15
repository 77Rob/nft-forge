import { createSlice } from "@reduxjs/toolkit";
``;

interface GeneratorState {
  activeLayer: number;
  currentCollection: string;
}

const initialState: GeneratorState = {
  activeLayer: 0,
  currentCollection: "",
};

const generatorSlice = createSlice({
  name: "generator",
  initialState,
  reducers: {
    setActiveLayer: (state, action) => {
      state.activeLayer = action.payload;
    },
    setCurrentCollection: (state, action) => {
      state.currentCollection = action.payload;
    },
  },
});

export const { setActiveLayer, setCurrentCollection } = generatorSlice.actions;

export default generatorSlice.reducer;
