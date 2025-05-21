import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../../components/Navbar';
import API_BASE_URL from '../../components/Config';
const MyHistory = () => {
  const [history, setHistory] = useState([]);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const userId = sessionStorage.getItem('useridcolorapp');

  useEffect(() => {
    const fetchUserHistory = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/bet/history/${userId}`);
        setHistory(res.data?.data || []);
      } catch (err) {
        console.error('Fetch failed:', err);
        setHistory([]);
      }
    };

    if (userId) fetchUserHistory();
  }, [userId]);

  const paginated = history.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const totalPages = Math.ceil(history.length / itemsPerPage);

  return (
    <>
  <div className="w-screen flex justify-center h-screen bg-[#9195a3] ">
      <Navbar />
      <div className="w-full max-w-[500px] mx-auto px-4 pb-24 font-poppins pt-[60px] bg-white">
      <h2 className="text-sm  font-medium mb-4 text-start text-black"> My All Betting History</h2>

      <table className="w-full text-sm border mb-4">
        <thead className="bg-primary text-white">
          <tr>
            <th className="py-2">Period</th>
            <th>Type</th>
            <th>Value</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {paginated.map((item, index) => (
            <tr key={index} className="text-center border-b">
              <td className="py-1">{item.periodId}</td>
              <td>{item.betType}</td>
              <td>
                {['red', 'green', 'violet'].includes(item.betValue) ? (
                  <span
                    className={`w-4 h-4 inline-block rounded-full ${
                      item.betValue === 'red'
                        ? 'bg-red-500'
                        : item.betValue === 'green'
                        ? 'bg-green-500'
                        : 'bg-purple-500'
                    }`}
                  ></span>
                ) : (
                  item.betValue
                )}
              </td>
              <td>₹{item.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {history.length > 0 && (
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

export default MyHistory;
