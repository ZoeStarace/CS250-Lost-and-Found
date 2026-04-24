import { Link } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../userState.jsx";
import { signout } from "../firebase.js";

export default function Layout({ children }) {
  const { loginState } = useContext(UserContext);

  return (
    <div>
      <nav
        style={{
          padding: "16px 28px",
          borderBottom: "1px solid #d9d9d9",
          display: "flex",
          alignItems: "center",
          gap: "24px",
          backgroundColor: "#ffffff",
        }}
      >
        <div
          style={{
            fontWeight: "700",
            fontSize: "1.2rem",
            color: "#a6192e",
            marginRight: "12px",
          }}
        >
          SDSU Lost & Found
        </div>

        <Link to="/" style={{ textDecoration: "none", color: "#1f1f1f" }}>
          Home
        </Link>

        <Link
          to="/search"
          style={{ textDecoration: "none", color: "#1f1f1f" }}
        >
          Search
        </Link>

        {loginState && (
          <Link
            to="/report"
            style={{ textDecoration: "none", color: "#1f1f1f" }}
          >
            Report
          </Link>
        )}

          {loginState && (
              <Link
                  to="/chat"
                  style={{ textDecoration: "none", color: "#1f1f1f" }}
              >
                  Chat
              </Link>
          )}

        <div style={{ marginLeft: "auto" }}></div>

        {loginState ? (
          <button
            onClick={signout}
            style={{
              backgroundColor: "#a6192e",
              color: "#ffffff",
              border: "none",
              padding: "10px 18px",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            Sign Out
          </button>
        ) : (
          <Link
            to="/login"
            style={{
              textDecoration: "none",
              color: "#ffffff",
              backgroundColor: "#a6192e",
              padding: "10px 18px",
              borderRadius: "6px",
              fontWeight: "600",
            }}
          >
            Login
          </Link>
        )}
      </nav>

      <div>{children}</div>
    </div>
  );
}