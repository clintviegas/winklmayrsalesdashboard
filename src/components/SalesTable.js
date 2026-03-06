import React, { useState, useMemo, useCallback } from 'react';
import { Search, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatNum } from '../data/config';
import './SalesTable.css';

const COLUMNS = [
  { key: 'date', label: 'Date' },
  { key: 'customer', label: 'Customer' },
  { key: 'category', label: 'Category' },
  { key: 'subCategory', label: 'Sub Category' },
  { key: 'description', label: 'Description' },
  { key: 'material', label: 'Material' },
  { key: 'color', label: 'Color' },
  { key: 'quantity', label: 'Qty', numeric: true },
  { key: 'price', label: 'Price', numeric: true, currency: true },
  { key: 'total', label: 'Total', numeric: true, currency: true, bold: true },
];

const PAGE_SIZE = 15;

function SalesTable({ data }) {
  const [sortCol, setSortCol] = useState('date');
  const [sortAsc, setSortAsc] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');

  const handleSort = useCallback((col) => {
    if (sortCol === col) {
      setSortAsc((prev) => !prev);
    } else {
      setSortCol(col);
      setSortAsc(true);
    }
    setCurrentPage(1);
  }, [sortCol]);

  const filteredData = useMemo(() => {
    if (!search.trim()) return data;
    const term = search.toLowerCase();
    return data.filter((r) =>
      Object.values(r).some((v) => String(v).toLowerCase().includes(term))
    );
  }, [data, search]);

  const sortedData = useMemo(() => {
    const sorted = [...filteredData];
    sorted.sort((a, b) => {
      const va = a[sortCol];
      const vb = b[sortCol];
      if (typeof va === 'number') return sortAsc ? va - vb : vb - va;
      return sortAsc
        ? String(va).localeCompare(String(vb))
        : String(vb).localeCompare(String(va));
    });
    return sorted;
  }, [filteredData, sortCol, sortAsc]);

  const totalPages = Math.max(1, Math.ceil(sortedData.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const pageData = sortedData.slice(start, start + PAGE_SIZE);

  const formatDate = (dateStr) => {
    try {
      const [y, m, d] = dateStr.split('-');
      return `${d}/${m}/${y}`;
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="table-card">
      <div className="table-toolbar">
        <div className="table-title">Sales Log</div>
        <div className="table-search-wrap">
          <Search size={14} className="table-search-icon" />
          <input
            type="text"
            className="table-search"
            placeholder="Search sales..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  className={sortCol === col.key ? 'sorted' : ''}
                  onClick={() => handleSort(col.key)}
                >
                  <span className="th-content">
                    {col.label}
                    <span className="sort-arrow">
                      {sortCol === col.key
                        ? (sortAsc ? <ChevronUp size={10} /> : <ChevronDown size={10} />)
                        : <ChevronDown size={10} />
                      }
                    </span>
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageData.length === 0 ? (
              <tr>
                <td colSpan={COLUMNS.length} className="table-empty">
                  No records found
                </td>
              </tr>
            ) : (
              pageData.map((r, i) => {
                const catClass = r.category.toLowerCase().includes('handbag')
                  ? 'cat-handbags'
                  : 'cat-wallets';
                return (
                  <tr key={`${r.date}-${r.customer}-${i}`}>
                    <td>{formatDate(r.date)}</td>
                    <td>{r.customer}</td>
                    <td>
                      <span className={`td-category ${catClass}`}>{r.category}</span>
                    </td>
                    <td>{r.subCategory}</td>
                    <td>{r.description}</td>
                    <td>{r.material}</td>
                    <td>{r.color}</td>
                    <td>{r.quantity}</td>
                    <td className="td-amount">AED {formatNum(r.price)}</td>
                    <td className="td-amount td-amount--bold">AED {formatNum(r.total)}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      <div className="table-footer">
        <div className="table-info">
          Showing {sortedData.length > 0 ? start + 1 : 0}–{Math.min(start + PAGE_SIZE, sortedData.length)} of {sortedData.length} records
        </div>
        <div className="pagination">
          <button
            className="page-btn"
            disabled={safePage <= 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            <ChevronLeft size={14} />
          </button>
          {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
            let page;
            if (totalPages <= 7) {
              page = i + 1;
            } else if (safePage <= 4) {
              page = i + 1;
            } else if (safePage >= totalPages - 3) {
              page = totalPages - 6 + i;
            } else {
              page = safePage - 3 + i;
            }
            return (
              <button
                key={page}
                className={`page-btn ${page === safePage ? 'active' : ''}`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            );
          })}
          <button
            className="page-btn"
            disabled={safePage >= totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default SalesTable;
