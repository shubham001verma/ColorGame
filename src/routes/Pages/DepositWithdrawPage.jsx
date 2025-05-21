import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import Navbar from '../../components/Navbar';
import API_BASE_URL from '../../components/Config';
const methods = [{ label: "Manual", icon: "💵" }];

const DepositWithdrawPage = () => {
  const { userId, type } = useParams();
  const [selectedMethod, setSelectedMethod] = useState("Manual");
  const [amount, setAmount] = useState("");
  const [paymentMode, setPaymentMode] = useState("mobile");
  const [paymentId, setPaymentId] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [proofFile, setProofFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [fileKey, setFileKey] = useState(Date.now());
  const [loading, setLoading] = useState(false);

  const [minWithdraw, setMinWithdraw] = useState(100);
  const [maxWithdraw, setMaxWithdraw] = useState(100000);
const navigate =useNavigate()
  useEffect(() => {
    if (type === 'withdraw') {
      axios.get(`${API_BASE_URL}/api/setting`).then(res => {
        const limits = res.data?.settings?.withdrawalLimits;
        if (limits) {
          setMinWithdraw(limits.min || 100);
          setMaxWithdraw(limits.max || 100000);
        }
      });
    }
  }, [type]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProofFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFilePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleAction = async () => {
    if (!amount || isNaN(amount) || amount <= 0) {
      return Swal.fire("Invalid Amount", "Enter a valid amount", "warning");
    }

    if (type === 'withdraw') {
      if (paymentMode === 'mobile' && !paymentId) return Swal.fire("Missing UPI ID", "Enter your UPI ID", "warning");
      if (paymentMode === 'bank' && (!accountName || !accountNumber || !ifsc)) {
        return Swal.fire("Missing Bank Info", "Fill all bank fields", "warning");
      }
      if (Number(amount) < minWithdraw || Number(amount) > maxWithdraw) {
        return Swal.fire("Invalid Amount", `Withdrawal must be between ₹${minWithdraw} and ₹${maxWithdraw}`, "error");
      }
    }

    if (type === 'deposit' && !proofFile) {
      return Swal.fire("Missing Screenshot", "Upload deposit payment screenshot", "warning");
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("amount", amount);
      formData.append("method", "manual");

      if (type === "deposit") {
        formData.append("screenshot", proofFile);
        formData.append("metadata", JSON.stringify({
          upi: "9131199259@paytm",
          qr: `${API_BASE_URL}/api/qr/upi?upi=9131199259@paytm&name=Admin&amount=${amount}`
        }));
      } else {
        formData.append("metadata", JSON.stringify(
          paymentMode === "mobile"
            ? { userPaymentId: paymentId }
            : { accountName, accountNumber, ifsc }
        ));
      }

      const res = await axios.post(
        `${API_BASE_URL}/api/wallet/${type}`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      Swal.fire("Success", res.data.message, "success");
      setAmount(""); setPaymentId(""); setAccountName(""); setAccountNumber(""); setIfsc("");
      setProofFile(null); setFilePreview(null); setFileKey(Date.now());
      navigate(-1)
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen flex justify-center h-screen bg-[#9195a3]">
      <Navbar />
      <div className="w-full max-w-[500px] mx-auto px-4 pb-24 font-poppins pt-[60px] bg-white">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4 rounded-lg shadow mb-4">
          <div className="flex justify-between text-sm">
            <span className="capitalize">{type}</span>
            <span>******</span>
          </div>
          <div className="text-2xl font-bold mt-2">₹{amount || "0.00"}</div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">Enter Amount (₹)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Ex: 200"
            className="w-full border px-3 py-2 rounded text-sm"
          />
          {type === 'withdraw' && (
            <p className="text-xs text-gray-600 mt-1">Allowed Range: ₹{minWithdraw} - ₹{maxWithdraw}</p>
          )}
        </div>

        {type === 'withdraw' && (
          <>
            <label className="block text-sm font-medium mb-1">Withdrawal Mode</label>
            <select
              value={paymentMode}
              onChange={(e) => setPaymentMode(e.target.value)}
              className="w-full border px-3 py-2 rounded text-sm mb-4"
            >
              <option value="mobile">Mobile UPI</option>
              <option value="bank">Bank Transfer</option>
            </select>

            {paymentMode === "mobile" ? (
              <div className="mb-4">
                <label className="block mb-1 font-medium text-sm">UPI ID</label>
                <input
                  type="text"
                  value={paymentId}
                  onChange={(e) => setPaymentId(e.target.value)}
                  placeholder="e.g. yourupi@bank"
                  className="w-full border px-3 py-2 rounded text-sm"
                />
              </div>
            ) : (
              <>
                <div className="mb-2">
                  <label className="block mb-1 text-sm">Account Name</label>
                  <input
                    type="text"
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    className="w-full border px-3 py-2 rounded text-sm"
                  />
                </div>
                <div className="mb-2">
                  <label className="block mb-1 text-sm">Account Number</label>
                  <input
                    type="text"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className="w-full border px-3 py-2 rounded text-sm"
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-1 text-sm">IFSC Code</label>
                  <input
                    type="text"
                    value={ifsc}
                    onChange={(e) => setIfsc(e.target.value)}
                    className="w-full border px-3 py-2 rounded text-sm"
                  />
                </div>
              </>
            )}
          </>
        )}

        {/* Deposit file input only */}
     {type === 'deposit' && (
  <>


    {Number(amount) > 0 && (
        <div className="mb-4 p-3 border rounded bg-gray-50 text-sm text-center">
    <p className="mb-2">Pay using this UPI ID:</p>
    <div className="flex items-center justify-center gap-2 text-blue-600 font-semibold text-lg">
      <span>9131199259@paytm</span>
      <button
        onClick={() => {
          navigator.clipboard.writeText('9131199259@paytm');
          Swal.fire("Copied!", "UPI ID copied to clipboard", "success");
        }}
        className="text-sm text-white bg-blue-500 px-2 py-1 rounded hover:bg-blue-600"
      >
        Copy
      </button>
      <button
        onClick={() => {
          if (navigator.share) {
            navigator.share({
              title: "Pay via UPI",
              text: "Send payment to this UPI ID: 9131199259@paytm",
            });
          } else {
            Swal.fire("Not Supported", "Sharing is not supported on this device", "info");
          }
        }}
        className="text-sm text-white bg-green-500 px-2 py-1 rounded hover:bg-green-600"
      >
        Share
      </button>
    </div>

    <p className="mt-3">or Scan this QR Code:</p>
    <img
      src={`${API_BASE_URL}/api/qr/upi?upi=9131199259@paytm&name=Admin&amount=${amount}`}
      alt="UPI QR Code"
      className="w-40 h-40 mx-auto my-2 border"
    />
  </div>
    )}

    <div className="mb-4">
      <label className="block mb-1 font-medium text-sm">Upload Payment Screenshot</label>
      <input
        key={fileKey}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="w-full border px-3 py-2 rounded text-sm"
      />
      {filePreview && (
        <div className="mt-2">
          <img src={filePreview} alt="Preview" className="w-32 h-32 mx-auto border rounded shadow" />
        </div>
      )}
    </div>
  </>
)}

        <div className="flex justify-between items-center">
          <span className="text-sm">
            {type === "deposit" ? "Recharge Method:" : "Withdraw Method:"} <b>{selectedMethod}</b>
          </span>
          <button
            onClick={handleAction}
            disabled={loading}
            className="bg-primary text-white px-4 py-1 rounded hover:bg-blue-700 text-sm"
          >
            {loading ? "Processing..." : type === "deposit" ? "Deposit" : "Withdraw"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DepositWithdrawPage;
