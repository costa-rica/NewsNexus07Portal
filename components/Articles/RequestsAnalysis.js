import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Table01 from "../common/Tables/Table01";
import Table02Small from "../common/Tables/Table02Small";
import { createColumnHelper } from "@tanstack/react-table";
import TemplateView from "../common/TemplateView";
import styles from "../../styles/articles/ReviewArticles.module.css";

export default function RequestsAnalysis() {
  const userReducer = useSelector((state) => state.user);
  const [requestsArray, setRequestsArray] = useState([]);
  const [manualFoundCount, setManualFoundCount] = useState(0);
  const [loadingComponents, setLoadingComponents] = useState({
    table01: false,
  });
  const [selectedRequest, setSelectedRequest] = useState(null);

  const fetchApprovedArticles = async () => {
    const bodyParams = {
      dateRequestsLimit: "2025-05-21",
    };

    try {
      setLoadingComponents((prev) => ({
        ...prev,
        table01: true,
      }));
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/articles/table-approved-by-request`,
        {
          headers: {
            Authorization: `Bearer ${userReducer.token}`,
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify(bodyParams),
        }
      );

      console.log(`Response status: ${response.status}`);

      if (!response.ok) {
        const errorText = await response.text(); // Log response text for debugging
        throw new Error(`Server Error: ${errorText}`);
      }

      const result = await response.json();
      console.log("Fetched Data:", result);

      if (result.requestsArray && Array.isArray(result.requestsArray)) {
        setRequestsArray(result.requestsArray);
        setSelectedRequest(result.requestsArray[0]);
      } else {
        setRequestsArray([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
      setRequestsArray([]);
    }
    setLoadingComponents((prev) => ({
      ...prev,
      table01: false,
    }));
  };

  const columnHelper = createColumnHelper();
  const columnsForArticlesTable = [
    columnHelper.accessor("id", {
      header: "ID",
      enableSorting: true,
      cell: ({ row }) => {
        return (
          <button
            onClick={() => setSelectedRequest(row.original)}
            className={styles.button}
          >
            {row.original.id}
          </button>
        );
      },
    }),
    columnHelper.accessor("nameOfOrg", {
      header: "Name of Organization",
      enableSorting: true,
      cell: ({ row }) => row.original.nameOfOrg,
    }),
    columnHelper.display({
      header: "AND OR NOT string",
      enableSorting: true,
      cell: ({ row }) => {
        let andString = row.original.andString;
        let orString = row.original.orString;
        let notString = row.original.notString;
        return `${andString} ${orString} ${notString}`;
      },
    }),
    columnHelper.accessor("includeOrExcludeDomainsString", {
      header: "Include/Exclude Domains",
      enableSorting: true,
      cell: ({ row }) => row.original.includeOrExcludeDomainsString,
    }),
    columnHelper.accessor("countOfApprovedArticles", {
      header: "Count of Approved Articles",
      enableSorting: true,
      cell: ({ row }) => row.original.countOfApprovedArticles,
    }),
  ];

  useEffect(() => {
    fetchApprovedArticles();
  }, []);

  return (
    <TemplateView>
      <main className={styles.main}>
        <div className={styles.divMainTop}>
          <div>RequestsAnalysis</div>
        </div>
        <Table02Small
          data={requestsArray}
          columns={columnsForArticlesTable}
          //   selectedRowId={selectedRequest?.id}
          //   loading={loadingComponents.table01}
        />
      </main>
    </TemplateView>
  );
}
