import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/Firebase";
import { useNavigate,Link } from "react-router-dom";

export default function Login() {

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async(e) => {
    e.preventDefault();

    try{

      const userCredential = await signInWithEmailAndPassword(auth,email,password);

      if(!userCredential.user.emailVerified){
        alert("Please verify your email first.");
        return;
      }

      navigate("/");

    }catch(error){
      alert(error.message);
    }
  }

  return(

    <div className="container mt-5">
      <h3>Login</h3>

      <form onSubmit={handleLogin}>

        <input
        type="email"
        placeholder="Email"
        className="form-control mb-3"
        onChange={(e)=>setEmail(e.target.value)}
        />

        <input
        type="password"
        placeholder="Password"
        className="form-control mb-3"
        onChange={(e)=>setPassword(e.target.value)}
        />

        <button className="btn btn-success">Login</button>

      </form>

      <p className="mt-3">
        New user? <Link to="/signup">Signup</Link>
      </p>

    </div>

  )
}