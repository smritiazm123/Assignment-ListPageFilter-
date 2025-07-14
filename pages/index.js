import { useEffect, useState } from "react";
import EventIcon from '@mui/icons-material/Event';
import GetAppIcon from '@mui/icons-material/GetApp';
import LanguageIcon from '@mui/icons-material/Language';
import BarChartIcon from '@mui/icons-material/BarChart';
function Home() {
  const [data, setData] = useState([]);
  const [aggregations, setAggregations] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    tags: [],
    sectors: [],
    formats: [],
    geography: []
  });
  const [expandedAccordions, setExpandedAccordions] = useState({
    tags: true,
    sectors: true,
    timePeriod: true,
    dataType: true,
    licenses: true,
    geographies: true
  });
  const [viewMode, setViewMode] = useState('card'); // 'card' or 'list'
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12); // Show 12 items per page
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async (page = currentPage, rowsPerPage = itemsPerPage) => {
    try {
      setLoading(true);
      const response = await fetch(`https://api.datakeep.civicdays.in/api/search/dataset/?page=${page}&size=${rowsPerPage}`);
      const result = await response.json();
      setData(result.results || []);
      // Set total items to 50 as per the API response
      setTotalItems(50);
      console.log(result.aggregations?.tags);
      setAggregations(result.aggregations || {});
    } catch (err) {
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const toggleAccordion = (accordion) => {
    setExpandedAccordions(prev => ({
      ...prev,
      [accordion]: !prev[accordion]
    }));
  };

  const handleFilterChange = (category, value) => {
    setFilters(prev => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter(item => item !== value)
        : [...prev[category], value]
    }));
  };

  const filteredData = data.filter(item => {
    const tagMatch = filters.tags.length === 0 || 
      (item.tags && filters.tags.some(tag => item.tags.includes(tag)));
    const sectorMatch = filters.sectors.length === 0 || 
      (item.sectors && filters.sectors.some(sector => item.sectors.includes(sector)));
    const formatMatch = filters.formats.length === 0 || 
      (item.formats && filters.formats.some(format => item.formats.includes(format)));
    const geographyMatch = filters.geography.length === 0 || 
      (item.geography && filters.geography.includes(item.geography));
    
    return tagMatch && sectorMatch && formatMatch && geographyMatch;
  });

  // Pagination logic
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentData = data; // Use the data directly from API since it's already paginated

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchData(page, itemsPerPage);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRowsPerPageChange = (newRowsPerPage) => {
    setItemsPerPage(newRowsPerPage);
    setCurrentPage(1); // Reset to first page when changing rows per page
    fetchData(1, newRowsPerPage);
  };

  const handleFirstPage = () => {
    if (currentPage !== 1) {
      handlePageChange(1);
    }
  };

  const handleLastPage = () => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    if (currentPage !== totalPages && totalPages > 0) {
      handlePageChange(totalPages);
    }
  };

  // Helper to normalize aggregation data to array
  const normalizeAgg = (agg) => {
    if (Array.isArray(agg)) return agg;
    if (agg && typeof agg === 'object') {
      return Object.entries(agg).map(([key, value]) => ({
        key,
        doc_count: value.doc_count ?? value.count ?? value
      }));
    }
    return [];
  };

  const AccordionItem = ({ title, children, isExpanded, onToggle }) => (
    <div className="border-b border-gray-200">
      <button
        className="w-full px-4 py-3 text-left flex justify-between items-center hover:bg-gray-50"
        onClick={onToggle}
      >
        <span className="font-medium text-gray-700">{title}</span>
        <span className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>
      {isExpanded && (
        <div className="px-4 pb-3">
          {children}
        </div>
      )}
    </div>
  );

  const FilterCheckbox = ({ label, checked, onChange, count }) => (
    <label className="flex items-center space-x-2 py-1 cursor-pointer hover:bg-gray-50 px-2 rounded">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
      />
      <span className="text-sm text-gray-700 flex-1">{label}</span>
      {count && <span className="text-xs text-gray-500">({count})</span>}
    </label>
  );

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
        <span className="font-medium"><EventIcon/>Last Updated:</span> {item.modified ? new Date(item.modified).toLocaleDateString() : "N/A"}
      </div>
      <div className="text-xs text-gray-500 mb-1">
        <span className="font-medium"><GetAppIcon/>Downloads:</span> {item.download_count ?? "N/A"}
      </div>
      <div className="text-xs text-gray-500 mb-1">
        <span className="font-medium"><LanguageIcon/>Geography:</span> {item.geography ?? "N/A"}
      </div>
      <div className="text-xs text-gray-500 mb-1">
        <span className="font-medium"><BarChartIcon/>Sectors:</span> {Array.isArray(item.sectors) ? item.sectors.join(", ") : item.sectors ?? "N/A"}
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

  const ListView = ({ item, idx }) => (
    <div
      key={item.id || idx}
      className="bg-white border-b border-gray-200 p-4 hover:bg-gray-50 transition-colors duration-200"
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="font-semibold text-lg text-blue-700 mb-2">
            {item.organization?.name || "No Organization"}
          </h3>
          <p className="text-gray-700 mb-3 line-clamp-2">
            {item.description || "No description available."}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
            <div>
              <span className="font-medium"><EventIcon/>Last Updated:</span><br />
              {item.modified ? new Date(item.modified).toLocaleDateString() : "N/A"}
            </div>
            <div>
              <span className="font-medium"><GetAppIcon/>Downloads:</span><br />
              {item.download_count ?? "N/A"}
            </div>
            <div>
              <span className="font-medium"><LanguageIcon/>Geography:</span><br />
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
                  <span key={i} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
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

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (error) return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
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

      {/* Search Bar and Controls */}
      <div className="bg-white shadow-sm border-b border-gray-200 p-4">
        <div className=" mx-auto">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search Input */}
            <div className="flex-1 w-full">
              <input
                type="text"
                placeholder="start typing to search for any dataset"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Latest Updated Dropdown */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Latest Updated:</span>
              <div className="relative">
                <select className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="last-week">Last Week</option>
                  <option value="last-month">Last Month</option>
                  <option value="last-year">Last Year</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* View Toggle */}
            <div className="flex items-center bg-white rounded-lg shadow-sm border border-gray-200">
              <button
                onClick={() => setViewMode('card')}
                className={`px-4 py-3 rounded-l-lg transition-colors duration-200 ${
                  viewMode === 'card' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
                title="Card View"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-3 rounded-r-lg transition-colors duration-200 ${
                  viewMode === 'list' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
                title="List View"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex">
        {/* Filter Sidebar */}
        <div className="w-80 bg-white shadow-lg min-h-screen p-4">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Filters</h2>
          
          <AccordionItem
            title="Tags"
            isExpanded={expandedAccordions.tags}
            onToggle={() => toggleAccordion('tags')}
          >
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {normalizeAgg(aggregations.tags).length > 0 ? normalizeAgg(aggregations.tags).map(tag => (
                <FilterCheckbox
                  key={tag.key}
                  label={tag.key}
                  checked={filters.tags.includes(tag.key)}
                  onChange={() => handleFilterChange('tags', tag.key)}
                  count={tag.doc_count}
                />
              )) : <p className="text-gray-500 text-sm">No tags available</p>}
            </div>
          </AccordionItem>

          <AccordionItem
            title="Sectors"
            isExpanded={expandedAccordions.sectors}
            onToggle={() => toggleAccordion('sectors')}
          >
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {normalizeAgg(aggregations.sectors).length > 0 ? normalizeAgg(aggregations.sectors).map(sector => (
                <FilterCheckbox
                  key={sector.key}
                  label={sector.key}
                  checked={filters.sectors.includes(sector.key)}
                  onChange={() => handleFilterChange('sectors', sector.key)}
                  count={sector.doc_count}
                />
              )) : <p className="text-gray-500 text-sm">No sectors available</p>}
            </div>
          </AccordionItem>

          <AccordionItem
            title="Time Period"
            isExpanded={expandedAccordions.timePeriod}
            onToggle={() => toggleAccordion('timePeriod')}
          >
            <div className="space-y-1">
              <FilterCheckbox
                label="Last 30 days"
                checked={false}
                onChange={() => {}}
              />
              <FilterCheckbox
                label="Last 3 months"
                checked={false}
                onChange={() => {}}
              />
              <FilterCheckbox
                label="Last year"
                checked={false}
                onChange={() => {}}
              />
            </div>
          </AccordionItem>

          <AccordionItem
            title="Data Type"
            isExpanded={expandedAccordions.dataType}
            onToggle={() => toggleAccordion('dataType')}
          >
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {normalizeAgg(aggregations.formats).length > 0 ? normalizeAgg(aggregations.formats).map(format => (
                <FilterCheckbox
                  key={format.key}
                  label={format.key}
                  checked={filters.formats.includes(format.key)}
                  onChange={() => handleFilterChange('formats', format.key)}
                  count={format.doc_count}
                />
              )) : <p className="text-gray-500 text-sm">No formats available</p>}
            </div>
          </AccordionItem>

          <AccordionItem
            title="Licenses"
            isExpanded={expandedAccordions.licenses}
            onToggle={() => toggleAccordion('licenses')}
          >
            <div className="space-y-1">
              <FilterCheckbox
                label="Open License"
                checked={false}
                onChange={() => {}}
              />
              <FilterCheckbox
                label="Commercial License"
                checked={false}
                onChange={() => {}}
              />
            </div>
          </AccordionItem>

          <AccordionItem
            title="Geographies"
            isExpanded={expandedAccordions.geographies}
            onToggle={() => toggleAccordion('geographies')}
          >
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {normalizeAgg(aggregations.geography).length > 0 ? normalizeAgg(aggregations.geography).map(geo => (
                <FilterCheckbox
                  key={geo.key}
                  label={geo.key}
                  checked={filters.geography.includes(geo.key)}
                  onChange={() => handleFilterChange('geography', geo.key)}
                  count={geo.doc_count}
                />
              )) : <p className="text-gray-500 text-sm">No geographies available</p>}
            </div>
          </AccordionItem>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Datasets</h1>
          </div>

          {/* Content based on view mode */}
          {viewMode === 'card' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentData.map((item, idx) => (
                <CardView key={item.id || idx} item={item} idx={idx} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {currentData.map((item, idx) => (
                <ListView key={item.id || idx} item={item} idx={idx} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <div className="flex items-center space-x-2 bg-white rounded-lg shadow-sm border border-gray-200 px-4 py-2">
                {/* Previous button */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    currentPage === 1
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Previous
                </button>

                {/* Page numbers */}
                <div className="flex items-center space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    // Show first page, last page, current page, and pages around current
                    const shouldShow = 
                      page === 1 || 
                      page === totalPages || 
                      (page >= currentPage - 2 && page <= currentPage + 2);
                    
                    if (!shouldShow) {
                      // Show ellipsis
                      if (page === currentPage - 3 || page === currentPage + 3) {
                        return <span key={`ellipsis-${page}`} className="px-2 text-gray-500">...</span>;
                      }
                      return null;
                    }

                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                          page === currentPage
                            ? 'bg-blue-500 text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>

                {/* Next button */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    currentPage === totalPages
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* Results count and controls */}
          <div className="mt-4 flex flex-col sm:flex-row justify-between items-center text-gray-600 text-sm">
            <div className="mb-2 sm:mb-0">
              Showing {startIndex + 1}-{endIndex} of {totalItems} datasets
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Rows per page selector */}
              <div className="flex items-center space-x-2">
                <span className="text-gray-600">Rows per page:</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => handleRowsPerPageChange(Number(e.target.value))}
                  className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={6}>6</option>
                  <option value={12}>12</option>
                  <option value={24}>24</option>
                  <option value={48}>48</option>
                </select>
              </div>

              {/* Pagination arrows */}
              <div className="flex items-center space-x-1">
                {/* First page */}
                <button
                  onClick={handleFirstPage}
                  disabled={currentPage === 1}
                  className={`p-1 rounded transition-colors ${
                    currentPage === 1
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  title="First page"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 9H17a1 1 0 110 2h-5.586l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd"/>
                  </svg>
                </button>

                {/* Previous page */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`p-1 rounded transition-colors ${
                    currentPage === 1
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  title="Previous page"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                </button>

                {/* Page indicator */}
                <span className="px-2 text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>

                {/* Next page */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                  className={`p-1 rounded transition-colors ${
                    currentPage >= totalPages
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  title="Next page"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
                  </svg>
                </button>

                {/* Last page */}
                <button
                  onClick={handleLastPage}
                  disabled={currentPage >= totalPages}
                  className={`p-1 rounded transition-colors ${
                    currentPage >= totalPages
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  title="Last page"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-blue-950 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start">
            {/* Left side - Logo and links */}
            <div className="mb-6 md:mb-0">
              <div className="text-2xl font-bold mb-4">CIVICDATASPACE</div>
              <div className="flex space-x-6 text-sm">
                <a href="#" className="hover:text-gray-200 transition-colors">ABOUT US</a>
                <a href="#" className="hover:text-gray-200 transition-colors">SITEMAP</a>
                <a href="#" className="hover:text-gray-200 transition-colors">CONTACT US</a>
              </div>
            </div>

            {/* Right side - Social media */}
            <div className="flex flex-col items-start md:items-end">
              <div className="text-sm font-medium mb-4">FOLLOW US</div>
              <div className="flex space-x-4">
                <a href="#" className="hover:text-gray-200 transition-colors" title="GitHub">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
                <a href="#" className="hover:text-gray-200 transition-colors" title="Facebook">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#" className="hover:text-gray-200 transition-colors" title="Twitter">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a href="#" className="hover:text-gray-200 transition-colors" title="Instagram">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323c-.875.807-2.026 1.297-3.323 1.297zm7.718-1.297c-.875.807-2.026 1.297-3.323 1.297s-2.448-.49-3.323-1.297c-.807-.875-1.297-2.026-1.297-3.323s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;