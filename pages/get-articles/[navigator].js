import { useRouter } from "next/router";
import dynamic from "next/dynamic";

export default function GetArticlesNavigator() {
  const router = useRouter();
  // const { get_articles_navigator } = router.query;
  const { navigator } = router.query;

  const GetArticlesComponent = dynamic(() => {
    if (navigator === "gnews") {
      return import(`../../components/GNewsRequest`).catch(() => () => (
        <p>GNewsRequest Not Found</p>
      ));
    } else {
      return Promise.resolve(() => <p>Something else Not Found</p>);
    }
  });

  return <GetArticlesComponent />;
}
