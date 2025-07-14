import React from "react";

const Header = () => (
  <header className="bg-blue-950 text-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center py-4">
        {/* Logo */}
        <div className="flex items-center">
          <div className="text-2xl font-bold">CIVICDATASPACE</div>
        </div>
        {/* Navigation */}
        <nav className="hidden md:flex space-x-8">
          <a href="#" className="text-green-800 font-medium">ALL DATA</a>
          <a href="#" className="text-white hover:text-gray-200 transition-colors">SECTORS</a>
          <a href="#" className="text-white hover:text-gray-200 transition-colors">USE CASES</a>
          <a href="#" className="text-white hover:text-gray-200 transition-colors">PUBLISHERS</a>
          <a href="#" className="text-white hover:text-gray-200 transition-colors">ABOUT US</a>
        </nav>
        {/* Login/Signup Button */}
        <button className="bg-green-800 hover:bg-green-600 text-white px-6 py-2 rounded-md font-medium transition-colors">
          LOGIN/SIGNUP
        </button>
      </div>
    </div>
    {/* Breadcrumb */}
    <div className="bg-yellow-400 text-gray-800 py-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-sm">
          HOME &gt; ALL DATA
        </div>
      </div>
    </div>
  </header>
);

export default Header; 