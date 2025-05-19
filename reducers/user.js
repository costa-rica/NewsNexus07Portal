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
  navExpandAdminGeneral: false,
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
  approvedArticlesArray: [],
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
      state.hideIrrelevant = !state.hideIrrelevant; // toggle for Review Articles

      // update articleTableBodyParams
      if (state.hideIrrelevant) {
        const newParams = {
          ...state.articleTableBodyParams,
          returnOnlyIsRelevant: true,
        };
        state.articleTableBodyParams = newParams;
      } else {
        const newParams = {
          ...state.articleTableBodyParams,
          returnOnlyIsRelevant: false,
        };
        state.articleTableBodyParams = newParams;
      }
    },
    toggleHideApproved: (state) => {
      state.hideApproved = !state.hideApproved;

      // update articleTableBodyParams
      if (state.hideApproved) {
        const newParams = {
          ...state.articleTableBodyParams,
          returnOnlyIsNotApproved: true,
        };
        state.articleTableBodyParams = newParams;
      } else {
        const newParams = {
          ...state.articleTableBodyParams,
          returnOnlyIsNotApproved: false,
        };
        state.articleTableBodyParams = newParams;
      }
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
    toggleNavExpandAdminGeneral: (state) => {
      state.navExpandAdminGeneral = !state.navExpandAdminGeneral;
    },
    updateRequestTableBodyParams: (state, action) => {
      const newParams = { ...state.requestTableBodyParams, ...action.payload };
      state.requestTableBodyParams = newParams;
    },
    updateArticleTableBodyParams: (state, action) => {
      const newParams = { ...state.articleTableBodyParams, ...action.payload };
      state.articleTableBodyParams = newParams;
    },
    updateApprovedArticlesArray: (state, action) => {
      state.approvedArticlesArray = action.payload;
    },
  },
});

export const {
  loginUser,
  logoutUser,
  updateStateArray,
  updateArticlesSummaryStatistics,
  toggleHideIrrelevant,
  toggleHideApproved,
  toggleNavExpandGetArticles,
  toggleNavExpandManageArticles,
  toggleNavExpandDb,
  toggleNavExpandAdminGeneral,
  updateRequestTableBodyParams,
  updateArticleTableBodyParams,
  updateApprovedArticlesArray,
} = userSlice.actions;
export default userSlice.reducer;
