import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: {
    token: null,
    username: null,
    email: null,
  },
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginUser: (state, action) => {
      console.log(`- dans Redux: loginUser 🔔`);
      state.value.token = action.payload.token;
      state.value.username = action.payload.user.username || "some_name";
      state.value.email = action.payload.user.email || "some_name@mail.com";
      console.log(`- finished loginUser 🏁`);
    },

    logoutUser: (state) => {
      console.log(`- dans Redux: logoutUser 🔔`);
      state.value.token = null;
      state.value.username = null;
      state.value.email = null;
      console.log(`- finished logoutUser 🏁`);
    },
  },
});

export const { loginUser, logoutUser } = userSlice.actions;
export default userSlice.reducer;
