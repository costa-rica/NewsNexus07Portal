import styles from "../../styles/GetArticlesDetailed.module.css";
import TemplateView from "../common/TemplateView";
import Modal from "../common/Modal";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import TableRequests from "../common/Tables/TableRequests";
import { createColumnHelper } from "@tanstack/react-table";
import SummaryStatistics from "../common/SummaryStatistics";
import { useDispatch } from "react-redux";
import {
  updateArticlesSummaryStatistics,
  updateIncludeDomainsArray,
  updateExcludeDomainsArray,
} from "../../reducers/user";

import InputDropdownCheckbox from "../common/InputDropdownCheckbox";

export default function GetArticlesNewsApiDetailed() {
  const [keywordsArray, setKeywordsArray] = useState([]);
  const [filterKeyword, setFilterKeyword] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isOpenKeywordWarning, setIsOpenKeywordWarning] = useState(false);

  const [isOpenRequestResponse, setIsOpenRequestResponse] = useState(false);
  const [requestResponseMessage, setRequestResponseMessage] = useState("");
  const [newsApiRequestsArray, setNewsApiRequestsArray] = useState([]);
  const dispatch = useDispatch();
  const [keywordsAnd, setKeywordsAnd] = useState("");
  const [keywordsOr, setKeywordsOr] = useState("");
  const [keywordsNot, setKeywordsNot] = useState("");
  const [includeWebsiteDomainObjArray, setIncludeWebsiteDomainObjArray] =
    useState([]);
  const [excludeWebsiteDomainObjArray, setExcludeWebsiteDomainObjArray] =
    useState([]);

  const [newsOrgArray, setNewsOrgArray] = useState([]);
  const [newsOrg, setNewsOrg] = useState("NewsAPI");
  const [inputErrors, setInputErrors] = useState({
    startDate: false,
    endDate: false,
    newsOrg: false,
  });
  const userReducer = useSelector((state) => state.user);
  const todayDate = new Date().toISOString().split("T")[0];
  const minDate = new Date(Date.now() - 180 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  const filteredKeywords = keywordsArray.filter((keyword) =>
    keyword.toLowerCase().includes(filterKeyword.toLowerCase())
  );
  const exactMatch = keywordsArray.some(
    (keyword) => keyword.toLowerCase() === filterKeyword.toLowerCase()
  );

  const columnHelper = createColumnHelper();
  const columnsForRequestTable = [
    columnHelper.accessor("madeOn", { header: "Made On", enableSorting: true }),
    columnHelper.accessor("nameOfOrg", {
      header: "Org Name",
      enableSorting: true,
    }),
    columnHelper.accessor("keyword", {
      header: "Keyword",
      enableSorting: true,
    }),
    columnHelper.accessor("startDate", {
      header: "Start Date",
      enableSorting: true,
    }),
    columnHelper.accessor("endDate", {
      header: "End Date",
      enableSorting: true,
    }),
    columnHelper.accessor("count", {
      header: () => (
        <div className={styles.columnHeaderSmallNote}>
          Count
          <br />
          <span>(Returned)</span>
        </div>
      ),
      enableSorting: true,
      cell: ({ getValue }) => (
        <div
          style={{
            textAlign: "center",
          }}
        >
          {getValue()}
        </div>
      ),
    }),
    columnHelper.accessor("countSaved", {
      header: () => (
        <div className={styles.columnHeaderSmallNote}>
          Count
          <br />
          <span>(Saved)</span>
        </div>
      ),
      enableSorting: true,
      cell: ({ getValue }) => (
        <div
          style={{
            textAlign: "center",
          }}
        >
          {getValue()}
        </div>
      ),
    }),
    columnHelper.accessor("status", { header: "Status", enableSorting: true }),
    columnHelper.display({
      id: "copyRequest",
      header: "Copy Request",
      cell: ({ row }) => (
        <button onClick={() => handleCopyRequest(row.original)}>Copy</button>
      ),
    }),
  ];
  useEffect(() => {
    fetchKeywordsArray();
    requestNewsApiRequestsArray();
    fetchNewsOrgArray();
    fetchArticlesSummaryStatistics();
    fetchWebsiteDomains();
  }, []);
  useEffect(() => {
    if (!endDate) {
      const today = new Date().toISOString().split("T")[0];
      setEndDate(today);
    }
  }, []);
  const fetchKeywordsArray = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/keywords`,
        {
          headers: { Authorization: `Bearer ${userReducer.token}` },
        }
      );

      console.log(`Response status: ${response.status}`);

      if (!response.ok) {
        const errorText = await response.text(); // Log response text for debugging
        throw new Error(`Server Error: ${errorText}`);
      }

      const result = await response.json();
      console.log("Fetched Data:", result);

      if (result.keywordsArray && Array.isArray(result.keywordsArray)) {
        setKeywordsArray(result.keywordsArray);
      } else {
        setKeywordsArray([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
      setKeywordsArray([]);
    }
  };
  const handleRequestArticles = () => {
    // if filteredKeyword is not in keywordsArray, add it do not trigger
    console.log(`newsOrg: ${newsOrg}`);
    const errors = {
      startDate: !startDate,
      endDate: !endDate,
      newsOrg: !newsOrg || newsOrg === "",
    };
    setInputErrors(errors);

    requestNewsApi();
  };

  const requestNewsApi = async () => {
    try {
      const bodyObj = {
        newsOrg,
        startDate,
        endDate,
        keywordsAnd,
        keywordsOr,
        keywordsNot,
        includeWebsiteDomainObjArray: includeWebsiteDomainObjArray.filter(
          (domain) => domain.selected === true
        ),
        // excludeWebsiteDomainObjArray: excludeWebsiteDomainObjArray.filter(
        //   (domain) => domain.selected === true
        // ),
      };
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/news-api/detailed-news-api`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userReducer.token}`,
          },
          body: JSON.stringify(bodyObj),
        }
      );

      console.log(`Response status: ${response.status}`);
      let resJson = null;
      const contentType = response.headers.get("Content-Type");

      if (contentType?.includes("application/json")) {
        resJson = await response.json();
      }

      if (resJson) {
        console.log("Fetched Data:", resJson);
        if (response.status === 400) {
          setRequestResponseMessage(resJson.message);
          setIsOpenRequestResponse(true);
          return;
        } else {
          setFilterKeyword("");
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);

      const result = await response.json();
      console.log("Error Data:", result);
    }
  };
  const requestNewsApiRequestsArray = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/news-aggregators/requests`,
        {
          headers: { Authorization: `Bearer ${userReducer.token}` },
        }
      );

      console.log(`Response status: ${response.status}`);

      const result = await response.json();
      console.log("Fetched Data:", result);

      if (
        result.newsApiRequestsArray &&
        Array.isArray(result.newsApiRequestsArray)
      ) {
        setNewsApiRequestsArray(result.newsApiRequestsArray);
      } else {
        setNewsApiRequestsArray([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
      setNewsApiRequestsArray([]);
    }
  };
  const fetchNewsOrgArray = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/news-aggregators/news-org-apis`,
        {
          headers: { Authorization: `Bearer ${userReducer.token}` },
        }
      );

      console.log(`Response status: ${response.status}`);

      const result = await response.json();
      console.log("Fetched Data:", result);

      if (result.newsOrgArray && Array.isArray(result.newsOrgArray)) {
        setNewsOrgArray(result.newsOrgArray);
      } else {
        setNewsOrgArray([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
      setNewsOrgArray([]);
    }
  };

  const handleCopyRequest = (rowData) => {
    setNewsOrg(rowData.nameOfOrg);
    // setFilterKeyword(rowData.keyword);
    setStartDate(rowData.startDate);
    setEndDate(rowData.endDate);
    setKeywordsAnd(rowData.andArray);
    setKeywordsNot(rowData.notArray);
    setKeywordsOr(rowData.orArray);
    // setIncludeWebsiteDomainObjArray(rowData.includeDomains);
  };
  const fetchArticlesSummaryStatistics = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/articles/summary-statistics`,
        {
          headers: { Authorization: `Bearer ${userReducer.token}` },
        }
      );

      console.log(`Response status: ${response.status}`);

      if (!response.ok) {
        const errorText = await response.text(); // Log response text for debugging
        throw new Error(`Server Error: ${errorText}`);
      }

      const result = await response.json();
      console.log(
        "Fetched Data (articles/summary-statistics):",
        result.summaryStatistics
      );

      if (result.summaryStatistics) {
        console.log("-----> make summary statistics");
        dispatch(updateArticlesSummaryStatistics(result.summaryStatistics));
      }
    } catch (error) {
      console.error(
        "Error fetching articles summary statistics:",
        error.message
      );
    }
  };

  const fetchWebsiteDomains = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/website-domains`,
        {
          headers: { Authorization: `Bearer ${userReducer.token}` },
        }
      );

      console.log(`Response status: ${response.status}`);

      if (!response.ok) {
        const errorText = await response.text(); // Log response text for debugging
        throw new Error(`Server Error: ${errorText}`);
      }

      const result = await response.json();
      console.log("Fetched Data (website-domains):", result);

      if (result.websiteDomains) {
        // dispatch(updateIncludeDomainsArray(result.websiteDomains));
        let tempWebsiteDomainsArray = [];
        for (let i = 0; i < result.websiteDomains.length; i++) {
          tempWebsiteDomainsArray.push({
            id: i,
            websiteDomainId: result.websiteDomains[i].id,
            name: result.websiteDomains[i].name,
            selected: false,
          });
        }
        setIncludeWebsiteDomainObjArray(tempWebsiteDomainsArray);
      }
    } catch (error) {
      console.error("Error fetching website domains:", error.message);
    }
  };

  return (
    <TemplateView>
      <main className={styles.main}>
        <div className={styles.divMainTop}>
          {/* Some tables with counts will go here */}
          <SummaryStatistics />
        </div>

        <div className={styles.divMainMiddle}>
          <div className={styles.divRequestGroup}>
            <div className={styles.divRequestGroupTop}>
              <div className={styles.divRequestGroupInput}>
                <label htmlFor="newsOrg">News Organization</label>
                <input
                  // className={styles.inputRequestKeyword}
                  className={styles.inputRequestKeyword}
                  value={newsOrg}
                  // onChange={(e) => {
                  //   setNewsOrg(e.target.value);
                  // }}
                  disabled
                />
              </div>
              <div className={styles.divRequestGroupInput}>
                <label htmlFor="startDate">Start Date</label>
                <input
                  // className={styles.inputRequestStartDate}
                  className={`${styles.inputRequestStartDate} ${
                    inputErrors.startDate ? styles.inputError : ""
                  }`}
                  min={minDate}
                  max={todayDate}
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  type="date"
                />
              </div>
              <div className={styles.divRequestGroupInput}>
                <label htmlFor="endDate">End Date</label>
                <input
                  // className={styles.inputRequestEndDate}
                  className={`${styles.inputRequestEndDate} ${
                    inputErrors.endDate ? styles.inputError : ""
                  }`}
                  min={minDate}
                  max={todayDate}
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  type="date"
                />
              </div>
              <div className={styles.divRequestGroupInput}>
                <button
                  className={styles.btnSubmit}
                  onClick={() => {
                    handleRequestArticles();
                    // You can call your submit logic or dispatch here
                  }}
                >
                  Request Articles
                </button>
              </div>
            </div>
            {/* <div className */}

            <div className={styles.divRequestGroupInputWide}>
              <label htmlFor="keywordsAnd">Keywords AND</label>
              <input
                className={styles.inputRequestKeyword}
                type="text"
                placeholder={`enter word(s), use " " for exact phrase`}
                value={keywordsAnd}
                onChange={(e) => setKeywordsAnd(e.target.value)}
              />
              {keywordsAnd && (
                <button
                  className={styles.btnClearKeyword}
                  onClick={() => setKeywordsAnd("")}
                >
                  ×
                </button>
              )}
            </div>
            <div className={styles.divRequestGroupInputWide}>
              <label htmlFor="keywordsNot">Keywords NOT</label>
              <input
                className={styles.inputRequestKeyword}
                type="text"
                placeholder={`enter word(s), use " " for exact phrase`}
                value={keywordsNot}
                onChange={(e) => setKeywordsNot(e.target.value)}
              />
              {keywordsNot && (
                <button
                  className={styles.btnClearKeyword}
                  onClick={() => setKeywordsNot("")}
                >
                  ×
                </button>
              )}
            </div>
            <div className={styles.divRequestGroupInputWide}>
              <label htmlFor="keywordsOr">Keywords OR</label>
              <input
                className={styles.inputRequestKeyword}
                type="text"
                placeholder={`enter word(s), use " " for exact phrase`}
                value={keywordsOr}
                onChange={(e) => setKeywordsOr(e.target.value)}
              />
              {keywordsOr && (
                <button
                  className={styles.btnClearKeyword}
                  onClick={() => setKeywordsOr("")}
                >
                  ×
                </button>
              )}
            </div>
            <div className={styles.divRequestGroupInputDropdownCheckbox}>
              {/* Do you see me? */}
              {/* {userReducer.includeDomainsArray &&
                Array.from(userReducer.includeDomainsArray).map(
                  (domain, index) => <span key={index}>{domain.name}</span>
                )} */}
              <label htmlFor="includeDomains">Get Articles Only From: </label>
              <div style={{ width: "100%" }}>
                <InputDropdownCheckbox
                  inputObjectArray={includeWebsiteDomainObjArray}
                  setInputObjectArray={setIncludeWebsiteDomainObjArray}
                  displayName="name"
                  inputDefaultText="select sources ..."
                />
              </div>
            </div>
          </div>
        </div>

        <div className={styles.divMainBottom}>
          <div className={styles.divKeywordsGroup}>
            <div className={styles.divKeywordInputGroup}>
              <label htmlFor="keyword">Keyword</label>
              <input
                className={`${styles.inputRequestKeyword} ${
                  inputErrors.keyword ? styles.inputError : ""
                }`}
                type="text"
                placeholder="enter word"
                value={filterKeyword}
                onChange={(e) => setFilterKeyword(e.target.value)}
              />
              {filterKeyword && (
                <button
                  className={styles.btnClearKeyword}
                  onClick={() => setFilterKeyword("")}
                >
                  ×
                </button>
              )}
            </div>
            <div className={styles.divKeywordsTableSuper}>
              <div className={styles.divKeywordsTable}>
                <table className={styles.tableKeywords}>
                  {/* <thead>
                    <tr>
                      <th>Keywords</th>
                    </tr>
                  </thead> */}
                  <tbody>
                    {filteredKeywords.map((keyword, index) => (
                      <tr
                        key={index}
                        style={{ cursor: "pointer" }}
                        onClick={() => setFilterKeyword(keyword)}
                      >
                        <td>{keyword}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className={styles.divRequestTableGroup}>
            <TableRequests
              data={newsApiRequestsArray}
              columns={columnsForRequestTable}
              onCopyRequest={handleCopyRequest}
            />
          </div>
        </div>
        {isOpenKeywordWarning && (
          <Modal
            isModalOpenSetter={setIsOpenKeywordWarning}
            title="Must match keyword"
            content="If you're sure this keyword is correct, you can add it."
          />
        )}

        {isOpenRequestResponse && (
          <Modal
            isModalOpenSetter={setIsOpenRequestResponse}
            title="Problem with request"
            content={requestResponseMessage}
          />
        )}
      </main>
    </TemplateView>
  );
}
