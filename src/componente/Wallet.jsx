import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase/Firebase";
import {
  doc,
  updateDoc,
  addDoc,
  collection,
  serverTimestamp,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "./wallet.css";
// import "./WalletChart";
import WalletChart from "./WalletChart";

export default function Wallet() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [amount, setAmount] = useState("");
  const [totalDeposit, setTotalDeposit] = useState(0);
  const [totalWithdraw, setTotalWithdraw] = useState(0);

  const [transactions, setTransactions] = useState([]);

  // ✅ AUTH FIX
 useEffect(() => {

  let unsubUser;

  const unsubscribe = auth.onAuthStateChanged((currentUser) => {

    if (currentUser) {
      setUser(currentUser);

      const userRef = doc(db, "users", currentUser.uid);

      unsubUser = onSnapshot(userRef, (snap) => {
        setUserData(snap.data());
      });
    }

  });

  return () => {
    unsubscribe();
    if (unsubUser) unsubUser();
  };

}, []);

  // ✅ TRANSACTIONS FIX
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "transactions"),
      where("uid", "==", user.uid),
      orderBy("timestamp", "desc"),
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setTransactions(data);

      const deposit = data
        .filter((t) => t.type === "deposit")
        .reduce((sum, t) => sum + t.amount, 0);

      const withdraw = data
        .filter((t) => t.type === "withdraw")
        .reduce((sum, t) => sum + t.amount, 0);

      setTotalDeposit(deposit);
      setTotalWithdraw(withdraw);
    });

    return () => unsub();
  }, [user]);

  // DEPOSIT
  const handleDeposit = async () => {
    if (!amount || Number(amount) <= 0) {
      alert("Enter valid amount");
      return;
    }

    const newBalance = Number(userData?.wallet || 0) + Number(amount);

    await updateDoc(doc(db, "users", user.uid), {
      wallet: newBalance,
    });

    await addDoc(collection(db, "transactions"), {
      uid: user.uid,
      type: "deposit",
      amount: Number(amount),
      balanceAfter: newBalance,
      timestamp: serverTimestamp(),
    });

    setAmount("");
  };

  // WITHDRAW
  const handleWithdraw = async () => {
    if (!amount || Number(amount) <= 0) {
      alert("Enter valid amount");
      return;
    }

    if (Number(amount) > (userData?.wallet || 0)) {
      alert("Insufficient balance");
      return;
    }

    const newBalance = (userData?.wallet || 0) - Number(amount);

    await updateDoc(doc(db, "users", user.uid), {
      wallet: newBalance,
    });

    await addDoc(collection(db, "transactions"), {
      uid: user.uid,
      type: "withdraw",
      amount: Number(amount),
      balanceAfter: newBalance,
      timestamp: serverTimestamp(),
    });

    setAmount("");
  };

  return (
    <div className="wallet-page">
     

      <div className="wallet-card">
         <button className="back-btn" onClick={() => navigate("/")}>
        ⬅ Back
      </button>
        <div className="wallet-title">Wallet</div>

        <div className="wallet-balance">Balance: ₹{userData?.wallet || 0}</div>

        <input
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="wallet-input"
        />

        <div className="wallet-buttons">
          <button className="deposit-btn" onClick={handleDeposit}>
            Deposit
          </button>

          <button className="withdraw-btn" onClick={handleWithdraw}>
            Withdraw
          </button>
        </div>

        <WalletChart deposit={totalDeposit} withdraw={totalWithdraw} />

        <div className="transaction-section">
          <div className="transaction-title">Transaction History</div>

          <div className="transaction-list">
            {transactions.map((t) => (
              <div key={t.id} className="transaction-item">
                {t.type === "deposit" ? "🟢 +" : "🔴 -"}₹{t.amount}
                <span>{t.type}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
