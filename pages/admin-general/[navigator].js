import { useRouter } from "next/router";
import dynamic from "next/dynamic";

export default function Navigator() {
  const router = useRouter();
  const { navigator } = router.query;

  const NavigatorComponent = dynamic(() => {
    if (navigator === "manage-users") {
      return import(`../../components/AdminGeneral/ManageUsers`).catch(
        () => () => <p>ManageDbBackups Not Found</p>
      );
    } else if (navigator === "manage-news-aggregators") {
      return import(
        `../../components/AdminGeneral/ManageNewsAggregators`
      ).catch(() => () => <p>ManageDbBackups Not Found</p>);
    }
    // else if (navigator === "manage-db-uploads") {
    //   return import(`../../components/AdminDb/ManageDbUploads`).catch(
    //     () => () => <p>ManageDbUploads Not Found</p>
    //   );
    // } else if (navigator === "manage-users") {
    //   return import(`../../components/AdminGeneral/ManageUsers`).catch(() => () => (
    //     <p>ManageDbUploads Not Found</p>
    //   ));
    // } else if (navigator === "manage-db-deletes") {
    //   return import(`../../components/AdminDb/ManageDbDeletes`).catch(
    //     () => () => <p>ManageDbDeletes Not Found</p>
    //   );
    // }
    else {
      return Promise.resolve(() => <p>Something else Not Found</p>);
    }
  });

  return <NavigatorComponent />;
}
