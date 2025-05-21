import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AiOutlineWallet, AiOutlineArrowLeft } from 'react-icons/ai';
import { FaSyncAlt } from 'react-icons/fa';
import { io } from 'socket.io-client';
import API_BASE_URL from "../components/Config";
const socket = io(`${API_BASE_URL}`);

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userId = sessionStorage.getItem('useridcolorapp');
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchBalance = async () => {
    if (!userId) return;
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/wallet/${userId}`);
      const data = await res.json();
      if (data.success) {
        setWallet(data.wallet);
      }
    } catch (err) {
      console.error('Error fetching wallet:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, []);

  useEffect(() => {
    if (!userId) return;
    socket.on('walletUpdate', (data) => {
      if (data?.userId === userId && typeof data.main === 'number') {
        setWallet((prev) => ({
          ...prev,
          mainBalance: data.main,
        }));
      }
    });
    return () => socket.off('walletUpdate');
  }, [userId]);

  const isGamePage = location.pathname.startsWith('/game');
  const isTransactionPage = location.pathname.startsWith('/mytransactions');
  const isDepositPage = location.pathname.startsWith('/depositwithdeaw');
    const ismyhistorypage = location.pathname.startsWith('/myhistory');
  const isupdateprofilepage = location.pathname.startsWith('/updateprofile');
     const ismydeposithistorypage = location.pathname.startsWith('/mydeposit');
  const ismywithdrawalpage = location.pathname.startsWith('/mywithdrawal');
  const showBackArrow = isGamePage || isTransactionPage  || ismyhistorypage || isupdateprofilepage || isDepositPage || ismydeposithistorypage || ismywithdrawalpage;

  let pageTitle = '';
  if (isGamePage) pageTitle = 'WinGo';
  else if (isTransactionPage) pageTitle = 'Transactions';
 else if (ismyhistorypage) pageTitle = 'History';
  else if (isDepositPage) pageTitle = 'Deposit/Withdraw';
  else if (isupdateprofilepage) pageTitle = 'Edit Profile';
    else if (ismydeposithistorypage) pageTitle = 'Deposit History';
  else if (ismywithdrawalpage) pageTitle = 'Withdrawal History';
  return (
    <>
      {/* Fixed Navbar */}
      <div className="w-full max-w-[500px] fixed top-0 left-0 right-0 mx-auto  z-50">
        <div className=" bg-primary text-white px-4 py-3 flex justify-between items-center shadow-md  ">
          {/* Left */}
          <div className="flex items-center gap-2">
            {showBackArrow ? (
              <button onClick={() => navigate(-1)} className="text-white">
                <AiOutlineArrowLeft size={22} />
              </button>
            ) : (
              <img src='/3.png' className='w-45 h-7'/>
            )}
          </div>

          {/* Title */}
          <h1 className="text-lg font-semibold">{pageTitle}</h1>

          {/* Wallet */}
          <div className="flex items-center gap-2 bg-white text-primary px-3 py-1 rounded-full shadow-sm text-sm font-semibold">
            <AiOutlineWallet size={18} />
            <span>₹{wallet ? wallet.mainBalance.toFixed(2) : '0.00'}</span>
            <FaSyncAlt
              className={`cursor-pointer transition-transform duration-300 ${
                loading ? 'animate-spin' : ''
              }`}
              onClick={fetchBalance}
            />
          </div>
        </div>
     </div>

      {/* Spacer to push page content below fixed navbar */}
      <div className="h-[60px]" />
    </>
  );
};

export default Navbar;
