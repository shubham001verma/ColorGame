import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import API_BASE_URL from "../../components/Config";
import Navbar from "../../components/Navbar";
import { FiCamera } from "react-icons/fi";
import img1 from "../../assets/user-1.jpg"; // ✅ Dummy image

const UpdateProfile = () => {
  const navigate = useNavigate();
 const { id } = useParams();
  const fileInputRef = useRef();


  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    image: null,
    previewImage: " ", // default preview
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/user/singleuser/${id}`);
        const { name, email, phone, address, image } = res.data;
        setFormData({
          name: name || "",
          email: email || "",
          phone: phone || "",
          address: address || "",
          image: null,
          previewImage: image ? `${API_BASE_URL}/${image}`  : img1,
        });
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

   fetchUser();
  }, [id]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
        previewImage: URL.createObjectURL(file),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedData = new FormData();
    updatedData.append("name", formData.name);
    updatedData.append("email", formData.email);
    updatedData.append("phone", formData.phone);
    updatedData.append("address", formData.address);
    if (formData.image) {
      updatedData.append("image", formData.image);
    }

    try {
      await axios.put(`${API_BASE_URL}/api/user/update/${id}`, updatedData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      Swal.fire({
        icon: "success",
        title: "Profile Updated!",
        timer: 1500,
        showConfirmButton: false,
      });

      navigate(`/user/account/${id}`);
    } catch (err) {
      console.error("Update error:", err);
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <>
    <div className="w-screen flex justify-center h-screen bg-[#9195a3] ">
      <Navbar />
      <div className="w-full max-w-[500px] mx-auto pt-[60px] pb-[90px] px-4 bg-white">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Profile Image */}
          <div className="relative w-24 h-24 mx-auto">
            <img
              src={formData.previewImage || img1}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-2 border-primary"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current.click()}
              className="absolute bottom-1 right-1 bg-white p-1 rounded-full shadow text-primary hover:bg-primary hover:text-white transition"
            >
              <FiCamera size={18} />
            </button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageChange}
              className="hidden"
            />
          </div>

          {/* Name */}
          <div>
            <label className="text-sm font-semibold block mb-1">Name</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-[#f0f6ff] border border-[#c7ddf6] px-4 py-2 rounded-lg text-sm outline-none"
            />
          </div>

          {/* Phone (disabled) */}
          <div>
            <label className="text-sm font-semibold block mb-1">Phone</label>
            <input
              type="text"
              name="phone"
              disabled
              value={formData.phone}
              className="w-full bg-[#f0f6ff] border border-[#c7ddf6] px-4 py-2 rounded-lg text-sm outline-none"
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-sm font-semibold block mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@email.com"
              className="w-full bg-[#f0f6ff] border border-[#c7ddf6] px-4 py-2 rounded-lg text-sm outline-none"
            />
          </div>

          {/* Address */}
          <div>
            <label className="text-sm font-semibold block mb-1">Address</label>
            <textarea
              name="address"
              rows="3"
              value={formData.address}
              onChange={handleChange}
              className="w-full bg-[#f0f6ff] border border-[#c7ddf6] px-4 py-2 rounded-lg text-sm outline-none resize-none"
              placeholder="Enter your address"
            ></textarea>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold py-2 rounded-full shadow-lg"
          >
            Save Changes
          </button>
        </form>
      </div>
      </div>
    </>
  );
};

export default UpdateProfile;
