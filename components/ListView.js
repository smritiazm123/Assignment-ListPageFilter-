import React from "react";
import EventIcon from '@mui/icons-material/Event';
import GetAppIcon from '@mui/icons-material/GetApp';
import LanguageIcon from '@mui/icons-material/Language';

const ListView = ({ item, idx }) => (
  <div
    key={item.id || idx}
    className="bg-white border-b border-gray-200 p-4 hover:bg-gray-50 transition-colors duration-200"
  >
    <div className="flex justify-between items-start">
      <div className="flex-1">
        <h3 className="font-semibold text-lg text-[#1F5F8D] mb-2">
          {item.organization?.name || "No Organization"}
        </h3>
        <p className="text-gray-700 mb-3 line-clamp-2">
          {item.description || "No description available."}
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
          <div>
            <span className="font-medium"><EventIcon fontSize='inherit'/> Last Updated:</span><br />
            {item.modified ? new Date(item.modified).toLocaleDateString() : "N/A"}
          </div>
          <div>
            <span className="font-medium"><GetAppIcon fontSize='inherit'/> Downloads:</span><br />
            {item.download_count ?? "N/A"}
          </div>
          <div>
            <span className="font-medium"><LanguageIcon fontSize='inherit'/> Geography:</span><br />
            {item.geography ?? "N/A"}
          </div>
          <div>
            <span className="font-medium">Published By:</span><br />
            {item.name ?? "N/A"}
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {Array.isArray(item.sectors) && item.sectors.length > 0 && (
            <div className="flex items-center gap-1">
              <span className="text-xs font-medium text-gray-500">Sectors:</span>
              {item.sectors.slice(0, 3).map((sector, i) => (
                <span key={i} className="px-2 py-1 bg-blue-100 text-[#1F5F8D] text-xs rounded">
                  {sector}
                </span>
              ))}
              {item.sectors.length > 3 && (
                <span className="text-xs text-gray-500">+{item.sectors.length - 3} more</span>
              )}
            </div>
          )}
          {Array.isArray(item.tags) && item.tags.length > 0 && (
            <div className="flex items-center gap-1">
              <span className="text-xs font-medium text-gray-500">Tags:</span>
              {item.tags.slice(0, 3).map((tag, i) => (
                <span key={i} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                  {tag}
                </span>
              ))}
              {item.tags.length > 3 && (
                <span className="text-xs text-gray-500">+{item.tags.length - 3} more</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);

export default ListView; 