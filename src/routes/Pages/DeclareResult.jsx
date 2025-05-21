import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import Swal from 'sweetalert2';
import API_BASE_URL from "../../components/Config";
const socket = io(`${API_BASE_URL}`);

const numberToColor = {
  0: 'Red + Violet',
  1: 'Green',
  2: 'Red',
  3: 'Green',
  4: 'Red',
  5: 'Green + Violet',
  6: 'Red',
  7: 'Green',
  8: 'Red',
  9: 'Green'
};

const getSizeFromNumber = (num) => (parseInt(num) <= 4 ? 'small' : 'big');

const DeclareResult = () => {
  const [timerTypes, setTimerTypes] = useState([]);
  const [activeTab, setActiveTab] = useState('');
  const [rounds, setRounds] = useState({});
  const [timers, setTimers] = useState({});
  const [summaries, setSummaries] = useState({});
  const [message, setMessage] = useState('');
  const [mode, setMode] = useState('manual');
  const [selectedResults, setSelectedResults] = useState({ color: '', number: '', size: '' });
  const [showResult, setShowResult] = useState(false);

  const showMessage = (msg) => {
    Swal.fire({
      text: msg,
      icon: msg.includes("❌") ? 'error' : 'success',
      confirmButtonText: 'OK'
    });
  };

  const triggerResultDisplay = (results) => {
    setSelectedResults(results);
    setShowResult(true);
    setTimeout(() => setShowResult(false), 2000);
  };

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/setting`);
        const data = await res.json();
        if (data.success && data.settings?.timerConfigs?.length) {
          const labels = data.settings.timerConfigs.map(t => t.label);
          setTimerTypes(labels);
          setActiveTab(labels[0]); // Automatically set first timer type as active
        }
      } catch (err) {
        console.error("Timer fetch failed", err);
      }
    };
    fetchSettings();
  }, []);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/setting/mode`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.mode) setMode(data.mode);
      });
  }, []);

  useEffect(() => {
    const savedRounds = JSON.parse(localStorage.getItem('rounds') || '{}');
    const now = Date.now();
    const savedTimers = {};
    for (let type of timerTypes) {
      const r = savedRounds[type];
      if (r?.endTime) {
        savedTimers[type] = new Date(r.endTime).getTime() - now;
      }
    }
    setRounds(savedRounds);
    setTimers(savedTimers);
  }, [timerTypes]);

  useEffect(() => {
    socket.on('roundUpdate', (data) => {
      const now = Date.now();
      const end = new Date(data.endTime).getTime();
      const updatedRounds = { ...rounds, [data.timerType]: data };
      setRounds(updatedRounds);
      setTimers((prev) => ({ ...prev, [data.timerType]: end - now }));
      localStorage.setItem('rounds', JSON.stringify(updatedRounds));
    });
    return () => socket.off('roundUpdate');
  }, [rounds]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimers((prev) =>
        Object.fromEntries(Object.entries(prev).map(([key, val]) => [key, Math.max(val - 1000, 0)]))
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const current = rounds[activeTab];
    if (!current) return;
    fetch(`${API_BASE_URL}/api/game/summary/${current.periodId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.summary) {
          setSummaries((prev) => ({
            ...prev,
            [activeTab]: data.summary
          }));
        }
      });
  }, [rounds, activeTab]);

  useEffect(() => {
    socket.on('betUpdate', (data) => {
      const { periodId, timerType, betType, betValue, amount, multiplier } = data;
      const isActive = rounds[timerType]?.periodId === periodId;
      if (!isActive) return;

      setSummaries((prev) => {
        const prevSummary = prev[timerType]?.[betType] || [];
        const updatedSummary = prevSummary.map((entry) =>
          entry.value.toLowerCase() === betValue.toLowerCase()
            ? {
                ...entry,
                totalAmount: entry.totalAmount + amount,
                totalExpectedWin: entry.totalExpectedWin + amount * multiplier,
                totalUsers: entry.totalUsers + 1
              }
            : entry
        );

        const exists = prevSummary.find((entry) => entry.value.toLowerCase() === betValue.toLowerCase());
        if (!exists) {
          updatedSummary.push({
            value: betValue,
            totalAmount: amount,
            totalExpectedWin: amount * multiplier,
            totalUsers: 1
          });
        }

        return {
          ...prev,
          [timerType]: {
            ...(prev[timerType] || {}),
            [betType]: updatedSummary
          }
        };
      });
    });
    return () => socket.off('betUpdate');
  }, [rounds]);

  useEffect(() => {
    const handleRoundEnded = async (data) => {
      const { periodId, timerType } = data;
      if (rounds[timerType]?.periodId !== periodId) return;

      try {
        const res = await fetch(`${API_BASE_URL}/api/setting/mode`);
        const modeData = await res.json();
        const currentMode = modeData?.mode || 'manual';

        if (currentMode === 'auto') {
          const declareRes = await fetch(`${API_BASE_URL}/api/game/auto-declare`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ periodId })
          });

          const result = await declareRes.json();
           if (result.success) {
          console.log("✅ Auto-declared:", result.results);

          // You do NOT trigger resultPopup directly here
          // Backend must emit socket event 'resultDeclared'
        } else {
          console.error("❌ Auto-declare failed:", result.message);
        }
        }
      } catch (err) {
        console.error('Auto declare error:', err);
        showMessage(`❌ Auto-declare request failed`);
      }
    };

    socket.on('roundEnded', handleRoundEnded);
    return () => socket.off('roundEnded', handleRoundEnded);
  }, [rounds]);

  const handleDeclareAll = async () => {
    const current = rounds[activeTab];
    if (!current) return;
    const { color, number, size } = selectedResults;
    if (!color || !number || !size) {
      showMessage('❌ Please select a result.');
      return;
    }
    const res = await fetch(`${API_BASE_URL}/api/game/declare`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ periodId: current.periodId, colorResult: color, numberResult: number, sizeResult: size })
    });
    const data = await res.json();
    if (data.success) {
      triggerResultDisplay({ color, number, size });
    }
    showMessage(data.success ? `✅ Declared: ${color} - ${number} - ${size}` : `❌ ${data.message}`);
  };

  const renderSection = (type, label, options) => {
    const activeSummary = summaries[activeTab] || { [type]: [] };
    return (
      <div className="card-body p-0">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{label} Summary</h2>
        <table className="table">
          <thead className="table-header">
            <tr>
              <th className="table-head">Value</th>
              <th className="table-head">Users</th>
              <th className="table-head">Amount</th>
              <th className="table-head">Expected Win</th>
              <th className="table-head">Select</th>
            </tr>
          </thead>
          <tbody>
            {options.map((v) => {
              const entry = activeSummary[type]?.find(e => e.value === v) || {
                totalUsers: 0,
                totalAmount: 0,
                totalExpectedWin: 0
              };
              const isSelected = selectedResults[type] === v;

              return (
                <tr key={v} className="table-row">
                  <td className="table-cell">{v}</td>
                  <td className="table-cell">{entry.totalUsers}</td>
                  <td className="table-cell">₹{entry.totalAmount}</td>
                  <td className="table-cell">₹{entry.totalExpectedWin}</td>
                  <td className="table-cell">
                    <input
                      type="radio"
                      name={`select-${type}`}
                      value={v}
                      checked={isSelected}
                      disabled={mode === 'auto'}
                      onChange={() =>
                        setSelectedResults((prev) => ({
                          ...prev,
                          [type]: v
                        }))
                      }
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  const current = rounds[activeTab];
  const timeLeft = Math.floor((timers[activeTab] || 0) / 1000);

  return (
    <div className="card">
      <h2 className="text-lg font-semibold dark:text-white">Declare Result</h2>
      {current ? (
        <>
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 p-4 rounded-lg shadow-sm">
            <div className="space-y-1 text-sm font-semibold dark:text-white">
              <p><strong>Period ID:</strong> {current.periodId}</p>
              <p><strong>Timer Type:</strong> {current.timerType}</p>
              <p><strong>Time Left:</strong> {timeLeft}s</p>
            </div>
            <div className="flex gap-2">
              {timerTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setActiveTab(type)}
                  className={`px-4 py-2 rounded-full font-semibold text-sm transition ${
                    activeTab === type ? 'bg-primary text-white' : 'bg-gray-200 text-black'
                  }`}
                >
                  {type.replace('min', ' Min')}
                </button>
              ))}
            </div>
          </div>

          {renderSection('number', 'Number', ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'])}
          {renderSection('color', 'Color', ['red', 'green', 'violet'])}
          {renderSection('size', 'Size', ['small', 'big'])}

          {mode === 'manual' && (
            <button onClick={handleDeclareAll} className="w-40 bg-primary text-white font-medium py-2 rounded-md transition duration-300">
              Declare Result
            </button>
          )}

          {showResult && selectedResults.color && selectedResults.number && selectedResults.size && (
            <p className="mt-4 font-semibold text-center">
              {/* 🎯 Declared Result: {selectedResults.color} - {selectedResults.number} - {selectedResults.size} ({mode.toUpperCase()}) */}
            </p>
          )}

          {message && (
            <p className="mt-2 text-sm text-center text-primary font-medium">{message}</p>
          )}
        </>
      ) : (
        <p className="text-center text-gray-500">⚠️ Waiting for active round...</p>
      )}
    </div>
  );
};

export default DeclareResult;
