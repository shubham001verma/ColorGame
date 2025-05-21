import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_BASE_URL from "../components/Config";
import {
  User,
  DollarSign,
  Trophy,
  Hand,
  TrendingUp,
  TrendingDown,
  Percent,
  BarChart,
  XCircle
} from 'lucide-react';

const TopCard = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalBets, setTotalBets] = useState(0);
    const [totalWins, setTotalWins] = useState(0);
  const [profitStats, setProfitStats] = useState({
    totalBet: 0,
    totalWin: 0,
    totalCommission: 0,
    profit: 0,
    loss: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await axios.get(`${API_BASE_URL}/api/user/countuser`);
        const betRes = await axios.get(`${API_BASE_URL}/api/bet/betcount`);
        const profitRes = await axios.get(`${API_BASE_URL}/api/report/profit-report`);
        const winRes = await axios.get(`${API_BASE_URL}/api/report/total-wins`);

       console.log('Users:', userRes.data);
console.log('Bets:', betRes.data);
console.log('Profit:', profitRes.data?.report);
console.log('Wins:', winRes.data);

        setTotalUsers(userRes.data.count);
      
        setTotalBets(betRes.data.count);
        setProfitStats(profitRes.data?.report || {});
        setTotalWins(winRes.data.totalWins);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container mx-auto mt-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {/* Basic Stats */}
        <Card icon={<User size={40} color="#007bff" />} label="Total Users" value={totalUsers} />
        <Card icon={<DollarSign size={40} color="#28a745" />} label="Total Bets" value={totalBets} />
        {/* <Card icon={<Hand size={40} color="#ffc107" />} label="Active Matches" value="5" /> */}
        <Card icon={<Trophy size={40} color="#dc3545" />} label="Total Wins" value={totalWins} />

        {/* Profit Report */}
        <Card icon={<BarChart size={40} color="#6610f2" />} label="Total Bet Amount" value={`₹${profitStats.totalBet}`} />
        <Card icon={<TrendingDown size={40} color="#e83e8c" />} label="Total Win Amount" value={`₹${profitStats.totalWin}`} />
        <Card icon={<Percent size={40} color="#fd7e14" />} label="Total Commission" value={`₹${profitStats.totalCommission}`} />
        <Card icon={<TrendingUp size={40} color="#198754" />} label="Total Profit" value={`₹${profitStats.profit}`} />
        <Card icon={<XCircle size={40} color="#ff0000" />} label="Total Loss" value={`₹${profitStats.loss}`} />
      </div>
    </div>
  );
};

const Card = ({ icon, label, value }) => (
  <div className="card shadow-lg p-4 flex flex-col items-center bg-white rounded-lg">
    {icon}
    <h5 className="mt-2 text-lg font-semibold dark:text-gray-200">{label}</h5>
    <p className="text-xl dark:text-white">{value}</p>
  </div>
);

export default TopCard;
