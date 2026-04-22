import React from 'react';

const Header = () => {
  return (
    <div className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
      <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
      <div className="flex items-center space-x-4">
        <span className="text-sm text-gray-600">Admin</span>
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white">
          A
        </div>
      </div>
    </div>
  );
};

export default Header;