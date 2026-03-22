import { Link } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../userState.jsx";
import { signout } from "../firebase.js";

export default function Layout({ children }) {
  const { loginState, setLoginState } = useContext(UserContext);
  return (
    <div>
      <nav
        style={{
          padding: "12px 20px",
          borderBottom: "1px solid #ccc",
          display: "flex",
          gap: 20,
        }}
      >
        <Link to="/">Home</Link>
        <Link to="/search">Search</Link>
        {loginState ? (
          <>
            <Link to="/report">Report</Link>
            <Link to="/dashboard">Dashboard</Link>
          </>
        ) : (
          ""
        )}
        <div style={{ marginLeft: "auto" }}></div>
        {loginState ? (
          <>
            <label className="signout-label" onClick={signout}>
              Sign Out
            </label>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
          </>
        )}
      </nav>

      <div>{children}</div>
    </div>
  );
}
