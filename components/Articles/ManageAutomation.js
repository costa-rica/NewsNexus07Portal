import styles from "../../styles/articles/ManageAutomation.module.css";
import TemplateView from "../common/TemplateView";

export default function ManageAutomation() {
  const userReducer = useSelector((state) => state.user);

  const [filesArray, setFilesArray] = useState([]);

  useEffect(() => {
    fetchAutomationFilesList();
  }, []);

  const fetchAutomationFilesList = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/automations/excel-files`,
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
      console.log("Fetched Data:", result);

      if (result.filesArray && Array.isArray(result.filesArray)) {
        setFilesArray(result.filesArray);
      } else {
        setFilesArray([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
      setFilesArray([]);
    }
  };
  return (
    <TemplateView>
      <main className={styles.main}>
        <h1 className={styles.title}>Welcome to Manage Automation!</h1>

        <div className={styles.divSettingsGroup}>
          <h3>Excel Spreadsheets</h3>
          {filesArray.map((file) => (
            <div key={file.id}>
              <p>{file.name}</p>
              <p>{file.createdAt}</p>
            </div>
          ))}
          <div className={styles.divSettingDetail}>
            News API
            <span className={styles.lblSettingDetailMain}>Upload Excel:</span>
            <input type="file" />
          </div>
        </div>
      </main>
    </TemplateView>
  );
}
