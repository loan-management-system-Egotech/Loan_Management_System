import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { apiGet } from '../../api/apiClient';
import { errorMessage } from '../../utils/format';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState([]);
  const [charts, setCharts] = useState({});
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setLoading(true);
        setError('');
        const [statsRes, chartsRes, appsRes] = await Promise.all([
          apiGet('/admin/dashboard/stats'),
          apiGet('/admin/dashboard/charts').catch(() => ({})),
          apiGet('/admin/applications?status=ALL&page=0&size=5').catch(() => ({ content: [] })),
        ]);
        if (!active) return;
        setStats(Array.isArray(statsRes) ? statsRes : []);
        setCharts(chartsRes || {});
        setRecent(appsRes?.content || []);
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
            <div className="css-donut-chart">
              <div className="donut-hole">
                <span className="donut-center-text">{activeLoans}</span>
              </div>
            </div>
          </div>
          <div className="chart-legend centered">
            <span className="legend-item"><div className="dot blue"></div> Personal</span>
            <span className="legend-item"><div className="dot green"></div> Business</span>
            <span className="legend-item"><div className="dot purple"></div> Home</span>
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
          <h3 className="chart-title">System Health</h3>
          <div className="health-grid">
            <div className="health-box"><p>API Response</p><h4 className="text-success">42ms</h4></div>
            <div className="health-box"><p>Server Uptime</p><h4 className="text-success">99.8%</h4></div>
            <div className="health-box"><p>DB Load</p><h4 className="text-primary">34%</h4></div>
            <div className="health-box"><p>Error Rate</p><h4 className="text-success">0.02%</h4></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
