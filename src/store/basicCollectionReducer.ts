import { setActiveStep } from "@/store/generatorReducer";
import { useAppDispatch } from "@/store/hooks";
import {
  AnyAction,
  Dispatch,
  PayloadAction,
  createSlice,
} from "@reduxjs/toolkit";
import axios from "axios";
import { CollectionType, LayerType } from "@/types/config.dto";

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
  } as CollectionType,
};

export const generativeCollectionSlice = createSlice({
  name: "generator",
  initialState,
  reducers: {
    setConfig: (state, action: PayloadAction<CollectionType>) => {
      state.config = action.payload;
    },
    handleSetImageIPFSUrl: (state, action: PayloadAction<string>) => {
      state.config.ipfsUrlImages = action.payload;
    },
    deleteGeneratedImageAction: (state, action: PayloadAction<string>) => {
      state.config.images = state.config.images?.filter(
        (item) => item !== action.payload
      );
    },
    handleSetMetadataIPFSUrl: (state, action: PayloadAction<string>) => {
      state.config.ipfsUrlMetadata = action.payload;
    },
    handleLoadMetadata: (state, action: PayloadAction<any>) => {
      state.config.metadata = action.payload;
    },

    handleUploadImages: (state, action: PayloadAction<any>) => {
      const { payload } = action;
      state.config.images = payload;
    },
  },
});

export const loadCollection = async (id: string, dispatch: any) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks

  const collectionDetails = await axios.get("/api/basic_collections/details", {
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
      .get("/api/basic_collections/deleteImage", {
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
  const ipfsUrl = await axios.get(
    "/api/basic_collections/uploadImagesToIPFSPinata",
    {
      params: {
        collectionId: collectionId,
        userId: userId,
      },
    }
  );
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
    "/api/basic_collections/uploadImagesToIPFSWeb3Storage",
    {
      params: {
        collectionId: collectionId,
        userId: userId,
      },
    }
  );

  dispatch(handleSetImageIPFSUrl(ipfsUrl.data.url));
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
  const metadata = await axios.get("/api/basic_collections/metadata", {
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
    "/api/basic_collections/uploadMetadataToIPFSPinata",
    {
      params: {
        collectionId: collectionId,
        userId: userId,
      },
    }
  );
  dispatch(handleSetMetadataIPFSUrl(ipfsUrl.data.url));
};

export const uploadMetadataToIPFSWeb3Storage = async ({
  collectionId,
  userId,
  dispatch,
}: UploadMetadataToIPFSProps) => {
  await loadMetadata({ collectionId, userId, dispatch });
  const ipfsUrl = await axios.get(
    "/api/basic_collections/uploadMetadataToIPFSWeb3Storage",
    {
      params: {
        collectionId: collectionId,
        userId: userId,
      },
    }
  );
  dispatch(handleSetMetadataIPFSUrl(ipfsUrl.data.url));
};

export const {
  setConfig,
  handleUploadImages,
  handleSetImageIPFSUrl,
  deleteGeneratedImageAction,
  handleLoadMetadata,
  handleSetMetadataIPFSUrl,
} = generativeCollectionSlice.actions;

const generativeCollectionReducer = generativeCollectionSlice.reducer;
export default generativeCollectionReducer;
