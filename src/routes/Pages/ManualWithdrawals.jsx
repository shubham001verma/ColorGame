import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Check, Search, Trash2, XCircle } from 'lucide-react';
import Swal from 'sweetalert2';
import API_BASE_URL from '../../components/Config';

const ManualWithdrawals = () => {
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const fetchTransactions = async () => {
    try {
      const query = `?type=withdraw&method=manual${statusFilter ? `&status=${statusFilter}` : ''}`;
      const res = await axios.get(`${API_BASE_URL}/api/transaction/manual-withdrawals${query}`);
      setTransactions(res.data.transactions);
    } catch (err) {
      console.error(err);
      setMessage('Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (transactionId) => {
    Swal.fire({
      title: 'Approve withdrawal?',
      text: "Amount will be debited from user's wallet.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Approve',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.post(`${API_BASE_URL}/api/wallet/approve-withdrawal`, { transactionId });
          Swal.fire('Approved!', 'Withdrawal has been processed.', 'success');
          fetchTransactions();
        } catch (err) {
          Swal.fire('Error!', 'Approval failed.', 'error');
        }
      }
    });
  };

  const handleReject = async (transactionId) => {
    Swal.fire({
      title: 'Reject withdrawal?',
      text: 'This action will mark the request as rejected and refund user.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, Reject',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.post(`${API_BASE_URL}/api/wallet/reject-withdrawal`, { transactionId });
          Swal.fire('Rejected!', 'Withdrawal has been rejected.', 'success');
          fetchTransactions();
        } catch (err) {
          Swal.fire('Error!', 'Rejection failed.', 'error');
        }
      }
    });
  };

  const handleDelete = async (transactionId) => {
    Swal.fire({
      title: 'Delete transaction?',
      text: 'This cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, Delete',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${API_BASE_URL}/api/transaction/${transactionId}`);
          Swal.fire('Deleted!', 'Transaction has been removed.', 'success');
          fetchTransactions();
        } catch (err) {
          Swal.fire('Error!', 'Deletion failed.', 'error');
        }
      }
    });
  };

  useEffect(() => {
    fetchTransactions();
  }, [statusFilter]);

  const filtered = transactions.filter((tx) =>
    tx.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.userId?.phone?.includes(searchTerm)
  );

  return (
    <div className="card">
      <div className="card-header flex justify-between items-center p-4">
        <h2 className="text-lg font-semibold dark:text-white">Manual Withdrawal Requests</h2>
        <div className="flex gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name or phone"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
            <Search className="absolute left-3 top-3 text-gray-500 dark:text-gray-400" size={18} />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-primary rounded-lg text-sm dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          >
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="card-body p-0">
        <div className="relative h-auto w-full overflow-auto">
          <table className="table">
            <thead className="table-header">
              <tr className="table-row">
                <th className="table-head">#</th>
                <th className="table-head">User</th>
                <th className="table-head">Amount</th>
                <th className="table-head">Payment ID</th>
                <th className="table-head">Status</th>
                <th className="table-head">Date</th>
                <th className="table-head">Action</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {filtered.map((tx, index) => (
                <tr key={tx._id} className="table-row">
                  <td className="table-cell">{index + 1}</td>
                  <td className="table-cell">
                    <div className="font-medium">{tx.userId?.name || 'Unknown'}</div>
                    <div className="text-xs text-gray-500">{tx.userId?.phone}</div>
                  </td>
                  <td className="table-cell">₹{tx.amount}</td>
                  <td className="table-cell text-xs">
  {tx.metadata?.userPaymentId && (
    <div><b>UPI ID:</b> {tx.metadata.userPaymentId}</div>
  )}

  {tx.metadata?.accountName && (
    <>
      <div><b>Account:</b> {tx.metadata.accountName}</div>
      <div><b>Number:</b> {tx.metadata.accountNumber}</div>
      <div><b>IFSC:</b> {tx.metadata.ifsc}</div>
    </>
  )}

  {/* {tx.metadata?.qr && (
    <img
      src={`${API_BASE_URL}${tx.metadata.qr}`}
      alt="QR Proof"
      className="w-16 h-16 mt-1 rounded shadow border"
    />
  )} */}
</td>
                  <td className="table-cell">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      tx.status === 'approved'
                        ? 'bg-green-100 text-green-600'
                        : tx.status === 'rejected'
                        ? 'bg-red-100 text-red-600'
                        : 'bg-yellow-100 text-yellow-600'
                    }`}>{tx.status}</span>
                  </td>
                  <td className="table-cell">{new Date(tx.createdAt).toLocaleString()}</td>
                  <td className="table-cell">
                    <div className='flex gap-2'>
                      {tx.status === 'pending' && (
                        <>
                          <button onClick={() => handleApprove(tx._id)} title="Approve">
                            <Check size={20} className="text-green-600 hover:text-green-800" />
                          </button>
                          <button onClick={() => handleReject(tx._id)} title="Reject">
                            <XCircle size={20} className="text-red-500 hover:text-red-700" />
                          </button>
                        </>
                      )}
                      <button onClick={() => handleDelete(tx._id)} title="Delete">
                        <Trash2 size={20} className="text-gray-500 hover:text-black" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-sm text-gray-400">
                    No transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManualWithdrawals;
