import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Profile from "./componente/Profile";
import Login from "./pagesLS/Login";
import Signup from "./pagesLS/Signup";
import ProtectedRoute from "./auth/ProtectedRouter";
import EditProfile from "./componente/EditProfile";
import AdminWallet from "./componente/AdminWallet";
import Wallet from "./componente/Wallet";
import "./index.css";

function App() {

   const [darkMode, setDarkMode] = useState(false);

  // APPLY CLASS ON BODY
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
      document.body.classList.remove("light-mode");
    } else {
      document.body.classList.add("light-mode");
      document.body.classList.remove("dark-mode");
    }
  }, [darkMode]);

//   useEffect(() => {
//   const saved = localStorage.getItem("darkMode");
//   if(saved === "true") setDarkMode(true);
// }, []);

// useEffect(() => {
//   localStorage.setItem("darkMode", darkMode);
// }, [darkMode]);

  return (

    <>
      {/* 🌙 TOGGLE BUTTON */}
      <div className="theme-toggle">
        <button onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "☀ Light" : "🌙 Dark"}
        </button>
      </div>

    <Routes>
       {/* PUBLIC ROUTES */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

       {/* PROTECTED ROUTES */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Profile/>
          </ProtectedRoute>
        }
      />

      <Route
        path="/wallet"   // ✅ NEW ROUTE
        element={
          <ProtectedRoute>
            <Wallet/>
          </ProtectedRoute>
        }
      />

      <Route
        path="/edit-profile"
        element={
          <ProtectedRoute>
            <EditProfile/>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin-wallet"
        element={
          <ProtectedRoute>
            <AdminWallet/>
          </ProtectedRoute>
        }
      />

    </Routes>
     </>
  );
}

export default App;