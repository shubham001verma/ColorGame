import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import API_BASE_URL from "../../components/Config";
const ReferralSettingsPage = () => {
  const [settings, setSettings] = useState({
    referralBonus: '',
    mlmCommission: {
      level1: '', level2: '', level3: '', level4: '', level5: '', level6: ''
    },
    resultMode: 'manual',
    commissionPercentage: '',
    withdrawalCommissionPercentage: '',
    withdrawalLimits: {
      min: '',
      max: ''
    },
    winningMultipliers: {
      color: '', number: '', size: ''
    }
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/setting`)
      .then(res => res.json())
      .then(data => {
        if (data.settings) setSettings(data.settings);
      })
      .catch(err => console.error('Fetch error:', err));
  }, []);

  const handleChange = (field, subfield, value) => {
    const updated = { ...settings };
    if (subfield) {
      if (typeof updated[field] === 'object' && !Array.isArray(updated[field])) {
        updated[field][subfield] = value;
      }
    } else {
      updated[field] = value;
    }
    setSettings(updated);
  };

  const handleSubmit = async () => {
    setLoading(true);
    const res = await fetch(`${API_BASE_URL}/api/setting`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    });
    const data = await res.json();
     if (data.success) {
      Swal.fire("Success", " Settings updated successfully!", "success");
    } else {
      Swal.fire("Error", data.message || " Failed to update settings", "error");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Game Settings</h2>

      <label className="block text-gray-700 dark:text-gray-300">Referral Bonus (on registration)
        <input
          type="number"
          value={settings.referralBonus}
          onChange={(e) => handleChange('referralBonus', null, Number(e.target.value))}
          className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                focus:outline-none focus:ring-2 focus:ring-primary  focus:border-primary  
                dark:bg-gray-700 dark:text-white"
        />
      </label>

      <h3 className="mt-6 text-gray-700 dark:text-gray-300">MLM Commissions (%)</h3>
      {[1, 2, 3, 4, 5, 6].map((level) => (
        <label key={level} className="block text-gray-700 dark:text-gray-300">
          Level {level}:
          <input
            type="number"
            value={settings.mlmCommission[`level${level}`]}
            onChange={(e) => handleChange('mlmCommission', `level${level}`, Number(e.target.value))}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                focus:outline-none focus:ring-2 focus:ring-primary  focus:border-primary  
                dark:bg-gray-700 dark:text-white"
          />
        </label>
      ))}

       <label className="mt-6 block text-gray-700 dark:text-gray-300">Commission on Winning (%)
        <input
          type="number"
          value={settings.commissionPercentage}
          onChange={(e) => handleChange('commissionPercentage', null, Number(e.target.value))}
          className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                focus:outline-none focus:ring-2 focus:ring-primary  focus:border-primary  
                dark:bg-gray-700 dark:text-white"
        />
      </label> 

      <label className="mt-6 block text-gray-700 dark:text-gray-300">Commission on Withdrawal (%)
        <input
          type="number"
          value={settings.withdrawalCommissionPercentage}
          onChange={(e) => handleChange('withdrawalCommissionPercentage', null, Number(e.target.value))}
          className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                focus:outline-none focus:ring-2 focus:ring-primary  focus:border-primary  
                dark:bg-gray-700 dark:text-white"
        />
      </label>

      <h3 className="mt-6 text-gray-700 dark:text-gray-300">Withdrawal Limits</h3>
      <label className="block text-gray-700 dark:text-gray-300">Minimum Withdrawal Amount
        <input
          type="number"
          value={settings.withdrawalLimits.min}
          onChange={(e) => handleChange('withdrawalLimits', 'min', Number(e.target.value))}
          className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                focus:outline-none focus:ring-2 focus:ring-primary  focus:border-primary  
                dark:bg-gray-700 dark:text-white"
        />
      </label>
      <label className="block text-gray-700 dark:text-gray-300 mt-2">Maximum Withdrawal Amount
        <input
          type="number"
          value={settings.withdrawalLimits.max}
          onChange={(e) => handleChange('withdrawalLimits', 'max', Number(e.target.value))}
          className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                focus:outline-none focus:ring-2 focus:ring-primary  focus:border-primary  
                dark:bg-gray-700 dark:text-white"
        />
      </label>

      <h3 className="mt-6 text-gray-700 dark:text-gray-300">Winning Multipliers</h3>
      {['color', 'number', 'size'].map((type) => (
        <label key={type} className="block text-gray-700 dark:text-gray-300 capitalize">
          {type}:
          <input
            type="number"
            value={settings.winningMultipliers[type]}
            onChange={(e) => handleChange('winningMultipliers', type, Number(e.target.value))}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                focus:outline-none focus:ring-2 focus:ring-primary  focus:border-primary  
                dark:bg-gray-700 dark:text-white"
          />
        </label>
      ))}

      <h3 className="mt-6 text-gray-700 dark:text-gray-300 mb-2">Result Mode</h3>
      <label>
        <input
          type="radio"
          name="resultMode"
          value="manual"
          checked={settings.resultMode === 'manual'}
          onChange={(e) => handleChange('resultMode', null, e.target.value)}
        /> Manual
      </label>
      <label style={{ marginLeft: 10 }}>
        <input
          type="radio"
          name="resultMode"
          value="auto"
          checked={settings.resultMode === 'auto'}
          onChange={(e) => handleChange('resultMode', null, e.target.value)}
        /> Auto
      </label>

      <br />
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-40 bg-primary text-white font-medium py-2 mt-6 rounded-md transition duration-300"
      >
        {loading ? 'Saving...' : 'Save Settings'}
      </button>
 
    </div>
  );
};

export default ReferralSettingsPage;
