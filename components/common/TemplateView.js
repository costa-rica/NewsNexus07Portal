import styles from "../../styles/TemplateView.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../reducers/user";
export default function TemplateView({
  children,
  onlyVersionsVisible = false,
}) {
  const dispatch = useDispatch();
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

  const router = useRouter();

  // --- dynamic styles ---
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

  const { navigator } = router.query;
  const currentPath = navigator || router.pathname;

  console.log(`currentPath : ${currentPath}`);
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
          Place all the navigation buttons here
          <Link href="/" passHref legacyBehavior>
            <a
              style={{
                display: "flex",
                alignItems: "center",
                padding: "1rem",
                color: "white",
                textDecoration: "none",
                backgroundColor:
                  router.pathname === "/" ? "black" : "transparent",
                border: "1px solid transparent",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.border = "1px solid white";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.border =
                  router.pathname === "/"
                    ? "1px solid black"
                    : "1px solid transparent";
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.backgroundColor = "black";
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.backgroundColor =
                  router.pathname === "/" ? "black" : "transparent";
              }}
            >
              <img
                src="/images/menu/house-solid.svg"
                alt="Home Icon"
                style={{ width: "1.5rem", marginRight: "1rem" }}
              />
              <span>Home</span>
            </a>
          </Link>
          <Link href="/get-articles/gnews" passHref legacyBehavior>
            <a
              style={{
                display: "flex",
                alignItems: "center",
                padding: "1rem",
                color: "white",
                textDecoration: "none",
                backgroundColor:
                  currentPath === "gnews" ? "black" : "transparent",
                border: "1px solid transparent",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.border = "1px solid white";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.border =
                  currentPath === "gnews"
                    ? "1px solid black"
                    : "1px solid transparent";
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.backgroundColor = "black";
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.backgroundColor =
                  currentPath === "gnews" ? "black" : "transparent";
              }}
              onClick={() => setMenuOpen(false)}
            >
              <img
                src="/images/menu/satellite-dish-solid.svg"
                alt="GNews Icon"
                style={{ width: "1.5rem", marginRight: "1rem" }}
              />
              <span>GNews</span>
            </a>
          </Link>
          <Link href="/login" passHref legacyBehavior>
            <a
              style={{
                display: "flex",
                alignItems: "center",
                padding: "1rem",
                color: "white",
                textDecoration: "none",
                backgroundColor:
                  currentPath === "login" ? "black" : "transparent",
                border: "1px solid transparent",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.border = "1px solid white";
                dispatch(logoutUser());
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.border =
                  currentPath === "login"
                    ? "1px solid black"
                    : "1px solid transparent";
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.backgroundColor = "black";
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.backgroundColor =
                  currentPath === "login" ? "black" : "transparent";
              }}
            >
              <img
                src="/images/menu/logout.svg"
                alt="Logout Icon"
                style={{ width: "1.5rem", marginRight: "1rem" }}
              />
              <span>Logout</span>
            </a>
          </Link>
          <Link href="/admin-db/manage-db-backups" passHref legacyBehavior>
            <a
              style={{
                display: "flex",
                alignItems: "center",
                padding: "1rem",
                color: "white",
                textDecoration: "none",
                backgroundColor:
                  currentPath === "manage-db-backups" ? "black" : "transparent",
                border: "1px solid transparent",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.border = "1px solid white";
                dispatch(logoutUser());
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.border =
                  currentPath === "manage-db-backups"
                    ? "1px solid black"
                    : "1px solid transparent";
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.backgroundColor = "black";
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.backgroundColor =
                  currentPath === "manage-db-backups" ? "black" : "transparent";
              }}
            >
              <img
                src="/images/menu/logout.svg"
                alt="Logout Icon"
                style={{ width: "1.5rem", marginRight: "1rem" }}
              />
              <span>Manage Backups</span>
            </a>
          </Link>
        </div>
      </div>
    </>
  );
}
