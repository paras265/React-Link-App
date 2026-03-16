import { Routes, Route } from "react-router-dom";
import Profile from "./componente/Profile";
import Login from "./pagesLS/Login";
import Signup from "./pagesLS/Signup";
import ProtectedRoute from "./auth/ProtectedRouter";
import EditProfile from "./componente/EditProfile";
import AdminWallet from "./componente/AdminWallet";

function App() {

  return (

    <Routes>

      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Profile/>
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

  );
}

export default App;