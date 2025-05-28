import { useRouter } from "next/router";
import dynamic from "next/dynamic";

export default function ReportsAnalysisNavigator() {
  const router = useRouter();
  const { navigator } = router.query;

  const ReportsAnalysisComponent = dynamic(() => {
    if (navigator === "reports") {
      return import(`../../components/ReportsAndAnalysis/Reports`).catch(
        () => () => <p>Reports Not Found</p>
      );
    } else if (navigator === "requests-analysis") {
      return import(
        `../../components/ReportsAndAnalysis/RequestsAnalysis`
      ).catch(() => () => <p>RequestsAnalysis Not Found</p>);
    } else if (navigator === "analysis-counts-by-state") {
      return import(
        `../../components/ReportsAndAnalysis/AnalysisCountsByState`
      ).catch(() => () => <p>AnalysisCountsByState Not Found</p>);
    } else {
      return Promise.resolve(() => <p>Something else Not Found</p>);
    }
  });

  return <ReportsAnalysisComponent />;
}
