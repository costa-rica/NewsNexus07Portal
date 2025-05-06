import React from "react";
import styles from "../../../styles/modals/ModalLoading.module.css";

export default function ModalLoading({ isVisible }) {
  if (!isVisible) return null;
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.dotsLoader}>
        <div className={styles.dot}></div>
        <div className={styles.dot}></div>
        <div className={styles.dot}></div>
      </div>
    </div>
  );
}
