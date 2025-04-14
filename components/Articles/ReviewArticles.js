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
  const [isOpenApproveModal, setIsOpenApproveModal] = useState(false);
  const [isOpenStateWarning, setIsOpenStateWarning] = useState(false);

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

  // const fetchStateArray = async () => {
  //   try {
  //     const response = await fetch(
  //       `${process.env.NEXT_PUBLIC_API_BASE_URL}/states`,
  //       {
  //         headers: { Authorization: `Bearer ${userReducer.token}` },
  //       }
  //     );

  //     console.log(`Response status: ${response.status}`);

  //     if (!response.ok) {
  //       const errorText = await response.text(); // Log response text for debugging
  //       throw new Error(`Server Error: ${errorText}`);
  //     }

  //     const result = await response.json();
  //     console.log("Fetched Data:", result);

  //     if (result.statesArray && Array.isArray(result.statesArray)) {
  //       const tempStatesArray = result.statesArray.map((stateObj) => ({
  //         ...stateObj,
  //         selected: false,
  //       }));
  //       setStateArray(tempStatesArray);
  //     } else {
  //       setStateArray([]);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching data:", error.message);
  //     setStateArray([]);
  //   }
  // };
  const handleRowClick = (article) => {
    console.log("Selected article:", article);
    setSelectedArticle(article);
    updateStateArrayWithArticleState(article);
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
          onClick={() => handleRowClick(row.original)}
          style={{
            fontSize: "10px",
          }}
        >
          {row.id}
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
  ];

  const handleClickedValidateState = async () => {
    console.log("clicked validate state");

    const selectedStateIds = stateArray
      .filter((st) => st.selected)
      .map((st) => st.id);
    // if (selectedStateIds.length === 0) {
    //   // console.log("No states selected");
    //   setIsOpenStateWarning(true);
    //   return;
    // }
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
  return (
    <TemplateView>
      <main className={styles.main}>
        <div className={styles.divMainTop}>
          Some tables with counts will go here
          <h1 className={styles.title}>Welcome to Review articles page</h1>
        </div>
        <div className={styles.divMainMiddle}>
          <div className={styles.divMainMiddleLeft}>
            <div className={styles.divArticleDetail}>
              <span className={styles.lblArticleDetail}>Article Title:</span>{" "}
              <span> {selectedArticle?.title}</span>
            </div>
            <div className={styles.divArticleDetail}>
              <span className={styles.lblArticleDetail}>Link to article:</span>{" "}
              <span>
                {selectedArticle?.url && (
                  <Link href={selectedArticle?.url}>
                    {selectedArticle?.url}
                  </Link>
                )}
              </span>
            </div>
            <div className={styles.divArticleContent}>
              {selectedArticle?.description}
            </div>
          </div>
          <div className={styles.divMainMiddleRight}>
            <div className={styles.divManageStates}>
              <StateSelector
                stateArray={stateArray}
                setStateArray={setStateArray}
              />
            </div>

            <button
              className={styles.btnSubmit}
              onClick={() => {
                console.log("approve article");
                handleClickedValidateState();
                // setIsOpenApproveModal(true);
                // handleRequestArticles();
                // You can call your submit logic or dispatch here
              }}
            >
              Validate State
            </button>
            <button
              className={styles.btnSubmit}
              onClick={() => {
                console.log("approve article");
                setIsOpenApproveModal(true);
                // handleRequestArticles();
                // You can call your submit logic or dispatch here
              }}
            >
              Approve
            </button>
          </div>
        </div>
        <div className={styles.divMainBottom}>
          <div className={styles.divRequestTableGroup}>
            <TableRequests
              columns={columnsForArticlesTable}
              data={articlesArray}
            />
          </div>
        </div>
      </main>
      {isOpenApproveModal && (
        <ModalApproveArticle setIsOpen={setIsOpenApproveModal} />
      )}
      {isOpenStateWarning && (
        <Modal
          isModalOpenSetter={setIsOpenStateWarning}
          title="Problem with state request"
          content="Maybe no selected states ?"
        />
      )}
    </TemplateView>
  );
}
