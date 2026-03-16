import { useEffect, useState } from "react";
import { db } from "../firebase/Firebase";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";

export default function AdminWallet(){

 const [users,setUsers] = useState([]);

 useEffect(()=>{

 const loadUsers = async()=>{

 const snapshot = await getDocs(collection(db,"users"));

 const data = snapshot.docs.map(doc=>({
  id:doc.id,
  ...doc.data()
 }));

 setUsers(data);

 };

 loadUsers();

 },[]);

 const updateWallet = async(id,newAmount)=>{

 const ref = doc(db,"users",id);

 await updateDoc(ref,{
  wallet:Number(newAmount)
 });

 };

 return(

 <div>

 <h2>Admin Wallet Control</h2>

 {users.map(u=>(
   <div key={u.id}>

    {u.name} ₹{u.wallet}

    <button
     onClick={()=>updateWallet(u.id,u.wallet+100)}
    >
     +100
    </button>

   </div>
 ))}

 </div>

 );

}