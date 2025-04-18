import styles from "../../styles/AdminDb.module.css";
import TemplateView from "../common/TemplateView";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import ModalYesNo from "../common/ModalYesNo";

export default function Reports() {
  const [reportsArray, setReportsArray] = useState([]);
  const [isOpenReportType, setIsOpenReportType] = useState(false);
  const [isOpenAreYouSure, setIsOpenAreYouSure] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const userReducer = useSelector((state) => state.user);

  useEffect(() => {
    fetchReportsList();
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
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/reports/send/${reportId}`,
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

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = report;
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

  return (
    <TemplateView>
      <main className={styles.main}>
        <div className={styles.divMain}>
          <h1>Create Report</h1>
          <div>
            <button
              className={styles.button}
              onClick={() => setIsOpenReportType(true)}
            >
              Create a Report
            </button>
          </div>
          {/* <div className={styles.divReports}>
          {reportsArray.map((report, index) => (
            <div key={index} className={styles.divReport}>
              <h2>{report}</h2>
            </div>
          ))}
        </div> */}
          <div className={styles.divManageDbBackups}>
            <h3>Existing Reports</h3>
            <ul>
              {reportsArray &&
                reportsArray.map((report, index) => (
                  <li key={index} className={styles.liBackups}>
                    <button
                      className={styles.btnDownload}
                      onClick={() => fetchReportZipFile(report.id)}
                    >
                      {/* Get the filename from the path*/}
                      {report?.pathToReport?.split("/")?.pop()}
                    </button>
                    <button
                      className={styles.btnDelete}
                      onClick={() => {
                        setSelectedReport(report);
                        setIsOpenAreYouSure(true);
                      }}
                    >
                      X
                    </button>
                  </li>
                ))}
            </ul>
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
