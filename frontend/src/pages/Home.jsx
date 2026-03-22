import { useNavigate } from "react-router-dom";
export default function Home() {
    const navigate = useNavigate();

    return (
        <div style={{ maxWidth: "1000px", margin: "0 auto", backgroundColor: "#a6192e" }}>
            <section style={{
                textAlign: "center",
                padding: "60px 20px",
            }}
            >
                <h1 style={{ fontSize: "3rem", marginBottom: "16px", color: "black"}}>
                    Lost and Found System
                </h1>

                <p style={{
                    fontSize: "1.1rem",
                    maxWidth: "700px",
                    margin: "0 auto 24px",
                    lineHeight: "1.6",
                }}
                >
                    Report lost items across SDSU and connect with those looking to recover them
                </p>

                <div style={{ display: "flex", justifyContent: "center", gap: "16px"}}>
                    <button
                        onClick={() => navigate("/search")}
                        style={{
                            padding: "12px 24px",
                            fontSize: "1rem",
                            cursor: "pointer",
                        }}
                    >
                        Search Items
                    </button>

                    <button
                        onClick={() => navigate("/report")}
                        style={{
                            padding: "12px 24px",
                            fontSize: "1rem",
                            cursor: "pointer",
                        }}
                    >
                        Report an Item
                    </button>
                </div>
            </section>

            <div style={{ padding: "20px"}}>
                <h2 style={{marginBottom: "20px", textAlign: "center", color: "#000000"}}>
                    How It Works
                </h2>
                <section style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: "20px",
                }}
                >
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                        gap: "20px",
                        color: "#000000"
                    }}
                    >
                        <div style={{
                            border: "1px solid #000000",
                            padding: "20px",
                            borderRadius: "8px",
                        }}
                        >
                            <h3>Report</h3>
                            <p>
                                Submit information about a lost or found item, including a description, category, and location
                            </p>
                        </div>
                        <div style={{
                            border: "1px solid #000000",
                            padding: "20px",
                            borderRadius: "8px",
                        }}
                        >
                            <h3>Search</h3>
                            <p>
                                Search for items using filters and descriptions
                            </p>
                        </div>
                        <div style={{
                            border: "1px solid #000000",
                            padding: "20px",
                            borderRadius: "8px",
                        }}
                        >
                            <h3>Connect</h3>
                            <p>
                                Contact the person who reported or found the item to arrange a return.
                            </p>
                        </div>
                    </div>
                </section>

                <section style={{padding: "40px 20px"}}>
                    <h2 style={{marginBottom: "20px", textAlign: "center", color: "#000000"}}>
                        Key Features
                    </h2>

                    <ul style={{
                        maxWidth: "700px",
                        margin: "0 auto",
                        lineHeight: "1.8",
                        fontSize: "1rem",
                        color: "#000000"
                    }}
                    >
                        <li>Lost and found item reporting</li>
                        <li>Search with filters and item descriptions</li>
                        <li>User dashboard for managing reports</li>
                        <li>Messaging system for communication</li>
                        <li>AI-assisted item matching</li>
                    </ul>
                </section>
            </div>
        </div>
    );
}