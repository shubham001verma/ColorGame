import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Trash } from "lucide-react";
import API_BASE_URL from "../../components/Config";

const ManageTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [filterDate, setFilterDate] = useState("");

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/transaction/all`);
      console.log(res.data);
      setTransactions(res.data.transactions || []);
    } catch (error) {
      console.error("Error fetching transactions", error);
    }
  };

  const getStatusBackgroundColor = (status) => {
    switch (status) {
      case "completed":
        return "#28a745";
      case "reject":
        return "#dc3545";
      case "pending":
        return "#FF8C00";
      default:
        return "#6c757d";
    }
  };

  const deleteTransaction = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This transaction will be deleted permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel",
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`${API_BASE_URL}/api/transaction/delete/${id}`);
        Swal.fire("Deleted!", "Transaction has been removed.", "success");
        fetchTransactions();
      } catch (error) {
        Swal.fire("Error!", "Failed to delete transaction.", "error");
      }
    }
  };

  const filteredTransactions = filterDate
    ? transactions.filter(
        (tx) => new Date(tx.createdAt).toISOString().split("T")[0] === filterDate
      )
    : transactions;

  return (
    <div className="card">
      <div className="card-header flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">All Transactions</h2>
        <input
          type="date"
          className="px-4 py-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800 text-gray-900 dark:text-gray-100 mx-2"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
        />
      </div>

      <div className="card-body p-0">
        <div className="relative h-auto w-full flex-shrink-0 overflow-auto rounded-none [scrollbar-width:_thin]">
          <table className="table">
            <thead className="table-header">
              <tr className="table-row">
                <th className="table-head">#</th>
                <th className="table-head">User</th>
                <th className="table-head">Type</th>
                <th className="table-head">Amount</th>
                <th className="table-head">Date</th>
                <th className="table-head">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((tx, index) => (
                <tr key={tx._id} className="table-row">
                  <td className="table-cell">{index + 1}</td>
                  <td className="table-cell">{tx.userId?.name || "N/A"}</td>
                  <td className="table-cell">{tx.type}</td>
                  <td className="table-cell">₹{tx.amount}</td>
                  <td className="py-3 px-6">{new Date(tx.createdAt).toLocaleDateString()}</td>
                  <td className="py-3 px-6 text-center flex gap-3">
                    <Trash
                      onClick={() => deleteTransaction(tx._id)}
                      className="text-red-500 cursor-pointer"
                      title="Delete"
                      size={20}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredTransactions.length === 0 && (
            <p className="text-center text-gray-500 py-4">No transactions found for this date.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageTransactions;
