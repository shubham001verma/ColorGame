import React, { useEffect, useState } from 'react';
import BottomTab from '../../components/BottomTab';
import Navbar from '../../components/Navbar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ReferralTree from '../../components/ReferralTree';
import API_BASE_URL from "../../components/Config";
const defaultWallet = {
  mainBalance: 0,
  referralBalance: 0,
  totalDeposits: 0,
  totalWithdrawals: 0,
};

const WalletPage = () => {
  const userId = sessionStorage.getItem('useridcolorapp');
  const [wallet, setWallet] = useState(defaultWallet);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  const fetchWallet = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/wallet/${userId}`);
      const data = await res.json();
      if (data.success && data.wallet) {
        setWallet(data.wallet);
      }
    } catch (err) {
      console.error('Error fetching wallet:', err);
    }
  };

const fetchReferralData = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/api/user/referrals/${userId}`);
    if (res.data.success && res.data.user && Array.isArray(res.data.referralTree)) {
      const rootUser = {
        ...res.data.user,
        level: 0,
        downlines: res.data.referralTree
      };
      setUserData(rootUser);
    } else {
      console.error("Invalid referral data");
    }
  } catch (err) {
    console.error('Error fetching referral tree:', err);
  }
};

  useEffect(() => {
    if (!userId) {
      navigate('/user/login');
    } else {
      fetchWallet();
      fetchReferralData();
    }
  }, [userId, navigate]);

  const totalBalance = wallet.mainBalance + wallet.referralBalance;
  const mainPercent = totalBalance > 0 ? (wallet.mainBalance / totalBalance) * 100 : 0;
  const referralPercent = totalBalance > 0 ? (wallet.referralBalance / totalBalance) * 100 : 0;

  return (
    <div className="w-screen flex justify-center min-h-screen bg-[#9195a3]">
      <Navbar />
      <div className="w-full max-w-[500px] mx-auto pt-[60px] pb-[90px] px-4 bg-white">
        {/* Wallet Summary */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl text-white py-6 text-center shadow-md">
          <div className="text-2xl font-bold">Wallet</div>
          <div className="text-3xl font-bold mt-2">₹{totalBalance.toFixed(2)}</div>
          <div className="text-sm text-white/80 mt-1">Total balance</div>

          <div className="flex justify-around mt-4 text-xs">
            <div>
              <p className="font-semibold">₹{wallet.totalWithdrawals.toFixed(2)}</p>
              <p className="text-white/80">Total withdrawal</p>
            </div>
            <div>
              <p className="font-semibold">₹{wallet.totalDeposits.toFixed(2)}</p>
              <p className="text-white/80">Total deposit</p>
            </div>
          </div>
        </div>

        {/* Wallet Breakdown */}
        <div className="bg-white shadow-sm rounded-xl mt-4 p-4 flex justify-around text-center">
          <div>
            <div className="relative w-20 h-20 rounded-full border-8 border-primary flex items-center justify-center font-bold text-primary">
              {Math.round(mainPercent)}%
            </div>
            <p className="mt-2 font-semibold text-gray-700">₹{wallet.mainBalance.toFixed(2)}</p>
            <p className="text-sm text-gray-500">Main wallet</p>
          </div>
          <div>
            <div className="relative w-20 h-20 rounded-full border-8 border-primary flex items-center justify-center font-bold text-primary">
              {Math.round(referralPercent)}%
            </div>
            <p className="mt-2 font-semibold text-gray-700">₹{wallet.referralBalance.toFixed(2)}</p>
            <p className="text-sm text-gray-500">Referral wallet</p>
          </div>
        </div>

        {/* Referral Tree */}
        <div className="px-4 py-6 bg-gray-50 mt-6 rounded-xl shadow-inner">
          <h2 className="text-2xl font-bold text-center mb-6">Referral Tree</h2>
          {userData ? (
            <ReferralTree user={userData} />
          ) : (
            <p className="text-center text-sm text-gray-500">Loading tree...</p>
          )}
        </div>
      </div>
      <BottomTab />
    </div>
  );
};

export default WalletPage;
