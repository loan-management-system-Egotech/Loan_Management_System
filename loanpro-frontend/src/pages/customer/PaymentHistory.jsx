import { loanPaymentHistory } from '../../data/mockData';
import './PaymentHistory.css';

const PaymentHistory = () => {
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
          <h3 className="stat-value">{loanPaymentHistory.length}</h3>
        </div>
        <div className="history-stat-card">
          <span className="stat-label">Total Amount Paid</span>
          <h3 className="stat-value text-primary">LKR 14,264</h3>
        </div>
        <div className="history-stat-card">
          <span className="stat-label">Missed Payments</span>
          <h3 className="stat-value text-success">0</h3>
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
            {loanPaymentHistory.map(payment => (
              <tr key={payment.id}>
                <td className="tx-id">{payment.id}</td>
                <td>{payment.date}</td>
                <td className="font-semibold">{payment.amount}</td>
                <td>{payment.principal}</td>
                <td>{payment.interest}</td>
                <td>
                  <span className="status-badge paid">✓ {payment.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentHistory;
