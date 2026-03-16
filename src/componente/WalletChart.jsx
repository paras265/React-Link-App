import { Bar } from "react-chartjs-2";
import {
 Chart as ChartJS,
 CategoryScale,
 LinearScale,
 BarElement,
 Title,
 Tooltip,
 Legend
} from "chart.js";

ChartJS.register(
 CategoryScale,
 LinearScale,
 BarElement,
 Title,
 Tooltip,
 Legend
);

export default function WalletChart({deposit,withdraw}){

 const data={
  labels:["Deposits","Withdrawals"],
  datasets:[
   {
    label:"Wallet Activity",
    data:[deposit,withdraw],
    backgroundColor:["#4CAF50","#f44336"]
   }
  ]
 };

 return <Bar data={data} />;
}