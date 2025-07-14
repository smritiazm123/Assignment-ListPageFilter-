import React from "react";
import EventIcon from '@mui/icons-material/Event';
import GetAppIcon from '@mui/icons-material/GetApp';
import LanguageIcon from '@mui/icons-material/Language';
import BarChartIcon from '@mui/icons-material/BarChart';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
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
const CardView = ({ item, idx }) => (
  <div
    key={item.id || idx}
    className="bg-white rounded-lg shadow-md p-6 flex flex-col gap-2 border border-gray-200 hover:shadow-lg transition-shadow duration-200 min-h-[320px]"
  >
    <h3 className="font-semibold text-lg text-[#1F5F8D] mb-2">
          {item?.title || "No Organization"}
        </h3>
        <div className="flex gap-4 text-sm text-gray-600 mt-2">
          <div>
            <EventIcon sx={{color:"#b17f3d",fontSize:"20px"}}/> <b> {item.modified ? new Date(item.modified).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : "N/A"}<br />
            </b><br />
          </div>
          <div>
            <GetAppIcon sx={{color:"#b17f3d",fontSize:"20px"}}/><b> {item.download_count ?? "N/A"}</b><br />
          </div>
          <div>
            <LanguageIcon sx={{color:"#b17f3d",fontSize:"20px"}}/>
            <b className="truncate max-w-[40px] align-middle inline-block">
              {item.metadata?.[1]?.value ?? "N/A"}
            </b>
          </div>
</div>
        <hr className="my-2 border-gray-200" />
<p className="text-gray-700 mb-3 line-clamp-2 text-[14px]">
          {item.description || "No description available."}
        </p>
          
          <div className="flex justify-between mt-auto">
            <div className="flex">
            {item.has_charts && 
            <div>
              <span className="font-medium"><LeaderboardIcon sx={{color:"#b17f3d",fontSize:"20px"}}/></span><br />
            </div>
          }
            {Array.isArray(item.formats) && item.formats.length > 0 && (
            <div className="flex items-center gap-2">
              {item.formats.map((fmt, i) => {
                const upperFmt = fmt.toUpperCase();
                const iconObj = formatIconMap[upperFmt];
                return iconObj ? (
                  <span key={i} className="flex items-center gap-1 px-2 py-1 rounded border border-gray-200 bg-gray-50">
                    {iconObj.icon}
                    {/* <span className="text-xs font-semibold" style={{ color: iconObj.icon.props.sx.color }}>{iconObj.label}</span> */}
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
<div>
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
          </div>
  </div>
);

export default CardView; 