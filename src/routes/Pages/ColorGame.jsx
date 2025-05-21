import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import { Clock } from 'lucide-react';       
import coin0 from '../../assets/coin0.png';
import coin1 from '../../assets/coin1.png';
import coin2 from '../../assets/coin2.png';
import coin3 from '../../assets/coin3.png';
import coin4 from '../../assets/coin4.png';
import coin5 from '../../assets/coin5.png';
import coin6 from '../../assets/coin6.png';
import coin7 from '../../assets/coin7.png';
import coin8 from '../../assets/coin8.png';
import coin9 from '../../assets/coin9.png';
import Navbar from '../../components/Navbar';
import { useRef } from 'react';
import Swal from 'sweetalert2';
import API_BASE_URL from "../../components/Config";
const socket = io(`${API_BASE_URL}`);
import bipMp3 from '../../assets/comdown.mp3';
const bipSound = new Audio(bipMp3);
bipSound.volume = 0.5;

const coinImages = [coin0, coin1, coin2, coin3, coin4, coin5, coin6, coin7, coin8, coin9];
const ColorGame = () => {
  const [timerOptions, setTimerOptions] = useState([]);
  const [activeTab, setActiveTab] = useState('');
  const [rounds, setRounds] = useState({});
  const [timers, setTimers] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [amount, setAmount] = useState('1');
  const [quantity, setQuantity] = useState(1);
  const [selectedBet, setSelectedBet] = useState({ type: '', value: '' });
  const [message, setMessage] = useState('');
  const [resultPopup, setResultPopup] = useState(null);
  const [userBets, setUserBets] = useState({});
  const [showCountdown, setShowCountdown] = useState(null);
  const [history, setHistory] = useState([]);
  const [page, setPage] = useState(1);
  const [tabView, setTabView] = useState('game');
  const itemsPerPage = 10;
const lastPeriodIdRef = useRef(null);

  const userId = sessionStorage.getItem('useridcolorapp');

const groupedByBasePeriod = {};

if (Array.isArray(history)) {
  history.forEach(item => {
    const [basePeriod] = item.periodId.split('_'); // extract time only
    if (!groupedByBasePeriod[basePeriod]) groupedByBasePeriod[basePeriod] = [];
    groupedByBasePeriod[basePeriod].push(item);
  });
}

// Step 2: Sort base periods in descending order
const sortedBasePeriods = Object.keys(groupedByBasePeriod).sort((a, b) => b.localeCompare(a));

// Step 3: Flatten grouped items while preserving order within each group
const sortedHistory = sortedBasePeriods.flatMap(base => {
  // Optional: sort inner group by timer label (30sec, 40sec, 1min) if needed
  return groupedByBasePeriod[base].sort((a, b) => a.periodId.localeCompare(b.periodId));
});

// Step 4: Paginate
const paginated = sortedHistory.slice((page - 1) * itemsPerPage, page * itemsPerPage);
const totalPages = Math.ceil(sortedHistory.length / itemsPerPage);
  const fetchTimers = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/setting/`);
      const timersFromSettings = res.data.settings?.timerConfigs || [];
      setTimerOptions(timersFromSettings.map(t => t.label));
      if (timersFromSettings.length > 0) setActiveTab(timersFromSettings[0].label);
    } catch (err) {
      console.error('Failed to load timers:', err);
    }
  };

  useEffect(() => {
    fetchTimers();
  }, []);

  useEffect(() => {
    const savedRounds = JSON.parse(localStorage.getItem('rounds') || '{}');
    const now = Date.now();
    const savedTimers = {};
    for (let type in savedRounds) {
      const r = savedRounds[type];
      if (r?.endTime) {
        savedTimers[type] = new Date(r.endTime).getTime() - now;
      }
    }
    setRounds(savedRounds);
    setTimers(savedTimers);
  }, []);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        if (tabView === 'game') {
          const res = await axios.get(`${API_BASE_URL}/api/game/history`);
          setHistory(res.data.data || []);
        } else if (tabView === 'my' && userId) {
          const res = await axios.get(`${API_BASE_URL}/api/bet/history/${userId}`);
          setHistory(res.data?.data || []);
        }
      } catch (err) {
        console.error('Fetch failed:', err);
        setHistory([]);
      }
    };
    fetchHistory();
  }, [activeTab, tabView, userId]);
socket.on('resultDeclared', async (data) => {
  const round = rounds[activeTab];
  if (round && round.periodId === data.periodId) {
    try {
      let tries = 0;
      let currentBets = [];

      while (tries < 5) {
        const res = await fetch(`${API_BASE_URL}/api/bet/history/${userId}`);
        const betData = await res.json();
        currentBets = betData.data.filter(b => b.periodId === data.periodId);

        // ✅ If no bet, break early and handle it below
        if (currentBets.length === 0) break;

        const allUpdated = currentBets.every(b => typeof b.isWin === 'boolean');
        if (allUpdated) break;

        tries++;
        await new Promise((res) => setTimeout(res, 800));
      }

      // // ✅ Show "Play & Win Big!" popup if user did NOT bet
      // if (!currentBets.length) {
      //   setResultPopup({ result: 'no-bet' });
      //   setTimeout(() => setResultPopup(null), 4000);
      //   return;
      // }

      // ✅ Else, continue with win/lose check
      let didWin = false;
      let winAmount = 0;
      let totalAmount = 0;
      const firstBet = currentBets[0];

      currentBets.forEach((b) => {
        totalAmount += Number(b.amount || 0);
        winAmount += Number(b.winAmount || 0);
        if (b.isWin) didWin = true;
      });

      setResultPopup({
        color: Array.isArray(data.results.color)
          ? data.results.color.join(', ')
          : data.results.color,
        auto: data.autoDeclared,
        result: didWin ? 'win' : 'lose',
        winAmount: winAmount.toFixed(2),
        amount: totalAmount.toFixed(2),
        betValue: firstBet.betValue || '-',
        betType: firstBet.betType || '-',
        isWin: didWin,
         periodId: data.periodId
      });

      setTimeout(() => setResultPopup(null), 5000);
    } catch (err) {
      console.error('Error fetching user bet data:', err);
    }
  }
});


const totalWin = paginated.filter(bet => bet.isWin);
const totalLost = paginated.filter(bet => !bet.isWin);

const totalWinCount = totalWin.length;
const totalLostCount = totalLost.length;

const totalWinAmount = totalWin.reduce((sum, bet) => sum + (bet.winAmount || 0), 0);
const totalLostAmount = totalLost.reduce((sum, bet) => sum + (bet.amount || 0), 0);

 useEffect(() => {
  socket.on('roundUpdate', (data) => {
    const now = Date.now();
    const end = new Date(data.endTime).getTime();
    const updatedRounds = { ...rounds, [data.timerType]: data };
    setRounds(updatedRounds);
    setTimers((prev) => ({ ...prev, [data.timerType]: end - now }));
    localStorage.setItem('rounds', JSON.stringify(updatedRounds));

    // Detect period change
    const lastPeriod = lastPeriodIdRef.current;
    if (lastPeriod && lastPeriod !== data.periodId && data.timerType === activeTab) {
      // Period changed, show result popup based on previous periodId
      showWinPopup(lastPeriod);
    }
    lastPeriodIdRef.current = data.periodId;
  });

  return () => socket.off('roundUpdate');
}, [rounds, activeTab]);

useEffect(() => {
  const interval = setInterval(() => {
    setTimers((prev) => {
      const updated = Object.fromEntries(
        Object.entries(prev).map(([k, v]) => [k, Math.max(v - 1000, 0)])
      );

      const active = updated[activeTab] || 0;
      const sec = Math.floor(active / 1000);

      if (sec === 4) {
        // Show countdown and play tone ONCE at 4
        bipSound.currentTime = 0;
        bipSound.play().catch(() => {});
        setShowCountdown(4);
      } else if (sec < 4 && sec > 0) {
        setShowCountdown(sec);
      } else {
        setShowCountdown(null);
      }

      return updated;
    });
  }, 1000);

  return () => clearInterval(interval);
}, [activeTab]);


  const openModal = (type, value) => {
    setSelectedBet({ type, value });
    setModalVisible(true);
  };


  const placeBet = async () => {
    const round = rounds[activeTab];
    if (!round || !userId || !amount || isNaN(amount) || Number(amount) <= 0) {
      return setMessage('Invalid bet data');
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/bet/place`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          periodId: round.periodId,
          betType: selectedBet.type,
          betValue: selectedBet.value,
      amount: Number(amount) * quantity,

        })
      });
      const data = await res.json();
      if (data.success) {
        Swal.fire("Success", `✅ Bet placed successfully!`, "success");
        setAmount('1');
        setModalVisible(false);
        setUserBets(prev => ({ ...prev, [round.periodId]: selectedBet }));
      } else {
        Swal.fire("Failed", data.message || "Something went wrong", "error");
      }
    } catch {
      Swal.fire("Server Error", "Unable to place bet right now", "error");
    }
  };

  const round = rounds[activeTab];
  const timeLeft = Math.floor((timers[activeTab] || 0) / 1000);
  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const seconds = String(timeLeft % 60).padStart(2, '0');

  return (
    <>
       <div className="w-screen flex justify-center min-h-screen bg-[#9195a3] ">
        <Navbar />
      
      <div className="w-full max-w-[500px]  pt-[70px] pb-[50px] px-4  bg-white   relative">
      {showCountdown && (
        <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white text-primary text-[80px] font-bold rounded-[30px] px-8 py-4">
            {showCountdown}
          </div>
        </div>
      )}
{resultPopup && (
  <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center">
    <div
      className={`relative rounded-[30px] w-[320px] text-center px-4 py-6 shadow-2xl border-4 ${
        resultPopup.result === 'win'
          ? 'bg-gradient-to-b from-blue-200 to-blue-400 border-blue-300'
          : resultPopup.result === 'no-bet'
          ? 'bg-gradient-to-b from-yellow-200 to-yellow-400 border-yellow-300'
          : 'bg-gradient-to-b from-gray-300 to-gray-500 border-gray-400'
      }`}
    >
      {/* Icon */}
      <div className="absolute -top-10 left-1/2 transform -translate-x-1/2">
        <div
          className={`p-3 rounded-full shadow-md ${
            resultPopup.result === 'win'
              ? 'bg-blue-100'
              : resultPopup.result === 'no-bet'
              ? 'bg-yellow-100'
              : 'bg-gray-300'
          }`}
        >
          <img
            src={
              resultPopup.result === 'win'
                ? '/win.png'
                : resultPopup.result === 'no-bet'
                ? '/nexttime.png'
                : '/lose.png'
            }
            alt="result"
            className="w-10 h-10"
          />
        </div>
      </div>

      {/* Heading */}
      <h2 className="text-white text-xl font-bold mt-8">
        {resultPopup.result === 'win'
          ? 'Congratulations'
          : resultPopup.result === 'no-bet'
          ? 'Play & Win Big!'
          : 'Better Luck Next Time'}
      </h2>

      {/* Amount Summary */}
      <div className="mt-4 bg-white rounded-lg shadow-inner py-3 px-4 font-bold text-xl text-black">
        {resultPopup.result === 'no-bet'
          ? 'Don’t miss the next round!'
          : resultPopup.result === 'win'
          ? `Bonus ₹${resultPopup.winAmount}`
          : `Lost ₹${resultPopup.amount}`}
      </div>
 <p className='text-white text-sm text-center mt-3'>Period ID: {resultPopup.periodId}</p>
      {/* Bet Type & Bet Value */}
      {resultPopup.result !== 'no-bet' && (
        <div className="mt-3 text-sm text-white">
          <div>Bet Type: <span className="font-semibold">{resultPopup.betType}</span></div>
          <div>Bet Value: <span className="font-semibold">{resultPopup.betValue}</span></div>
        </div>
      )}

      <p className="text-white text-xs mt-3 italic">Auto closing...</p>
    </div>
  </div>
)}




<div className="overflow-x-auto px-2 scrollbar-hide">
  <div className="flex gap-4 mb-4 mt-4 w-max min-w-full">
    {timerOptions.map((type) => (
      <button
        key={type}
        onClick={() => setActiveTab(type)}
        className={`flex flex-col items-center justify-center w-[80px] h-[100px] rounded-xl transition-all duration-200 font-semibold text-xs ${
          activeTab === type ? 'bg-primary text-white shadow-lg' : 'bg-gray-100 text-gray-700'
        }`}
      >
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 ${
            activeTab === type ? 'bg-white text-primary' : 'bg-gray-300 text-gray-600'
          }`}
        >
          <Clock size={20} />
        </div>
        Win Go <br /> {type.toUpperCase()}
      </button>
    ))}
  </div>
</div>


    {round ? (
  <div className="flex justify-center mb-6">
    <div className="relative w-[440px] h-[100px] bg-primary text-white rounded-lg  overflow-hidden">

      {/* Top Center Notch */}
      <div className="absolute top-[-12px] left-1/2 transform -translate-x-1/2 w-6 h-6 bg-white rounded-full z-10"></div>

      {/* Bottom Center Notch */}
      <div className="absolute bottom-[-12px] left-1/2 transform -translate-x-1/2 w-6 h-6 bg-white rounded-full z-10"></div>

      <div className="flex h-full">

        {/* Period ID Section */}
        <div className="flex flex-col justify-center items-center w-1/2 px-2 py-3">
          <span className="text-xs font-semibold mb-1">Period ID</span>
          <span className="text-center text-sm font-bold break-words leading-tight">
            {round.periodId}
          </span>
        </div>

        {/* Dashed Vertical Divider */}
        <div className="w-[1px] border-l border-dashed border-white my-4"></div>

        {/* Timer Section */}
        <div className="flex items-center justify-center gap-1 w-1/2 px-3 py-3">
          <span className="bg-white text-black px-2 py-1 rounded font-mono text-lg">{minutes[0]}</span>
          <span className="bg-white text-black px-2 py-1 rounded font-mono text-lg">{minutes[1]}</span>
          <span className="text-lg font-bold">:</span>
          <span className="bg-white text-black px-2 py-1 rounded font-mono text-lg">{seconds[0]}</span>
          <span className="bg-white text-black px-2 py-1 rounded font-mono text-lg">{seconds[1]}</span>
        </div>
      </div>
    </div>
  </div>
) : (
  <p className="text-center text-gray-600">⚠️ No round active</p>
)}


      <div className="space-y-5">
        <div className="flex justify-center gap-5">
          {['green', 'violet', 'red'].map(c => (
            <button key={c} className={`px-6 py-2 rounded-tl-lg rounded-br-lg text-white font-bold capitalize ${c === 'green' ? 'bg-green-500' : c === 'violet' ? 'bg-purple-500' : 'bg-red-500'
              }`} onClick={() => openModal('color', c)}>{c}</button>
          ))}
        </div>

   <div className="flex justify-center">
  <div className="grid grid-cols-5 gap-6">
    {[...Array(10).keys()].map(n => (
      <button
        key={n}
        onClick={() => openModal('number', n)}
        className="w-14 h-14 rounded-full overflow-hidden  shadow hover:scale-110 transition"
      >
        <img
          src={coinImages[n]}
          alt={`coin${n}`}
          className="w-full h-full object-cover rounded-full"
        />
      </button>
    ))}
  </div>
</div>


        <div className="flex justify-center gap-4">
          <button onClick={() => openModal('size', 'big')} className="bg-primary text-white px-8 py-2 rounded-tl-lg rounded-br-lg font-bold">Big</button>
          <button onClick={() => openModal('size', 'small')} className="bg-gray-500 text-white px-8 py-2 rounded-tl-lg rounded-br-lg font-bold">Small</button>
        </div>
      </div>
      <div className="flex justify-center mb-4 mt-5">
        <button onClick={() => { setTabView('game'); setPage(1); }} className={`px-4 py-2 rounded-l-lg ${tabView === 'game' ? 'bg-primary text-white font-semibold' : 'bg-gray-200 font-semibold'}`}>Game History</button>
        <button onClick={() => { setTabView('my'); setPage(1); }} className={`px-4 py-2 rounded-r-lg ${tabView === 'my' ? 'bg-primary font-semibold text-white' : 'bg-gray-200 font-semibold'}`}>My History</button>
      </div>



{tabView === 'game' ? (
  <>
    {(() => {
      // Step 1: Group by base period
      const groupedByBasePeriod = {};
      if (Array.isArray(history)) {
        history.forEach(item => {
          const [basePeriod] = item.periodId.split('_');
          if (!groupedByBasePeriod[basePeriod]) groupedByBasePeriod[basePeriod] = [];
          groupedByBasePeriod[basePeriod].push(item);
        });
      }

      // Step 2: Sort base periods descending
      const sortedBasePeriods = Object.keys(groupedByBasePeriod).sort((a, b) => b.localeCompare(a));

      // Step 3: Flatten grouped items (inner group sorted by full periodId)
      const sortedHistory = sortedBasePeriods.flatMap(base =>
        groupedByBasePeriod[base].sort((a, b) => a.periodId.localeCompare(b.periodId))
      );

      // Step 4: Paginate the sorted result
      const sortedPaginated = sortedHistory.slice((page - 1) * itemsPerPage, page * itemsPerPage);

      return (
        <table className="w-full text-sm border">
          <thead className="bg-primary text-white">
            <tr className="text-center">
              <th className="py-2">Period</th>
              <th>Number</th>
              <th>Big/Small</th>
              <th>Color</th>
            </tr>
          </thead>
          <tbody>
            {sortedPaginated.map((item, index) => {
              const number = item.result?.number;
              const color = item.result?.color;
              const size = item.result?.size;

              return (
                <tr key={index} className="text-center border-b">
                  <td className="py-1">{item.periodId}</td>
                  <td
                    className={`font-bold ${
                      number === '0'
                        ? 'text-purple-500'
                        : Number(number) % 2 === 0
                        ? 'text-red-500'
                        : 'text-green-500'
                    }`}
                  >
                    {number ?? '-'}
                  </td>
                  <td className="capitalize">{size ?? '-'}</td>
                  <td className="py-1 text-center">
                    {color ? (
                      <div className="flex justify-center items-center gap-1">
                        {color.includes('red') && (
                          <span className="w-4 h-4 rounded-full bg-red-500"></span>
                        )}
                        {color.includes('green') && (
                          <span className="w-4 h-4 rounded-full bg-green-500"></span>
                        )}
                        {color.includes('violet') && (
                          <span className="w-4 h-4 rounded-full bg-purple-500"></span>
                        )}
                      </div>
                    ) : (
                      '-'
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      );
    })()}
  </>
) : (

  <>

    {(() => {
      const totalWin = paginated.filter(bet => bet.isWin);
      const totalLost = paginated.filter(bet => !bet.isWin);

      const totalWinCount = totalWin.length;
      const totalLostCount = totalLost.length;

      const totalWinAmount = totalWin.reduce(
        (sum, bet) => sum + (bet.winAmount || 0),
        0
      );
      const totalLostAmount = totalLost.reduce(
        (sum, bet) => sum + (bet.amount || 0),
        0
      );

      return (
        <table className="w-full text-sm border">
          <thead className="bg-primary text-white">
            <tr>
              <th className="py-2">Period</th>
              <th>Type</th>
              <th>Value</th>
              <th>Amount</th>
              <th>Result</th>
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
                <td>{item.amount}</td>
                <td>
                  {item.isWin ? (
                    <span className="text-green-600 font-semibold">Win</span>
                  ) : (
                    <span className="text-red-600 font-semibold">Lost</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-gray-100 font-medium text-sm">
            <tr className="text-center">
              <td colSpan={2}>Total</td>
              <td className="text-green-600">Wins: {totalWinCount}</td>
              <td className="text-green-600">
                ₹{totalWinAmount.toFixed(2)}
              </td>
              <td className="text-green-600">Win</td>
            </tr>
            <tr className="text-center">
              <td colSpan={2}></td>
              <td className="text-red-600">Lost: {totalLostCount}</td>
              <td className="text-red-600">
                ₹{totalLostAmount.toFixed(2)}
              </td>
              <td className="text-red-600">Lost</td>
            </tr>
          </tfoot>
        </table>
      );
    })()}
  </>
)}


      {history.length > 0 && (
        <div className="flex justify-between items-center mt-4">
          <button disabled={page === 1} onClick={() => setPage(p => Math.max(p - 1, 1))} className="bg-gray-200 px-2 py-1 rounded">Prev</button>
          <span className="text-sm">Page {page} of {totalPages}</span>
          <button disabled={page === totalPages} onClick={() => setPage(p => Math.min(p + 1, totalPages))} className="bg-primary text-white px-2 py-1 rounded">Next</button>
        </div>
      )}


      {/* MODAL */}
      {modalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl max-w-md w-full text-center overflow-hidden">
            <div className="bg-primary text-white text-lg font-bold py-3">
              Win Go {activeTab.replace('min', 'Min')}
            </div>
            <div className="p-5 space-y-4">
              <div className="bg-gray-100 p-2 rounded text-sm font-semibold">Select <span className="font-bold">{selectedBet.value}</span></div>

              <div className="text-left space-y-2">
                <div>
                  <label className="block text-sm font-bold mb-1">Balance</label>
                  <div className="flex gap-2">
                    {[1, 10, 100, 1000].map(v => (
                      <button key={v} onClick={() => setAmount(String(v))} className="bg-gray-100 text-sm font-semibold px-4 py-1 rounded">{v}</button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-1">Quantity</label>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setAmount(String(Math.max((Number(amount) || 1) - 1, 1)))} className="bg-primary text-white w-8 h-8 rounded">-</button>
                    <input
                      type="number"
                      className="w-16 border rounded text-center"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                    <button onClick={() => setAmount(String((Number(amount) || 1) + 1))} className="bg-primary text-white w-8 h-8 rounded">+</button>
                  </div>
                </div>

              <label className="block text-sm font-bold mb-1">Quantity</label>
<div className="flex gap-2 flex-wrap">
  {[1, 2, 3, 4, 5].map(q => (
    <button key={q} onClick={() => setQuantity(q)} className={`px-4 py-1 rounded font-bold ${quantity === q ? 'bg-primary text-white' : 'bg-gray-200'}`}>×{q}</button>
  ))}
</div>


              </div>
            </div>

            <div className="flex">
              <button className="w-1/2 py-3 bg-gray-100 text-gray-700 font-bold" onClick={() => setModalVisible(false)}>Cancel</button>
              <button
                className="w-1/2 py-3 bg-primary text-white font-bold"
                onClick={placeBet}
              >
            Total amount ₹{(Number(amount || 0) * quantity).toFixed(2)}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* {message && <p className="mt-4 font-semibold text-sm">{message}</p>} */}
   
    </div>
   </div>
    </>
  );
};

export default ColorGame;
