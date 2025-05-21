import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  AiFillHome,
  AiOutlineUser,
  AiOutlineWallet,
  AiOutlineHistory,
} from 'react-icons/ai';

const BottomTab = () => {
  const userId = sessionStorage.getItem('useridcolorapp');
  return (
    <>
      {/* Mobile-style fixed bottom bar container */}
   
        <div className="w-full max-w-[500px] fixed bottom-0  left-0 right-0 mx-auto  z-50">
          <div className="bg-primary text-white  shadow-xl flex justify-around items-center h-16 border border-white/10 backdrop-blur-md transition-all duration-300">
            <NavLink
              to="/home"
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 transition-all duration-300 ${
                  isActive
                    ? 'text-white font-semibold scale-110'
                    : 'text-white/80 hover:text-white'
                }`
              }
            >
              <AiFillHome size={22} />
              <span className="text-xs">Home</span>
            </NavLink>

            <NavLink
              to="/activity"
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 transition-all duration-300 ${
                  isActive
                    ? 'text-white font-semibold scale-110'
                    : 'text-white/80 hover:text-white'
                }`
              }
            >
              <AiOutlineHistory size={22} />
              <span className="text-xs">Activity</span>
            </NavLink>

            <NavLink
              to="/walletpage"
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 transition-all duration-300 ${
                  isActive
                    ? 'text-white font-semibold scale-110'
                    : 'text-white/80 hover:text-white'
                }`
              }
            >
              <AiOutlineWallet size={22} />
              <span className="text-xs">Wallet</span>
            </NavLink>

            <NavLink
               to={`/user/account/${userId}`}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 transition-all duration-300 ${
                  isActive
                    ? 'text-white font-semibold scale-110'
                    : 'text-white/80 hover:text-white'
                }`
              }
            >
              <AiOutlineUser size={22} />
              <span className="text-xs">Account</span>
            </NavLink>
          </div>
        </div>
     

      {/* Spacer to avoid content behind tab */}
      <div className="h-[80px]" />
    </>
  );
};

export default BottomTab;
