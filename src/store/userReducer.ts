import { createSlice } from "@reduxjs/toolkit";
import { UserType } from "@/types/user.dto";
import axios from "axios";

const initialState: UserType = {
  userId: "",
  pinataKey: "",
  web3StorageKey: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loadUser: (state, action) => {
      if (!action.payload) return;
      if (action.payload.userId) {
        state.userId = action.payload.userId;
      }
      if (action.payload.pinataKey) {
        state.pinataKey = action.payload.pinataKey;
      }
      if (action.payload.web3StorageKey) {
        state.web3StorageKey = action.payload.web3StorageKey;
      }
    },
  },
});

export const { loadUser } = userSlice.actions;

export const createUser = async (userId: string) => {
  const user = await axios.get("/api/user/create", {
    params: {
      userId: userId,
    },
  });
};

export const initUser = async (userId: any, dispatch: any) => {
  const user = await axios.get("/api/user", {
    params: {
      userId: userId,
    },
  });
  dispatch(loadUser(user.data));
};

export const updatePinataApiKey = async (
  userId: string,
  pinataKey: string,
  dispatch: any
) => {
  const user = await axios.get("/api/user/updatePinataKey", {
    params: {
      userId: userId,
      pinataKey: pinataKey,
    },
  });
  dispatch(loadUser(user.data));
};
export const updateWeb3StorageKey = async (
  userId: string,
  web3StorageKey: string,
  dispatch: any
) => {
  const user = await axios.get("/api/user/updateWeb3StorageKey", {
    params: {
      userId: userId,
      web3StorageKey: web3StorageKey,
    },
  });
  dispatch(loadUser(user.data));
};

export default userSlice.reducer;
