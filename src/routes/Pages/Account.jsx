import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import BottomTab from '../../components/BottomTab';
import { BsWallet2, BsSafe, BsClockHistory } from 'react-icons/bs';
import { AiOutlineDollarCircle } from 'react-icons/ai';
import { MdOutlineAttachMoney, MdOutlineAccountBalanceWallet } from 'react-icons/md';
import img1 from '../../assets/user-1.jpg'; // Dummy image import
import { FiEdit } from 'react-icons/fi';
import API_BASE_URL from '../../components/Config'
import { BsThreeDotsVertical } from "react-icons/bs";
import { FiShare2 } from 'react-icons/fi';
const Account = () => {
  const navigate = useNavigate();
  const userId = sessionStorage.getItem('useridcolorapp');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
const [menuOpen, setMenuOpen] = useState(false);
  const fetchUser = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/user/singleuser/${userId}`);
      const data = await res.json();
    console.log(data)
        setUser(data);
    
    } catch (err) {
      console.error('Error fetching user:', err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };
  const handleShare = async (refCode) => {
  if (navigator.share) {
    try {
      await navigator.share({
        text: refCode // ✅ Only share the referral code
      });
    } catch (error) {
      console.error('Share failed:', error);
    }
  } else {
    try {
      await navigator.clipboard.writeText(refCode);
      alert('Referral code copied to clipboard!');
    } catch (err) {
      console.error('Clipboard copy failed:', err);
    }
  }
};

const handleLogout = () => {
  sessionStorage.clear('useridcolorapp', userId);
  navigate("/user/login");
};
  useEffect(() => {
    if (!userId) {
      navigate('/user/login');
    } else {
      fetchUser();
    }
  }, [userId, navigate]);

  const displayName = user?.username || user?.name || 'Guest User';
  const displayUID = user?.uid || user?._id?.slice(0, 6) || 'XXXXXX';
    const referralCode = user?.referralCode || user?._id?.slice(0, 6) || 'XXXXXX';
  const displayBalance = user?.walletId?.mainBalance?.toFixed(2) || '0.00';
  const image = user?.image || img1;
  return (
    <>
       <div className="w-screen flex justify-center min-h-screen bg-[#9195a3] ">
      <Navbar />
      <div className="w-full max-w-[500px] mx-auto pt-[60px] pb-[90px]   px-4 bg-white">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl p-4 flex items-start justify-between">
  <div className="flex items-center gap-4">
      <img
        src={user?.image ? `${API_BASE_URL}/${user.image}` : img1}
        alt="Profile"
        className="w-16 h-16 rounded-full border-2 border-white object-cover"
      />
      <div>
        <h2 className="font-bold text-lg uppercase">{displayName}</h2>
        <p className="text-xs">
          UID: <span className="bg-white/20 px-2 py-1 rounded">{displayUID}</span>
        </p>
        <p className="text-xs flex items-center gap-1">
  Referral Code: 
  <span className="bg-white/20 px-2 py-1 rounded">{referralCode}</span>
  <button
    onClick={() => handleShare(referralCode)}
    className="text-white hover:text-yellow-200"
    title="Share Referral Code"
  >
    <FiShare2 size={16} />
  </button>
</p>
        <p className="text-xs">Last login: {new Date().toLocaleString()}</p>
      </div>
    </div>

    {/* Right - 3 Dots Menu */}
    <div className="relative">
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="text-white text-xl"
      >
        <BsThreeDotsVertical />
      </button>

      {menuOpen && (
        <div className="absolute right-0 mt-2 bg-white text-black rounded-md shadow-lg w-40 z-10">
          <NavLink
            to={`/updateprofile/${userId}`}
            className="w-full px-4 py-2 text-left "
          >
         Edit Profile
          </NavLink>
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 text-left "
          >
           Logout
          </button>
        </div>
      )}
    </div>


    
  </div>

        {/* Balance Card */}
        <div className="bg-white rounded-xl shadow-md mt-4 p-4">
          <p className="text-sm text-gray-500 mb-1">Total balance</p>
          <h3 className="text-2xl font-bold text-black mb-3">₹{displayBalance}</h3>
          <div className="grid grid-cols-4 gap-4 text-center text-sm font-semibold text-gray-700">
    
           <div
  onClick={() => navigate(`/depositwithdeaw/deposit/${userId}`)}
  className="flex flex-col items-center cursor-pointer"
>
  <AiOutlineDollarCircle size={24} className="text-orange-400" />
  Deposit
</div>

<div
  onClick={() => navigate(`/depositwithdeaw/withdraw/${userId}`)}
  className="flex flex-col items-center cursor-pointer"
>
  <BsWallet2 size={24} className="text-blue-500" />
  Withdraw
</div>
          </div>
        </div>

        {/* Safe Section */}
        {/* <div className="bg-white rounded-xl shadow-md mt-4 p-4 flex items-center justify-between">
          <div>
            <h3 className="text-md font-bold text-yellow-600 flex items-center gap-1">
              <BsSafe /> Safe
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              The daily interest rate is 0.1%, and the income is calculated once every 1 minutes.
            </p>
          </div>
          <div className="text-orange-500 font-bold">₹0.00</div>
        </div> */}

        {/* History Grid */}
        <div className="grid grid-cols-2 gap-4 mt-4 text-sm font-semibold">
          <div className="bg-white rounded-lg p-4 flex items-center gap-3 shadow">
            <BsClockHistory size={24} className="text-blue-500" />
            <div>
              <NavLink to={'/myhistory'}>
              <p>Game History</p>
              <p className="text-xs text-gray-400">My game history</p>
              </NavLink>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 flex items-center gap-3 shadow">
            <BsWallet2 size={24} className="text-green-500" />
            <div>
                 <NavLink to={'/mytransactions'}>
              <p>Transaction</p>
              <p className="text-xs text-gray-400">My transaction history</p>
              </NavLink>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 flex items-center gap-3 shadow">
            <AiOutlineDollarCircle size={24} className="text-pink-500" />
            <div>
                <NavLink to={'/mydeposits'}>
              <p>Deposit</p>
              <p className="text-xs text-gray-400">My deposit history</p>
              </NavLink>
            </div>

          </div>
          <div className="bg-white rounded-lg p-4 flex items-center gap-3 shadow">
            <MdOutlineAttachMoney size={24} className="text-yellow-500" />
            <div>
                <NavLink to={'/mywithdrawals'}>
              <p>Withdraw</p>
              <p className="text-xs text-gray-400">My withdraw history</p>
              </NavLink>
            </div>
          </div>
        </div>
      </div>
      <BottomTab />
      </div>
    </>
  );
};

export default Account;
