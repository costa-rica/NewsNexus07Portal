import { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table";
import styles from "../../../styles/common/Table05ReportsExpandingRows.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";

export default function Table05ReportsExpandingRows({
  data,
  updateStagedArticlesTableWithReportArticles,
}) {
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [globalFilter, setGlobalFilter] = useState("");
  const [expandedRows, setExpandedRows] = useState({});

  const toggleExpandRow = (rowIndex) => {
    setExpandedRows((prev) => ({
      ...prev,
      [rowIndex]: !prev[rowIndex],
    }));
  };

  const columns = [
    {
      accessorKey: "crName",
      header: "CR Name",
      cell: (info) => <div>{info.getValue()}</div>,
    },
    {
      id: "reportId",
      header: "Report ID",
      cell: ({ row }) => {
        const highestId = [...row.original.reportsArray]
          .sort((a, b) => a.id - b.id)
          .at(-1).id;
        return <div>{highestId}</div>;
      },
    },
    {
      id: "expandIcon",
      header: "",
      cell: ({ row }) => {
        const hasMultipleReports = row.original.reportsArray.length > 1;
        if (!hasMultipleReports) return null;

        return (
          <div
            style={{ cursor: "pointer", textAlign: "right" }}
            onClick={() => toggleExpandRow(row.index)}
          >
            <FontAwesomeIcon
              icon={expandedRows[row.index] ? faChevronDown : faChevronLeft}
            />
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    state: { pagination, globalFilter },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onPaginationChange: setPagination,
    onGlobalFilterChange: setGlobalFilter,
    autoResetPageIndex: false,
  });

  return (
    <div className={styles.divTableMain}>
      <div className={styles.divTableButtonsAndInputs}>
        <div className={styles.divShowRows}>
          Show rows:{" "}
          {[5, 10, 20].map((size) => (
            <button
              key={size}
              onClick={() =>
                setPagination((prev) => ({
                  ...prev,
                  pageSize: size,
                  pageIndex: 0,
                }))
              }
            >
              {size}
            </button>
          ))}
        </div>
        <div className={styles.divInputSearchbar}>
          <input
            type="text"
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className={styles.inputSearchbar}
            placeholder="Search..."
          />
        </div>
      </div>
      <table className={styles.tableRequest}>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className={styles.tableRequestHeader}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler?.()}
                  style={{ cursor: "pointer" }}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getPaginationRowModel().rows.map((row) => (
            <>
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
              {expandedRows[row.index] && (
                <tr className={styles.expandedRow}>
                  <td colSpan={3}>
                    {[...row.original.reportsArray]
                      .sort((a, b) => a.id - b.id)
                      .slice(0, -1)
                      .map((report) => (
                        <div
                          key={report.id}
                          style={{ display: "flex", gap: "1rem" }}
                        >
                          <span>{row.original.crName}</span>
                          <span>{report.id}</span>
                        </div>
                      ))}
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
}
