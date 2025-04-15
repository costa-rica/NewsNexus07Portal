import styles from "../../styles/ReviewArticles.module.css";
import TemplateView from "../common/TemplateView";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import TableRequests from "../common/TableRequests";
import { createColumnHelper } from "@tanstack/react-table";
import StateSelector from "../common/StateSelector";
import ModalApproveArticle from "../common/ModalApproveArticle";
import Modal from "../common/Modal";
export default function ReviewArticles() {
  const userReducer = useSelector((state) => state.user);
  const [articlesArray, setArticlesArray] = useState([]);
  const [stateArray, setStateArray] = useState(userReducer.stateArray);
  // const [isOpenApproveModal, setIsOpenApproveModal] = useState(false);
  const [isOpenModalInfo, setIsOpenModalInfo] = useState(false);
  const [infoModalContent, setInfoModalContent] = useState("");
  const [isOpenStateWarning, setIsOpenStateWarning] = useState(false);
  const [hideIrrelevant, setHideIrrelevant] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);

  useEffect(() => {
    fetchArticlesArray();
    // fetchStateArray();
  }, []);
  const fetchArticlesArray = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/articles`,
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

      if (result.articlesArray && Array.isArray(result.articlesArray)) {
        setArticlesArray(result.articlesArray);
        setSelectedArticle(result.articlesArray[0]);
        updateStateArrayWithArticleState(result.articlesArray[0]);
      } else {
        setArticlesArray([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
      setArticlesArray([]);
    }
  };

  // const handleRowClick = async (article) => {
  const handleSelectArticleFromTable = async (article) => {
    console.log("Selected article:", article);

    // STEP 1: Call API to see if an approved record for this article exists
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/articles/get-approved/${article.id}`,
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
      console.log("Fetched Data (/articles/get-approved):", result);

      if (result.article && result.article.id) {
        setSelectedArticle({
          ...result.article,
          ...article,
          approved: result.result,
          content: result.content,
        });
        updateStateArrayWithArticleState(result.article);
      } else {
        setSelectedArticle({ ...article, content: article.description });
      }
      // else {
      //   console.log("----- blanking out the aritlces list");
      //   setArticlesArray([]);
      // }
    } catch (error) {
      console.error("Error fetching data:", error.message);
      // setArticlesArray([]);
    }

    // // STEP 2
    // setSelectedArticle(article);
    // updateStateArrayWithArticleState(article);
  };

  const handleClickIsRelevant = async (articleId) => {
    console.log("Clicked is relevant for article:", articleId);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/articles/user-toggle-is-not-relevant/${articleId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userReducer.token}`,
          },
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
          let updatedArticle = articlesArray.find(
            (article) => article.id === articleId
          );
          updatedArticle.isRelevant = !updatedArticle.isRelevant;
          setArticlesArray(
            articlesArray.map((article) =>
              article.id === articleId ? updatedArticle : article
            )
          );
          // setSelectedArticle(updatedArticle);
          if (selectedArticle.id === articleId) {
            setSelectedArticle(updatedArticle);
          }
        }
      }
    } catch (error) {
      console.error("Error validating states:", error.message);
    }
  };

  const updateStateArrayWithArticleState = (article) => {
    console.log(article.States);
    const articleStateIds = article.States.map((state) => state.id);
    const tempStatesArray = stateArray.map((stateObj) => {
      if (articleStateIds.includes(stateObj.id)) {
        return { ...stateObj, selected: true };
      } else {
        return { ...stateObj, selected: false };
      }
    });
    setStateArray(tempStatesArray);
  };

  const columnHelper = createColumnHelper();
  const columnsForArticlesTable = [
    columnHelper.accessor("id", {
      header: "ID",
      enableSorting: true,
      cell: ({ row }) => (
        <button
          onClick={() => handleSelectArticleFromTable(row.original)}
          style={{
            fontSize: "10px",
          }}
        >
          {row.original.id}
        </button>
      ),
    }),
    columnHelper.accessor("title", { header: "Title", enableSorting: true }),
    columnHelper.accessor("description", {
      header: "Description",
      enableSorting: true,
      cell: ({ getValue }) => (
        <div
          style={{
            fontSize: "10px",
          }}
        >
          {getValue() && getValue().slice(0, 100)}
        </div>
      ),
    }),
    columnHelper.accessor("publishedDate", {
      header: "Published Date",
      enableSorting: true,
    }),
    columnHelper.accessor("url", {
      header: "URL",
      enableSorting: true,
      cell: ({ getValue }) => (
        <div
          style={{
            fontSize: "12px",
            maxWidth: "150px",
          }}
        >
          {/* {getValue()} */}
          {getValue() && (
            <Link href={getValue()}>{getValue().slice(0, 40)}</Link>
          )}
        </div>
      ),
    }),
    columnHelper.accessor("states", {
      header: "State",
      enableSorting: true,
    }),
    columnHelper.accessor("isRelevant", {
      header: "Relevant ?",
      enableSorting: true,
      cell: ({ getValue, row }) => (
        <div className={styles.divBtnRelevant}>
          <button
            className={`${styles.btnRelevant} ${
              getValue() === false ? "btnOpaque" : ""
            }`}
            onClick={() => handleClickIsRelevant(row.original.id)}
          >
            {getValue() === true ? "Yes" : "No"}
          </button>
        </div>
      ),
    }),
  ];

  const handleClickedValidateState = async () => {
    console.log("clicked validate state");

    const selectedStateIds = stateArray
      .filter((st) => st.selected)
      .map((st) => st.id);
    try {
      const bodyObj = {
        stateIdArray: selectedStateIds,
      };
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/states/${selectedArticle.id}`,
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
          fetchArticlesArray();
        }
      }
    } catch (error) {
      console.error("Error validating states:", error.message);
    }
  };

  const handleApproveArticle = async () => {
    console.log("clicked approve article");
    if (!selectedArticle.id) {
      setRequestResponseMessage("Please select an article to approve");
      setIsOpenModalInfo(true);
      return;
    }
    try {
      const bodyObj = {
        isApproved: !selectedArticle.isApproved,
        headlineForPdfReport: selectedArticle.title,
        publicationNameForPdfReport: selectedArticle.publicationName,
        publicationDateForPdfReport: selectedArticle.publishedDate,
        textForPdfReport: selectedArticle.content,
        urlForPdfReport: selectedArticle.url,
        kmNotes: "",
      };
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/articles/approve/${selectedArticle.id}`,
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
          //modify selected article
          setSelectedArticle({
            ...selectedArticle,
            isApproved: !selectedArticle.isApproved,
          });
          let tempArray = [...articlesArray];
          tempArray = tempArray.map((article) => {
            if (article.id === selectedArticle.id) {
              return {
                ...article,
                isApproved: !article.isApproved,
              };
            }
            return article;
          });
          setArticlesArray(tempArray);
        }
      }
    } catch (error) {
      console.error("Error approving article:", error.message);
    }
  };
  return (
    <TemplateView>
      <main className={styles.main}>
        <div className={styles.divMainTop}>Articles review: [some number]</div>
        <div className={styles.divMainMiddle}>
          <div className={styles.divMainMiddleLeft}>
            <div className={`${styles.divMainMiddleLeftTitle} tooltipWrapper`}>
              <h2>Article Approval Details</h2>
              <div className="tooltipText">
                This is the content for CPSC report PDF
              </div>
            </div>
            <div className={styles.divArticleDetail}>
              <div className="tooltipWrapper">
                <span className={styles.lblArticleDetailMain}>Headline:</span>
                <span className="tooltipText">This is the article title</span>
              </div>
              <input
                type="text"
                value={selectedArticle?.title}
                className={styles.inputArticleDetail}
                // onChange={(e) =>
                disabled
              />
            </div>

            <div className={styles.divArticleDetail}>
              <div className="tooltipWrapper">
                <span className={styles.lblArticleDetailMain}>
                  Publication:
                </span>
                <span className="tooltipText">
                  Name of newspaper or organization that published the article
                </span>
              </div>
              <input
                type="text"
                value={selectedArticle?.publicationName}
                className={styles.inputArticleDetail}
                // onChange={(e) =>
                disabled
              />
            </div>
            <div className={styles.divArticleDetail}>
              <div className="tooltipWrapper">
                <span className={styles.lblArticleDetailMain}>
                  Publication Date:
                </span>
                <span className="tooltipText">Date article was published</span>
              </div>
              <input
                type="date"
                value={selectedArticle?.publishedDate}
                className={styles.inputArticleDetail}
                // onChange={(e) =>
                disabled
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
                <StateSelector
                  stateArray={stateArray}
                  setStateArray={setStateArray}
                />
              </div>
              <button
                className={styles.btnSubmit}
                onClick={() => {
                  handleClickedValidateState();
                }}
              >
                Validate State
              </button>
            </div>

            <div className={styles.divArticleDetailContent}>
              <div className="tooltipWrapper">
                <span className={styles.lblArticleDetailMain}>Content:</span>
                <span className="tooltipText">This is the article content</span>
              </div>
              <textarea
                value={selectedArticle?.content}
                className={styles.inputArticleDetailContent}
                onChange={(e) => {
                  setSelectedArticle({
                    ...selectedArticle,
                    content: e.target.value,
                  });
                }}
                // disabled
              />
            </div>
          </div>
          <div className={styles.divMainMiddleRight}>
            {/* <div className={styles.divManageStates}>
              <StateSelector
                stateArray={stateArray}
                setStateArray={setStateArray}
              />
            </div> */}

            <button
              className={`${styles.btnSubmit} ${
                selectedArticle?.isApproved ? styles.btnOpaque : ""
              }`}
              onClick={() => {
                // console.log("approve article");
                handleApproveArticle();
              }}
            >
              {selectedArticle?.isApproved ? "Un-approve" : "Approve"}
            </button>

            <button
              className={`${styles.btnSubmit} ${
                hideIrrelevant ? styles.btnOpaque : ""
              }`}
              onClick={() => setHideIrrelevant(!hideIrrelevant)}
            >
              {hideIrrelevant
                ? "Show All Articles"
                : "Hide Irrelevant Articles"}
            </button>
            <button
              className={styles.btnSubmit}
              onClick={() => {
                console.log(selectedArticle);
                console.log(selectedArticle.isApproved);
              }}
            >
              Show Selected Article
            </button>
          </div>
        </div>
        <div className={styles.divMainBottom}>
          <div className={styles.divRequestTableGroup}>
            <TableRequests
              columns={columnsForArticlesTable}
              data={
                hideIrrelevant
                  ? articlesArray.filter(
                      (article) => article.isRelevant !== false
                    )
                  : articlesArray
              }
            />
          </div>
        </div>
      </main>
      {/* {isOpenApproveModal && (
        <ModalApproveArticle setIsOpen={setIsOpenApproveModal} />
      )} */}
      {isOpenStateWarning && (
        <Modal
          isModalOpenSetter={setIsOpenStateWarning}
          title="Problem with state request"
          content="Maybe no selected states ?"
        />
      )}
      {isOpenModalInfo && (
        <Modal
          isModalOpenSetter={setIsOpenModalInfo}
          title="Information"
          content={infoModalContent}
        />
      )}
    </TemplateView>
  );
}
