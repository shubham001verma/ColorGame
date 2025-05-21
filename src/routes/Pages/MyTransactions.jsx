// pages/MyTransactions.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../../components/Navbar';
import API_BASE_URL from '../../components/Config';
const MyTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const userId = sessionStorage.getItem('useridcolorapp');

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/transaction/${userId}`);
        setTransactions(res.data?.transactions || []);
      } catch (err) {
        console.error('Fetch Transactions Error:', err);
        setTransactions([]);
      }
    };

    if (userId) fetchTransactions();
  }, [userId]);

  const paginated = transactions.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const totalPages = Math.ceil(transactions.length / itemsPerPage);

  return (
     <>
     <div className="w-screen flex justify-center h-screen bg-[#9195a3] ">
      <Navbar />
      <div className="w-full max-w-[500px] mx-auto px-4 pb-24 font-poppins pt-[60px] bg-white">
        <h2 className="text-sm font-medium mb-4 text-start text-black">My Wallet Transaction History</h2>

        <table className="w-full text-sm border mb-4">
          <thead className="bg-primary text-white">
            <tr>
              <th className="py-2">Type</th>
              <th>Amount</th>
              <th>Type</th>
              <th>Porpose</th>
              <th>Method</th>
<th>Date</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((tx, index) => (
              <tr key={index} className="text-center border-b">
                <td className="py-1">{tx.type}</td>
                <td>₹{tx.amount}</td>
                 <td>{tx.type}</td>
                  <td>{tx.purpose || 'N/A'}</td>
                        <td>{tx.method}</td>
                <td>{new Date(tx.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {transactions.length > 0 && (
          <div className="flex justify-between items-center">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              className="bg-gray-200 px-3 py-1 rounded"
            >
              Prev
            </button>
            <span className="text-sm">Page {page} of {totalPages}</span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              className="bg-primary text-white px-3 py-1 rounded"
            >
              Next
            </button>
          </div>
        )}
      </div>
     </div>
    </>
  );
};

export default MyTransactions;
