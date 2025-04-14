import styles from "../../styles/ModalApproveArticle.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRectangleXmark } from "@fortawesome/free-solid-svg-icons";

export default function ModalApproveArticle({
  setIsOpen,
  cspcRefNumber,
  title,
  publicationName,
  publishedDate,
  state,
  content,
}) {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalTop}>
          <FontAwesomeIcon
            icon={faRectangleXmark}
            onClick={() => setIsOpen(false)}
            className={styles.closeModalIcon}
          />
          <h2>Approve Article </h2>
          <p style={{ marginTop: "-1rem" }}>(details for the pdf files)</p>

          <div style={{ padding: "1rem" }}>
            <span>Message to EM and Mark:</span>{" "}
            <span style={{ color: "red" }}>
              These fields are modifiedable so they can be different than the db
              if needed?
            </span>
          </div>
        </div>
        <div className={styles.divMainBottom}>
          <div className={styles.divRequestGroupInputWide}>
            <label htmlFor="keyword">Reference #:</label>
            <input
              className={styles.inputRequestKeyword}
              type="text"
              placeholder="enter word"
            />
          </div>
          <div className={styles.divRequestGroupInputWide}>
            <label htmlFor="keyword">Headline:</label>
            <input
              className={styles.inputRequestKeyword}
              type="text"
              placeholder="enter word"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
