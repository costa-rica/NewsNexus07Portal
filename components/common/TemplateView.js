import styles from "../../styles/TemplateView.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";

export default function TemplateView({
  children,
  onlyVersionsVisible = false,
}) {
  const [headerHeight, setHeaderHeight] = useState(
    typeof window !== "undefined" && window.innerWidth >= 768 ? "8rem" : "5rem"
  );

  useEffect(() => {
    const updateHeaderHeight = () => {
      setHeaderHeight(window.innerWidth >= 768 ? "8rem" : "5rem");
    };
    window.addEventListener("resize", updateHeaderHeight);
    return () => window.removeEventListener("resize", updateHeaderHeight);
  }, []);

  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  // --- dynamic styles ---
  // const headerHeight = "8rem";
  const menuWidth = "15rem";
  const styleHeader = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    zIndex: 1000,
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    display: "flex",
    alignItems: "center",
    height: headerHeight,
  };
  const styleRightMenu = {
    position: "fixed",
    zIndex: 1000,
    right: 0,
    top: headerHeight,
    width: menuWidth,
    height: "100vh",
    // border: "4px dashed gray",
  };
  return (
    <>
      <header className={styles.headerCustom} style={styleHeader}>
        <div className={styles.divHeaderLeft}>
          <img
            className={styles.imgNewsNexusLogo}
            src="/images/logoWhiteBackground.png"
            alt="NewsNexus Logo"
          />
        </div>
        <div className={styles.divHeaderMiddle}></div>
        <div className={styles.divHeaderRight}>
          <button
            className={styles.hamburgerMenu}
            onClick={toggleMenu}
            aria-label="Toggle navigation menu"
          >
            <FontAwesomeIcon
              icon={menuOpen ? faXmark : faBars}
              className={styles.faHamburgerMenu}
            />
          </button>
        </div>
      </header>
      <div className={styles.divMain} style={{ marginTop: headerHeight }}>
        <div
          className={styles.divLeftChildren}
          style={{ marginRight: menuOpen ? menuWidth : "0" }}
        >
          {children}
        </div>
        <div
          className={styles.divRightMenu}
          style={{
            ...styleRightMenu,
            display: menuOpen ? "block" : "none",
          }}
        >
          Place all the navigaiton buttons here
        </div>
      </div>
    </>
  );
}
