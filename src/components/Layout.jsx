import { Link } from "react-router-dom";

export default function Layout({ children }) {
  return (
    <div>
      <nav
        style={{
          padding: "16px 24px",
            backgroundColor: "#8C1S28",
            color: "white",
          borderBottom: "1px solid #ccc",
          marginBottom: 20,
          display: "flex",
          gap: "20px",
        }}
      >
          <Link to="/" style={{color: "white", textDecoration: "none", fontWeight: "bold"}} >
              SDSU Lost & Found
          </Link>
        <Link to="/home" style={{color:"white"}}>Home</Link>
        <Link to="/search" style={{color:"white"}}>Search</Link>
        <Link to="/report" style={{color:"white"}}>Report</Link>
        <Link to="/dashboard" style={{color:"white"}}>Dashboard</Link>
      </nav>
        <main style={{
            backgroundColor: "#A6192E",
            color: "white",
            margin: "20px auto",
            maxWidth: "1000px",
            borderRadius: "8px",
            padding: "20px",
        }}
        >
            {children}
        </main>
    </div>
  );
}
