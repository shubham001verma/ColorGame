import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search, Trash } from "lucide-react";
import Swal from "sweetalert2";
import API_BASE_URL from "../../components/Config";

const ManageBets = () => {
  const [bets, setBets] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchBets();
  }, []);

  const fetchBets = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/bet/allbets`);
      setBets(response.data.data);
    } catch (error) {
      console.error("Error fetching bets:", error);
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This bet will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${API_BASE_URL}/api/bets/${id}`);
          setBets(bets.filter((bet) => bet._id !== id));
          Swal.fire("Deleted!", "Bet has been deleted.", "success");
        } catch (error) {
          console.error("Error deleting bet:", error);
          Swal.fire("Error!", "Something went wrong.", "error");
        }
      }
    });
  };

  const filteredBets = bets.filter(
    (bet) =>
      bet?.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bet.betType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="card">
      <div className="card-header flex justify-between items-center p-4">
        <h2 className="text-lg font-semibold dark:text-white">All Bets</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search by user or bet type"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
          <Search className="absolute left-3 top-3 text-gray-500 dark:text-gray-400" size={18} />
        </div>
      </div>

      <div className="card-body p-0">
        <div className="relative h-auto w-full overflow-auto">
          <table className="table">
            <thead className="table-header">
              <tr className="table-row">
                <th className="table-head">#</th>
                <th className="table-head">User</th>
                <th className="table-head">Timer</th>
                <th className="table-head">Bet Type</th>
                <th className="table-head">Value</th>
                <th className="table-head">Amount</th>
                <th className="table-head">Multiplier</th>
                <th className="table-head">Win</th>
                <th className="table-head">Win Amount</th>
                <th className="table-head">Created At</th>
                <th className="table-head">Actions</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {filteredBets.map((bet, index) => (
                <tr key={bet._id} className="table-row">
                  <td className="table-cell">{index + 1}</td>
                  <td className="table-cell">{bet?.userId?.name || "Unknown"}</td>
                  <td className="table-cell">{bet.timerType}</td>
                  <td className="table-cell">{bet.betType}</td>
                  <td className="table-cell">{bet.betValue}</td>
                  <td className="table-cell">{bet.amount}</td>
                  <td className="table-cell">x{bet.multiplier}</td>
                  <td className="table-cell">
                    {bet.isWin ? (
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-500 rounded-full">Won</span>
                    ) : (
                      <span className="px-2 py-1 text-xs bg-red-100 text-red-500 rounded-full">Lost</span>
                    )}
                  </td>
                  <td className="table-cell">{bet.winAmount}</td>
                  <td className="table-cell">
                    {new Date(bet.createdAt).toLocaleString()}
                  </td>
                  <td className="table-cell">
                    <button
                      onClick={() => handleDelete(bet._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageBets;
