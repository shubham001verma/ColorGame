import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ProfileImg from "../../src/assets/user-1.jpg";
import { FiPower } from "react-icons/fi";
import Swal from "sweetalert2"; 
import API_BASE_URL from './Config'
export const UserProfile = () => {
  const navigate = useNavigate();
  const id = sessionStorage.getItem("useridcolorapp");

  const [userData, setUserData] = useState({
    profileName: "Admin Name",
    image: ProfileImg,
    role: "Admin",
  });

  // Local state for menu visibility (if required)
  const [hideMenu, setHideMenu] = useState(false);

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
          sessionStorage.clear('useridcolorapp', userId);
      localStorage.clear('token', token);
        navigate("/admin/login");
      }
    });
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (!id) return;

      try {
        const userResponse = await axios.get(`${API_BASE_URL}/api/user/singleuser/${id}`);
        console.log(userResponse);

        setUserData((prev) => ({
          ...prev,
          profileName: userResponse.data.name || "User Name",
          role: userResponse.data.role || "",
          image: userResponse.data.image ? `${API_BASE_URL}/${userResponse.data.image}` : prev.image,
        }));
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [id]);

  return (
    <div className="flex items-center gap-4 p-2 rounded-lg shadow-md m-1 bg-slate-100 transition-colors dark:bg-gray-800">
    <img src={userData.image} alt="Profile" className="w-12 h-12 rounded-full object-cover" />
    <div>
      <h2 className="text-lg font-semibold text-slate-900 transition-colors dark:text-slate-50">
        {userData.profileName}
      </h2>
      {userData.role !== "client" && (
        <p className="text-sm text-slate-900 transition-colors dark:text-slate-50">
          {userData.role}
        </p>
      )}
    </div>
    <button className="ml-auto hover:text-black" onClick={handleLogout}>
      <FiPower size={20} className=" text-primary" />
    </button>
  </div>
  );
};
