import React, { useState, useEffect } from "react";
import { useParams, useNavigate,useLocation } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import API_BASE_URL from "../../components/Config";

const EditProfile = () => {

    const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    image: null,
    address:"",
    previewImage: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/user/singleuser/${id}`);
        const { name, email, phone, image,address } = response.data;
        setFormData({
          name: name || "",
          email: email || "",
          phone: phone || "",
          image: null,
          address: address ||"",
          previewImage: image ? `${API_BASE_URL}/${image}` : "",
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        image: file,
        previewImage: URL.createObjectURL(file),
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("phone", formData.phone);
    formDataToSend.append("address", formData.address);
    if (formData.image) {
      formDataToSend.append("image", formData.image);
    }

    try {
      await axios.put(`${API_BASE_URL}/api/user/update/${id}`, formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      Swal.fire({
        icon: "success",
        title: "Profile Updated!",
        text: "Your profile has been updated successfully.",
        confirmButtonColor: "#8254ff",
      }).then(() => {
        navigate("/dashboard");
      });

    } catch (error) {
      console.error("Error updating profile:", error);
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "Something went wrong. Please try again!",
        confirmButtonColor: "#ff4b4b",
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-1 p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Edit Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
              focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary 
              dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
              focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary 
              dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
              focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary 
              dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
              focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary 
              dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          {/* Profile Image */}
       
        </div>
        <div className=" grid grid-cols-2 gap-4">
        <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Profile Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
              focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary 
              dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
        {/* Profile Image Preview */}
        {formData.previewImage && (
          <div className="flex ">
            <img src={formData.previewImage} alt="Profile Preview" className="w-24 h-24 rounded-full object-cover mt-2" />
          </div>
        )}

        {/* Submit Button */}

    
        <button
          type="submit"
          className="w-40 bg-primary text-white font-medium py-2 rounded-md transition duration-300"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
