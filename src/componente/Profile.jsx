import React, { useEffect, useState } from "react";
import "./profile.css";
import { auth, db } from "../firebase/Firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";
import CountUp from "react-countup";
import {
  doc,
  onSnapshot
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function Profile() {

  const [user,setUser] = useState(null);
  const [userData,setUserData] = useState(null);
  const [completion,setCompletion] = useState(0);

  const navigate = useNavigate();

  // AUTH + REALTIME USER DATA
  useEffect(()=>{

    let unsubscribeDoc;

    const unsubscribeAuth = onAuthStateChanged(auth,(currentUser)=>{

      if(currentUser){

        setUser(currentUser);

        const userRef = doc(db,"users",currentUser.uid);

        unsubscribeDoc = onSnapshot(userRef,(snapshot)=>{

          const data = snapshot.data();
          setUserData(data);

          let fields = [
            data?.name,
            data?.phone,
            data?.gender,
            data?.age,
            data?.email
          ];

          let filled = fields.filter(Boolean).length;
          let percent = Math.round((filled / fields.length) * 100);

          setCompletion(percent);

        });

      }

    });

    return ()=>{
      unsubscribeAuth();
      if(unsubscribeDoc) unsubscribeDoc();
    };

  },[]);


  // LOGOUT
  const logout = async ()=>{
    await signOut(auth);
    window.location.replace("/login");
  };


  return(

  <div className="profile-container">

    <div className="video-overlay"></div>

    <div className="profile-wrapper">

      <div className="card profile-card shadow-lg">

        <div className="profile-cover"></div>

        <div
        className="edit-icon"
        onClick={()=>navigate("/edit-profile")}>
        ✏️
        </div>

        <img
        src={user?.photoURL || "/react.svg"}
        alt="profile"
        className="profile-img"
        />

        <div className="card-body text-center">

          {/* WALLET */}

          <div className="wallet-badge">
            💰 ₹
            <CountUp
              end={userData?.wallet ?? 0}
              duration={1.5}
              separator=","
            />
          </div>

          {/* MANAGE WALLET BUTTON */}

          <button
            className="btn btn-primary mt-3"
            onClick={() => navigate("/wallet")}
          >
            Manage Wallet
          </button>


          {/* PROFILE COMPLETION */}

          <div className="profile-progress mt-4">

            <div className="progress-text">
              Profile Completion {completion}%
            </div>

            <div className="progress">

              <div
              className="progress-bar"
              style={{width:`${completion}%`}}
              ></div>

            </div>

          </div>


          <hr/>


          {/* USER INFO */}

          <div className="profile-info">

            <h4 className="fw-bold info-box">
              {userData?.name || user?.displayName || "User Name"}
            </h4>

            <div className="info-box">
              {userData?.email || user?.email}
            </div>

            <div className="info-box">
              📱 Phone
              <span>{userData?.phone || "Not added"}</span>
            </div>

            <div className="info-box">
              👤 Gender
              <span>{userData?.gender || "Not added"}</span>
            </div>

            <div className="info-box">
              🎂 Age
              <span>{userData?.age || "Not added"}</span>
            </div>

            <div className="info-box">
              🆔 User ID
              <span>{user?.uid}</span>
            </div>

            <div className="info-box">
              ✉ Email Verified
              <span>{user?.emailVerified ? "Yes":"No"}</span>
            </div>

          </div>


          <hr/>

          <button
          className="btn btn-danger w-100"
          onClick={logout}>
          Logout
          </button>

        </div>
      </div>
    </div>
  </div>

  );

}