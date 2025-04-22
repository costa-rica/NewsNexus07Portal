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
      <header
        className={`${styles.headerCustom} ${
          process.env.NEXT_PUBLIC_MODE !== "production"
            ? styles.headerCustomNonProduction
            : ""
        }`}
      >
        <div className={styles.divHeaderLeft}>
          <img
            className={styles.imgNewsNexusLogo}
            src="/images/logoWhiteBackground.png"
            alt="NewsNexus Logo"
          />
        </div>
        <div className={styles.divHeaderMiddle}>
          <div className={styles.divHeaderMiddleName}>
            {process.env.NEXT_PUBLIC_APP_NAME}
          </div>

          <div className={styles.divHeaderMiddleApiUrl}>
            {process.env.NEXT_PUBLIC_API_BASE_URL}
          </div>
        </div>
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
          <NavBarSideDropdown
            iconFilenameAndPath="/images/menu/satellite-dish-solid.svg"
            label="Get Articles"
            currentPath={currentPath}
          >
            <NavBarSideLink
              href="/articles/get-from-api-services"
              style={{ padding: "0.25rem" }}
              label="Old way"
              currentPath={currentPath}
            />
            <NavBarSideLink
              href="/articles/get-from-api-services-detailed"
              style={{ padding: "0.25rem" }}
              label="Detailed way"
              currentPath={currentPath}
            />
          </NavBarSideDropdown>

          <NavBarSideDropdown
            iconFilenameAndPath="/images/menu/newspaper-solid-white.svg"
            label="Manage Articles"
            currentPath={currentPath}
          >
            <NavBarSideLink
              href="/articles/review"
              // iconFilenameAndPath="/images/menu/newspaper-solid-white.svg"
              label="Review Articles"
              style={{ padding: "0.25rem" }}
              currentPath={currentPath}
            />
            <NavBarSideLink
              href="/articles/add-delete"
              // iconFilenameAndPath="/images/menu/newspaper-solid-white.svg"
              label="Add / Delete Article"
              style={{ padding: "0.25rem" }}
              currentPath={currentPath}
            />
          </NavBarSideDropdown>
          <NavBarSideLink
            href="/articles/reports"
            iconFilenameAndPath="/images/menu/file-invoice-solid.svg"
            label="Reports"
            currentPath={currentPath}
          />
          <NavBarSideLink
            href="/login"
            iconFilenameAndPath="/images/menu/logout.svg"
            label="Logout"
            onEnterFunction={() => dispatch(logoutUser())}
            currentPath={currentPath}
          />
          <NavBarSideDropdown
            iconFilenameAndPath="/images/menu/database-solid.svg"
            label="Manage DB"
            currentPath={currentPath}
          >
            <NavBarSideLink
              href="/admin-db/manage-db-backups"
              label="Backups"
              style={{ padding: "0.25rem" }}
              currentPath={currentPath}
            />
            <NavBarSideLink
              href="/admin-db/manage-db-uploads"
              label="Uploads"
              style={{ padding: "0.25rem" }}
              currentPath={currentPath}
            />
            <NavBarSideLink
              href="/admin-db/manage-users"
              label="Users"
              style={{ padding: "0.25rem" }}
              currentPath={currentPath}
            />
            <NavBarSideLink
              href="/admin-db/manage-db-deletes"
              label="Deletes"
              style={{ padding: "0.25rem" }}
              currentPath={currentPath}
            />
          </NavBarSideDropdown>
        </div>
      </div>
    </>
  );
}
