import { Routes, Route } from "react-router-dom";
import Profile from "./componente/Profile";

function App() {
  return (
    <>
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/" element={<Profile />} />
      </Routes>
    </>
  );
}

export default App;
