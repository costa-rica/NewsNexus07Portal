import { useRouter } from "next/router";
import dynamic from "next/dynamic";

export default function Navigator() {
  const router = useRouter();
  const { navigator } = router.query;

  const NavigatorComponent = dynamic(() => {
    if (navigator === "manage-db-backups") {
      return import(`../../components/AdminDb/ManageDbBackups`).catch(
        () => () => <p>ManageDbBackups Not Found</p>
      );
    } else if (navigator === "manage-db-uploads") {
      return import(`../../components/AdminDb/ManageDbUploads`).catch(
        () => () => <p>ManageDbUploads Not Found</p>
      );
    } else {
      return Promise.resolve(() => <p>Something else Not Found</p>);
    }
  });

  return <NavigatorComponent />;
}
