import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Papa from 'papaparse';
import Header from './components/Header';
import Filters from './components/Filters';
import DashboardCards from './components/DashboardCards';
import Charts from './components/Charts';
import SalesTable from './components/SalesTable';
import titleLogo from './assets/logos/title-logo.svg';
import scalifyLogo from './assets/logos/scalify-footer.svg';
import {
  SHEET_CSV_URL,
  POLL_INTERVAL,
  normalizeGoogleSheetsCsvUrl,
  parseRecord,
  withCacheBuster,
} from './data/config';
import './App.css';

const INITIAL_FILTERS = {
  dateFrom: '',
  dateTo: '',
  category: '',
  subCategory: '',
  material: '',
  region: '',
  country: '',
};

function App() {
  const [rawData, setRawData] = useState([]);
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from Google Sheets
  const fetchData = useCallback(async () => {
    try {
      const url = withCacheBuster(normalizeGoogleSheetsCsvUrl(SHEET_CSV_URL));
      console.log('Fetching from URL:', url);
      
      const response = await fetch(url, { cache: 'no-store' });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status} while fetching Google Sheet`);
      }
      const csvText = await response.text();

      const peek = csvText.trimStart().slice(0, 200).toLowerCase();
      if (peek.startsWith('<!doctype') || peek.startsWith('<html') || peek.includes('<table')) {
        throw new Error(
          'Google Sheets returned HTML instead of CSV. Use a Publish-to-web CSV link (pub?output=csv) or paste your pubhtml link and let the app convert it.'
        );
      }

      const result = Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (h) => String(h || '').trim(),
      });

      console.log('CSV parsed. Raw records count:', result.data.length);
      console.log('Sample raw row:', result.data[0]);
      console.log('Available column headers:', Object.keys(result.data[0] || {}));
      console.log('First 3 raw rows:', result.data.slice(0, 3));

      const records = result.data
        .map((row, idx) => {
          const parsed = parseRecord(row);
          if (idx < 3) {
            console.log(`Row ${idx}:`, row, '-> Parsed:', parsed);
          }
          return parsed;
        })
        .filter((r) => r !== null);

      console.log(`Successfully loaded ${records.length} records`);
      console.log('Sample parsed record:', records[0]);

      setRawData(records);
      setLastUpdate(new Date().toLocaleTimeString());
      setError(null);
      setLoading(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error('Failed to fetch data:', err);
      setError(message);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchData]);

  // Extract unique filter options from data
  const filterOptions = useMemo(() => {
    const categories = [...new Set(rawData.map((r) => r.category).filter(Boolean))].sort();
    const subCategories = [...new Set(rawData.map((r) => r.subCategory).filter(Boolean))].sort();
    const materials = [...new Set(rawData.map((r) => r.material).filter(Boolean))].sort();
    return { categories, subCategories, materials };
  }, [rawData]);

  // Apply filters to data
  const filteredData = useMemo(() => {
    return rawData.filter((r) => {
      if (filters.dateFrom && r.date < filters.dateFrom) return false;
      if (filters.dateTo && r.date > filters.dateTo) return false;
      if (filters.category && r.category !== filters.category) return false;
      if (filters.subCategory && r.subCategory !== filters.subCategory) return false;
      if (filters.material && r.material !== filters.material) return false;
      // Region and Country are static for now; no filtering needed unless expanded
      return true;
    });
  }, [rawData, filters]);

  const handleFilterChange = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleReset = useCallback(() => {
    setFilters(INITIAL_FILTERS);
  }, []);

  if (loading) {
    return (
      <div className="loading-overlay">
        <div className="loading-logo-container">
          <img src={titleLogo} alt="WiNKLMAYR" className="loading-logo" />
        </div>
        <div className="loading-bar">
          <div className="loading-fill" />
        </div>
        <div className="loading-text">Loading Dashboard</div>
        <div className="loading-footer">
          <div className="loading-powered-by">Powered By</div>
          <img src={scalifyLogo} alt="Scalify" className="loading-scalify-logo" />
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <Header lastUpdate={lastUpdate} onRefresh={fetchData} />

      <main className="dash-main">
        {error ? (
          <div className="data-error" role="alert">
            <div className="data-error-title">Data sync issue</div>
            <div className="data-error-body">{error}</div>
            <div className="data-error-hint">
              Check `src/data/config.js` → `SHEET_CSV_URL` and make sure the sheet is published to the web.
            </div>
          </div>
        ) : null}

        <div className="dash-title-bar">
          <div>
            <h1 className="dash-title">
              <span className="brand-name">WiNKLMAYR</span> Sales Dashboard
            </h1>
            <p className="dash-subtitle">Mercedes-Benz Brand Center — Dubai</p>
          </div>
        </div>

        <Filters
          filters={filters}
          categories={filterOptions.categories}
          subCategories={filterOptions.subCategories}
          materials={filterOptions.materials}
          onFilterChange={handleFilterChange}
          onReset={handleReset}
        />

        <DashboardCards data={filteredData} />

        <Charts data={filteredData} />

        <SalesTable data={filteredData} />

        <footer className="dash-footer">
          <div className="footer-powered-by">Powered By</div>
          <a href="https://scalify.ae/" target="_blank" rel="noopener noreferrer" className="scalify-footer-link">
            <img src={scalifyLogo} alt="Powered by" className="scalify-logo" />
          </a>
        </footer>
      </main>
    </div>
  );
}

export default App;
