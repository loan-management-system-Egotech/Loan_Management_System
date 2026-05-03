import Card from '../../components/Card';
import { dashboardStats, recentLoans } from '../../data/mockData';
import './AdminDashboard.css';

function AdminDashboard() {
  return (
    <div className="admin-dash">
      {/* Stats Grid */}
      <div className="admin-dash__stats">
        {dashboardStats.map((stat) => (
          <div className="stat-card" key={stat.label}>
            <div className="stat-card__icon" style={{ background: `${stat.color}12`, color: stat.color }}>
              {stat.icon}
            </div>
            <div className="stat-card__info">
              <span className="stat-card__label">{stat.label}</span>
              <span className="stat-card__value">{stat.value}</span>
            </div>
            <span className={`stat-card__change ${stat.change.startsWith('+') ? 'stat-card__change--up' : 'stat-card__change--down'}`}>
              {stat.change}
            </span>
          </div>
        ))}
      </div>

      {/* Recent Loans Table */}
      <Card title="Recent Loans" subtitle="Latest loan activity" icon="📋">
        <div className="admin-dash__table-wrap">
          <table className="admin-dash__table">
            <thead>
              <tr>
                <th>Loan ID</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentLoans.map((loan) => (
                <tr key={loan.id}>
                  <td className="admin-dash__loan-id">{loan.id}</td>
                  <td>{loan.customer}</td>
                  <td className="admin-dash__amount">{loan.amount}</td>
                  <td>
                    <span className={`status-badge status-badge--${loan.status.toLowerCase()}`}>
                      {loan.status}
                    </span>
                  </td>
                  <td className="admin-dash__date">{loan.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

export default AdminDashboard;
