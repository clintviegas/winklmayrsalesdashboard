import React, { useMemo } from 'react';
import { DollarSign, ShoppingCart, BarChart3, Star, Gem } from 'lucide-react';
import { formatNum, KPI_ACCENTS } from '../data/config';
import './DashboardCards.css';

const KPI_ICONS = [DollarSign, ShoppingCart, BarChart3, Star, Gem];

function DashboardCards({ data }) {
  const kpis = useMemo(() => {
    if (!data || data.length === 0) {
      return [
        { label: 'Total Revenue', value: 'AED 0', sub: '—' },
        { label: 'Total Orders', value: '0', sub: '—' },
        { label: 'Avg Order Value', value: 'AED 0', sub: '—' },
        { label: 'Top Product', value: '—', sub: '—', smallValue: true },
        { label: 'Top Material', value: '—', sub: '—', smallValue: true },
      ];
    }

    const totalRevenue = data.reduce((s, r) => s + r.total, 0);
    const totalOrders = data.length;
    const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

    // Top product by revenue
    const productRevMap = {};
    data.forEach((r) => {
      const key = r.subCategory || r.description || 'Unknown';
      productRevMap[key] = (productRevMap[key] || 0) + r.total;
    });
    const topProduct = Object.entries(productRevMap).sort((a, b) => b[1] - a[1])[0];

    // Top material by count
    const matCountMap = {};
    data.forEach((r) => {
      matCountMap[r.material] = (matCountMap[r.material] || 0) + 1;
    });
    const topMaterial = Object.entries(matCountMap).sort((a, b) => b[1] - a[1])[0];

    return [
      {
        label: 'Total Revenue',
        value: `AED ${formatNum(totalRevenue)}`,
        sub: `${totalOrders} transactions`,
      },
      {
        label: 'Total Orders',
        value: formatNum(totalOrders),
        sub: `AED ${formatNum(totalRevenue)} total`,
      },
      {
        label: 'Avg Order Value',
        value: `AED ${formatNum(avgOrderValue)}`,
        sub: `Per transaction`,
      },
      {
        label: 'Top Product',
        value: topProduct ? topProduct[0] : '—',
        sub: topProduct ? `AED ${formatNum(topProduct[1])}` : '—',
        smallValue: true,
      },
      {
        label: 'Top Material',
        value: topMaterial ? topMaterial[0] : '—',
        sub: topMaterial ? `${topMaterial[1]} orders` : '—',
        smallValue: true,
      },
    ];
  }, [data]);

  return (
    <div className="kpi-grid">
      {kpis.map((kpi, index) => {
        const Icon = KPI_ICONS[index];
        const accent = KPI_ACCENTS[index];
        return (
          <div
            className="kpi-card"
            key={kpi.label}
            style={{
              '--kpi-accent': accent.bar,
              '--kpi-bg': accent.bg,
              animationDelay: `${index * 0.06}s`,
            }}
          >
            <div className="kpi-accent-bar" />
            <div className="kpi-icon-wrap">
              <Icon size={18} />
            </div>
            <div className="kpi-label">{kpi.label}</div>
            <div className={`kpi-value ${kpi.smallValue ? 'kpi-value--small' : ''}`}>
              {kpi.value}
            </div>
            <div className="kpi-sub">{kpi.sub}</div>
          </div>
        );
      })}
    </div>
  );
}

export default DashboardCards;
