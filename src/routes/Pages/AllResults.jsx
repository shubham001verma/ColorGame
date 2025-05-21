import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search, Trash } from "lucide-react";
import Swal from "sweetalert2";
import API_BASE_URL from "../../components/Config";

const AllResults = () => {
  const [gameRounds, setGameRounds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchGameRounds();
  }, []);

  const fetchGameRounds = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/game/allgameRounds`);
      setGameRounds(response.data);  // Assuming response contains game round data
    } catch (error) {
      console.error("Error fetching game rounds:", error);
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This game round will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${API_BASE_URL}/api/gameRounds/${id}`);
          setGameRounds(gameRounds.filter((round) => round._id !== id));
          Swal.fire("Deleted!", "Game round has been deleted.", "success");
        } catch (error) {
          console.error("Error deleting game round:", error);
          Swal.fire("Error!", "Something went wrong.", "error");
        }
      }
    });
  };

  const filteredGameRounds = gameRounds.filter(
    (round) =>
      round?.periodId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      round?.timerType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="card">
      <div className="card-header flex justify-between items-center p-4">
        <h2 className="text-lg font-semibold dark:text-white">All Game Rounds</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search by period ID or timer type"
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
                <th className="table-head">Period ID</th>
                <th className="table-head">Timer Type</th>
                <th className="table-head">Start Time</th>
                <th className="table-head">End Time</th>
                <th className="table-head">Result</th>
                <th className="table-head">Actions</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {filteredGameRounds.map((round, index) => (
                <tr key={round._id} className="table-row">
                  <td className="table-cell">{index + 1}</td>
                  <td className="table-cell">{round.periodId}</td>
                  <td className="table-cell">{round.timerType}</td>
                  <td className="table-cell">{new Date(round.startTime).toLocaleString()}</td>
                  <td className="table-cell">{new Date(round.endTime).toLocaleString()}</td>
                  <td className="table-cell">
                    {round.result ? (
                      <div>
                        <strong>Color:</strong> {round.result.color.join(", ")} <br />
                        <strong>Number:</strong> {round.result.number} <br />
                        <strong>Size:</strong> {round.result.size}
                      </div>
                    ) : (
                      <span>No Result</span>
                    )}
                  </td>
                  <td className="table-cell">
                    <button
                      onClick={() => handleDelete(round._id)}
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

export default AllResults;

