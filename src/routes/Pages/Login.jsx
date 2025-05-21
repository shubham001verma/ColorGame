import React, { useState } from 'react';
import axios from 'axios';
import { NavLink, useNavigate } from 'react-router-dom';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import Swal from 'sweetalert2';
import API_BASE_URL from "../../components/Config";

function Login() {
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
      console.log(response.data)
      const { token } = response.data;

      // Decode token to extract userId and role
      const payload = JSON.parse(atob(token.split('.')[1]));
      const { userId, role } = payload;

      sessionStorage.setItem('useridcolorapp', userId);
      localStorage.setItem('token', token);

      Swal.fire({
        icon: 'success',
        title: 'Login Successful!',
        text: 'Redirecting...',
        timer: 1500,
        showConfirmButton: false
      });

      if (role === 'admin') {
        navigate('/dashboard');
      } else {
        navigate('/home');
      }

    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Login Failed!',
        text: err.response?.data?.message || 'Please check your credentials.',
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4 mt-1">Login</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Phone Number</label>
            <input 
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter your phone number"
            />
          </div>
          <div className="mb-4 relative">
            <label className="block text-gray-700 mb-1">Password</label>
            <input 
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Password"
            />
            <span 
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-10 right-3 cursor-pointer text-primary text-xl"
            >
              {showPassword ? <AiFillEye /> : <AiFillEyeInvisible />}
            </span>
          </div>
          <button 
            type="submit"
            className="w-full text-white py-2 rounded-lg bg-primary transition mb-4"
          >
            Login
          </button>
          
        </form>
      </div>
    </div>
  );
}

export default Login;
