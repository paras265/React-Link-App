import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase/Firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "./editProfile.css";

export default function EditProfile() {

  const navigate = useNavigate();

  // USER INFO
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");

  // BANK DETAILS
  const [accountNumber,setAccountNumber] = useState("");
  const [ifsc,setIfsc] = useState("");

  const [hasBank,setHasBank] = useState(false);

  // LOAD DATA
  useEffect(() => {

    const fetchData = async () => {

      const user = auth.currentUser;
      if (!user) return;

      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {

        const data = docSnap.data();

        setName(data.name || "");
        setPhone(data.phone || "");
        setGender(data.gender || "");
        setAge(data.age || "");

        // BANK DATA
        if(data.bankDetails){
          setAccountNumber(data.bankDetails.accountNumber || "");
          setIfsc(data.bankDetails.ifsc || "");
          setHasBank(true);
        }

      }

    };

    fetchData();

  }, []);

  // SAVE PROFILE + BANK
  const saveProfile = async () => {

    try {

      const user = auth.currentUser;
      if (!user) return;

      const docRef = doc(db, "users", user.uid);

      await updateDoc(docRef, {
        name,
        phone,
        gender,
        age,
        bankDetails:{
          accountNumber,
          ifsc
        }
      });

      alert("Profile Updated Successfully");

      navigate("/");

    } catch (error) {
      console.error(error);
      alert("Update Failed");
    }

  };

  // MASK ACCOUNT NUMBER
  const maskedAccount = accountNumber
    ? "****" + accountNumber.slice(-4)
    : "";

  return (

    
     <div className="edit-page"> 
      <div className="edit-card">

      <div className=" p-4 shadow">

        <h3 className="mb-4 text-center">Edit Profile</h3>

        {/* USER INFO */}

        <label className="input-label">Name</label>
        <input
          type="text"
          className="custom-input mb-3"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label className="input-label">Phone</label>
        <input
          type="text"
          className="custom-input mb-3"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <label className="input-label">Gender</label>
        <select
          className="custom-input mb-3"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>

        <label className="input-label">Age</label>
        <input
  type="number"
  className="custom-input"
  placeholder="Enter age"
  value={age}
  onChange={(e) => setAge(e.target.value)}
/>

        <hr/>

        {/* BANK SECTION */}

       <h5 className="section-title ">Bank Details</h5>

{hasBank ? (
  <div className="bank-display">
    <div><strong>Account:</strong> {maskedAccount}</div>
    <div><strong>IFSC:</strong> {ifsc}</div>

    <button
      className="edit-btn"
      onClick={()=>setHasBank(false)}
    >
      Edit Bank Details
    </button>
  </div>
) : (
  <>
    <label className="input-label">Account Number</label>
    <input
      type="text"
      className="custom-input"
      placeholder="Enter account number"
      value={accountNumber}
      onChange={(e)=>setAccountNumber(e.target.value)}
    />

    <label className="input-label">IFSC Code</label>
    <input
      type="text"
      className="custom-input"
      placeholder="Enter IFSC code"
      value={ifsc}
      onChange={(e)=>setIfsc(e.target.value)}
    />
  </>
)}

        <button
          className="btn btn-success w-100"
          onClick={saveProfile}
        >
          Save Changes
        </button>

      </div>
      </div>
    </div>

  );
}