import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { apiGet } from '../../api/apiClient';
import { formatLKR, errorMessage } from '../../utils/format';
import ProgressBar from '../../components/ProgressBar';
import './CustomerDashboard.css';

const CustomerDashboard = () => {
  const [wallet, setWallet] = useState(null);
  const [loan, setLoan] = useState(null);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setLoading(true);
        setError('');
        const [walletRes, unreadRes] = await Promise.all([
          apiGet('/wallet'),
          apiGet('/notifications/unread-count'),
        ]);
        // The active-loan endpoint 404s when the customer has no active loan.
        let loanRes = null;
        try {
          loanRes = await apiGet('/loans/active');
        } catch (e) {
          if (e.status !== 404) throw e;
        }
        if (!active) return;
        setWallet(walletRes);
        setUnread(Number(unreadRes) || 0);
        setLoan(loanRes);
      } catch (e) {
        if (active) setError(errorMessage(e));
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  if (loading) return <div className="page-loading">Loading your dashboard…</div>;
  if (error) return <div className="page-error">{error}</div>;

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
          <h3 className="dash-stat-value">{formatLKR(wallet?.balance)}</h3>
          <Link to="/wallet" className="dash-stat-link">Go to Wallet →</Link>
        </div>
        <div className="dash-stat-card">
          <span className="dash-stat-label">Active Loan</span>
          <h3 className="dash-stat-value">{loan ? loan.type : 'No active loan'}</h3>
          <Link to="/loans" className="dash-stat-link">View Details →</Link>
        </div>
        <div className="dash-stat-card">
          <span className="dash-stat-label">Next EMI Due</span>
          <h3 className="dash-stat-value emi-highlight">{loan?.nextEmi ? formatLKR(loan.nextEmi.amount) : '—'}</h3>
          <span className="dash-stat-sub">{loan?.nextEmi ? `${loan.nextEmi.daysLeft} days left` : 'Nothing due'}</span>
        </div>
        <div className="dash-stat-card">
          <span className="dash-stat-label">Unread Notifications</span>
          <h3 className="dash-stat-value">{unread}</h3>
          <Link to="/notifications" className="dash-stat-link">View All →</Link>
        </div>
      </div>

      {/* Loan Progress */}
      <div className="dash-grid-2col">
        <div className="dash-card">
          <h3 className="dash-card-title">Loan Repayment Progress</h3>
          {loan ? (
            <>
              <div className="dash-loan-info">
                <div className="dash-loan-row">
                  <span>Loan ID</span>
                  <strong>{loan.id}</strong>
                </div>
                <div className="dash-loan-row">
                  <span>Principal</span>
                  <strong>{formatLKR(loan.principal)}</strong>
                </div>
                <div className="dash-loan-row">
                  <span>Amount Paid</span>
                  <strong>{formatLKR(loan.amountPaid)}</strong>
                </div>
              </div>
              <ProgressBar
                label="Repayment"
                percentage={loan.paidPercentage}
                textValue={`${loan.paidPercentage}% Completed`}
                variant="primary"
              />
              <div className="dash-card-actions">
                <Link to="/schedule" className="dash-link-btn">View Schedule →</Link>
              </div>
            </>
          ) : (
            <p style={{ color: 'var(--text-muted)' }}>
              You have no active loans. <Link to="/apply" className="dash-stat-link">Apply for a loan →</Link>
            </p>
          )}
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
