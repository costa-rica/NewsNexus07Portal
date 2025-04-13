import styles from "../styles/GetArticles.module.css";
import TemplateView from "./common/TemplateView";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Modal from "./common/Modal";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  getPaginationRowModel,
} from "@tanstack/react-table";

export default function NewsOrgApiRequests() {
  const [keywordsArray, setKeywordsArray] = useState([]);
  const [filterKeyword, setFilterKeyword] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isOpenKeywordWarning, setIsOpenKeywordWarning] = useState(false);
  const [isOpenRequestWarning, setIsOpenRequestWarning] = useState(false);
  const [isOpenRequestResponse, setIsOpenRequestResponse] = useState(false);
  const [requestResponseMessage, setRequestResponseMessage] = useState("");
  const [newsApiRequestsArray, setNewsApiRequestsArray] = useState([]);
  const [maxResults, setMaxResults] = useState(10);
  // const [pageIndex, setPageIndex] = useState(0);
  // const [pageSize, setPageSize] = useState(10);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [newsOrgArray, setNewsOrgArray] = useState([]);
  const [newsOrg, setNewsOrg] = useState("");
  const [inputErrors, setInputErrors] = useState({
    keyword: false,
    startDate: false,
    endDate: false,
    maxResults: false,
    newsOrg: false,
  });
  const userReducer = useSelector((state) => state.user.value);
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
  const columns = [
    columnHelper.accessor("madeOn", { header: "Made On" }),
    columnHelper.accessor("nameOfOrg", { header: "Org Name" }),
    columnHelper.accessor("keyword", { header: "Keyword" }),
    columnHelper.accessor("startDate", { header: "Start Date" }),
    columnHelper.accessor("endDate", { header: "End Date" }),
    columnHelper.accessor("count", { header: "Count" }),
    columnHelper.accessor("status", { header: "Status" }),
  ];

  useEffect(() => {
    fetchKeywordsArray();
    requestNewsApiRequestsArray();
    fetchNewsOrgArray();
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
      maxResults: !maxResults || Number(maxResults) <= 0,
      newsOrg: !newsOrg || newsOrg === "",
    };
    setInputErrors(errors);

    // This is need for the input errors (keyword, max, start/end dates) to be displayed
    if (Object.values(errors).some((e) => e)) {
      setIsOpenRequestWarning(true);
      return;
    }

    if (!exactMatch) {
      console.log("Keyword not found:", filterKeyword);
      setIsOpenKeywordWarning(true);
    } else {
      if (newsOrg === "GNews") {
        requestGNewsApi();
      } else if (newsOrg === "NewsAPI") {
        requestNewsApi();
      }
    }
  };
  const requestGNewsApi = async () => {
    if (!startDate || !endDate || !filterKeyword || !maxResults || !newsOrg) {
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
        max: maxResults,
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
    if (!startDate || !endDate || !filterKeyword || !maxResults || !newsOrg) {
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
        max: maxResults,
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

  // const setPagination = ({ pageIndex, pageSize }) => {
  //   if (pageIndex !== undefined) setPageIndex(pageIndex);
  //   if (pageSize !== undefined) setPageSize(pageSize);
  // };
  const tableRequests = useReactTable({
    data: newsApiRequestsArray,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
  });
  // const tableRequests = useReactTable({
  //   data: newsApiRequestsArray,
  //   columns,
  //   getCoreRowModel: getCoreRowModel(),
  //   getPaginationRowModel: getPaginationRowModel(),
  //   initialState: {
  //     pagination: {
  //       pageSize: pageSize,
  //     },
  //   },
  // });

  return (
    <TemplateView>
      <main className={styles.main}>
        <div className={styles.divMainTop}>
          Some tables with counts will go here
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
                onChange={(e) => setNewsOrg(e.target.value)}
              >
                <option value="">Select API</option>
                {newsOrgArray.map((org, index) => (
                  <option key={index} value={org.nameOfOrg}>
                    {org.nameOfOrg}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.divRequestGroupInput}>
              <label htmlFor="keyword">Keyword</label>
              <input
                // className={styles.inputRequestKeyword}
                className={`${styles.inputRequestKeyword} ${
                  inputErrors.keyword ? styles.inputError : ""
                }`}
                type="text"
                placeholder="enter word"
                value={filterKeyword}
                onChange={(e) => setFilterKeyword(e.target.value)}
              />
            </div>
            <div className={styles.divRequestGroupInputSmall}>
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
                onChange={(e) => setMaxResults(e.target.value)}
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
          <div className={styles.divRequestTableGroup}>
            <div className={styles.divRequestTableDisplayRows}>
              <div>
                Show rows:{" "}
                {[5, 10, 20].map((size) => (
                  <button
                    key={size}
                    onClick={() =>
                      setPagination((prev) => ({
                        ...prev,
                        pageSize: size,
                        pageIndex: 0, // reset to first page
                      }))
                    }
                  >
                    {size}
                  </button>
                ))}
              </div>
              <div>
                <button
                  onClick={() => tableRequests.previousPage()}
                  disabled={!tableRequests.getCanPreviousPage()}
                >
                  {"<"} Prev
                </button>
                <span>
                  Page {tableRequests.getState().pagination.pageIndex + 1} of{" "}
                  {tableRequests.getPageCount()}
                </span>
                <button
                  onClick={() => {
                    tableRequests.nextPage();
                    console.log("clicked next page");
                  }}
                  disabled={!tableRequests.getCanNextPage()}
                >
                  Next {">"}
                </button>
              </div>
            </div>
            <table className={styles.tableRequest}>
              <thead>
                {tableRequests.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th key={header.id}>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </th>
                    ))}
                    <th>Make similar request</th>
                  </tr>
                ))}
              </thead>
              <tbody>
                {tableRequests.getPaginationRowModel().rows.map((row) => (
                  <tr key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                    <td>Button</td>
                  </tr>
                ))}
              </tbody>
            </table>
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
