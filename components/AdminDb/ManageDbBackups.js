import styles from "../../styles/Home.module.css";
import TemplateView from "../common/TemplateView";

export default function ManageDbBackups() {
  return (
    <TemplateView>
      <main className={styles.main}>
        {Array.from({ length: 100 }).map((_, index) => (
          <h1 key={index} className={styles.title}>
            Welcome to <a href="https://nextjs.org">Manage Database Backups</a>
          </h1>
        ))}
      </main>
    </TemplateView>
  );
}
