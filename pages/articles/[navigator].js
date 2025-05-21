import { useRouter } from "next/router";
import dynamic from "next/dynamic";

export default function GetArticlesNavigator() {
  const router = useRouter();
  // const { get_articles_navigator } = router.query;
  const { navigator } = router.query;

  const GetArticlesComponent = dynamic(() => {
    // if (navigator === "get-from-api-services") {
    //   return import(`../../components/Articles/GetArticles`).catch(() => () => (
    //     <p>GetArticles Not Found</p>
    //   ));
    // }

    // else if (navigator === "get-from-api-services-detailed") {
    if (navigator === "get-newsapi") {
      return import(`../../components/Articles/GetArticlesNewsApi`).catch(
        () => () => <p>GetArticlesNewsApi Not Found</p>
      );
    } else if (navigator === "get-gnews") {
      return import(`../../components/Articles/GetArticlesGNews`).catch(
        () => () => <p>GetArticlesGNews Not Found</p>
      );
    } else if (navigator === "get-newsdataio") {
      return import(`../../components/Articles/GetArticlesNewsDataIo`).catch(
        () => () => <p>GetArticlesNewsDataIo Not Found</p>
      );
    } else if (navigator === "review") {
      return import(`../../components/Articles/ReviewArticles`).catch(
        () => () => <p>ReviewArticles Not Found</p>
      );
    } else if (navigator === "reports") {
      return import(`../../components/Articles/Reports`).catch(() => () => (
        <p>Reports Not Found</p>
      ));
    } else if (navigator === "add-delete") {
      return import(`../../components/Articles/AddDeleteArticle`).catch(
        () => () => <p>AddDeleteArticle Not Found</p>
      );
    } else if (navigator === "automation") {
      return import(`../../components/Articles/ManageAutomation`).catch(
        () => () => <p>ManageAutomation Not Found</p>
      );
    } else if (navigator === "requests-analysis") {
      return import(`../../components/Articles/RequestsAnalysis`).catch(
        () => () => <p>RequestsAnalysis Not Found</p>
      );
    } else {
      return Promise.resolve(() => <p>Something else Not Found</p>);
    }
  });

  return <GetArticlesComponent />;
}
