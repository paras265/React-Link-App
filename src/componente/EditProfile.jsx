import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase/Firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function EditProfile() {

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");

  // Load existing data
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

      }

    };

    fetchData();

  }, []);

  // Save updated profile
  const saveProfile = async () => {

    try {

      const user = auth.currentUser;

      const docRef = doc(db, "users", user.uid);

      await updateDoc(docRef, {
        name,
        phone,
        gender,
        age
      });

      alert("Profile Updated Successfully");

      navigate("/");

    } catch (error) {
      console.error(error);
      alert("Update Failed");
    }

  };

  return (

    <div className="container mt-5">

      <div className="card p-4 shadow">

        <h3 className="mb-4 text-center">Edit Profile</h3>

        <input
          type="text"
          className="form-control mb-3"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="text"
          className="form-control mb-3"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <select
          className="form-control mb-3"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>

        <input
          type="number"
          className="form-control mb-4"
          placeholder="Age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />

        <button
          className="btn btn-success w-100"
          onClick={saveProfile}
        >
          Save Changes
        </button>

      </div>

    </div>

  );
}