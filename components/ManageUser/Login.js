import styles from "../../styles/ManageUser.module.css";
import InputPassword from "../common/InputPassword";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
export default function Login() {
  const [email, emailSetter] = useState("");
  const [password, passwordSetter] = useState("");
  // const dispatch = useDispatch();
  const router = useRouter();
  // const userReducer = useSelector((state) => state.user.value);
  const sendPasswordBackToParent = (passwordFromInputPasswordElement) => {
    passwordSetter(passwordFromInputPasswordElement);
  };
  return (
    <div>
      <main className={styles.main}>
        <div className={styles.divLeft}>
          <img
            className={styles.imgKmLogo}
            src="/images/logoWhiteBackground.png"
            alt="NewsNexus Logo"
          />
          <h1 className={styles.h1PageTitle}>Login</h1>

          <div className={styles.divEmailAndPassword}>
            <div className={styles.divInputGroup}>
              <label htmlFor="email">Email</label>
              <input
                className={styles.inputEmail}
                type="email"
                placeholder="example@gmail.com"
              />
            </div>
            <div className={styles.divInputGroup}>
              <label htmlFor="password">Password</label>
              <InputPassword
                sendPasswordBackToParent={sendPasswordBackToParent}
              />
            </div>
          </div>
        </div>
        <div className={styles.divRight}>
          <img
            className={styles.imgKmLogo}
            src="/images/kmLogo_square1500.png"
            alt="Km Logo"
          />
        </div>
      </main>
    </div>
  );
}
