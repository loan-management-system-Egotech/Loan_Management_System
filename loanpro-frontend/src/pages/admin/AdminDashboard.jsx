import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { apiGet } from '../../api/apiClient';
import { errorMessage } from '../../utils/format';
import './AdminDashboard.css';

const DONUT_COLORS = ['#3b5bdb', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444'];

const AdminDashboard = () => {
  const [stats, setStats] = useState([]);
  const [charts, setCharts] = useState({});
  const [recent, setRecent] = useState([]);
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setLoading(true);
        setError('');
        const [statsRes, chartsRes, appsRes, healthRes] = await Promise.all([
          apiGet('/admin/dashboard/stats'),
          apiGet('/admin/dashboard/charts').catch(() => ({})),
          apiGet('/admin/applications?status=ALL&page=0&size=5').catch(() => ({ content: [] })),
          apiGet('/admin/dashboard/system').catch(() => null),
        ]);
        if (!active) return;
        setStats(Array.isArray(statsRes) ? statsRes : []);
        setCharts(chartsRes || {});
        setRecent(appsRes?.content || []);
        setHealth(healthRes);
      } catch (e) {
        if (active) setError(errorMessage(e));
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  // Normalise the absolute chart values into 0-100% bar heights.
  const chartBars = useMemo(() => {
    const months = charts?.months || [];
    const dis = charts?.disbursements || [];
    const col = charts?.collections || [];
    const max = Math.max(1, ...dis, ...col);
    return months.map((m, i) => ({
      month: m,
      disbursed: Math.round(((dis[i] || 0) / max) * 100),
      collected: Math.round(((col[i] || 0) / max) * 100),
    }));
  }, [charts]);

  const activeLoans = stats.find((s) => s.title === 'Active Loans')?.value || '0';

  // Build the real loan-portfolio donut from the per-type active-loan counts.
  const portfolio = useMemo(() => {
    const entries = Object.entries(charts?.portfolio || {});
    const total = entries.reduce((sum, [, count]) => sum + count, 0);
    let cursor = 0;
    const segments = entries.map(([label, count], i) => {
      const start = total > 0 ? (cursor / total) * 100 : 0;
      cursor += count;
      const end = total > 0 ? (cursor / total) * 100 : 0;
      return { label, count, color: DONUT_COLORS[i % DONUT_COLORS.length], start, end };
    });
    const gradient = total > 0
      ? `conic-gradient(${segments.map((s) => `${s.color} ${s.start}% ${s.end}%`).join(', ')})`
      : 'conic-gradient(#e2e8f0 0% 100%)';
    return { segments, total, gradient };
  }, [charts]);

  if (loading) return <div className="page-loading">Loading dashboard…</div>;
  if (error) return <div className="page-error">{error}</div>;

  return (
    <div className="admin-dashboard">
      {/* 1. Top Stats Grid */}
      <div className="stats-grid-4col">
        {stats.map((stat, index) => (
          <div className="stat-card" key={index}>
            <h3>{stat.title}</h3>
            <h2>{stat.value}</h2>
            <p className={`trend-text ${stat.type}`}>{stat.trend}</p>
          </div>
        ))}
      </div>

      {/* 2. Charts Section */}
      <div className="charts-grid">
        <div className="chart-card">
          <h3 className="chart-title">Monthly Loan Disbursements & Collections</h3>
          <div className="css-bar-chart">
            {chartBars.map((data, index) => (
              <div className="bar-group" key={index}>
                <div className="bars">
                  <div className="bar disbursed" style={{ height: `${data.disbursed}%` }}></div>
                  <div className="bar collected" style={{ height: `${data.collected}%` }}></div>
                </div>
                <span className="bar-label">{data.month}</span>
              </div>
            ))}
          </div>
          <div className="chart-legend">
            <span className="legend-item"><div className="dot blue"></div> Disbursed</span>
            <span className="legend-item"><div className="dot green"></div> Collected</span>
          </div>
        </div>

        <div className="chart-card">
          <h3 className="chart-title">Loan Portfolio Mix</h3>
          <div className="donut-chart-container">
            <div className="css-donut-chart" style={{ background: portfolio.gradient }}>
              <div className="donut-hole">
                <span className="donut-center-text">{activeLoans}</span>
              </div>
            </div>
          </div>
          <div className="chart-legend centered">
            {portfolio.total === 0 ? (
              <span className="legend-item" style={{ color: 'var(--text-muted)' }}>No active loans</span>
            ) : (
              portfolio.segments.map((s) => (
                <span className="legend-item" key={s.label}>
                  <div className="dot" style={{ backgroundColor: s.color }}></div> {s.label} ({s.count})
                </span>
              ))
            )}
          </div>
        </div>
      </div>

      {/* 3. Bottom Section: Recent Apps & System Health */}
      <div className="bottom-grid">
        <div className="table-card">
          <h3 className="chart-title">Recent Applications</h3>
          <table className="loanpro-table">
            <thead>
              <tr>
                <th>Applicant</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Score</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recent.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No applications yet.</td></tr>
              ) : (
                recent.map((app) => (
                  <tr key={app.id}>
                    <td><Link to={`/admin/review/${app.id}`} className="action-link">{app.name}</Link></td>
                    <td>{app.type}</td>
                    <td>{app.amount}</td>
                    <td>{app.creditScore ?? '—'}</td>
                    <td>
                      <span className={`status-badge ${String(app.status).replace(' ', '-').toLowerCase()}`}>
                        {app.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="health-card">
          <h3 className="chart-title">System Overview</h3>
          <div className="health-grid">
            <div className="health-box"><p>Total Users</p><h4 className="text-primary">{health?.totalUsers ?? '—'}</h4></div>
            <div className="health-box"><p>Active Loans</p><h4 className="text-success">{health?.activeLoans ?? '—'}</h4></div>
            <div className="health-box"><p>Pending Review</p><h4 className="text-primary">{health?.pendingApplications ?? '—'}</h4></div>
            <div className="health-box"><p>Server Uptime</p><h4 className="text-success">{health?.uptime ?? '—'}</h4></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
