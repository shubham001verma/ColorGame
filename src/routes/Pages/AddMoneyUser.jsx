import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search, IndianRupee } from "lucide-react";
import { useNavigate } from "react-router-dom";
import img1 from '../../assets/user-1.jpg';
import img2 from '../../assets/user-2.jpg';
import img3 from '../../assets/user-3.jpg';
import img4 from '../../assets/user-4.jpg';
import API_BASE_URL from "../../components/Config";

const AddMoneyUser = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const images = [img1, img2, img3, img4];
  const getAvatar = (index) => images[index % images.length];

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/user`);
      const filtered = response.data.filter(u => u.role === 'user');
      setUsers(filtered);
    } catch (error) {
      console.error("Failed to fetch users", error);
    }
  };

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone?.includes(searchTerm)
  );

  return (
    <div className="card">
      <div className="card-header flex justify-between items-center p-4">
        <h2 className="text-lg font-semibold dark:text-white">Add Money Users Wallet</h2>
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
      </div>

      <div className="card-body p-0">
        <div className="relative h-auto w-full flex-shrink-0 overflow-auto rounded-none [scrollbar-width:_thin]">
          <table className="table">
            <thead className="table-header">
              <tr className="table-row">
                <th className="table-head">#</th>
                <th className="table-head">Image</th>
                <th className="table-head">Name</th>
                <th className="table-head">Phone</th>
                <th className="table-head">Status</th>
                <th className="table-head">Balance</th>
                <th className="table-head">Action</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {filteredUsers.map((user, index) => (
                <tr key={user._id} className="table-row">
                  <td className="table-cell">{index + 1}</td>
                  <td className="table-cell">
                    <div className="flex gap-x-1 w-14 h-14 overflow-hidden rounded-full border">
                      <img
                        src={user.image || getAvatar(index)}
                        alt={user.name}
                        className="size-13 rounded-sm object-cover"
                      />
                    </div>
                  </td>
                  <td className="table-cell">{user.name}</td>
                  <td className="table-cell">{user.phone}</td>
                  <td className="table-cell">
                    {user.isBlocked ? (
                      <span className="px-2 py-1 text-xs bg-red-100 text-red-500 rounded-full">Blocked</span>
                    ) : (
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-500 rounded-full">Active</span>
                    )}
                  </td>
                  <td className="table-cell">
  ₹{user.walletId?.mainBalance?.toFixed(2) || '0.00'}
</td>
                  <td className="table-cell">
                    <button
                      onClick={() => navigate(`/admin/add-money?userId=${user._id}`)}
                      title="Add Money"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <IndianRupee size={20} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-sm text-gray-500">No users found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AddMoneyUser;
