import { useEffect, useState } from "react";

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

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("https://api.datakeep.civicdays.in/api/search/dataset/");
      const result = await response.json();
      setData(result.results || []);
      console.log(result.aggregations.tags);
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
        <span className="font-medium">Last Updated:</span> {item.modified ? new Date(item.modified).toLocaleDateString() : "N/A"}
      </div>
      <div className="text-xs text-gray-500 mb-1">
        <span className="font-medium">Downloads:</span> {item.download_count ?? "N/A"}
      </div>
      <div className="text-xs text-gray-500 mb-1">
        <span className="font-medium">Geography:</span> {item.geography ?? "N/A"}
      </div>
      <div className="text-xs text-gray-500 mb-1">
        <span className="font-medium">Sectors:</span> {Array.isArray(item.sectors) ? item.sectors.join(", ") : item.sectors ?? "N/A"}
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
              <span className="font-medium">Last Updated:</span><br />
              {item.modified ? new Date(item.modified).toLocaleDateString() : "N/A"}
            </div>
            <div>
              <span className="font-medium">Downloads:</span><br />
              {item.download_count ?? "N/A"}
            </div>
            <div>
              <span className="font-medium">Geography:</span><br />
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
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Datasets</h1>
            
            {/* View Toggle */}
            <div className="flex items-center bg-white rounded-lg shadow-sm border border-gray-200">
              <button
                onClick={() => setViewMode('card')}
                className={`px-4 py-2 rounded-l-lg transition-colors duration-200 ${
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
                className={`px-4 py-2 rounded-r-lg transition-colors duration-200 ${
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

          {/* Content based on view mode */}
          {viewMode === 'card' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredData.map((item, idx) => (
                <CardView key={item.id || idx} item={item} idx={idx} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {filteredData.map((item, idx) => (
                <ListView key={item.id || idx} item={item} idx={idx} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
