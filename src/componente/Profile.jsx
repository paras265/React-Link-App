import React from "react";
import profilePic from "../assets/react.svg";
import bgImage from "/public/professional-photo-background-zb0abc8ysodf81ui.jpg";
import "./Profile.css";

export default function Profile() {
  const user = {
    name: "Paras Vaghela",
    age: 25,
    gender: "Male",
    blockAmount: 50000,
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center profile-container"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="card shadow-lg p-4 text-center profile-card">
        <img
          src={profilePic}
          className="rounded-circle mx-auto mb-3 profile-img"
          alt="profile"
        />
        <h4 className="fw-bold">{user.name}</h4>
        <p className="text-muted mb-1">Age: {user.age}</p>
        <p className="text-muted mb-1">Gender: {user.gender}</p>
        <h5 className="block-amount mt-3">₹ {user.blockAmount}</h5>
        <button className="btn btn-primary mt-3 w-100">
          Contact
        </button>
      </div>
    </div>
  );
}