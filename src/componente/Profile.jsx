import React, { useEffect, useState } from "react";
import "./profile.css";
import { auth, db } from "../firebase/Firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";
import CountUp from "react-countup";
import {
  doc,
  onSnapshot,
  updateDoc,
  addDoc,
  collection,
  serverTimestamp,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import WalletChart from "./WalletChart";
import { useNavigate } from "react-router-dom";

export default function Profile() {

  const [user,setUser] = useState(null);
  const [userData,setUserData] = useState(null);
  const [completion,setCompletion] = useState(0);
  const [amount,setAmount] = useState("");

  const [transactions,setTransactions] = useState([]);
  const [totalDeposit,setTotalDeposit] = useState(0);
  const [totalWithdraw,setTotalWithdraw] = useState(0);

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


  // REALTIME TRANSACTIONS
  useEffect(()=>{

    if(!user) return;

    const q = query(
      collection(db,"transactions"),
      where("uid","==",user.uid),
      orderBy("timestamp","desc")
    );

    const unsubscribeTx = onSnapshot(q,(snapshot)=>{

      const data = snapshot.docs.map(doc=>doc.data());

      setTransactions(data);

      const deposit = data
        .filter(t=>t.type==="deposit")
        .reduce((sum,t)=>sum + t.amount,0);

      const withdraw = data
        .filter(t=>t.type==="withdraw")
        .reduce((sum,t)=>sum + t.amount,0);

      setTotalDeposit(deposit);
      setTotalWithdraw(withdraw);

    });

    return ()=>unsubscribeTx();

  },[user]);


  // LOGOUT
  const logout = async ()=>{
    await signOut(auth);
    window.location.replace("/login");
  };


  // DEPOSIT
  const handleDeposit = async ()=>{

    if(!amount || Number(amount)<=0){
      alert("Enter valid amount");
      return;
    }

    const newBalance = Number(userData?.wallet || 0) + Number(amount);

    const userRef = doc(db,"users",user.uid);

    await updateDoc(userRef,{
      wallet:newBalance
    });

    await addDoc(collection(db,"transactions"),{

      uid:user.uid,
      type:"deposit",
      amount:Number(amount),
      balanceAfter:newBalance,
      timestamp:serverTimestamp()

    });

    setAmount("");

  };


  // WITHDRAW
  const handleWithdraw = async ()=>{

    if(!amount || Number(amount)<=0){
      alert("Enter valid amount");
      return;
    }

    if(Number(amount) > (userData?.wallet || 0)){
      alert("Insufficient balance");
      return;
    }

    const newBalance = (userData?.wallet || 0) - Number(amount);

    const userRef = doc(db,"users",user.uid);

    await updateDoc(userRef,{
      wallet:newBalance
    });

    await addDoc(collection(db,"transactions"),{

      uid:user.uid,
      type:"withdraw",
      amount:Number(amount),
      balanceAfter:newBalance,
      timestamp:serverTimestamp()

    });

    setAmount("");

  };


  return(

  <div className="profile-container">

    {/* <video autoPlay muted loop className="background-video">
      <source src="/12822975-uhd_3840_2160_60fps.mp4" type="video/mp4"/>
    </video> */}

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


          {/* WALLET INPUT */}

          <div className="wallet-actions">

            <input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e)=>setAmount(e.target.value)}
            className="wallet-input"
            />

            <div className="wallet-buttons">

              <button
              className="btn btn-success"
              onClick={handleDeposit}>
              Deposit
              </button>

              <button
              className="btn btn-warning"
              onClick={handleWithdraw}>
              Withdraw
              </button>

            </div>

          </div>


          {/* ANALYTICS */}

          <div className="wallet-analytics">

            <div>Total Deposited: ₹{totalDeposit}</div>

            <div>Total Withdrawn: ₹{totalWithdraw}</div>

            <div>Transactions: {transactions.length}</div>

          </div>


          {/* CHART */}

          <WalletChart
            deposit={totalDeposit}
            withdraw={totalWithdraw}
          />


          {/* PROFILE COMPLETION */}

          <div className="profile-progress">

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


          {/* TRANSACTION HISTORY */}

          <div className="transaction-box">

            <h5>Transaction History</h5>

            {transactions.map((t,i)=>(
              <div key={i} className="transaction-row">

                <span>
                  {t.type==="deposit" ? "🟢 +" : "🔴 -"}₹{t.amount}
                </span>

                <span>{t.type}</span>

              </div>
            ))}

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