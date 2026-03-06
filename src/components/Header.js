import React from 'react';
import { RefreshCw } from 'lucide-react';
import winklmayrWordmark from '../assets/logos/winklmayr-wordmark.svg';
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
            <img src={winklmayrWordmark} alt="WiNKLMAYR" className="header-logo header-logo-white" />
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
