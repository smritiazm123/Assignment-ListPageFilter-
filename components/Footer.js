import React from "react";
import HubOutlinedIcon from '@mui/icons-material/HubOutlined';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import GitHubIcon from '@mui/icons-material/GitHub';
import FacebookRoundedIcon from '@mui/icons-material/FacebookRounded';

const iconWrapperStyle = {
  background: "#84DCCF",
  height: "50px",
  width: "50px",
  borderRadius: "50%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center"
};

const Footer = () => (
  <footer className="bg-[#1F5F8D] text-white mt-16 px-6 py-12">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start">
        {/* Left side - Logo and links */}
        <div className="mb-6 md:mb-0">
        <div className="text-2xl font-bold"><HubOutlinedIcon sx={{color:"#fdb557",marginRight:"10px"}}/>CivicDataSpace</div>
       
          <div className="flex space-x-6 text-sm mt-12">
            <a href="#" className="hover:text-gray-200 transition-colors">ABOUT US</a>
            <a href="#" className="hover:text-gray-200 transition-colors">SITEMAP</a>
            <a href="#" className="hover:text-gray-200 transition-colors">CONTACT US</a>
          </div>
        </div>
        {/* Right side - Social media */}
        <div className="flex flex-col items-start md:items-end">
          <div className="text-sm font-medium mb-4 text-[#fdb557]">Follow Us</div>
          <div className="flex space-x-4">
          
          <a href="#" className="hover:text-gray-200 transition-colors" title="GitHub">
              <div style={iconWrapperStyle}>
                <GitHubIcon sx={{ background: "#84DCCF", color: "#000" }} />
              </div>
            </a>
            <a href="#" className="hover:text-gray-200 transition-colors" title="Facebook">
              <div style={iconWrapperStyle}>
                <FacebookRoundedIcon sx={{ background: "#84DCCF", color: "#000" }} />
              </div>
            </a>
            <a href="#" className="hover:text-gray-200 transition-colors" title="Twitter">
              <div style={iconWrapperStyle}>
                <TwitterIcon sx={{ background: "#84DCCF", color: "#000" }} />
              </div>
            </a>
            <a href="#" className="hover:text-gray-200 transition-colors" title="Instagram">
              <div style={iconWrapperStyle}>
                <InstagramIcon sx={{ background: "#84DCCF", color: "#000" }} />
              </div>
            </a>

          </div>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer; 