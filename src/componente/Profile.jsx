import React, { useEffect, useState } from "react";
import "./profile.css";
import { auth, db } from "../firebase/Firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [completion, setCompletion] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setUserData(data);

          // profile completion calculate
          let fields = [
            data.name,
            data.phone,
            data.gender,
            data.age,
            data.email,
          ];

          let filled = fields.filter(Boolean).length;
          let percent = Math.round((filled / fields.length) * 100);

          setCompletion(percent);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await signOut(auth);
    window.location.replace("/login");
  };

  return (
    <div className="profile-container">
      <video autoPlay muted loop className="background-video">
        <source src="/12822975-uhd_3840_2160_60fps.mp4" type="video/mp4" />
      </video>

      <div className="video-overlay"></div>

      <div className="profile-wrapper">
        <div className="card profile-card shadow-lg">
          {/* banner */}
          <div className="profile-cover"></div>

          {/* edit icon */}
          <div className="edit-icon" onClick={() => navigate("/edit-profile")}>
            ✏️
          </div>

          {/* avatar */}
          <img
            src={user?.photoURL || "/react.svg"}
            alt="profile"
            className="profile-img"
          />

          <div className="card-body text-center">
          

            {/* wallet badge */}
            <div className="wallet-badge">💰 ₹{userData?.wallet ?? 0}</div>

            {/* completion */}
            <div className="profile-progress">
              <div className="progress-text">
                Profile Completion {completion}%
              </div>

              <div className="progress">
                <div
                  className="progress-bar"
                  style={{ width: `${completion}%` }}
                ></div>
              </div>
            </div>

            <hr />

            {/* info grid */}
            <div className="profile-info">

               {/* name */}
            <h4 className="fw-bold info-box">
              {userData?.name || user?.displayName || "User Name"}
            </h4>

            {/* email */}
            <div className=" info-box">{userData?.email || user?.email}</div>
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
                <span>{user?.emailVerified ? "Yes" : "No"}</span>
              </div>
            </div>

            <hr />

            <button className="btn btn-danger w-100" onClick={logout}>
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
