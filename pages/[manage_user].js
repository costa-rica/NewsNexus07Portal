import { useRouter } from "next/router";
import dynamic from "next/dynamic";

export default function ManageUser() {
  const router = useRouter();
  const { manage_user } = router.query;

  const ManageUserComponent = dynamic(() => {
    if (manage_user === "login") {
      return import(`../components/ManageUser/Login`).catch(() => () => (
        <p>Table Not Found</p>
      ));
    } else if (manage_user === "register") {
      return import(`../components/ManageUser/Register`).catch(() => () => (
        <p>Table Not Found</p>
      ));
    } else {
      return Promise.resolve(() => <p>Table Not Found</p>);
    }
  });

  return <ManageUserComponent />;
}
