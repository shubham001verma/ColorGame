import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate,useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import API_BASE_URL from '../../components/Config'
const EditAdmin = () => {
   const location = useLocation();
    const id = location.state?.adminId;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
  });

  // Fetch admin details on component mount
  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/admin/singleadmin/${id}`);
        setFormData(response.data);
      } catch (error) {
        console.error("Error fetching admin details:", error);
      }
    };
    fetchAdmin();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`${API_BASE_URL}/admin/updateadmin/${id}`, formData, {
        headers: { "Content-Type": "application/json" },
      });

      Swal.fire({
        title: "Success!",
        text: "Admin updated successfully!",
        icon: "success",
        confirmButtonText: "OK",
      });

      navigate(-1); // Redirect to admin list after update
    } catch (error) {
      console.error("Error updating admin:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to update admin. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Edit Admin</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 dark:text-gray-300">Name</label>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary 
                dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary 
                dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 dark:text-gray-300">Phone</label>
            <input
              type="text"
              name="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary 
                dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300">Address</label>
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary 
                dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-700 dark:text-gray-300">Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter new password (optional)"
            value={formData.password}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary 
                dark:bg-gray-700 dark:text-white"
          />
        </div>

        <button
          type="submit"
          className="w-40 bg-primary  text-white font-medium py-2 rounded-md transition duration-300"
        >
          Update Admin
        </button>
      </form>
    </div>
  );
};

export default EditAdmin;
