import styles from "../../styles/SummaryStatistics.module.css";
import { useSelector } from "react-redux";

export default function SummaryStatistics() {
  const userReducer = useSelector((state) => state.user);
  return (
    <div className={styles.divArticleSummaryStatisticsGroupSuper}>
      <div className={styles.divArticleSummaryStatisticsGroup}>
        <div className={styles.divArticlesSummaryStatisticsTitle}>
          Article count
        </div>
        <div className={styles.divArticlesSummaryStatisticsMetric}>
          {userReducer.articlesSummaryStatistics?.articlesCount}
        </div>
      </div>
      <div className={styles.divArticleSummaryStatisticsGroup}>
        <div className={styles.divArticlesSummaryStatisticsTitle}>
          Relevant articles
        </div>
        <div className={styles.divArticlesSummaryStatisticsMetric}>
          {userReducer.articlesSummaryStatistics?.articlesIsRelevantCount}
        </div>
      </div>
      <div className={styles.divArticleSummaryStatisticsGroup}>
        <div className={styles.divArticlesSummaryStatisticsTitle}>
          Approved articles
        </div>
        <div className={styles.divArticlesSummaryStatisticsMetric}>
          {userReducer.articlesSummaryStatistics?.articlesIsApprovedCount}
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
    </div>
  );
}
