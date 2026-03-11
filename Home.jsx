import { useNavigate } from "react-router-dom";

export default function Home() {
    const navigate = useNavigate();

    return (
        <div>
            <h1>Lost and Found System</h1>
            <button onClick={() => navigate("/search")}>Search</button>
            <button onClick={() => navigate("/report")} style={{ marginLeft: 10 }}>
                Report
            </button>
        </div>
    );
}