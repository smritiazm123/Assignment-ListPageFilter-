import React from "react";

const SearchBarControls = ({
  searchValue,
  onSearchChange,
  sortValue,
  onSortChange,
  viewMode,
  setViewMode
}) => (
  <div className="bg-white shadow-sm border-b border-gray-200 p-4">
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-4 items-center">
        {/* Search Input */}
        <div className="flex-1 w-full">
          <input
            type="text"
            value={searchValue}
            onChange={onSearchChange}
            placeholder="start typing to search for any dataset"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        {/* Latest Updated Dropdown */}
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">Latest Updated:</span>
          <div className="relative">
            <select
              value={sortValue}
              onChange={onSortChange}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
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
);

export default SearchBarControls; 