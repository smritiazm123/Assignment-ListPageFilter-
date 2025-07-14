import React from "react";
import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';
import HubOutlinedIcon from '@mui/icons-material/HubOutlined';
const Header = () => (
  <header className="bg-[#1F5F8D] text-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center py-6">
        {/* Logo */}
        <div className="flex items-center">
          <div className="text-2xl font-bold"><HubOutlinedIcon sx={{color:"#fdb557",marginRight:"10px"}}/>CivicDataSpace</div>
        </div>
        {/* Navigation */}
        <nav className="hidden md:flex space-x-8 text-[14px] font-bold">
          <a href="#" className="text-[#84DCCF]">ALL DATA</a>
          <a href="#" className="text-white hover:text-gray-200 transition-colors">SECTORS</a>
          <a href="#" className="text-white hover:text-gray-200 transition-colors">USE CASES</a>
          <a href="#" className="text-white hover:text-gray-200 transition-colors">PUBLISHERS</a>
          <a href="#" className="text-white hover:text-gray-200 transition-colors">ABOUT US</a>
        </nav>
        {/* Login/Signup Button */}
        <button className="bg-[#84DCCF] text-black px-6 py-2 rounded-md text-[14px] font-bold transition-colors">
          LOGIN/SIGNUP
        </button>
      </div>
    </div>
    {/* Breadcrumb */}
    <div className="bg-[#fdb557] text-gray-800 py-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-sm">
          Home <KeyboardArrowRightRoundedIcon/> <b>All Data</b><KeyboardArrowRightRoundedIcon/>
        </div>
      </div>
    </div>
  </header>
);

export default Header; 