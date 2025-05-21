import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ProfileImg from "../../src/assets/user-1.jpg";
import { FiMail, FiLogOut, FiUser } from "react-icons/fi";
import API_BASE_URL from "../components/Config";
import Swal from "sweetalert2";

const HederProfile = () => {
  const id = sessionStorage.getItem("useridcolorapp");
  const dropdownRef = useRef(null);

  const [userData, setUserData] = useState({
    profileName: "Admin Name",
    image: ProfileImg,
    role: "Admin",
    email: "",
  });

  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!id) return;

      try {
        const userResponse = await axios.get(`${API_BASE_URL}/api/user/singleuser/${id}`);
        console.log(userResponse.data);

        setUserData((prev) => ({
          ...prev,
          profileName: userResponse.data.name || "User Name",
          role: userResponse.data.role || prev.role,
          image: userResponse.data.image ? `${API_BASE_URL}/${userResponse.data.image}` : prev.image,
          email: userResponse.data.email || prev.email,
        }));
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [id]);

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, logout!",
    }).then((result) => {
      if (result.isConfirmed) {
          sessionStorage.removeItem('useridcolorapp');
        navigate("/admin/login");
      }
    });
  };

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)} className="flex items-center">
        <img src={userData.image} alt="Profile" className="w-10 h-10 rounded-full object-cover" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-[300px] bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 z-50">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50">User Profile</h2>
          <div className="flex items-center gap-4 py-4">
            <img src={userData.image} alt="Profile" className="w-20 h-20 rounded-full object-cover" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">{userData.profileName}</h3>
              {userData.role !== "client" && (
                <p className="text-sm font-medium text-slate-900 transition-colors dark:text-slate-50">
                  {userData.role}
                </p>
              )}
              <p className="text-sm flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <FiMail className="text-gray-500 dark:text-gray-400" /> {userData.email || "No Email"}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
      
    navigate(`/editprofile/${id}` );
            }}
            className="w-full flex items-center justify-center gap-2 border border-primary text-primary bg-transparent font-medium py-2 rounded-lg dark:border-primary dark:text-primary mb-2"
          >
            <FiUser size={18} /> Edit Profile
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 border border-primary text-primary bg-transparent font-medium py-2 rounded-lg dark:border-primary dark:text-primary"
          >
            <FiLogOut size={18} /> Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default HederProfile;

