import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  const [successMessage, setSuccessMessage] = useState(location.state?.message || "");

  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);

      const timer = setTimeout(() => {
        setSuccessMessage("");
        window.history.replaceState({}, document.title);
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [location.state]);

  const tileStyle = {
    backgroundColor: "#a6192e",
    color: "#ffffff",
    border: "none",
    padding: "28px 24px",
    minHeight: "120px",
    borderRadius: "0",
    fontSize: "1.3rem",
    fontWeight: "700",
    cursor: "pointer",
    textAlign: "left",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
  };

  return (
    <div style={{ backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <section
        style={{
          backgroundColor: "#a6192e",
          color: "#ffffff",
          padding: "72px 24px 64px",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: "3.2rem",
            marginBottom: "16px",
            fontWeight: "700",
          }}
        >
          SDSU Lost & Found
        </h1>

        <p
          style={{
            fontSize: "1.15rem",
            maxWidth: "760px",
            margin: "0 auto",
            lineHeight: "1.7",
          }}
        >
          Report lost or found items on campus, search the item database, and
          help connect SDSU students and staff with their belongings.
        </p>
      </section>

      <section
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "48px 24px",
        }}
      >
        {successMessage && (
          <div
            style={{
              backgroundColor: "#e8f5e9",
              color: "#1b5e20",
              border: "1px solid #c8e6c9",
              padding: "16px 20px",
              marginBottom: "28px",
              borderRadius: "8px",
              fontWeight: "600",
            }}
          >
            {successMessage}
          </div>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "24px",
            marginBottom: "56px",
          }}
        >
          <button style={tileStyle} onClick={() => navigate("/search")}>
            Search Items
          </button>

          <button style={tileStyle} onClick={() => navigate("/report")}>
            Report an Item
          </button>

          <button style={tileStyle} onClick={() => navigate("/login")}>
            Login / Account
          </button>

          <button
            style={tileStyle}
            onClick={() =>
              window.open("https://library2.sdsu.edu/wayfinder/", "_blank")
            }
          >
            SDSU Map
          </button>
        </div>

        <div
          style={{
            backgroundColor: "#ffffff",
            padding: "36px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
            marginBottom: "32px",
          }}
        >
          <h2
            style={{
              fontSize: "2rem",
              marginBottom: "20px",
              color: "#1f1f1f",
            }}
          >
            How It Works
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "24px",
            }}
          >
            <div>
              <h3 style={{ color: "#a6192e" }}>1. Report</h3>
              <p style={{ color: "#333333", lineHeight: "1.7" }}>
                Submit details about a lost or found item, including description,
                category, color, and location.
              </p>
            </div>

            <div>
              <h3 style={{ color: "#a6192e" }}>2. Search</h3>
              <p style={{ color: "#333333", lineHeight: "1.7" }}>
                Search the database using keywords and filters to find possible
                matches.
              </p>
            </div>

            <div>
              <h3 style={{ color: "#a6192e" }}>3. Recover</h3>
              <p style={{ color: "#333333", lineHeight: "1.7" }}>
                Use the system to identify matching items and recover your lost item.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}