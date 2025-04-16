import { useRouter } from "next/router";
import dynamic from "next/dynamic";

export default function GetArticlesNavigator() {
  const router = useRouter();
  // const { get_articles_navigator } = router.query;
  const { navigator } = router.query;

  const GetArticlesComponent = dynamic(() => {
    if (navigator === "get-from-api-services") {
      return import(`../../components/Articles/GetArticles`).catch(() => () => (
        <p>GetArticles Not Found</p>
      ));
    } else if (navigator === "get-from-api-services-detailed") {
      return import(
        `../../components/Articles/GetArticlesNewsApiDetailed`
      ).catch(() => () => <p>GetArticlesNewsApiDetailed Not Found</p>);
    } else if (navigator === "review") {
      return import(`../../components/Articles/ReviewArticles`).catch(
        () => () => <p>ReviewArticles Not Found</p>
      );
    } else {
      return Promise.resolve(() => <p>Something else Not Found</p>);
    }
  });

  return <GetArticlesComponent />;
}
