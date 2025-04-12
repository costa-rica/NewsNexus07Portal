import styles from "../styles/GetArticles.module.css";
import TemplateView from "./common/TemplateView";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRectangleXmark } from "@fortawesome/free-solid-svg-icons";
import Modal from "./common/Modal";

export default function GNewsRequest() {
  const [keywordsArray, setKeywordsArray] = useState([]);
  const [filterKeyword, setFilterKeyword] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isModalOpen, isModalOpenSetter] = useState(false);
  const userReducer = useSelector((state) => state.user.value);

  const todayDate = new Date().toISOString().split("T")[0];
  const minDate = new Date(Date.now() - 180 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  useEffect(() => {
    fetchKeywordsArray();
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

    // else trigger console.log
    if (!exactMatch) {
      console.log("Keyword not found:", filterKeyword);
      isModalOpenSetter(true);
    } else {
      console.log("Request articles:", filterKeyword);
      console.log("Start Date:", startDate);
      console.log("End Date:", endDate);
      requestGNewsApi();
    }
  };

  const requestGNewsApi = async () => {
    try {
      const bodyObj = { startDate, endDate, keywordString: filterKeyword };
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

      // if (!response.ok) {
      //   const errorText = await response.text(); // Log response text for debugging
      //   throw new Error(`Server Error: ${errorText}`);
      // }

      const result = await response.json();
      console.log("Fetched Data:", result);

      // if (result.keywordsArray && Array.isArray(result.keywordsArray)) {
      //   setKeywordsArray(result.keywordsArray);
      // } else {
      //   setKeywordsArray([]);
      // }
      setFilterKeyword("");
    } catch (error) {
      console.error("Error fetching data:", error.message);
      const result = await response.json();
      console.log("Error Data:", result);
      // setKeywordsArray([]);
    }
  };
  const filteredKeywords = keywordsArray.filter((keyword) =>
    keyword.toLowerCase().includes(filterKeyword.toLowerCase())
  );
  const exactMatch = keywordsArray.some(
    (keyword) => keyword.toLowerCase() === filterKeyword.toLowerCase()
  );

  return (
    <TemplateView>
      <main className={styles.main}>
        <div className={styles.divMainTop}>
          Some tables with counts will go here
        </div>

        <div className={styles.divMainMiddle}>
          <div className={styles.divRequestGroup}>
            <div className={styles.divRequestGroupInput}>
              <label htmlFor="keyword">Keyword</label>
              <input
                className={styles.inputRequestKeyword}
                type="keyword"
                placeholder="enter word"
                value={filterKeyword}
                onChange={(e) => setFilterKeyword(e.target.value)}
              />
            </div>
            <div className={styles.divRequestGroupInput}>
              <label htmlFor="startDate">Start Date</label>
              <input
                className={styles.inputRequestStartDate}
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
                className={styles.inputRequestEndDate}
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
              {/* <table style={{ width: "100%", backgroundColor: "white" }}> */}
              <table style={{ backgroundColor: "white" }}>
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
            <table style={{ backgroundColor: "white" }}>
              <thead>
                <tr>
                  <th>Made On</th>
                  <th>Org Name</th>
                  <th>Keyword</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Count</th>
                  <th>Make similar request</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {/* make an array for request table */}
                {Array.from({ length: 10 }).map((_, index) => (
                  <tr key={index}>
                    <td>Request {index + 1}</td>
                    <td>Org {index + 1}</td>
                    <td>Keyword {index + 1}</td>
                    <td>Start Date {index + 1}</td>
                    <td>End Date {index + 1}</td>
                    <td>Count {index + 1}</td>
                    <td>Make similar request {index + 1}</td>
                    <td>Status {index + 1}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {isModalOpen && (
          <Modal
            isModalOpenSetter={isModalOpenSetter}
            title="Must match keyword"
            content="If you're sure this keyword is correct, you can add it."
          />
        )}
      </main>
    </TemplateView>
  );
}
