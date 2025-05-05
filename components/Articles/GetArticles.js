import styles from "../../styles/articles/GetArticles.module.css";
import TemplateView from "../common/TemplateView";
import Modal from "../common/Modal";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import TableRequests from "../common/Tables/TableRequests";
import { createColumnHelper } from "@tanstack/react-table";
import SummaryStatistics from "../common/SummaryStatistics";
import { useDispatch } from "react-redux";
import { updateArticlesSummaryStatistics } from "../../reducers/user";

export default function GetArticles() {
  const [keywordsArray, setKeywordsArray] = useState([]);
  const [filterKeyword, setFilterKeyword] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isOpenKeywordWarning, setIsOpenKeywordWarning] = useState(false);
  const [isOpenRequestWarning, setIsOpenRequestWarning] = useState(false);
  const [isOpenRequestResponse, setIsOpenRequestResponse] = useState(false);
  const [requestResponseMessage, setRequestResponseMessage] = useState("");
  const [newsApiRequestsArray, setNewsApiRequestsArray] = useState([]);
  // const [maxResults, setMaxResults] = useState(10);
  const [newsOrgArray, setNewsOrgArray] = useState([]);
  const [newsOrg, setNewsOrg] = useState("");
  const [inputErrors, setInputErrors] = useState({
    keyword: false,
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
        <div className={styles.columnCopyBtn}>
          <button onClick={() => handleCopyRequest(row.original)}>Copy</button>
        </div>
      ),
    }),
  ];
  useEffect(() => {
    fetchKeywordsArray();
    requestNewsApiRequestsArray();
    fetchNewsOrgArray();
    fetchArticlesSummaryStatistics();
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
      keyword: !filterKeyword,
      startDate: !startDate,
      endDate: !endDate,
      newsOrg: !newsOrg || newsOrg === "",
    };
    setInputErrors(errors);

    // This is need for the input errors (keyword, max, start/end dates) to be displayed
    if (Object.values(errors).some((e) => e)) {
      setIsOpenRequestWarning(true);
      return;
    }

    // if (!exactMatch) {
    //   console.log("Keyword not found:", filterKeyword);
    //   setIsOpenKeywordWarning(true);
    // } else {
    if (newsOrg === "GNews") {
      requestGNewsApi();
    } else if (newsOrg === "NewsAPI") {
      requestNewsApi();
    }
    // }
  };
  const requestGNewsApi = async () => {
    if (!startDate || !endDate || !filterKeyword || !newsOrg) {
      // console.log("Missing required fields");
      setIsOpenRequestWarning(true);
      return;
    }

    try {
      const bodyObj = {
        newsOrg,
        startDate,
        endDate,
        keywordString: filterKeyword,
      };
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/gnews/request`,
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
      const result = await response.json();
      console.log("Fetched Data:", result);
      setFilterKeyword("");
    } catch (error) {
      console.error("Error fetching data:", error.message);
      const result = await response.json();
      console.log("Error Data:", result);
      // setKeywordsArray([]);
    }
  };
  const requestNewsApi = async () => {
    if (!startDate || !endDate || !filterKeyword || !newsOrg) {
      // console.log("Missing required fields");
      setIsOpenRequestWarning(true);
      return;
    }

    try {
      const bodyObj = {
        newsOrg,
        startDate,
        endDate,
        keywordString: filterKeyword,
      };
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/news-api/request`,
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
          headers: {
            Authorization: `Bearer ${userReducer.token}`,
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify(userReducer.requestTableBodyParams),
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
    setFilterKeyword(rowData.keyword);
    setStartDate(rowData.startDate);
    setEndDate(rowData.endDate);
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

  return (
    <TemplateView>
      <main className={styles.main}>
        <div className={styles.divMainTop}>
          {/* Some tables with counts will go here */}
          <SummaryStatistics />
        </div>

        <div className={styles.divMainMiddle}>
          <div className={styles.divRequestGroup}>
            <div className={styles.divRequestGroupInput}>
              <label htmlFor="newsOrg">News Organization</label>
              <select
                // className={styles.inputRequestKeyword}
                className={`${styles.inputRequestKeyword} ${
                  inputErrors.newsOrg ? styles.inputError : ""
                }`}
                value={newsOrg}
                onChange={(e) => {
                  setNewsOrg(e.target.value);
                }}
              >
                <option value="">Select API</option>
                {newsOrgArray.map((org, index) => (
                  <option key={index} value={org.nameOfOrg}>
                    {org.nameOfOrg}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.divRequestGroupInputWide}>
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
            {/* <div className={styles.divRequestGroupInputSmall}>
              <label htmlFor="maxResults">Max Results</label>
              <input
                // className={styles.inputRequestKeyword}
                className={`${styles.inputRequestKeyword} ${
                  inputErrors.maxResults ? styles.inputError : ""
                }`}
                type="number"
                min="1"
                placeholder="enter word"
                value={maxResults}
                // onChange={(e) => setMaxResults(e.target.value)}
                disabled
              />
            </div> */}
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
        </div>

        <div className={styles.divMainBottom}>
          <div className={styles.divKeywordsGroup}>
            <div className={styles.divKeywordInputGroup}>
              {filterKeyword && !exactMatch && (
                <button
                  onClick={() => {
                    // placeholder for add keyword functionality
                    console.log("Add keyword:", filterKeyword);
                  }}
                >
                  Add Keyword
                </button>
              )}
            </div>
            <div className={styles.divKeywordsTableSuper}>
              <div className={styles.divKeywordsTable}>
                <table className={styles.tableKeywords}>
                  <thead>
                    <tr>
                      <th>Keywords</th>
                    </tr>
                  </thead>
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
        {isOpenRequestWarning && (
          <Modal
            isModalOpenSetter={setIsOpenRequestWarning}
            title="Must fill all fields"
            content="Please fill all fields to make a request."
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
