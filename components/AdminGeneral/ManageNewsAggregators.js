import styles from "../../styles/ManageNewsAggregators.module.css";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import TemplateView from "../common/TemplateView";
import DynamicDbTable from "../common/Tables/DynamicDbTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

export default function ManageNewsAggregators() {
  const [formData, setFormData] = useState({
    id: "",
    nameOfOrg: "",
    url: "",
    apiKey: "",
    isApi: false,
    isRss: false,
  });

  const [newsAggregatorsList, setNewsAggregatorsList] = useState([]);
  const [columns, setColumns] = useState([]);
  const [showPassword, setShowPassword] = useState(false); // 🔹 Toggle password visibility
  const userReducer = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    if (!userReducer.token) {
      router.push("/login");
    }
    console.log(`userReducer.token: ${userReducer.token}`);
    fetchNewsAggregatorsList();
  }, [userReducer]);

  const fetchNewsAggregatorsList = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin-db/table/NewsArticleAggregatorSource`,
      {
        headers: { Authorization: `Bearer ${userReducer.token}` },
      }
    );

    if (response.status === 200) {
      const resJson = await response.json();
      setNewsAggregatorsList(resJson.data);

      if (resJson.data.length > 0) {
        setColumns(Object.keys(resJson.data[0])); // Extract column names dynamically
      }
    } else {
      console.error(`Error fetching users: ${response.status}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let url;
    if (formData.id) {
      // url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/news-aggregators/update-aggregator/${formData.id}`;
      url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/news-aggregators/update/${formData.id}`;
    } else {
      url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/news-aggregators/add-aggregator`;
    }
    // alert(url);
    const response = await fetch(
      // `${process.env.NEXT_PUBLIC_API_BASE_URL}/news-aggregators/add-aggregator`,
      url,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userReducer.token}`,
        },
        body: JSON.stringify(formData),
      }
    );

    if (response.status === 200) {
      alert("News Aggregator Source created successfully!");
      setFormData({
        id: "",
        nameOfOrg: "",
        url: "",
        apiKey: "",
        isApi: false,
        isRss: false,
      });
      fetchNewsAggregatorsList();
    } else {
      const errorJson = await response.json();
      alert(`Error: ${errorJson.error || response.statusText}`);
    }
  };

  const handleDelete = async (userId) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${userId}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${userReducer.token}` },
      }
    );

    if (response.status === 200) {
      alert("News Aggregator Source deleted successfully!");
      fetchNewsAggregatorsList();
    } else {
      alert(`Error deleting News Aggregator Source: ${response.status}`);
    }
  };

  const handleSelectRow = (id) => {
    const selectedRow = newsAggregatorsList.find((row) => row.id === id);
    if (selectedRow) {
      const { createdAt, updatedAt, ...filteredRow } = selectedRow;
      setFormData({
        ...filteredRow,
        isApi: selectedRow.isApi || false,
        isRss: selectedRow.isRss || false,
      });
    }
  };

  return (
    <TemplateView>
      <div>
        <main className={styles.main}>
          <div className={styles.mainTop}>
            <h1 className={styles.title}>Update News Aggregator Source</h1>
            <div>* Note: Only provide fields that need to be updated</div>
          </div>

          {/* User Form */}
          <div className={styles.formContainer}>
            <form onSubmit={handleSubmit} className={styles.form}>
              {Object.keys(formData).map((field) => {
                if (field === "isApi" || field === "isRss") {
                  return (
                    <div key={field} className={styles.inputGroup}>
                      <label>{field}:</label>
                      <div className={styles.radioGroup}>
                        <label>
                          <input
                            type="radio"
                            name={field}
                            value="true"
                            checked={formData[field] === true}
                            onChange={() =>
                              setFormData({
                                ...formData,
                                [field]: true,
                              })
                            }
                          />
                          True
                        </label>
                        <label>
                          <input
                            type="radio"
                            name={field}
                            value="false"
                            checked={formData[field] === false}
                            onChange={() =>
                              setFormData({
                                ...formData,
                                [field]: false,
                              })
                            }
                          />
                          False
                        </label>
                      </div>
                    </div>
                  );
                }

                if (field !== "createdAt" && field !== "updatedAt") {
                  return (
                    <div key={field} className={styles.inputGroup}>
                      <label htmlFor={field}>{field}:</label>

                      {/* Password Field with Show/Hide Icon */}
                      {field === "password" ? (
                        <div className={styles.passwordContainer}>
                          <input
                            type={showPassword ? "text" : "password"}
                            className={styles.inputField}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                [field]: e.target.value,
                              })
                            }
                            value={formData[field]}
                          />
                          <FontAwesomeIcon
                            icon={showPassword ? faEyeSlash : faEye}
                            className={styles.iconEyePassword}
                            onClick={() => setShowPassword(!showPassword)}
                          />
                        </div>
                      ) : (
                        <input
                          type="text"
                          className={styles.inputField}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              [field]: e.target.value,
                            })
                          }
                          value={formData[field]}
                          required={field !== "id"}
                        />
                      )}
                    </div>
                  );
                }
              })}
              <div className={styles.divButtons}>
                <button type="submit" className={styles.btnSubmit}>
                  {formData.id
                    ? "Update News Aggregator Source"
                    : "Create News Aggregator Source"}
                </button>
                <button
                  type="button"
                  className={styles.btnClear}
                  onClick={() =>
                    setFormData({
                      id: "",
                      nameOfOrg: "",
                      url: "",
                      apiKey: "",
                      isApi: false,
                      isRss: false,
                    })
                  }
                >
                  Clear
                </button>
              </div>
            </form>
          </div>

          <DynamicDbTable
            columnNames={columns}
            rowData={newsAggregatorsList}
            onDeleteRow={handleDelete}
            selectedRow={handleSelectRow}
          />
        </main>
      </div>
    </TemplateView>
  );
}
