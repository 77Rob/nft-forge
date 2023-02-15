import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export interface Image {
  url: string;
  name: string;
  path: string;
}

export interface LayerType {
  name: string;
  rarity: number;
  id: number;
  images: Image[];
}
export interface Config {
  layers: LayerType[];
  ipfsHash?: string;
  ipfsUrl?: string;
  name: string;
  description?: string;
  image?: string;
  amount?: number;
  width?: number;
  preview?: any[];
  height: number;
  refetchId?: number;
}

const handleUpdateOrder = async (collectionId: string, order: LayerType[]) => {
  const params = {
    collectionId: collectionId,
    userId: localStorage.getItem("userId"),
    order: order,
  };

  await axios.get("/api/collections/updateOrder", {
    params: params,
  });
};

const initialState = {
  config: {
    layers: [],
    ipfsHash: "",
    ipfsUrl: "",
    name: "",
    description: "",
    image: "",
    amount: 0,
    width: 0,
    preview: [],
    height: 0,
    refetchId: 0,
  } as Config,
};

export const configSlice = createSlice({
  name: "generator",
  initialState,
  reducers: {
    setConfig: (state, action: PayloadAction<Config>) => {
      state.config = action.payload;
    },
    updatePreview: (state) => {
      state.config.preview = state.config.preview?.reverse();

      handleUpdateOrder(state.config.name, state.config.layers);
    },
    handleLayerDown: (state, action: PayloadAction<number>) => {
      const { payload } = action;

      const newLayers = state.config.layers;
      const temp = newLayers[payload];
      newLayers[payload] = newLayers[payload + 1];
      newLayers[payload + 1] = temp;
      state.config.layers = newLayers;

      handleUpdateOrder(state.config.name, state.config.layers);
    },

    handleLayerUp: (state, action: PayloadAction<number>) => {
      const { payload } = action;
      const newLayers = state.config.layers;
      const temp = newLayers[payload];
      newLayers[payload] = newLayers[payload - 1];
      newLayers[payload - 1] = temp;
      state.config.layers = newLayers;

      handleUpdateOrder(state.config.name, state.config.layers);
    },
  },
});

export const configReducer = configSlice.reducer;
