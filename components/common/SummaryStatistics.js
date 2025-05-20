import styles from "../../styles/common/SummaryStatistics.module.css";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateArticlesSummaryStatistics } from "../../reducers/user";
import ModalLoading from "./modals/ModalLoading";
export default function SummaryStatistics() {
  const userReducer = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [loadingSummaryStatistics, setLoadingSummaryStatistics] =
    useState(false);

  useEffect(() => {
    fetchArticlesSummaryStatistics();
  }, []);

  const fetchArticlesSummaryStatistics = async () => {
    setLoadingSummaryStatistics(true);
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
    setLoadingSummaryStatistics(false);
  };

  return loadingSummaryStatistics ? (
    <div className={styles.divTableMain}>
      <ModalLoading isVisible={true} sizeOfParent={true} />
    </div>
  ) : (
    <div className={styles.divArticleSummaryStatisticsGroupSuper}>
      <div className={styles.divArticleSummaryStatisticsGroup}>
        <div className={styles.divArticlesSummaryStatisticsTitle}>
          Article count
        </div>
        <div className={styles.divArticlesSummaryStatisticsMetric}>
          {/* {userReducer.articlesSummaryStatistics?.articlesCount.toLocaleString()} */}
          {userReducer.articlesSummaryStatistics?.articlesCount != null
            ? userReducer.articlesSummaryStatistics.articlesCount.toLocaleString()
            : "N/A"}
        </div>
      </div>
      {/* <div className={styles.divArticleSummaryStatisticsGroup}>
        <div className={styles.divArticlesSummaryStatisticsTitle}>
          Approved This week articles
        </div>
        <div className={styles.divArticlesSummaryStatisticsMetric}>
          {userReducer.articlesSummaryStatistics?.approvedThisWeek}
        </div>
      </div> */}
      <div className={styles.divArticleSummaryStatisticsGroup}>
        <div className={styles.divArticlesSummaryStatisticsTitle}>
          Approved articles
        </div>
        <div className={styles.divArticlesSummaryStatisticsMetric}>
          {userReducer.articlesSummaryStatistics?.articlesIsApprovedCount}
          <div
            className={styles.divArticlesSummaryStatisticsMetricParenthesesDiv}
          >
            (Week: {userReducer.articlesSummaryStatistics?.approvedThisWeek})
          </div>
        </div>
      </div>
      <div className={styles.divArticleSummaryStatisticsGroup}>
        <div className={styles.divArticlesSummaryStatisticsTitle}>
          Articles assigned to a state
        </div>
        <div className={styles.divArticlesSummaryStatisticsMetric}>
          {userReducer.articlesSummaryStatistics?.hasStateAssigned}
        </div>
      </div>
      <div className={styles.divArticleSummaryStatisticsGroup}>
        <div className={styles.divArticlesSummaryStatisticsTitle}>
          Articles added Yesterday
        </div>
        <div className={styles.divArticlesSummaryStatisticsMetric}>
          {userReducer.articlesSummaryStatistics?.addedYesterday}
        </div>
      </div>
      <div className={styles.divArticleSummaryStatisticsGroupTransparent}>
        <button
          className={styles.btnSubmit}
          onClick={() => {
            fetchArticlesSummaryStatistics();
          }}
        >
          Refresh
        </button>
      </div>
    </div>
  );
}
