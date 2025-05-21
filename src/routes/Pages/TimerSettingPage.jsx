import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import {  Trash, } from "lucide-react";
import API_BASE_URL from '../../components/Config';
const TimerSettingsPage = () => {
  const [timers, setTimers] = useState([]);
  const [newTimer, setNewTimer] = useState({ label: '', duration: '' });
  const [loading, setLoading] = useState(false);

  const fetchTimers = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/setting/alltimers`);
      const data = await res.json();
      if (data.success) setTimers(data.timers);
    } catch (err) {
      console.error('Failed to load timers:', err);
    }
  };

  useEffect(() => {
    fetchTimers();
  }, []);

  const handleAddTimer = async () => {
    if (!newTimer.label || !newTimer.duration) {
      return Swal.fire('Validation Error', 'Label and Duration are required', 'warning');
    }
    try {
      const res = await fetch(`${API_BASE_URL}/api/setting/addorupdatetimer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTimer)
      });
      const data = await res.json();
      if (data.success) {
        setTimers(data.timers);
        setNewTimer({ label: '', duration: '' });
        Swal.fire('Success', 'Timer added or updated successfully', 'success');
      } else {
        Swal.fire('Error', data.message, 'error');
      }
    } catch (err) {
      Swal.fire('Error', 'Server error', 'error');
    }
  };

  const handleDelete = async (label) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/setting/deletetimer/${label}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        setTimers(data.timers);
        Swal.fire('Deleted', 'Timer removed successfully', 'success');
      } else {
        Swal.fire('Error', data.message, 'error');
      }
    } catch (err) {
      Swal.fire('Error', 'Server error', 'error');
    }
  };

  return (
  <div className="card">
      <div className="flex-col ">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Manage Game Timers</h2>
  <div className=" flex gap-3  p-4">
   
        <input
          type="text"
          placeholder="Label (e.g. 30sec)"
          value={newTimer.label}
          onChange={(e) => setNewTimer(prev => ({ ...prev, label: e.target.value }))}
          className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                focus:outline-none focus:ring-2 focus:ring-primary  focus:border-primary  
                dark:bg-gray-700 dark:text-white"
        />
        <input
          type="number"
          placeholder="Duration (ms)"
          value={newTimer.duration}
          onChange={(e) => setNewTimer(prev => ({ ...prev, duration: e.target.value }))}
          className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                focus:outline-none focus:ring-2 focus:ring-primary  focus:border-primary  
                dark:bg-gray-700 dark:text-white"
        />
        <button
          onClick={handleAddTimer}
          disabled={loading}
          className="bg-primary text-white px-4 py-2 rounded"
        >
          {loading ? 'Saving...' : 'Add/Update'}
        </button>
      </div>
    
      </div>
  <div className="card-body p-0">
        <div className="relative h-auto w-full flex-shrink-0 overflow-auto rounded-none [scrollbar-width:_thin]">
      <table className="table">
        <thead className="table-header">
          <tr className="table-row">
             <th className="table-head">#</th>
            <th className="table-head">Label</th>
            <th className="table-head">Duration (ms)</th>
            <th className="table-head">Action</th>
          </tr>
        </thead>
        <tbody className="table-body">
          {timers.length > 0 ? timers.map((t, idx) => (
            <tr key={idx} className="border-b">
                  <td className="table-cell">{idx + 1}</td>
              <td className="table-cell">{t.label}</td>
              <td className="table-cell">{t.duration}</td>
              <td className="table-cell">
                <button onClick={() => handleDelete(t.label)} className="text-red-600 hover:underline text-sm"> <Trash size={20} /></button>
              </td>
            </tr>
          )) : (
            <tr><td colSpan="3" className="text-center py-4 text-gray-500">No timers found.</td></tr>
          )}
        </tbody>
      </table>
      </div></div>
    </div>

  );
};

export default TimerSettingsPage;
