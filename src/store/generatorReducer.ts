import { createSlice } from "@reduxjs/toolkit";

interface GeneratorState {
  activeLayer: number;
  currentCollection: string;
  activeStep: number;
}

const initialState: GeneratorState = {
  activeLayer: 0,
  currentCollection: "",
  activeStep: 0,
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
    setActiveStep: (state, action) => {
      state.activeStep = action.payload;
    },
  },
});

export const { setActiveLayer, setCurrentCollection, setActiveStep } =
  generatorSlice.actions;

export default generatorSlice.reducer;
