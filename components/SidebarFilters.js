import React from "react";

const SidebarFilters = ({
  aggregations,
  filters,
  expandedAccordions,
  toggleAccordion,
  handleFilterChange,
  normalizeAgg,
  AccordionItem,
  FilterCheckbox
}) => (
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
);

export default SidebarFilters; 