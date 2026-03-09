// import { useState } from "react";
// import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from "firebase/auth";
// import { auth } from "../firebase/Firebase";
// import { useNavigate } from "react-router-dom";

// export default function Signup() {

//   const [name,setName] = useState("");
//   const [email,setEmail] = useState("");
//   const [password,setPassword] = useState("");

//   const navigate = useNavigate();

//   const handleSignup = async (e) => {
//     e.preventDefault();

//     try {

//       const userCredential = await createUserWithEmailAndPassword(auth,email,password);

//       await updateProfile(userCredential.user,{
//         displayName:name
//       });

//       await sendEmailVerification(userCredential.user);

//       alert("Verification email has been sent. Please check your inbox.");

//       navigate("/login");

//     } catch(error) {
//       alert(error.message);
//     }
//   }

//   return (

//     <div className="container mt-5">
//       <h3>Signup</h3>

//       <form onSubmit={handleSignup}>

//         <input
//         type="text"
//         placeholder="Name"
//         className="form-control mb-3"
//         onChange={(e)=>setName(e.target.value)}
//         />

//         <input
//         type="email"
//         placeholder="Email"
//         className="form-control mb-3"
//         onChange={(e)=>setEmail(e.target.value)}
//         />

//         <input
//         type="password"
//         placeholder="Password"
//         className="form-control mb-3"
//         onChange={(e)=>setPassword(e.target.value)}
//         />

//         <button className="btn btn-primary">Create Account</button>

//       </form>

//     </div>
//   )
// }


import { useState } from "react";
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from "firebase/auth";
import { auth, db } from "../firebase/Firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function Signup() {

  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    try {

      // Create user
      const userCredential = await createUserWithEmailAndPassword(auth,email,password);

      const user = userCredential.user;

      // Update display name
      await updateProfile(user,{
        displayName:name
      });

      // Create Firestore user document
      await setDoc(doc(db,"users",user.uid),{

        name:name,
        email:email,
        age:"",
        gender:"",
        phone:"",
        wallet:0,
        createdAt:serverTimestamp()

      });

      // Send verification email
      await sendEmailVerification(user);

      alert("Verification email has been sent. Please check your inbox.");

      navigate("/login");

    } catch(error) {
      alert(error.message);
    }
  }

  return (

    <div className="container mt-5">
      <h3>Signup</h3>

      <form onSubmit={handleSignup}>

        <input
        type="text"
        placeholder="Name"
        className="form-control mb-3"
        onChange={(e)=>setName(e.target.value)}
        />

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

        <button className="btn btn-primary">Create Account</button>

      </form>

    </div>
  )
}