import React from 'react';
import img1 from '../assets/user-1.jpg';
import img2 from '../assets/user-2.jpg';
import img3 from '../assets/user-3.jpg';
import img4 from '../assets/user-4.jpg';

const avatars = [img1, img2, img3, img4];

const ReferralTree = ({ user }) => {
  if (!user) return null;

  return (
    <div className="flex flex-col items-center">
      <TreeNode user={user} showLevel={false} index={0} />
    </div>
  );
};

const TreeNode = ({ user, showLevel = true, index }) => {
  if (!user) return null;

  const avatar = avatars[index % avatars.length];

  return (
    <div className="flex flex-col items-center relative">
      {/* Avatar & Info */}
      <div className="flex flex-col items-center mb-4">
        <img
          src={avatar}
          alt="User Avatar"
          className="w-14 h-14 rounded-full border-2 border-blue-500"
        />
        <div className="bg-white border border-gray-300 shadow rounded px-3 py-1 mt-1 text-center">
          <p className="text-sm font-semibold text-gray-800">{user.name || user.phone}</p>
          <p className="text-xs text-gray-500">Code: {user.referralCode || 'N/A'}</p>
          {showLevel && (
            <p className="text-[10px] text-blue-600 font-medium">Level {user.level || 1}</p>
          )}
        </div>
      </div>

      {/* Lines and Children */}
      {user.downlines && user.downlines.length > 0 && (
        <>
          <div className="w-px h-5 bg-gray-400"></div>
          <div className="flex gap-6 mt-2">
            {user.downlines.map((child, idx) => (
              <TreeNode
                key={child.userId || idx}
                user={child}
                showLevel={true}
                index={idx}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ReferralTree;
