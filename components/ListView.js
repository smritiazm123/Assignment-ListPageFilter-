import React from "react";
import EventIcon from '@mui/icons-material/Event';
import GetAppIcon from '@mui/icons-material/GetApp';
import LanguageIcon from '@mui/icons-material/Language';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import GavelIcon from '@mui/icons-material/Gavel';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DataObjectIcon from '@mui/icons-material/DataObject';
import ArchiveIcon from '@mui/icons-material/Archive';
import TableChartIcon from '@mui/icons-material/TableChart';

const formatIconMap = {
  PDF: { icon: <PictureAsPdfIcon sx={{ color: '#e53935', fontSize: '20px' }} />, label: 'PDF' },
  JSON: { icon: <DataObjectIcon sx={{ color: '#1e88e5', fontSize: '20px' }} />, label: 'JSON' },
  ZIP: { icon: <ArchiveIcon sx={{ color: '#fbc02d', fontSize: '20px' }} />, label: 'ZIP' },
  XLSX: { icon: <TableChartIcon sx={{ color: '#43a047', fontSize: '20px' }} />, label: 'XLSX' },
  CSV: { icon: <TableChartIcon sx={{ color: '#43a047', fontSize: '20px' }} />, label: 'CSV' },
};

const ListView = ({ item, idx }) => (
  <div
    key={item.id || idx}
    className="bg-white border-b border-gray-200 p-4 hover:bg-gray-50 transition-colors duration-200 mb-[20px]"
  >
    <div className="flex justify-between items-start">
      <div className="flex-1">
        <h3 className="font-semibold text-lg text-[#1F5F8D] mb-2">
          {item?.title || "No Organization"}
        </h3>
        <p className="text-gray-700 mb-3 line-clamp-2 text-[14px]">
          {item.description || "No description available."}
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mt-8">
          <div>
            <span className="font-medium"><EventIcon sx={{color:"#b17f3d",fontSize:"20px"}}/> Last Updated:</span><b> {item.modified ? new Date(item.modified).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : "N/A"}</b><br />
          </div>
          <div>
            <span className="font-medium"><GetAppIcon sx={{color:"#b17f3d",fontSize:"20px"}}/> Downloads:</span><b> {item.download_count ?? "N/A"}</b><br />
          </div>
          <div>
            <span className="font-medium"><LanguageIcon sx={{color:"#b17f3d",fontSize:"20px"}}/> Geography:</span><b>{item.metadata?.[1]?.value ?? "N/A"}</b><br />
          </div>
          {item.has_charts && 
            <div>
              <span className="font-medium"><LeaderboardIcon sx={{color:"#b17f3d",fontSize:"20px"}}/> With Charts</span><br />
            </div>
          }
        </div>
        <div className="mt-6 flex justify-between w-[80%] flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-500"> Sector : <GavelIcon sx={{color:"#b17f3d",fontSize:"20px"}}/><br /></span>
          </div>
          {item.organization?.logo && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-500">Published By:</span>
              <img
                src={`https://api.datakeep.civicdays.in/${item.organization.logo}`}
                alt="Published by"
                className="h-8 w-8 rounded-full object-cover"
              />
            </div>
          )}
        </div>
        <div className="mt-6 flex justify-between w-[80%] flex-wrap gap-2">
          <div>
          {Array.isArray(item.tags) && item.tags.length > 0 && (
            <div className="flex items-center gap-1">
              <span className="text-xs font-medium text-gray-500">Tags:</span>
              {item.tags.slice(0, 3).map((tag, i) => (
                <span key={i} className="px-2 py-1 border-blue-950 bg-blue-300 text-black text-sm rounded">
                  {tag}
                </span>
              ))}
              {item.tags.length > 3 && (
                <span className="text-xs text-gray-500">+{item.tags.length - 3} more</span>
              )}
            </div>
          )}
          </div>
          {/* Formats row with icons */}
          <div>
          {Array.isArray(item.formats) && item.formats.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-500">Formats:</span>
              {item.formats.map((fmt, i) => {
                const upperFmt = fmt.toUpperCase();
                const iconObj = formatIconMap[upperFmt];
                return iconObj ? (
                  <span key={i} className="flex items-center gap-1 px-2 py-1 rounded border border-gray-200 bg-gray-50">
                    {iconObj.icon}
                    <span className="text-xs font-semibold" style={{ color: iconObj.icon.props.sx.color }}>{iconObj.label}</span>
                  </span>
                ) : (
                  <span key={i} className="flex items-center gap-1 px-2 py-1 rounded border border-gray-200 bg-gray-50">
                    {fmt}
                  </span>
                );
              })}
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default ListView; 