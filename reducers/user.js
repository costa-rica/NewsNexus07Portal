import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // value: {
  token: null,
  username: null,
  email: null,
  // },
  stateArray: [],
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginUser: (state, action) => {
      // console.log(`- dans Redux: loginUser 🔔`);
      state.token = action.payload.token;
      state.username = action.payload.user.username || "some_name";
      state.email = action.payload.user.email || "some_name@mail.com";
      // console.log(`- finished loginUser 🏁`);
    },
    updateStateArray: (state, action) => {
      state.stateArray = action.payload;
    },
    logoutUser: (state) => {
      console.log(`- dans Redux: logoutUser 🔔🔔🔔🔔`);
      state.token = null;
      state.username = null;
      state.email = null;
      // console.log(`- finished logoutUser 🏁`);
    },
  },
});

export const { loginUser, logoutUser, updateStateArray } = userSlice.actions;
export default userSlice.reducer;
