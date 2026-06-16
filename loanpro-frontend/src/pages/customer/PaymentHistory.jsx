import { useState, useEffect } from 'react';
import { apiGet } from '../../api/apiClient';
import { formatLKR, formatDate, errorMessage } from '../../utils/format';
import './PaymentHistory.css';

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setLoading(true);
        setError('');
        const data = await apiGet('/payments/history');
        if (active) setPayments(Array.isArray(data) ? data : []);
      } catch (e) {
        if (active) setError(errorMessage(e));
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  const totalPaid = payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
  const missed = payments.filter((p) => String(p.status).toLowerCase() !== 'paid').length;

  if (loading) return <div className="page-loading">Loading payment history…</div>;
  if (error) return <div className="page-error">{error}</div>;

  return (
    <div className="history-container">
      <div className="page-header">
        <h2>Payment History</h2>
        <p>Complete record of all your loan payments</p>
      </div>

      {/* Summary Stats */}
      <div className="history-stats-grid">
        <div className="history-stat-card">
          <span className="stat-label">Total Payments Made</span>
          <h3 className="stat-value">{payments.length}</h3>
        </div>
        <div className="history-stat-card">
          <span className="stat-label">Total Amount Paid</span>
          <h3 className="stat-value text-primary">{formatLKR(totalPaid)}</h3>
        </div>
        <div className="history-stat-card">
          <span className="stat-label">Missed Payments</span>
          <h3 className="stat-value text-success">{missed}</h3>
        </div>
      </div>

      {/* Payment History Table */}
      <div className="history-table-card">
        <div className="history-table-header">
          <h3>All Transactions</h3>
          <button className="download-btn">↓ Export CSV</button>
        </div>
        <table className="loanpro-table full-width">
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>Payment Date</th>
              <th>Total EMI</th>
              <th>Principal</th>
              <th>Interest</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {payments.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No payments yet.</td></tr>
            ) : (
              payments.map((payment) => (
                <tr key={payment.txnId}>
                  <td className="tx-id">{payment.txnId}</td>
                  <td>{formatDate(payment.date)}</td>
                  <td className="font-semibold">{formatLKR(payment.amount)}</td>
                  <td>{formatLKR(payment.principal)}</td>
                  <td>{formatLKR(payment.interest)}</td>
                  <td>
                    <span className="status-badge paid">✓ {payment.status}</span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentHistory;
