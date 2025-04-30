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
    dateLimitOnRequestMade: null,
  },
  // NOTE: dateLimitOnRequestMade: date; includeIsFromAutomation: boolean
  articleTableBodyParams: {
    returnOnlyThisPublishedDateOrAfter: null,
    returnOnlyIsNotApproved: true,
    returnOnlyIsRelevant: true,
  },
  // NOTE: returnOnlyThisPublishedDateOrAfter, returnOnlyIsNotApproved, returnOnlyIsRelevant
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
    updateRequestTableBodyParams: (state, action) => {
      const newParams = { ...state.requestTableBodyParams, ...action.payload };
      state.requestTableBodyParams = newParams;
    },
    updateArticleTableBodyParams: (state, action) => {
      const newParams = { ...state.articleTableBodyParams, ...action.payload };
      state.articleTableBodyParams = newParams;
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
  updateRequestTableBodyParams,
  updateArticleTableBodyParams,
} = userSlice.actions;
export default userSlice.reducer;
