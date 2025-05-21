import React, { useState, useEffect } from "react";
import axios from "axios";
import { ShieldOff, ShieldCheck, Trash, Search } from "lucide-react"; // ✅ Using Shield icons
import Swal from "sweetalert2";
import img1 from '../../assets/user-1.jpg';
import img2 from '../../assets/user-2.jpg';
import img3 from '../../assets/user-3.jpg';
import img4 from '../../assets/user-4.jpg';
import API_BASE_URL from "../../components/Config";

const ManageUser = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const images = [img1, img2, img3, img4];
  const getAvatar = (index) => images[index % images.length];

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/user`);
      const filteredUsers = response.data.filter(user => user.role === 'user'); // ✅ Only users, no admins
      setUsers(filteredUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${API_BASE_URL}/api/user/${id}`);
          setUsers(users.filter((user) => user._id !== id));
          Swal.fire("Deleted!", "User has been deleted.", "success");
        } catch (error) {
          console.error("Error deleting user:", error);
          Swal.fire("Error!", "Something went wrong.", "error");
        }
      }
    });
  };

  const handleBlockToggle = async (id, isBlocked) => {
    Swal.fire({
      title: isBlocked ? "Unblock this user?" : "Block this user?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: isBlocked ? "Unblock" : "Block",
      confirmButtonColor: isBlocked ? "#3085d6" : "#d33",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
            await axios.put(`${API_BASE_URL}/api/user/blockuser/${id}`, { isBlocked: !isBlocked });
          const updatedUsers = users.map(user =>
            user._id === id ? { ...user, isBlocked: !isBlocked } : user
          );
          setUsers(updatedUsers);
          Swal.fire("Success!", `User ${isBlocked ? "unblocked" : "blocked"} successfully.`, "success");
        } catch (error) {
          console.error("Error updating user:", error);
          Swal.fire("Error!", "Something went wrong.", "error");
        }
      }
    });
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="card">
      <div className="card-header flex justify-between items-center p-4">
        <h2 className="text-lg font-semibold dark:text-white">All Users</h2>
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search by name" 
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
                <th className="table-head">Actions</th>
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
                    <div className="flex items-center gap-x-4">
                      <button
                        onClick={() => handleBlockToggle(user._id, user.isBlocked)}
                        className="text-gray-600 hover:text-primary"
                      >
                        {user.isBlocked ? <ShieldCheck size={22} /> : <ShieldOff size={22} />}
                      </button>
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash size={20} />
                      </button>
                    </div>
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

export default ManageUser;
