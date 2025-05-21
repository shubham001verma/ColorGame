import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import API_BASE_URL from '../../components/Config';

const DepositDetails = () => {
  const { transactionId } = useParams();
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDetails = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/transaction/${transactionId}`);
      console.log(res.data)
      setTransaction(res.data.transaction);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to fetch transaction details", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [transactionId]);

  if (loading) return <div className="p-4">Loading...</div>;
  if (!transaction) return <div className="p-4 text-red-600">Transaction not found.</div>;

  const { userId, amount, metadata, status, createdAt } = transaction;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Deposit Details</h2>

      <div className="mb-4">
        <strong>User:</strong> {userId?.name || 'Unknown'} <br />
        <strong>Phone:</strong> {userId?.phone}
      </div>

      <div className="mb-4">
        <strong>Amount:</strong> ₹{amount} <br />
        <strong>Status:</strong>{' '}
        <span className={`font-medium ${
          status === 'approved' ? 'text-green-600' :
          status === 'rejected' ? 'text-red-600' : 'text-yellow-600'
        }`}>
          {status}
        </span>
      </div>

      <div className="mb-4">
        <strong>Screenshot:</strong><br />
        {metadata?.screenshot ? (
          <img
            src={`${API_BASE_URL}${metadata.screenshot}`}
            alt="screenshot"
            className="w-70 h-70 object-cover mt-2 rounded border"
          />
        ) : (
          <span className="text-sm text-gray-500">No screenshot uploaded</span>
        )}
      </div>

      {/* {metadata?.upi && (
        <div className="mb-4">
          <strong>UPI ID:</strong> {metadata.upi}
        </div>
      )} */}

      <div className="mb-4">
        <strong>Requst At:</strong> {new Date(createdAt).toLocaleString()}
      </div>

      <button
        onClick={() => navigate(-1)}
        className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded"
      >
        Go Back
      </button>
    </div>
  );
};

export default DepositDetails;
