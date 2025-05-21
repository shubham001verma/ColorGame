import React, { useState } from 'react';
import axios from 'axios';
import { NavLink, useNavigate } from 'react-router-dom';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { BiUser, BiGift, BiLockAlt } from 'react-icons/bi';
import { BsTelephoneFill } from 'react-icons/bs';
import Swal from 'sweetalert2';
import API_BASE_URL from "../../components/Config";
import Navbar from '../../components/Navbar';
import BottomTab from '../../components/BottomTab';

function UserSignup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    password: '',
    referredBy: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/register`, formData);
      if (response.data) {
        Swal.fire({
          icon: 'success',
          title: 'Signup Successful!',
          text: 'Redirecting...',
          timer: 1500,
          showConfirmButton: false
        });
        navigate('/user/login');
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Signup Failed!',
        text: err.response?.data?.message || 'Please check your details.',
      });
    }
  };

  return (
    <>
     <div className="w-screen flex justify-center h-screen bg-[#9195a3] ">
      <Navbar />
      <div className="w-full max-w-[500px] mx-auto pt-[50px] pb-[90px] px-4 bg-white ">
        <div className="text-start">
          <h2 className="text-xl font-semibold text-black mb-2 mt-5">Sign up</h2>
          <p className="text-sm text-black mb-4">
            Please sign up with your phone number and password. <br />
            Also add your referral code (optional).
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6">
          {/* Name Field */}
          <label className="block text-sm font-semibold text-black mb-1">
            <div className="flex items-center gap-2">
              <BiUser />
              Name
            </div>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your name"
            className="bg-[#f0f6ff] border border-[#c7ddf6] w-full px-3 py-2 rounded-lg text-sm outline-none mb-4"
            required
          />

          {/* Phone Field */}
          <label className="block text-sm font-semibold text-black mb-1">
            <div className="flex items-center gap-2">
              <BsTelephoneFill />
              Phone Number
            </div>
          </label>
          <div className="flex items-center bg-[#f0f6ff] border border-[#c7ddf6] rounded-lg mb-4 px-3 py-2">
            <span className="mr-2 text-sm font-medium">+91</span>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
              className="bg-transparent w-full outline-none text-sm"
              required
            />
          </div>

          {/* Referral Code */}
          <label className="block text-sm font-semibold text-black mb-1">
            <div className="flex items-center gap-2">
              <BiGift />
              Referral Code (optional)
            </div>
          </label>
          <input
            type="text"
            name="referredBy"
            value={formData.referredBy}
            onChange={handleChange}
            placeholder="Referral Code"
            className="bg-[#f0f6ff] border border-[#c7ddf6] w-full px-3 py-2 rounded-lg text-sm outline-none mb-4"
          />

          {/* Password Field */}
          <label className="block text-sm font-semibold text-black mb-1">
            <div className="flex items-center gap-2">
              <BiLockAlt />
              Password
            </div>
          </label>
          <div className="relative mb-4">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              className="bg-[#f0f6ff] border border-[#c7ddf6] w-full px-3 py-2 rounded-lg text-sm outline-none pr-10"
              required
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-xl text-gray-500 cursor-pointer"
            >
              {showPassword ? <AiFillEye /> : <AiFillEyeInvisible />}
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-primary mt-4 py-2 text-white font-bold rounded-full shadow-lg"
          >
            Sign up
          </button>

          <NavLink
            to="/user/login"
           className="w-full mt-3 block text-center border border-primary text-primary font-bold py-2 rounded-full"
          >
            Login
          </NavLink>
        </form>
      </div>
      <BottomTab />
      </div>
    </>
  );
}

export default UserSignup;
