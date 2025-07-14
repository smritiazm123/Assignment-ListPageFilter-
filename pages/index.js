import { useEffect, useState } from "react";
import Header from "../components/Header";
import SearchBarControls from "../components/SearchBarControls";
import SidebarFilters from "../components/SidebarFilters";
import CardView from "../components/CardView";
import ListView from "../components/ListView";
import PaginationControls from "../components/PaginationControls";
import Footer from "../components/Footer";

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
  const [searchValue, setSearchValue] = useState("");
  const [sortValue, setSortValue] = useState("newest");
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);

  useEffect(() => {
    fetchData(1, itemsPerPage, filters, searchValue, sortValue);
    setCurrentPage(1);
  }, [filters, searchValue, sortValue]);

  const fetchData = async (
    page = currentPage,
    rowsPerPage = itemsPerPage,
    filtersArg = filters,
    searchArg = searchValue,
    sortArg = sortValue
  ) => {
    // Build query string from filters and search
    const params = new URLSearchParams();
    if (searchArg) params.append('query', searchArg);
    if (filtersArg.Geography?.length || filtersArg.geography?.length) {
      const geo = filtersArg.Geography || filtersArg.geography;
      params.append('Geography', geo.join('+'));
    }
    if (filtersArg.sectors?.length) params.append('sectors', filtersArg.sectors.join('+'));
    if (filtersArg.tags?.length) params.append('tags', filtersArg.tags.join('+'));
    if (filtersArg.formats?.length) params.append('formats', filtersArg.formats.join('+'));
    params.append('size', rowsPerPage);
    params.append('page', page);
    // Sorting
    if (sortArg === 'newest') {
      params.append('sort', 'recent');
      params.append('order', 'desc');
    } else if (sortArg === 'oldest') {
      params.append('sort', 'recent');
      params.append('order', 'asc');
    } // Add more sort options if needed
    try {
      setLoading(true);
      const response = await fetch(`https://api.datakeep.civicdays.in/api/search/dataset/?${params.toString()}`);
      const result = await response.json();
      setData(result.results || []);
      setTotalItems(result.total || 50);
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
    setFilters(prev => {
      // Support both 'geography' and 'Geography' keys
      const key = category === 'geography' ? 'Geography' : category;
      return {
        ...prev,
        [key]: prev[key]?.includes(value)
          ? prev[key].filter(item => item !== value)
          : [...(prev[key] || []), value]
      };
    });
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
    fetchData(page, itemsPerPage, filters, searchValue, sortValue);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRowsPerPageChange = (newRowsPerPage) => {
    setItemsPerPage(newRowsPerPage);
    setCurrentPage(1);
    fetchData(1, newRowsPerPage, filters, searchValue, sortValue);
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

  // AccordionItem and FilterCheckbox for SidebarFilters
  const AccordionItem = ({ title, children, isExpanded, onToggle }) => (
    <div className="border-b border-gray-200">
      <button
        className="w-full px-4 py-3 text-left flex justify-between items-center hover:bg-gray-50"
        onClick={onToggle}
      >
        <span className="font-medium text-gray-700">{title}</span>
        <span className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>▼</span>
      </button>
      {isExpanded && (
        <div className="px-4 pb-3">{children}</div>
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

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (error) return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <SearchBarControls
        searchValue={searchValue}
        onSearchChange={e => setSearchValue(e.target.value)}
        sortValue={sortValue}
        onSortChange={e => setSortValue(e.target.value)}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />
      {/* Mobile Filters Button */}
      <div className="fixed bottom-4 right-4 z-50 md:hidden">
        <button
          onClick={() => setShowFilterDrawer(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg"
        >
          Filters
        </button>
      </div>
      {/* Mobile Drawer */}
      {showFilterDrawer && (
        <div className="fixed inset-0 z-50 flex">
          {/* Overlay */}
          <div className="fixed inset-0 bg-black bg-opacity-40" onClick={() => setShowFilterDrawer(false)} />
          {/* Drawer */}
          <div className="relative bg-white w-72 h-full shadow-lg p-4 z-50 animate-slideInLeft">
            <button
              className="mb-4 text-blue-950 font-bold"
              onClick={() => setShowFilterDrawer(false)}
            >
              Close
            </button>
            <SidebarFilters
              aggregations={aggregations}
              filters={filters}
              expandedAccordions={expandedAccordions}
              toggleAccordion={toggleAccordion}
              handleFilterChange={handleFilterChange}
              normalizeAgg={normalizeAgg}
              AccordionItem={AccordionItem}
              FilterCheckbox={FilterCheckbox}
            />
          </div>
        </div>
      )}
      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <SidebarFilters
            aggregations={aggregations}
            filters={filters}
            expandedAccordions={expandedAccordions}
            toggleAccordion={toggleAccordion}
            handleFilterChange={handleFilterChange}
            normalizeAgg={normalizeAgg}
            AccordionItem={AccordionItem}
            FilterCheckbox={FilterCheckbox}
          />
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
          <PaginationControls
            totalPages={totalPages}
            currentPage={currentPage}
            handlePageChange={handlePageChange}
            handleFirstPage={handleFirstPage}
            handleLastPage={handleLastPage}
            itemsPerPage={itemsPerPage}
            handleRowsPerPageChange={handleRowsPerPageChange}
            startIndex={startIndex}
            endIndex={endIndex}
            totalItems={totalItems}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Home;