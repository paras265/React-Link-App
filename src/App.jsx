import { Routes, Route } from "react-router-dom";
import Profile from "./componente/Profile";


function Home() {
  return <h1>HOME PAGE</h1>;
}

function App() {
  
  return (
    <>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/user-info" element={<Profile />} />
    </Routes>
    </>
  )
}

export default App;
