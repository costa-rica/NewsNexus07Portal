import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: null,
  username: null,
  email: null,
  isAdmin: false,
  stateArray: [],
  articlesSummaryStatistics: {},
  hideIrrelevant: false,
  navExpandGetArticles: false,
  navExpandManageArticles: false,
  navExpandDb: false,
  requestTableBodyParams: {
    includeIsFromAutomation: false,
    dateLimitOnRequestMade: new Date().toISOString().split("T")[0],
  },
  // NOTE: dateLimitOnRequestMade: date; includeIsFromAutomation: boolean
  articleTableBodyParams: {},
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginUser: (state, action) => {
      state.token = action.payload.token;
      state.username = action.payload.user.username || "some_name";
      state.email = action.payload.user.email || "some_name@mail.com";
      state.isAdmin = action.payload.user.isAdmin || false;
    },
    updateStateArray: (state, action) => {
      state.stateArray = action.payload;
    },
    updateArticlesSummaryStatistics: (state, action) => {
      state.articlesSummaryStatistics = action.payload;
    },
    logoutUser: (state) => {
      state.token = null;
      state.username = null;
      state.email = null;
    },
    toggleHideIrrelevant: (state) => {
      state.hideIrrelevant = !state.hideIrrelevant;
    },
    toggleNavExpandGetArticles: (state) => {
      state.navExpandGetArticles = !state.navExpandGetArticles;
    },
    toggleNavExpandManageArticles: (state) => {
      state.navExpandManageArticles = !state.navExpandManageArticles;
    },
    toggleNavExpandDb: (state) => {
      state.navExpandDb = !state.navExpandDb;
    },
    defaultRequestTableBodyParams: (state) => {
      const defaultDay = new Date();
      defaultDay.setDate(defaultDay.getDate() - 2);
      state.requestTableBodyParams = {
        includeIsFromAutomation: false,
        dateLimitOnRequestMade: defaultDay.toISOString().split("T")[0],
      };
    },
    updateRequestTableBodyParams: (state, action) => {
      const newParams = { ...state.requestTableBodyParams, ...action.payload };
      state.requestTableBodyParams = newParams;
    },
  },
});

export const {
  loginUser,
  logoutUser,
  updateStateArray,
  updateArticlesSummaryStatistics,
  toggleHideIrrelevant,
  toggleNavExpandGetArticles,
  toggleNavExpandManageArticles,
  toggleNavExpandDb,
  defaultRequestTableBodyParams,
  updateRequestTableBodyParams,
} = userSlice.actions;
export default userSlice.reducer;
