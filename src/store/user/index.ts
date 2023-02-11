// import { createAction, createReducer, createSlice } from "@reduxjs/toolkit";
// import { v4 as uuidv4 } from "uuid";

// interface UserState {
//   userId: string | undefined;
// }

// const setUUID = () => {
//   const userId = uuidv4();
//   localStorage.setItem("userId", userId);
//   return userId;
// };

// const userSlice = createSlice({
//   name: "user",
//   initialState,
//   reducers: {
//     initializeUser(state, action) {
//       const localStorageUserId = localStorage.getItem("userId");
//       console.log(localStorageUserId);
//       if (!state.userId && !localStorageUserId) {
//         const userId = uuidv4();
//         state.userId = userId;
//         localStorage.setItem("userId", userId);
//       }

//       if (!state.userId && localStorageUserId) {
//         state.userId = localStorageUserId;
//       }
//     },
//   },
// });

// export const { initializeUser } = userSlice.actions;

// export default userSlice.reducer;
