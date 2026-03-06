import React from 'react';
import { RefreshCw } from 'lucide-react';
import titleLogo from '../assets/logos/title-logo.svg';
import scalifyLogo from '../assets/logos/scalify-footer.svg';
import './Header.css';

function Header({ lastUpdate, onRefresh }) {
  return (
    <header className="dash-header">
      <div className="dash-header-left">
        <div className="ribbon-area">
          <a href="https://scalify.ae/" target="_blank" rel="noopener noreferrer" className="ribbon-link">
            <img src={scalifyLogo} alt="Scalify" className="ribbon-scalify-logo" />
          </a>
          <div className="ribbon-divider">×</div>
          <a href="https://winklmayr.com/" target="_blank" rel="noopener noreferrer" className="ribbon-link">
            <img src={titleLogo} alt="WiNKLMAYR x Mercedes-Benz" className="header-logo header-logo-white" />
          </a>
        </div>
      </div>
      <div className="dash-header-right">
        <span className="dash-status">{lastUpdate || '—'}</span>
        <button className="dash-refresh" onClick={onRefresh}>
          <RefreshCw size={14} />
          Refresh
        </button>
      </div>
    </header>
  );
}

export default Header;
