import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useLocation } from 'react-router-dom';
import API_BASE_URL from '../../components/Config';

const AddMoneyPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const userId = queryParams.get('userId');

  const [user, setUser] = useState(null);
  const [amount, setAmount] = useState('');
  const [walletType, setWalletType] = useState('main');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userId) fetchUser();
  }, [userId]);

  const fetchUser = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/user/singleuser/${userId}`);
      setUser(res.data);
    } catch (err) {
      console.error('Error fetching user', err);
      Swal.fire('Error', 'Failed to fetch user', 'error');
    }
  };

  const handleSubmit = async () => {
    if (!user || !amount || Number(amount) <= 0) {
      return Swal.fire('Error', 'Enter a valid amount', 'warning');
    }

    try {
      setLoading(true);
      await axios.post(`${API_BASE_URL}/api/wallet/add-money`, {
        userId: user._id,
        amount: Number(amount),
        walletType,
      });

      Swal.fire('Success', 'Amount added successfully', 'success');
      setAmount('');
    } catch (err) {
      console.error('Error adding money:', err);
      Swal.fire('Error', 'Failed to add money', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6  shadow rounded-lg bg-white dark:bg-gray-800 ">
        {user && (
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Add Money to  {user.name}'s' Wallet</h2>
)}
      {!user ? (
        <p className="text-gray-600">Loading user details...</p>
      ) : (
        <>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300">User:</label>
            <div className="bg-gray-100 p-2 rounded dark:bg-slate-700 text-black dark:text-white">
              {user.name} ({user.phone})<br />
              Wallet: ₹{user.walletId?.mainBalance?.toFixed(2) || '0.00'}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300">Amount (₹)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                focus:outline-none focus:ring-2 focus:ring-primary  focus:border-primary  
                dark:bg-gray-700 dark:text-white"
              placeholder="Enter amount"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300">Wallet Type</label>
            <select
              value={walletType}
              onChange={(e) => setWalletType(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                focus:outline-none focus:ring-2 focus:ring-primary  focus:border-primary  
                dark:bg-gray-700 dark:text-white"
            >
              <option value="main">Main Wallet</option>
              <option value="referral">Referral Wallet</option>
            </select>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
          >
            {loading ? 'Processing...' : 'Add Money'}
          </button>
        </>
      )}
    </div>
  );
};

export default AddMoneyPage;
