import styles from "../../styles/TemplateView.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../reducers/user";
import NavBarSideLink from "./navBarSide/NavBarSideLink";
import NavBarSideDropdown from "./navBarSide/NavBarSideDropdown";
export default function TemplateView({ children }) {
  const dispatch = useDispatch();

  const [menuOpen, setMenuOpen] = useState(true);
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const router = useRouter();

  // --- dynamic styles ---
  const menuWidth = "15rem";
  const { navigator } = router.query;
  const currentPath = navigator || router.pathname;

  return (
    <>
      <header className={styles.headerCustom}>
        <div className={styles.divHeaderLeft}>
          <img
            className={styles.imgNewsNexusLogo}
            src="/images/logoWhiteBackground.png"
            alt="NewsNexus Logo"
          />
        </div>
        <div className={styles.divHeaderMiddle}></div>
        <div className={styles.divHeaderRight}>
          {!menuOpen && (
            <button
              className={styles.hamburgerMenu}
              onClick={toggleMenu}
              aria-label="Toggle navigation menu"
            >
              <FontAwesomeIcon
                icon={faBars}
                className={styles.faHamburgerMenu}
              />
            </button>
          )}
        </div>
      </header>
      <div className={styles.divMain}>
        <div
          className={styles.divLeftChildren}
          style={{ marginRight: menuOpen ? menuWidth : "0" }}
        >
          {children}
        </div>
        <div
          className={styles.divRightMenu}
          style={{
            display: menuOpen ? "block" : "none",
          }}
        >
          {menuOpen && (
            <div className={styles.divRightMenuClose}>
              <button
                className={styles.hamburgerMenu}
                onClick={toggleMenu}
                aria-label="Toggle navigation menu"
              >
                <FontAwesomeIcon icon={faXmark} className={styles.faXmark} />
              </button>
            </div>
          )}

          <NavBarSideLink
            href="/"
            iconFilenameAndPath="/images/menu/house-solid.svg"
            label="Home"
          />
          <NavBarSideLink
            href="/get-articles/news-org-api-requests"
            iconFilenameAndPath="/images/menu/satellite-dish-solid.svg"
            label="NewsOrg API Requests"
          />
          <NavBarSideLink
            href="/login"
            iconFilenameAndPath="/images/menu/logout.svg"
            label="Logout"
            onEnterFunction={() => dispatch(logoutUser())}
          />
          <NavBarSideDropdown
            iconFilenameAndPath="/images/menu/database-solid.svg"
            label="Manage DB"
          >
            <NavBarSideLink
              href="/admin-db/manage-db-backups"
              // iconFilenameAndPath="/images/menu/database-solid.svg"
              label="Backups"
              style={{ padding: "0.25rem" }}
            />
            <NavBarSideLink
              href="/admin-db/manage-db-uploads"
              // iconFilenameAndPath="/images/menu/database-solid.svg"
              label="Uploads"
              style={{ padding: "0.25rem" }}
            />
          </NavBarSideDropdown>
        </div>
      </div>
    </>
  );
}
