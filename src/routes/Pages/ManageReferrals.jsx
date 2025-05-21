import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search, Trash } from "lucide-react";
import Swal from "sweetalert2";
import API_BASE_URL from "../../components/Config";

const ManageReferrals = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchReferrals();
  }, []);

  const fetchReferrals = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/user/referrals`);
       const filteredUsers = response.data.data.filter(user => user.role !== 'admin');
    setUsers(filteredUsers);
    } catch (error) {
      console.error("Error fetching referrals:", error);
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This user will be permanently deleted.",
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

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="card">
      <div className="card-header flex justify-between items-center p-4">
        <h2 className="text-lg font-semibold dark:text-white">Manage Referrals</h2>
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
        <div className="relative h-auto w-full overflow-auto">
          <table className="table">
            <thead className="table-header">
              <tr className="table-row">
                <th className="table-head">#</th>
                <th className="table-head">Name</th>
                <th className="table-head">Phone</th>
                <th className="table-head">Referral Code</th>
                <th className="table-head">Referred By</th>
                <th className="table-head">Downlines</th>
                <th className="table-head">Created At</th>
                <th className="table-head">Actions</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {filteredUsers.map((user, index) => (
                <tr key={user._id} className="table-row">
                  <td className="table-cell">{index + 1}</td>
                  <td className="table-cell">{user.name}</td>
                  <td className="table-cell">{user.phone}</td>
                  <td className="table-cell">{user.referralCode}</td>
                  <td className="table-cell">{user.referredBy || "-"}</td>
                  <td className="table-cell">
                    {user.downlines.length > 0 ? (
                      <tr className="list-disc pl-4">
                        {user.downlines.map((downline) => (
                            <>
                          <td key={downline._id}>
                            {downline.name} 
                          </td>
                          <td key={downline._id}>
                            ({downline.phone})
                          </td>
                          </>
                        ))}
                      </tr>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="table-cell">
                    {new Date(user.createdAt).toLocaleString()}
                  </td>
                  <td className="table-cell">
                    <button
                      onClick={() => handleDelete(user._id)}
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

export default ManageReferrals;
