import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import ChartDataLabelsPlugin from 'chartjs-plugin-datalabels';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import { CHART_COLORS } from '../data/config';
import './Charts.css';

const TOOLTIP_STYLE = {
  backgroundColor: '#141414',
  titleFont: { family: 'DM Sans' },
  bodyFont: { family: 'DM Mono, monospace' },
  padding: 12,
  cornerRadius: 8,
};

// Plugin to add center text to doughnut charts
const doughnutCenterTextPlugin = {
  id: 'doughnutCenterText',
  afterDraw(chart) {
    const { width, height } = chart;
    const ctx = chart.ctx;
    ctx.restore();

    const centerX = width / 2;
    const centerY = height / 2;
    const text = chart.data.datasets[0].centerText || '';
    const subtext = chart.data.datasets[0].centerSubText || '';

    // Scale text offsets based on chart height for better mobile support
    const heightScale = height / 300; // 300px is the base height
    const subtextOffset = 16 * heightScale; // Reduced from 28 for tighter centering
    const textOffset = 2 * heightScale; // Reduced from 10 for better centering

    if (subtext) {
      ctx.font = '14px DM Sans';
      ctx.fillStyle = '#888';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(subtext, centerX, centerY - subtextOffset);
    }

    if (text) {
      ctx.font = 'bold 48px DM Sans';
      ctx.fillStyle = '#1a1a1a';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, centerX, centerY + textOffset);
    }

    ctx.save();
  },
};

// Register plugins AFTER defining them
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
  ChartDataLabelsPlugin,
  doughnutCenterTextPlugin
);

function Charts({ data }) {
  // Revenue Over Time — line chart
  const lineData = useMemo(() => {
    if (!data || data.length === 0) return null;
    const byMonth = {};
    data.forEach((r) => {
      const parts = r.date.split('-');
      if (parts.length >= 2) {
        const key = `${parts[0]}-${parts[1]}`;
        byMonth[key] = (byMonth[key] || 0) + r.total;
      }
    });
    const sortedKeys = Object.keys(byMonth).sort();
    const labels = sortedKeys.map((k) => {
      const [y, m] = k.split('-');
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return `${monthNames[parseInt(m) - 1]} ${y.slice(2)}`;
    });
    return {
      labels,
      datasets: [{
        label: 'Revenue (AED)',
        data: sortedKeys.map((k) => byMonth[k]),
        borderColor: CHART_COLORS[0],
        backgroundColor: 'rgba(232, 97, 26, 0.08)',
        borderWidth: 2.5,
        pointRadius: 4,
        pointBackgroundColor: '#fff',
        pointBorderColor: CHART_COLORS[0],
        pointBorderWidth: 2,
        tension: 0.35,
        fill: true,
      }],
    };
  }, [data]);

  // Category Split — doughnut
  const pieData = useMemo(() => {
    if (!data || data.length === 0) return null;
    const byCat = {};
    data.forEach((r) => {
      byCat[r.category] = (byCat[r.category] || 0) + r.total;
    });
    const labels = Object.keys(byCat);
    const totalItems = data.length; // Total number of items from inventory
    return {
      labels,
      datasets: [{
        data: labels.map((c) => byCat[c]),
        backgroundColor: CHART_COLORS.slice(0, labels.length),
        borderWidth: 3,
        borderColor: '#fff',
        centerText: totalItems.toString(),
        centerSubText: 'Total Items',
      }],
    };
  }, [data]);

  // Revenue by Sub Category — horizontal bar
  const barData = useMemo(() => {
    if (!data || data.length === 0) return null;
    const bySub = {};
    data.forEach((r) => {
      bySub[r.subCategory] = (bySub[r.subCategory] || 0) + r.total;
    });
    const entries = Object.entries(bySub).sort((a, b) => b[1] - a[1]);
    const labels = entries.map((e) => e[0]);
    const vals = entries.map((e) => e[1]);
    return {
      labels,
      datasets: [{
        label: 'Revenue (AED)',
        data: vals,
        backgroundColor: CHART_COLORS.slice(0, labels.length).map((c) => c + '22'),
        borderColor: CHART_COLORS.slice(0, labels.length),
        borderWidth: 1.5,
        borderRadius: 6,
        barPercentage: 0.7,
      }],
    };
  }, [data]);

  // Material Distribution — doughnut
  const materialData = useMemo(() => {
    if (!data || data.length === 0) return null;
    const byMat = {};
    data.forEach((r) => {
      byMat[r.material] = (byMat[r.material] || 0) + 1;
    });
    const labels = Object.keys(byMat);
    const totalOrders = data.length; // Total number of orders
    return {
      labels,
      datasets: [{
        data: labels.map((m) => byMat[m]),
        backgroundColor: ['#b09164', '#2d8a52', '#2d6b8a', '#7c5caa', '#e8611a'],
        borderWidth: 3,
        borderColor: '#fff',
        centerText: totalOrders.toString(),
        centerSubText: 'Total Orders',
      }],
    };
  }, [data]);

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      datalabels: {
        anchor: 'end',
        align: 'top',
        offset: 8,
        font: { family: 'DM Mono', size: 10, weight: 500 },
        color: '#1a1a1a',
        formatter: (value) => {
          if (value >= 1000) return (value / 1000).toFixed(0) + 'k';
          return value;
        },
      },
      tooltip: {
        ...TOOLTIP_STYLE,
        callbacks: {
          label: (ctx) => 'AED ' + ctx.parsed.y.toLocaleString(),
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { family: 'DM Sans', size: 11 }, color: '#aaa' },
      },
      y: {
        grid: { color: 'rgba(0,0,0,0.04)' },
        ticks: {
          font: { family: 'DM Mono', size: 11 },
          color: '#aaa',
          callback: (v) => (v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v),
        },
      },
    },
  };

  const doughnutOptions = (label) => ({
    responsive: true,
    maintainAspectRatio: false,
    cutout: '62%',
    plugins: {
      doughnutCenterText: {},
      datalabels: {
        display: false,
      },
      legend: {
        position: 'bottom',
        labels: {
          font: { family: 'DM Sans', size: 12 },
          padding: 12,
          usePointStyle: true,
          pointStyleWidth: 10,
        },
        maxWidth: 800,
      },
      tooltip: {
        ...TOOLTIP_STYLE,
        callbacks: {
          label: (ctx) => `${ctx.label}: ${label === 'revenue' ? 'AED ' : ''}${ctx.parsed.toLocaleString()}${label === 'count' ? ' orders' : ''}`,
        },
      },
    },
  });

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',
    plugins: {
      legend: { display: false },
      tooltip: {
        ...TOOLTIP_STYLE,
        callbacks: {
          label: (ctx) => 'AED ' + ctx.parsed.x.toLocaleString(),
        },
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(0,0,0,0.04)' },
        ticks: {
          font: { family: 'DM Mono', size: 11 },
          color: '#aaa',
          callback: (v) => (v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v),
        },
      },
      y: {
        grid: { display: false },
        ticks: { font: { family: 'DM Sans', size: 11 }, color: '#666' },
      },
    },
  };

  const emptyMsg = (
    <div className="chart-empty">
      <p>No data to display</p>
    </div>
  );

  return (
    <>
      <div className="charts-row">
        <ChartCard title="Revenue Over Time" badge="Trend">
          <div className="chart-container chart-container--line">
            {lineData ? <Line data={lineData} options={lineOptions} /> : emptyMsg}
          </div>
        </ChartCard>
        <ChartCard title="Category Split" badge="Breakdown">
          <div className="chart-container chart-container--pie">
            {pieData ? <Doughnut data={pieData} options={doughnutOptions('revenue')} /> : emptyMsg}
          </div>
        </ChartCard>
      </div>

      <div className="charts-row">
        <ChartCard title="Revenue by Sub Category" badge="Products">
          <div className="chart-container chart-container--bar">
            {barData ? <Bar data={barData} options={barOptions} /> : emptyMsg}
          </div>
        </ChartCard>
        <ChartCard title="Material Distribution" badge="Materials">
          <div className="chart-container chart-container--pie">
            {materialData ? <Doughnut data={materialData} options={doughnutOptions('count')} /> : emptyMsg}
          </div>
        </ChartCard>
      </div>
    </>
  );
}

function ChartCard({ title, badge, children }) {
  return (
    <div className="chart-card">
      <div className="chart-header">
        <div className="chart-title">{title}</div>
        <div className="chart-badge">{badge}</div>
      </div>
      {children}
    </div>
  );
}

export default Charts;
