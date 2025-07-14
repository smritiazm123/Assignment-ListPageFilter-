import React from "react";
import EventIcon from '@mui/icons-material/Event';
import GetAppIcon from '@mui/icons-material/GetApp';
import LanguageIcon from '@mui/icons-material/Language';
import BarChartIcon from '@mui/icons-material/BarChart';

const CardView = ({ item, idx }) => (
  <div
    key={item.id || idx}
    className="bg-white rounded-lg shadow-md p-6 flex flex-col gap-2 border border-gray-200 hover:shadow-lg transition-shadow duration-200"
  >
    <div className="font-semibold text-lg text-blue-700 mb-1">
      {item.organization?.name || "No Organization"}
    </div>
    <div className="text-gray-700 mb-2 line-clamp-3">
      {item.description || "No description available."}
    </div>
    <div className="text-xs text-gray-500 mb-1">
      <span className="font-medium"><EventIcon fontSize='inherit'/> Last Updated:</span> {item.modified ? new Date(item.modified).toLocaleDateString() : "N/A"}
    </div>
    <div className="text-xs text-gray-500 mb-1">
      <span className="font-medium"><GetAppIcon fontSize='inherit'/> Downloads:</span> {item.download_count ?? "N/A"}
    </div>
    <div className="text-xs text-gray-500 mb-1">
      <span className="font-medium"><LanguageIcon fontSize='inherit'/> Geography:</span> {item.geography ?? "N/A"}
    </div>
    <div className="text-xs text-gray-500 mb-1">
      <span className="font-medium"><BarChartIcon fontSize='inherit'/> Sectors:</span> {Array.isArray(item.sectors) ? item.sectors.join(", ") : item.sectors ?? "N/A"}
    </div>
    <div className="text-xs text-gray-500 mb-1">
      <span className="font-medium">Tags:</span> {Array.isArray(item.tags) ? item.tags.join(", ") : item.tags ?? "N/A"}
    </div>
    <div className="text-xs text-gray-500 mb-1">
      <span className="font-medium">Published By:</span> {item.name ?? "N/A"}
    </div>
    <div className="text-xs text-gray-500">
      <span className="font-medium">Formats:</span> {Array.isArray(item.formats) ? item.formats.join(", ") : item.formats ?? "N/A"}
    </div>
  </div>
);

export default CardView; 