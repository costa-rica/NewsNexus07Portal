import styles from "../../styles/AddArticle.module.css";
import { useEffect, useState } from "react";
import TemplateView from "../common/TemplateView";
// import StateSelector from "../common/StateSelector";
import InputDropdownCheckbox from "../common/InputDropdownCheckbox";
import Modal from "../common/Modal";
import { useSelector } from "react-redux";
import SummaryStatistics from "../common/SummaryStatistics";

export default function AddArticle() {
  const userReducer = useSelector((state) => state.user);
  const [article, setArticle] = useState({});
  const [stateArray, setStateArray] = useState(userReducer.stateArray);

  useEffect(() => {
    fetchArticlesSummaryStatistics();
  }, []);

  const handleAddAndSubmitArticle = async () => {
    const selectedStateObjs = stateArray.filter((st) => st.selected);

    // Validation first
    if (selectedStateObjs.length === 0) {
      alert("Please select at least one state");
      return;
    }

    // Construct updated article
    const updatedArticle = {
      ...article,
      stateObjArray: selectedStateObjs,
      isApproved: true,
      kmNotes: "added manually",
    };

    // Optional: Log for debug
    console.log("Updated article object:", updatedArticle);

    // Set state
    setArticle(updatedArticle);

    if (
      !updatedArticle.publicationName ||
      !updatedArticle.title ||
      !updatedArticle.publishedDate ||
      !updatedArticle.content
    ) {
      alert(
        "Please fill in all required fields: publication name, title, published date, content"
      );
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/articles/add-article`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userReducer.token}`,
          },
          body: JSON.stringify(updatedArticle),
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
          alert(resJson.message);
          return;
        } else {
          alert("Successfully added article");
          // setArticle({});
          const blankArticle = {
            publicationName: "",
            author: "",
            title: "",
            description: "",
            url: "",
            publishedDate: "",
            content: "",
            stateObjArray: [],
          };

          setArticle(blankArticle);

          // Deselect all states
          const clearedStateArray = stateArray.map((st) => ({
            ...st,
            selected: false,
          }));
          setStateArray(clearedStateArray);
        }
      }
    } catch (error) {
      console.error("Error adding article:", error.message);
    }
    fetchArticlesSummaryStatistics();
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
          <SummaryStatistics />
        </div>
        <h1 className={styles.title}> Add (and approve) Article </h1>

        <div className={styles.divMainMiddle}>
          <div className={styles.divArticleDetail}>
            <span className={styles.lblArticleDetailMain}>
              Publication Name:
            </span>
            <input
              type="text"
              value={article?.publicationName || ""}
              className={styles.inputArticleDetail}
              onChange={(e) =>
                setArticle({ ...article, publicationName: e.target.value })
              }
            />
          </div>

          <div className={styles.divArticleDetail}>
            <span className={styles.lblArticleDetailMain}>Title:</span>
            <input
              type="text"
              value={article?.title || ""}
              className={styles.inputArticleDetail}
              onChange={(e) =>
                setArticle({ ...article, title: e.target.value })
              }
            />
          </div>

          <div className={styles.divArticleDetail}>
            <span className={styles.lblArticleDetailMain}>URL:</span>
            <input
              type="text"
              value={article?.url || ""}
              className={styles.inputArticleDetail}
              onChange={(e) => setArticle({ ...article, url: e.target.value })}
            />
          </div>
          <div className={styles.divArticleDetail}>
            <span className={styles.lblArticleDetailMain}>Published Date:</span>
            <input
              type="date"
              value={article?.publishedDate || ""}
              className={styles.inputArticleDetail}
              onChange={(e) =>
                setArticle({ ...article, publishedDate: e.target.value })
              }
            />
          </div>
          <div className={styles.divArticleDetail}>
            <div className="tooltipWrapper">
              <span className={styles.lblArticleDetailMain}>
                Article State:
              </span>
              <span className="tooltipText">
                State(s) article is relevant to
              </span>
            </div>
            <div className={styles.divManageStates}>
              <InputDropdownCheckbox
                inputObjectArray={stateArray}
                setInputObjectArray={setStateArray}
                displayName="name"
                inputDefaultText="select states ..."
              />
            </div>
          </div>

          <div className={styles.divArticleDetailContent}>
            <span className={styles.lblArticleDetailMain}>Content:</span>

            <textarea
              value={article?.content || ""}
              className={styles.inputArticleDetailContent}
              onChange={(e) => {
                setArticle({
                  ...article,
                  content: e.target.value,
                });
              }}
            />
          </div>
          <div className={styles.divMainMiddleBottom}>
            <button
              className={styles.btnSubmit}
              onClick={() => {
                handleAddAndSubmitArticle();
              }}
            >
              Submit
            </button>
          </div>
        </div>

        <div className={styles.divBottom}></div>
      </main>
    </TemplateView>
  );
}
