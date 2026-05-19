import { Link } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import { walletData, myActiveLoan, userNotifications } from '../../data/mockData';
import ProgressBar from '../../components/ProgressBar';
import './CustomerDashboard.css';

const CustomerDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="cust-dash-container">
      <div className="page-header">
        <h2>Dashboard</h2>
        <p>Overview of your account, loans, and recent activity</p>
      </div>

      {/* Quick Stats */}
      <div className="dash-stats-grid">
        <div className="dash-stat-card">
          <span className="dash-stat-label">Wallet Balance</span>
          <h3 className="dash-stat-value">LKR {walletData.balance}</h3>
          <Link to="/wallet" className="dash-stat-link">Go to Wallet →</Link>
        </div>
        <div className="dash-stat-card">
          <span className="dash-stat-label">Active Loan</span>
          <h3 className="dash-stat-value">{myActiveLoan.type}</h3>
          <Link to="/loans" className="dash-stat-link">View Details →</Link>
        </div>
        <div className="dash-stat-card">
          <span className="dash-stat-label">Next EMI Due</span>
          <h3 className="dash-stat-value emi-highlight">LKR {myActiveLoan.nextEmi.amount}</h3>
          <span className="dash-stat-sub">{myActiveLoan.nextEmi.daysLeft} days left</span>
        </div>
        <div className="dash-stat-card">
          <span className="dash-stat-label">Unread Notifications</span>
          <h3 className="dash-stat-value">{userNotifications.filter(n => n.unread).length}</h3>
          <Link to="/notifications" className="dash-stat-link">View All →</Link>
        </div>
      </div>

      {/* Loan Progress */}
      <div className="dash-grid-2col">
        <div className="dash-card">
          <h3 className="dash-card-title">Loan Repayment Progress</h3>
          <div className="dash-loan-info">
            <div className="dash-loan-row">
              <span>Loan ID</span>
              <strong>{myActiveLoan.id}</strong>
            </div>
            <div className="dash-loan-row">
              <span>Principal</span>
              <strong>LKR {myActiveLoan.principal}</strong>
            </div>
            <div className="dash-loan-row">
              <span>Amount Paid</span>
              <strong>LKR {myActiveLoan.amountPaid}</strong>
            </div>
          </div>
          <ProgressBar
            label="Repayment"
            percentage={myActiveLoan.paidPercentage}
            textValue={`${myActiveLoan.paidPercentage}% Completed`}
            variant="primary"
          />
          <div className="dash-card-actions">
            <Link to="/schedule" className="dash-link-btn">View Schedule →</Link>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="dash-card">
          <h3 className="dash-card-title">Quick Actions</h3>
          <div className="quick-actions-grid">
            <Link to="/apply" className="quick-action-btn">
              <span className="qa-icon">📝</span>
              <span>Apply for Loan</span>
            </Link>
            <Link to="/wallet" className="quick-action-btn">
              <span className="qa-icon">💰</span>
              <span>Top-Up Wallet</span>
            </Link>
            <Link to="/history" className="quick-action-btn">
              <span className="qa-icon">📋</span>
              <span>Payment History</span>
            </Link>
            <Link to="/profile" className="quick-action-btn">
              <span className="qa-icon">👤</span>
              <span>My Profile</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
