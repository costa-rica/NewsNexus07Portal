import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: null,
  username: null,
  email: null,
  isAdmin: false,
  stateArray: [],
  articlesSummaryStatistics: {},
  hideIrrelevant: false,
  navExpandObject: {
    GetArticles: false,
    ManageArticles: false,
    ManageDb: false,
    AdminGeneral: false,
    ReportsAnalysis: false,
  },
  requestTableBodyParams: {
    includeIsFromAutomation: false,
    dateLimitOnRequestMade: null,
  },
  // NOTE: dateLimitOnRequestMade: date; includeIsFromAutomation: boolean
  articleTableBodyParams: {
    returnOnlyThisPublishedDateOrAfter: null,
    returnOnlyThisCreatedAtDateOrAfter: null,
    returnOnlyIsNotApproved: true,
    returnOnlyIsRelevant: true,
  },
  // NOTE: returnOnlyThisPublishedDateOrAfter, returnOnlyThisCreatedAtDateOrAfter, returnOnlyIsNotApproved, returnOnlyIsRelevant
  approvedArticlesArray: [],
  requestsAnalysisTableBodyParams: {
    dateRequestsLimit: null,
  },
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
    toggleNavExpandItem: (state, action) => {
      const item = action.payload;
      state.navExpandObject[item] = !state.navExpandObject[item];
    },
    // toggleNavExpandGetArticles: (state) => {
    //   state.navExpandGetArticles = !state.navExpandGetArticles;
    // },
    // toggleNavExpandManageArticles: (state) => {
    //   state.navExpandManageArticles = !state.navExpandManageArticles;
    // },
    // toggleNavExpandDb: (state) => {
    //   state.navExpandDb = !state.navExpandDb;
    // },
    // toggleNavExpandAdminGeneral: (state) => {
    //   state.navExpandAdminGeneral = !state.navExpandAdminGeneral;
    // },
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
    logoutUserFully: (state) => {
      state.token = null;
      state.username = null;
      state.email = null;
      state.isAdmin = false;
      state.stateArray = [];
      state.articlesSummaryStatistics = {};
      state.hideIrrelevant = false;
      // state.navExpandGetArticles = false;
      // state.navExpandManageArticles = false;
      // state.navExpandDb = false;
      // state.navExpandAdminGeneral = false;
      state.requestTableBodyParams = {
        includeIsFromAutomation: false,
        dateLimitOnRequestMade: null,
      };
      // NOTE: dateLimitOnRequestMade: date; includeIsFromAutomation: boolean
      state.articleTableBodyParams = {
        returnOnlyThisPublishedDateOrAfter: null,
        returnOnlyThisCreatedAtDateOrAfter: null,
        returnOnlyIsNotApproved: true,
        returnOnlyIsRelevant: true,
      };
      // NOTE: returnOnlyThisPublishedDateOrAfter, returnOnlyThisCreatedAtDateOrAfter, returnOnlyIsNotApproved, returnOnlyIsRelevant
      state.approvedArticlesArray = [];
      state.navExpandObject = {
        GetArticles: false,
        ManageArticles: false,
        ManageDb: false,
        AdminGeneral: false,
        ReportsAnalysis: false,
      };
      console.log("-----> Finished Super Logout !!!");
    },
    updateRequestsAnalysisTableBodyParams: (state, action) => {
      const newParams = {
        ...state.requestsAnalysisTableBodyParams,
        ...action.payload,
      };
      state.requestsAnalysisTableBodyParams = newParams;
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
  // toggleNavExpandGetArticles,
  // toggleNavExpandManageArticles,
  // toggleNavExpandDb,
  // toggleNavExpandAdminGeneral,
  toggleNavExpandItem,
  updateRequestTableBodyParams,
  updateArticleTableBodyParams,
  updateApprovedArticlesArray,
  logoutUserFully,
  updateRequestsAnalysisTableBodyParams,
} = userSlice.actions;
export default userSlice.reducer;
