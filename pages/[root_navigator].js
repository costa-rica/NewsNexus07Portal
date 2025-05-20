import { useRouter } from "next/router";
import dynamic from "next/dynamic";

export default function RootNavigator() {
  const router = useRouter();
  const { root_navigator } = router.query;

  const RootNavigatorComponent = dynamic(() => {
    if (root_navigator === "login") {
      return import(`../components/ManageUser/Login`).catch(() => () => (
        <p>Table Not Found</p>
      ));
    } else if (root_navigator === "register") {
      return import(`../components/ManageUser/Register`).catch(() => () => (
        <p>Table Not Found</p>
      ));
    } else if (root_navigator === "user-settings") {
      return import(`../components/ManageUser/UserSettings`).catch(() => () => (
        <p>Table Not Found</p>
      ));
    } else if (root_navigator === "forgot-password") {
      return import(`../components/ManageUser/ForgotPassword`).catch(
        () => () => <p>Table Not Found</p>
      );
    } else if (root_navigator === "review-articles") {
      return import(`../components/Articles/ReviewArticles`).catch(() => () => (
        <p>Table Not Found</p>
      ));
    } else if (root_navigator === "logout") {
      return import(`../components/ManageUser/logout`).catch(() => () => (
        <p>Table Not Found</p>
      ));
    } else {
      return Promise.resolve(() => <p>Table Not Found</p>);
    }
  });

  return <RootNavigatorComponent />;
}
