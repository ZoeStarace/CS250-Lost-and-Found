import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Report from "./pages/Report";
import Dashboard from "./pages/Dashboard";

export default function App() {
    return (
        <Layout>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/search" element={<Search />} />
                <Route path="/report" element={<Report />} />
                <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
        </Layout>
    );
}