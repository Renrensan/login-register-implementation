import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { RegisterForm } from "./components/forms/register-form";
import { LoginForm } from "./components/forms/login-form";
import { Dashboard } from "./pages/dashboard";
import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  axios.defaults.withCredentials = true;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({});

  useEffect(() => {
    checkLoggedIn();
  }, []);

  const checkLoggedIn = async () => {
    try {
      const res = await axios.get("http://localhost:5000/user");
      if (res.status === 200) {
        setIsLoggedIn(true);
        const fetchedData = res.data.data;
        setUserData(fetchedData);
      }
    } catch (error) {
      console.error("Error checking login status:", error);
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return <div>Loading...</div>;
  }

  const handleLogin = async () => {
    setIsLoggedIn(true);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            isLoggedIn ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/dashboard"
          element={
            isLoggedIn ? (
              <Dashboard username={userData.username} email={userData.email} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/login"
          element={
            isLoggedIn ? <Navigate to="/dashboard" replace /> : <LoginForm />
          }
        />
        <Route
          path="/register"
          element={
            isLoggedIn ? <Navigate to="/dashboard" replace /> : <RegisterForm />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
