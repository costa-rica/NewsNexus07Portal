import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: null,
  username: null,
  email: null,
  stateArray: [],
  articlesSummaryStatistics: {},
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginUser: (state, action) => {
      state.token = action.payload.token;
      state.username = action.payload.user.username || "some_name";
      state.email = action.payload.user.email || "some_name@mail.com";
    },
    updateStateArray: (state, action) => {
      state.stateArray = action.payload;
    },
    updateArticlesSummaryStatistics: (state, action) => {
      console.log("- dans Redux: updateArticlesSummaryStatistics 🔔");
      state.articlesSummaryStatistics = action.payload;
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

export const {
  loginUser,
  logoutUser,
  updateStateArray,
  updateArticlesSummaryStatistics,
} = userSlice.actions;
export default userSlice.reducer;
