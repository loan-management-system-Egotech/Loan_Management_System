import { adminStats, adminCharts, recentApplications } from '../../data/mockData';
import './AdminDashboard.css';

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      
      {/* 1. Top Stats Grid */}
      <div className="stats-grid-4col">
        {adminStats.map(stat => (
          <div className="stat-card" key={stat.id}>
            <h3>{stat.title}</h3>
            <h2>{stat.value}</h2>
            <p className={`trend-text ${stat.type}`}>{stat.trend}</p>
          </div>
        ))}
      </div>

      {/* 2. Charts Section */}
      <div className="charts-grid">
        
        {/* CSS Bar Chart */}
        <div className="chart-card">
          <h3 className="chart-title">Monthly Loan Disbursements & Collections</h3>
          <div className="css-bar-chart">
            {adminCharts.barChart.map((data, index) => (
              <div className="bar-group" key={index}>
                <div className="bars">
                  {/* The height is driven dynamically by React state/data! */}
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

        {/* CSS Donut Chart */}
        <div className="chart-card">
          <h3 className="chart-title">Loan Portfolio Mix</h3>
          <div className="donut-chart-container">
            <div className="css-donut-chart">
              <div className="donut-hole">
                <span className="donut-center-text">1,240</span>
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
              {recentApplications.map(app => (
                <tr key={app.id}>
                  <td>{app.applicant}</td>
                  <td>{app.type}</td>
                  <td>{app.amount}</td>
                  <td>{app.score}</td>
                  <td>
                    <span className={`status-badge ${app.status.replace(' ', '-').toLowerCase()}`}>
                      {app.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="health-card">
          <h3 className="chart-title">System Health</h3>
          <div className="health-grid">
            <div className="health-box">
              <p>API Response</p>
              <h4 className="text-success">42ms</h4>
            </div>
            <div className="health-box">
              <p>Server Uptime</p>
              <h4 className="text-success">99.8%</h4>
            </div>
            <div className="health-box">
              <p>DB Load</p>
              <h4 className="text-primary">34%</h4>
            </div>
            <div className="health-box">
              <p>Error Rate</p>
              <h4 className="text-success">0.02%</h4>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;