import styles from "../../styles/Reports.module.css";
import TemplateView from "../common/TemplateView";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import ModalYesNo from "../common/ModalYesNo";
import Table01 from "../common/Tables/Table01";
import Table02Small from "../common/Tables/Table02Small";
import { createColumnHelper } from "@tanstack/react-table";

export default function Reports() {
  const userReducer = useSelector((state) => state.user);
  const [isOpenReportType, setIsOpenReportType] = useState(false);
  const [isOpenAreYouSure, setIsOpenAreYouSure] = useState(false);
  const [reportsArray, setReportsArray] = useState([]);
  const [approvedArticlesArray, setApprovedArticlesArray] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    fetchReportsList();
    fetchApprovedArticlesArray();
  }, []);

  const fetchReportsList = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/reports/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userReducer.token}`,
          },
        }
      );

      if (response.status !== 200) {
        console.log(`There was a server error: ${response.status}`);
        return;
      }
      const resJson = await response.json();
      console.log(resJson);
      setReportsArray(resJson.reports);
    } catch (error) {
      console.error("Error fetching reports:", error);
    }
  };

  const fetchReportZipFile = async (reportId) => {
    console.log(`Fetching report zip file for report ID: ${reportId}`);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/reports/download/${reportId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${userReducer.token}`,
          },
        }
      );

      if (response.status !== 200) {
        console.log(`There was a server error: ${response.status}`);
        return;
      }

      // Extract filename from Content-Disposition header
      const disposition = response.headers.get("Content-Disposition");
      let filename = "report.zip";
      console.log(response.headers);
      if (disposition && disposition.includes("filename=")) {
        console.log(`----> Filename: ${disposition}`);
        filename = disposition
          .split("filename=")[1]
          .replace(/['"]/g, "")
          .trim();
      } else {
        console.log(`----> Filename not found in header`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading report:", error);
    }
  };

  const createReport = async (includeAllArticles = false) => {
    const bodyObj = { includeAllArticles };
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/reports/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userReducer.token}`,
          },
          body: JSON.stringify(bodyObj),
        }
      );

      if (response.status !== 200) {
        console.log(`There was a server error: ${response.status}`);
        return;
      }

      alert("Report created successfully!");
      fetchReportsList();
    } catch (error) {
      console.error("Error creating report:", error);
    }
  };
  const handleDelete = async (reportId) => {
    // if (window.confirm("Are you sure you want to delete this report?")) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/reports/${reportId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userReducer.token}`,
          },
        }
      );

      if (response.status !== 200) {
        console.log(`There was a server error: ${response.status}`);
        return;
      }

      alert("Report deleted successfully!");
      fetchReportsList();
    } catch (error) {
      console.error("Error deleting report:", error);
    }
    // }
  };

  const fetchApprovedArticlesArray = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/articles/approved`,
        {
          headers: { Authorization: `Bearer ${userReducer.token}` },
        }
      );

      console.log(`Response status: ${response.status}`);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server Error: ${errorText}`);
      }

      const result = await response.json();
      console.log("Fetched Data:", result);

      if (result.articlesArray && Array.isArray(result.articlesArray)) {
        let tempArray = result.articlesArray;
        tempArray.forEach((article) => {
          article.includeInReport = false;
        });
        setApprovedArticlesArray(tempArray);
      } else {
        setApprovedArticlesArray([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
      setApprovedArticlesArray([]);
    }
  };

  // Table: Reports (top left)
  const columnHelper = createColumnHelper();
  const columnsReports = [
    columnHelper.accessor("id", {
      header: "ID",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("dateSubmittedToClient", {
      header: () => <div>Submitted </div>,
      cell: (info) => info.getValue().split("T")[0],
    }),
    columnHelper.accessor("ArticleReportContracts", {
      header: "Article Count",
      cell: (info) => (
        <div className={styles.divColumnValue}>{info.getValue().length}</div>
      ),
    }),
    columnHelper.display({
      id: "download",
      // header: "Download",
      cell: (info) => (
        <button
          onClick={() => {
            fetchReportZipFile(info.row.original.id);
            // alert(info.row.original.id);
          }}
          className={styles.btnDownload}
        >
          Download
        </button>
      ),
    }),
    columnHelper.display({
      id: "delete",
      // header: "Delete",
      cell: (info) => (
        <button
          onClick={() => {
            handleDelete(info.row.original.id);
            // alert(info.row.original.id);
          }}
          className={styles.btnDelete}
        >
          Delete
        </button>
      ),
    }),
  ];

  // Table: Approved Articles (Bottom)
  const columnsApprovedArticles = [
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
    columnHelper.accessor("ArticleReportContracts", {
      header: "Ref #",
      enableSorting: true,
      cell: ({ row }) => (
        <button
          onClick={() =>
            alert(JSON.stringify(row.original.ArticleReportContracts))
          }
          style={{
            fontSize: "10px",
          }}
        >
          {row.original.ArticleReportContracts[
            row.original.ArticleReportContracts.length - 1
          ]?.articleReferenceNumberInReport || "N/A"}
        </button>
      ),
    }),
    columnHelper.accessor("isSubmitted", {
      header: "Submitted",
      enableSorting: true,
      cell: ({ row }) => (
        <div className={styles.divColumnValue}>{row.original.isSubmitted}</div>
      ),
    }),
    columnHelper.accessor("title", {
      header: "Headline",
      enableSorting: true,
      cell: ({ row }) => (
        <div className={styles.divColumnValueTitle}>
          {row.original.title.substring(0, 20)}
        </div>
      ),
    }),
    columnHelper.accessor("ArticleReportContracts", {
      header: "Accepted",
      enableSorting: true,
      cell: ({ row }) => (
        <button
          onClick={() =>
            alert(JSON.stringify(row.original.ArticleReportContracts))
          }
          style={{
            fontSize: "10px",
          }}
        >
          {row.original.ArticleReportContracts[
            row.original.ArticleReportContracts.length - 1
          ]?.articleAcceptedByCpsc
            ? "Yes"
            : "No"}
        </button>
      ),
    }),
    columnHelper.accessor("publicationName", {
      header: "Pub Name",
      enableSorting: true,
      cell: ({ row }) => (
        <div className={styles.divColumnValueTitle}>
          {row.original.publicationName}
        </div>
      ),
    }),
    columnHelper.accessor("publishedDate", {
      header: "Pub Date",
      enableSorting: true,
      cell: ({ row }) => (
        <div className={styles.divColumnValueTitle}>
          {row.original.publishedDate.split("T")[0]}
        </div>
      ),
    }),
    columnHelper.accessor("States", {
      header: "State",
      enableSorting: true,
      cell: ({ row }) => (
        <div className={styles.divColumnValueTitle}>
          {row.original.States.length > 1
            ? row.original.States.map((state) => state.abbreviation).join(", ")
            : row.original?.States[0]?.abbreviation}
        </div>
      ),
    }),
    columnHelper.accessor("includeInReport", {
      header: "Include",
      enableSorting: false,
      cell: ({ row }) => (
        <button
          className={
            row.original.includeInReport
              ? styles.radioButtonActive
              : styles.radioButtonInactive
          }
          onClick={() => {
            const updatedArray = approvedArticlesArray.map((article) =>
              article.id === row.original.id
                ? { ...article, includeInReport: !article.includeInReport }
                : article
            );
            setApprovedArticlesArray(updatedArray);
          }}
        />
      ),
    }),
  ];
  return (
    <TemplateView>
      <main className={styles.main}>
        <div className={styles.divMainSub}>
          <h1>Create Report</h1>
          <div className={styles.divTop}>
            <div className={styles.divTopLeft}>
              <div className={styles.divReportTable}>
                <Table02Small columns={columnsReports} data={reportsArray} />
              </div>
            </div>
            <div className={styles.divTopRight}></div>
          </div>

          <div className={styles.divBottom}>
            <h3>Approved Articles (count: {approvedArticlesArray.length})</h3>
            <Table01
              columns={columnsApprovedArticles}
              data={approvedArticlesArray}
            />
          </div>
        </div>
      </main>
      {isOpenReportType && (
        <ModalYesNo
          isModalOpenSetter={setIsOpenReportType}
          title="Report Type"
          content="Do you want to include all approved or only the ones that have not been sent yet?"
          yesOptionText="All Approved"
          noOptionText="Only Not Sent"
          handleYes={() => createReport(true)}
          handleNo={() => createReport(false)}
        />
      )}
      {isOpenAreYouSure && (
        <ModalYesNo
          isModalOpenSetter={setIsOpenAreYouSure}
          title="Are you sure?"
          content="You are about to delete a report. This action cannot be undone."
          handleYes={() => handleDelete(selectedReport.id)}
          handleNo={() => setIsOpenAreYouSure(false)}
        />
      )}
    </TemplateView>
  );
}
