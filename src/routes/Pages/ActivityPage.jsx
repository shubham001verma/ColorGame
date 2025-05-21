import React from 'react';
import { FaGift, FaCalendarCheck, FaTrophy, FaUserFriends, FaSync, FaMedal } from 'react-icons/fa';
import Navbar from '../../components/Navbar';
import BottomTab from '../../components/BottomTab';

const topIcons = [
  { label: "Activity Award", icon: <FaMedal className="text-pink-500" /> },
  { label: "Invitation bonus", icon: <FaUserFriends className="text-blue-500" /> },
  { label: "Betting rebate", icon: <FaSync className="text-orange-500" /> },
  { label: "Super Jackpot", icon: <FaTrophy className="text-green-500" /> },
];

const bottomCards = [
  {
    title: "Gifts",
    description: "Enter the redemption code to receive gift rewards",
    image: "/23.png", // Replace with your actual image
  },
  {
    title: "Attendance bonus",
    description: "The more consecutive days you sign in, the higher the reward will be.",
    image: "/24.png", // Replace with your actual image
  },
];

const ActivityPage = () => {
  return (
    <>
    <div className="w-screen flex justify-center h-screen bg-[#9195a3] ">
    <Navbar/>
    <div className="w-full max-w-[500px]  px-4 pt-[70px]  bg-white">
      
      {/* Top Icon Section */}
      <div className="grid grid-cols-4 gap-4 text-center mb-6">
        {topIcons.map((item, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className="bg-blue-50 p-5 rounded-full shadow">
              {item.icon}
            </div>
            <p className="text-xs font-medium mt-2">{item.label}</p>
          </div>
        ))}
      </div>

      {/* Bottom Card Section */}
      <div className="grid grid-cols-2 gap-4">
        {bottomCards.map((card, i) => (
          <div key={i} className="bg-white rounded-xl overflow-hidden shadow-md">
            <img src={card.image} alt={card.title} className="w-full h-28 object-cover" />
            <div className="p-3">
              <h3 className="font-semibold text-sm mb-1">{card.title}</h3>
              <p className="text-xs text-gray-600">{card.description}</p>
            </div>
          </div>
        ))}
      </div>

    </div>
    <BottomTab/>
    </div>
    </>
  );
};

export default ActivityPage;
