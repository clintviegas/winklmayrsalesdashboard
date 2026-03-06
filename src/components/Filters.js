import React, { useState, useCallback, useMemo } from 'react';
import { RotateCcw, Calendar, ChevronDown } from 'lucide-react';
import { DATE_PRESETS, REGION_OPTIONS, COUNTRY_OPTIONS } from '../data/config';
import './Filters.css';

function Filters({ filters, categories, subCategories, materials, onFilterChange, onReset }) {
  const [dateMode, setDateMode] = useState('preset'); // 'preset' or 'custom'
  const [activePreset, setActivePreset] = useState(null);

  const handleDatePreset = useCallback((preset) => {
    const today = new Date();
    let from = new Date();

    if (preset === 'week') {
      from.setDate(today.getDate() - 7);
    } else if (preset === 'month') {
      from.setMonth(today.getMonth() - 1);
    } else if (preset === 'custom') {
      setDateMode('custom');
      setActivePreset('custom');
      return;
    }

    setActivePreset(preset);
    setDateMode('preset');

    const formatDate = (d) => d.toISOString().split('T')[0];
    onFilterChange('dateFrom', formatDate(from));
    onFilterChange('dateTo', formatDate(today));
  }, [onFilterChange]);

  const handleReset = useCallback(() => {
    setDateMode('preset');
    setActivePreset(null);
    onReset();
  }, [onReset]);

  const selectOptions = useMemo(() => ({
    categories: ['All', ...categories],
    subCategories: ['All', ...subCategories],
    materials: ['All', ...materials],
    regions: ['All', ...REGION_OPTIONS],
    countries: ['All', ...COUNTRY_OPTIONS],
  }), [categories, subCategories, materials]);

  return (
    <div className="filters-container">
      {/* Date Filter Section */}
      <div className="filter-section filter-section--date">
        <div className="filter-label">
          <Calendar size={12} />
          Date Range
        </div>
        <div className="date-presets">
          {DATE_PRESETS.map((preset) => (
            <button
              key={preset.value}
              className={`date-preset-btn ${activePreset === preset.value ? 'active' : ''}`}
              onClick={() => handleDatePreset(preset.value)}
            >
              {preset.label}
            </button>
          ))}
        </div>
        {(dateMode === 'custom' || activePreset === 'custom') && (
          <div className="date-custom-row">
            <input
              type="date"
              className="filter-input"
              value={filters.dateFrom}
              onChange={(e) => onFilterChange('dateFrom', e.target.value)}
              placeholder="From"
            />
            <span className="date-separator">to</span>
            <input
              type="date"
              className="filter-input"
              value={filters.dateTo}
              onChange={(e) => onFilterChange('dateTo', e.target.value)}
              placeholder="To"
            />
          </div>
        )}
      </div>

      {/* Dropdown Filters */}
      <div className="filter-section filter-section--dropdowns">
        <FilterSelect
          label="Category"
          value={filters.category}
          options={selectOptions.categories}
          onChange={(val) => onFilterChange('category', val)}
        />
        <FilterSelect
          label="Sub Category"
          value={filters.subCategory}
          options={selectOptions.subCategories}
          onChange={(val) => onFilterChange('subCategory', val)}
        />
        <FilterSelect
          label="Material"
          value={filters.material}
          options={selectOptions.materials}
          onChange={(val) => onFilterChange('material', val)}
        />
        <FilterSelect
          label="Region"
          value={filters.region}
          options={selectOptions.regions}
          onChange={(val) => onFilterChange('region', val)}
        />
        <FilterSelect
          label="Country"
          value={filters.country}
          options={selectOptions.countries}
          onChange={(val) => onFilterChange('country', val)}
        />
      </div>

      {/* Reset */}
      <button className="filter-reset" onClick={handleReset}>
        <RotateCcw size={13} />
        Reset
      </button>
    </div>
  );
}

function FilterSelect({ label, value, options, onChange }) {
  return (
    <div className="filter-group">
      <div className="filter-label">{label}</div>
      <div className="select-wrapper">
        <select
          className="filter-select"
          value={value}
          onChange={(e) => onChange(e.target.value === 'All' ? '' : e.target.value)}
        >
          {options.map((opt) => (
            <option key={opt} value={opt === 'All' ? '' : opt}>
              {opt}
            </option>
          ))}
        </select>
        <ChevronDown size={14} className="select-icon" />
      </div>
    </div>
  );
}

export default Filters;
