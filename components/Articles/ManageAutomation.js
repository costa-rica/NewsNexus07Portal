import styles from "../../styles/articles/ManageAutomation.module.css";
import TemplateView from "../common/TemplateView";
import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";

export default function ManageAutomation() {
  const userReducer = useSelector((state) => state.user);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
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

      if (
        result.excelFileNamesArray &&
        Array.isArray(result.excelFileNamesArray)
      ) {
        setFilesArray(result.excelFileNamesArray);
      } else {
        setFilesArray([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
      setFilesArray([]);
    }
  };

  const downloadExcelFile = async (fileName) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/automations/excel-file/${fileName}`,
        {
          headers: { Authorization: `Bearer ${userReducer.token}` },
        }
      );

      console.log(`Response status: ${response.status}`);

      if (!response.ok) {
        const errorText = await response.text(); // Log response text for debugging
        throw new Error(`Server Error: ${errorText}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file:", error.message);
    }
  };

  const sendExcelFile = async (file) => {
    if (file) {
      if (!filesArray.includes(file.name)) {
        alert(
          "Filename not recognized. Please select a file with a name from the list."
        );
        return;
      }

      const formData = new FormData();
      formData.append("file", file);

      const fileName = encodeURIComponent(file.name);

      fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/automations/excel-file/${fileName}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${userReducer.token}`,
          },
          body: formData,
        }
      )
        .then((res) => res.json())
        .then((data) => {
          alert("File uploaded successfully!");
          setSelectedFile(null);
          if (fileInputRef.current) {
            fileInputRef.current.value = ""; // Clear the input
          }
        })
        .catch((err) => {
          alert("Error uploading file: " + err.message);
        });
    }
  };

  return (
    <TemplateView>
      <main className={styles.main}>
        <h1 className={styles.title}>Manage Automation</h1>

        <div className={styles.divAutomationFileGroup}>
          <h3>Excel Spreadsheets</h3>

          {/* <div className={styles.divAutomationFileDetail}> */}
          {filesArray.map((file, index) => (
            <div key={index}>
              <button
                className={styles.btnFileLink}
                onClick={() => downloadExcelFile(file)}
              >
                {file}
              </button>
            </div>
          ))}

          <input
            ref={fileInputRef}
            className={styles.inputAutomationFileDetail}
            type="file"
            accept=".xlsx"
            onChange={(e) => {
              const selectedFile = e.target.files[0];
              setSelectedFile(selectedFile);
            }}
          />
          <button
            className={styles.btnUpload}
            onClick={() => {
              console.log("Upload button clicked – handled in input onChange.");
              sendExcelFile(selectedFile);
            }}
          >
            Upload
          </button>

          <div>
            <h4>Guide to modifying the excel files</h4>
            <ul>
              <li>
                andString column: will return all articles that have all the
                words in the string
              </li>
              <li>
                orString column: will return all articles that have any of the
                words in the string
              </li>
              <li>
                notString column: will return all articles that do not have any
                of the words in the string
              </li>
              <li> no commas in these strings spaces seperate the words</li>
              <li>
                quote the strings for words with spaces or any special
                characters !,?,$, etc.,
              </li>
              <li>
                For News API includeDomains and excludeDomains columns use
                commas, there is no https:// or www.
              </li>
              <li>
                - if domains do not match with what is found in database they
                will be omitted
              </li>
            </ul>
          </div>
        </div>
      </main>
    </TemplateView>
  );
}
