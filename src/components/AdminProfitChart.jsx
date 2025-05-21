import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line, Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import API_BASE_URL from "../components/Config";
const AdminProfitChart = () => {
  const [lineData, setLineData] = useState(null);
  const [pieData, setPieData] = useState(null);
  const [labelColor, setLabelColor] = useState('#111827'); // Default for light

  useEffect(() => {
    // Tailwind dark mode detection
    const isDark = document.documentElement.classList.contains('dark');
    setLabelColor(isDark ? '#e5e7eb' : '#111827');

    const fetchProfitData = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/report/profit-report`);
        const report = res.data?.report;

        if (report) {
          const parsedData = {
            totalBet: parseFloat(report.totalBet),
            totalWin: parseFloat(report.totalWin),
            totalCommission: parseFloat(report.totalCommission),
            profit: parseFloat(report.profit),
            loss: parseFloat(report.loss) || 0
          };

          const labels = ['Total Bet', 'Total Win', 'Commission', 'Profit', 'Loss'];
          const values = Object.values(parsedData);
          const colors = ['#3b82f6', '#6b7280', '#cbd5e1', '#60a5fa', '#94a3b8'];

          setLineData({
            labels,
            datasets: [
              {
                label: '₹ Amount',
                data: values,
                backgroundColor: 'rgba(59, 130, 246, 0.2)',
                borderColor: '#3b82f6',
                pointBackgroundColor: colors,
                tension: 0.3,
                fill: true
              }
            ]
          });

          setPieData({
            labels,
            datasets: [
              {
                label: '₹ Amount',
                data: values,
                backgroundColor: colors,
                borderColor: '#ffffff',
                borderWidth: 2
              }
            ]
          });
        }
      } catch (err) {
        console.error('Failed to load profit report:', err);
      }
    };

    fetchProfitData();
  }, []);

  return (
    <div className="container mx-auto w-full mt-6">
      <div className="card">
        <h2 className="text-xl font-bold mb-6 text-center text-gray-800 dark:text-gray-200">
          All-Time Profit & Loss Overview
        </h2>

        {lineData && pieData ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Line Chart */}
            <div className="w-full h-[300px]">
              <Line
                data={lineData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: {
                        color: labelColor,
                        font: { size: 12 }
                      }
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: { color: labelColor },
                      title: {
                        display: true,
                        text: '₹ Amount',
                        color: labelColor
                      }
                    },
                    x: {
                      ticks: { color: labelColor }
                    }
                  }
                }}
              />
            </div>

            {/* Pie Chart */}
            <div className="flex justify-center items-center h-[300px]">
              <div className="w-[250px] h-[250px]">
                <Pie
                  data={pieData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom',
                        labels: {
                          color: labelColor,
                          font: { size: 13 }
                        }
                      }
                    }
                  }}
                />
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500">Loading charts...</p>
        )}
      </div>
    </div>
  );
};

export default AdminProfitChart;
