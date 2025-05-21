import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, NavLink } from 'react-router-dom';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { BiLockAlt } from 'react-icons/bi';
import { BsTelephoneFill } from 'react-icons/bs';
import Swal from 'sweetalert2';
import API_BASE_URL from '../../components/Config';
import Navbar from '../../components/Navbar';
import BottomTab from '../../components/BottomTab';

const UserLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ phone: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, formData);
      const { token } = response.data;

      const payload = JSON.parse(atob(token.split('.')[1]));
      const { userId, role } = payload;

      if (role !== 'user') {
        Swal.fire({
          icon: 'error',
          title: 'Access Denied',
          text: 'Only users can log in here.',
        });
        return;
      }

  sessionStorage.setItem('useridcolorapp', userId);
      localStorage.setItem('token', token);

      Swal.fire({
        icon: 'success',
        title: 'Login Successful!',
        text: 'Redirecting...',
        timer: 1500,
        showConfirmButton: false,
      });

      navigate('/home');
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Login Failed!',
        text: err.response?.data?.message || 'Please check your credentials.',
      });
    }
  };

  return (
    <>
     <div className="w-screen flex justify-center min-h-screen bg-[#9195a3] ">
      <Navbar />
        <div className="w-full max-w-[500px] mx-auto pt-[60px] pb-[90px] px-4 bg-white">
            <div className="text-start">
          <h2 className="text-xl font-semibold text-black mb-2 mt-5 ">Login</h2>
          <p className="text-sm  text-black mb-4 ">Plese login in with your email & password</p>
        </div>
          <form
            onSubmit={handleSubmit}
            className=" mt-10"
          >
            {/* Phone Field */}
            <label className="text-sm font-semibold text-black mb-1 block">
              <div className="flex items-center gap-2 text-black">
                <BsTelephoneFill />
                Phone number
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

            {/* Password Field */}
            <label className="text-sm font-semibold text-black mb-1 block">
              <div className="flex items-center gap-2 text-black">
                <BiLockAlt />
                Password
              </div>
            </label>
            <div className="relative">
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

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-primary mt-6 py-2 text-white font-bold rounded-full shadow-lg"
            >
              Log in
            </button>

            {/* Register Button */}
            <NavLink
              to="/signup"
              className="w-full mt-3 block text-center border border-primary text-primary font-bold py-2 rounded-full"
            >
              Register
            </NavLink>

          
            
          </form>
        </div>

      <BottomTab />
      </div>
    </>
  );
};

export default UserLogin;
