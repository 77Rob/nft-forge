import { setActiveStep } from "@/store/generatorReducer";
import { useAppDispatch } from "@/store/hooks";
import {
  AnyAction,
  Dispatch,
  PayloadAction,
  createSlice,
} from "@reduxjs/toolkit";
import axios from "axios";
import {
  CollectionType as GenerativeCollectionType,
  LayerType,
} from "@/types/config.dto";

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
    ipfsUrlImages: "",
    ipfsUrlMetadata: "",
    name: "",
    description: "",
    image: "",
    amount: 0,
    ticker: "",
    generatedImages: [],
    price: 0,
    width: 0,
    preview: [],
    height: 0,
    refetchId: 0,
  } as GenerativeCollectionType,
};

export const generativeCollectionSlice = createSlice({
  name: "generator",
  initialState,
  reducers: {
    setConfig: (state, action: PayloadAction<GenerativeCollectionType>) => {
      state.config = action.payload;
    },
    handleCreateNewLayer: (state, action: PayloadAction<LayerType>) => {
      state.config.layers.push(action.payload);
    },
    updatePreview: (state) => {
      state.config.preview = state.config.preview?.reverse();

      handleUpdateOrder(state.config.name, state.config.layers);
    },
    handleSetImageIPFSUrl: (state, action: PayloadAction<string>) => {
      state.config.ipfsUrlImages = action.payload;
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
    deleteGeneratedImageAction: (state, action: PayloadAction<string>) => {
      state.config.generated = state.config.generated?.filter(
        (item) => item !== action.payload
      );
    },
    handleSetMetadataIPFSUrl: (state, action: PayloadAction<string>) => {
      state.config.ipfsUrlMetadata = action.payload;
    },
    handleLoadMetadata: (state, action: PayloadAction<any>) => {
      state.config.metadata = action.payload;
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
    handleGenerateImages: (state, action: PayloadAction<any>) => {
      const { payload } = action;
      state.config.generated = payload;
    },
  },
});

export const loadCollection = async (id: string, dispatch: any) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks

  const collectionDetails = await axios.get("/api/collections/details", {
    params: {
      collectionId: id,
      userId: localStorage.getItem("userId"),
    },
  });

  dispatch(setConfig(collectionDetails.data.config));
};

export const deleteGeneratedImage = (image: any, dispatch: any) => {
  return async () => {
    await axios
      .get("/api/collections/deleteImage", {
        params: {
          imagePath: image,
        },
      })
      .then(() => {
        dispatch(deleteGeneratedImageAction(image));
      });
  };
};

export const uploadImagesToIPFSPinata = async ({
  collectionId,
  userId,
  dispatch,
}: UploadImagesToIPFSWeb3StorageProps) => {
  const ipfsUrl = await axios.get("/api/collections/uploadImagesToIPFSPinata", {
    params: {
      collectionId: collectionId,
      userId: userId,
    },
  });
  dispatch(handleSetImageIPFSUrl(ipfsUrl.data));
};

interface UploadImagesToIPFSWeb3StorageProps {
  collectionId: string;
  userId: string;
  dispatch: Dispatch<AnyAction>;
}

export const uploadImagesToIPFSWeb3Storage = async ({
  collectionId,
  userId,
  dispatch,
}: UploadImagesToIPFSWeb3StorageProps) => {
  const ipfsUrl = await axios.get(
    "/api/collections/uploadImagesToIPFSWeb3Storage",
    {
      params: {
        collectionId: collectionId,
        userId: userId,
      },
    }
  );

  dispatch(handleSetImageIPFSUrl(ipfsUrl.data));
};

export const generateImages = async (
  collection: GenerativeCollectionType,
  dispatch: any
) => {
  const generated = await axios.get("/api/collections/generate", {
    params: {
      userId: localStorage.getItem("userId"),
      collectionId: collection.name,
    },
  });
  dispatch(setActiveStep(1));
  dispatch(handleGenerateImages(generated.data));
};

interface LoadMetadataProps {
  collectionId: string;
  userId: string;
  dispatch: Dispatch<AnyAction>;
}

export const loadMetadata = async ({
  collectionId,
  userId,
  dispatch,
}: LoadMetadataProps) => {
  const metadata = await axios.get("/api/collections/metadata", {
    params: {
      userId: userId,
      collectionId: collectionId,
    },
  });
  dispatch(handleLoadMetadata(metadata.data));
};

interface UploadMetadataToIPFSProps {
  collectionId: string;
  userId: string;
  dispatch: Dispatch<AnyAction>;
}

export const uploadMetadataToIPFSPinata = async ({
  collectionId,
  userId,
  dispatch,
}: UploadMetadataToIPFSProps) => {
  const ipfsUrl = await axios.get(
    "/api/collections/uploadMetadataToIPFSPinata",
    {
      params: {
        collectionId: collectionId,
        userId: userId,
      },
    }
  );
  dispatch(handleSetMetadataIPFSUrl(ipfsUrl.data));
};

export const uploadMetadataToIPFSWeb3Storage = async ({
  collectionId,
  userId,
  dispatch,
}: UploadMetadataToIPFSProps) => {
  await loadMetadata({ collectionId, userId, dispatch });
  const ipfsUrl = await axios.get(
    "/api/collections/uploadMetadataToIPFSWeb3Storage",
    {
      params: {
        collectionId: collectionId,
        userId: userId,
      },
    }
  );
  dispatch(handleSetMetadataIPFSUrl(ipfsUrl.data));
};

export const {
  setConfig,
  updatePreview,
  handleLayerDown,
  handleLayerUp,
  handleSetImageIPFSUrl,
  deleteGeneratedImageAction,
  handleGenerateImages,
  handleCreateNewLayer,
  handleLoadMetadata,
  handleSetMetadataIPFSUrl,
} = generativeCollectionSlice.actions;

const generativeCollectionReducer = generativeCollectionSlice.reducer;
export default generativeCollectionReducer;
