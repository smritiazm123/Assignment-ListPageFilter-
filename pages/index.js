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

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async (page = currentPage, rowsPerPage = itemsPerPage) => {
    try {
      setLoading(true);
      const response = await fetch(`https://api.datakeep.civicdays.in/api/search/dataset/?page=${page}&size=${rowsPerPage}`);
      const result = await response.json();
      setData(result.results || []);
      setTotalItems(50);
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRowsPerPageChange = (newRowsPerPage) => {
    setItemsPerPage(newRowsPerPage);
    setCurrentPage(1);
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
      <div className="flex">
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
        {/* Main Content */}
        <div className="flex-1 p-4">

          {/* Content based on view mode */}
          {viewMode === 'card' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentData.map((item, idx) => (
                <CardView key={item.id || idx} item={item} idx={idx} />
              ))}
            </div>
          ) : (
            <div className="bg-transparent rounded-lg  border border-none overflow-hidden">
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