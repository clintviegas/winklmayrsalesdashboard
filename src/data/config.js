// Google Sheets data source configuration
// Paste either a "Publish to web" link (pubhtml/pub) OR a direct CSV link.
// The app will normalize pubhtml -> pub?output=csv automatically.
export const SHEET_CSV_URL =
  'https://docs.google.com/spreadsheets/d/14tmShDDHnd8ySA0Vy6WtQWq4LnU9M9qPFTDX0sF5l0k/export?format=csv&gid=203344050';

// Polling interval in milliseconds (2 minutes)
export const POLL_INTERVAL = 120000;

// Chart color palette
export const CHART_COLORS = [
  '#e8611a',
  '#2d8a52',
  '#2d6b8a',
  '#7c5caa',
  '#b09164',
  '#c0392b',
  '#e67e22',
  '#16a085',
];

// KPI card accent colors
export const KPI_ACCENTS = [
  { bar: '#e8611a', bg: 'rgba(232, 97, 26, 0.08)' },
  { bar: '#2d8a52', bg: 'rgba(45, 138, 82, 0.08)' },
  { bar: '#2d6b8a', bg: 'rgba(45, 107, 138, 0.08)' },
  { bar: '#7c5caa', bg: 'rgba(124, 92, 170, 0.08)' },
  { bar: '#b09164', bg: 'rgba(176, 145, 100, 0.10)' },
];

// Filter options for Region and Country
export const REGION_OPTIONS = ['Mercedes-Benz Centre'];
export const COUNTRY_OPTIONS = ['UAE'];

// Date preset options
export const DATE_PRESETS = [
  { label: 'Last 1 Week', value: 'week' },
  { label: 'Last 1 Month', value: 'month' },
  { label: 'Custom Range', value: 'custom' },
];

// Format number with commas
export function formatNum(n) {
  if (n === null || n === undefined) return '0';
  return Number(n).toLocaleString('en-US', { maximumFractionDigits: 0 });
}

// Format currency
export function formatCurrency(n) {
  return `AED ${formatNum(n)}`;
}

export function normalizeGoogleSheetsCsvUrl(inputUrl) {
  if (!inputUrl) return inputUrl;
  let url;
  try {
    url = new URL(inputUrl);
  } catch {
    return inputUrl;
  }

  // Published link: .../pubhtml?gid=... -> .../pub?gid=...&output=csv
  if (url.pathname.includes('/pubhtml')) {
    url.pathname = url.pathname.replace('/pubhtml', '/pub');
  }
  if (url.pathname.endsWith('/pub')) {
    url.searchParams.set('output', 'csv');
    return url.toString();
  }

  // Edit link: .../spreadsheets/d/<id>/edit#gid=123 -> .../export?format=csv&gid=123
  if (url.pathname.includes('/spreadsheets/d/') && url.pathname.endsWith('/edit')) {
    const idMatch = url.pathname.match(/\/spreadsheets\/d\/([^/]+)\/edit$/);
    const gidMatch = (url.hash || '').match(/gid=(\d+)/);
    const gid = gidMatch?.[1] || url.searchParams.get('gid') || '0';
    if (idMatch?.[1]) {
      return `https://docs.google.com/spreadsheets/d/${idMatch[1]}/export?format=csv&gid=${gid}`;
    }
  }

  return inputUrl;
}

export function withCacheBuster(inputUrl) {
  if (!inputUrl) return inputUrl;
  try {
    const url = new URL(inputUrl);
    url.searchParams.set('_', String(Date.now()));
    return url.toString();
  } catch {
    return inputUrl;
  }
}

function parseNumber(value) {
  if (value === null || value === undefined) return 0;
  const s = String(value).trim();
  if (!s) return 0;
  const cleaned = s.replace(/[^\d.-]/g, '');
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : 0;
}

// Extract date part from timestamp (format: "26/02/2026 13:55" -> "2026-02-26")
function extractDate(timestamp) {
  if (!timestamp) return '';
  const s = String(timestamp).trim();
  // Try to parse DD/MM/YYYY HH:MM format
  const match = s.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (match) {
    const day = String(match[1]).padStart(2, '0');
    const month = String(match[2]).padStart(2, '0');
    const year = match[3];
    return `${year}-${month}-${day}`;
  }
  return s;
}

// Parse CSV row into sale record
export function parseRecord(row) {
  if (!row || typeof row !== 'object') return null;

  // Extract total from "Total (AED)" column
  const total = parseNumber(row['Total (AED)'] ?? row['total (aed)'] ?? row['Total'] ?? row['total'] ?? 0);

  // We'll accept records even if total is 0 or missing (they might have other important info)
  return {
    date: extractDate(row['Timestamp'] || row['Date'] || row['date'] || ''),
    customer: row['Customer Name'] || row['Customer'] || row['customer'] || '',
    category: row['Category'] || row['category'] || row['CATEGORY'] || '',
    subCategory: row['Sub - Category'] || row['Sub Category'] || row['Sub-Category'] || row['sub category'] || row['SubCategory'] || row['sub_category'] || '',
    description: row['Description'] || row['description'] || row['DESCRIPTION'] || '',
    material: row['Material'] || row['material'] || row['MATERIAL'] || '',
    color: row['Color'] || row['color'] || row['COLOR'] || '',
    quantity: Math.trunc(parseNumber(row['Quantity'] ?? row['quantity'] ?? row['QTY'] ?? row['Qty'] ?? row['QUANTITY'] ?? 0)),
    price: parseNumber(row['Retail Price (AED)'] ?? row['Price'] ?? row['price'] ?? row['PRICE'] ?? row['Unit Price'] ?? row['unit price'] ?? 0),
    total: total,
    payment: row['Mode of Payment'] || row['Payment'] || row['payment'] || row['PAYMENT'] || '',
  };
}
