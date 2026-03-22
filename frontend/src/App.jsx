import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Report from "./pages/Report";
import Dashboard from "./pages/Dashboard";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import { useState, useEffect } from "react";
import { UserContext } from "./userState";
import { onAuthStateChanged } from "firebase/auth";
import { clientAuth } from "./firebase";

export default function App() {
  const [loginState, setLoginState] = useState(null);

  useEffect(() => {
    onAuthStateChanged(clientAuth, async (user) => {
      if (user) {
        setLoginState(true);
      } else {
        setLoginState(false);
      }
    });
  });

  return (
    <UserContext.Provider value={{ loginState, setLoginState }}>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route
            path="/report"
            element={loginState ? <Report /> : <Navigate to="/login" />}
          />
          <Route
            path="/dashboard"
            element={loginState ? <Dashboard /> : <Navigate to="/login" />}
          />
          <Route
            path="/signup"
            element={loginState ? <Navigate to="/" /> : <Signup />}
          />
          <Route
            path="/login"
            element={loginState ? <Navigate to="/" /> : <Login />}
          />
        </Routes>
      </Layout>
    </UserContext.Provider>
  );
}
