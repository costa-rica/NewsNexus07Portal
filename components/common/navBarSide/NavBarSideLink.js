import Link from "next/link";
import { useRouter } from "next/router";

export default function NavBarSideLink({
  href,
  iconFilenameAndPath = false,
  style,
  label,

  onEnterFunction = () => {},
}) {
  const router = useRouter();
  // Define default styles
  const defaultStyles = {
    display: "flex",
    alignItems: "center",
    padding: "1rem",
    color: "white",
    textDecoration: "none",
    backgroundColor: router.pathname === href ? "black" : "transparent",
    border: "1px solid transparent",
  };
  // Merge provided style with default styles
  const mergedStyle = { ...defaultStyles, ...style };

  return (
    <Link href={href} passHref legacyBehavior>
      <a
        style={mergedStyle}
        onMouseEnter={(e) => {
          e.currentTarget.style.border = "1px solid white";
          onEnterFunction();
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.border =
            router.pathname === href
              ? "1px solid black"
              : "1px solid transparent";
        }}
        onMouseDown={(e) => {
          e.currentTarget.style.backgroundColor = "black";
        }}
        onMouseUp={(e) => {
          e.currentTarget.style.backgroundColor =
            router.pathname === href ? "black" : "transparent";
        }}
      >
        {iconFilenameAndPath && (
          <img
            src={iconFilenameAndPath}
            alt={`<${label} Icon>`}
            style={{ width: "1.5rem", marginRight: "1rem", color: "white" }}
          />
        )}
        <span>{label}</span>
      </a>
    </Link>
  );
}
