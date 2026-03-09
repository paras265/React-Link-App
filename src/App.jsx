import { Routes, Route } from "react-router-dom";
import Profile from "./componente/Profile";
import Login from "./pagesLS/Login";
import Signup from "./pagesLS/Signup";
import ProtectedRoute from "./auth/ProtectedRouter";
import EditProfile from "./componente/EditProfile";   // NEW

function App() {

  return (

      <Routes>

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />}/>

        {/* Profile Page */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Profile/>
            </ProtectedRoute>
          }
        />

        {/* Edit Profile Page */}
        <Route
          path="/edit-profile"
          element={
            <ProtectedRoute>
              <EditProfile/>
            </ProtectedRoute>
          }
        />

      </Routes>

  );
}

export default App;