import { useState, useEffect } from 'react';
import { apiGet } from '../../api/apiClient';
import { formatLKR, formatDate, errorMessage } from '../../utils/format';
import Button from '../../components/Button';
import './RepaymentSchedule.css';

const RepaymentSchedule = () => {
  const [loan, setLoan] = useState(null);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setLoading(true);
        setError('');
        let loanRes = null;
        try {
          loanRes = await apiGet('/loans/active');
        } catch (e) {
          if (e.status !== 404) throw e;
        }
        if (!active) return;
        setLoan(loanRes);
        if (loanRes) {
          const sched = await apiGet(`/loans/${loanRes.id}/schedule`).catch(() => []);
          if (active) setRows(Array.isArray(sched) ? sched : []);
        }
      } catch (e) {
        if (active) setError(errorMessage(e));
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  if (loading) return <div className="page-loading">Loading your schedule…</div>;
  if (error) return <div className="page-error">{error}</div>;

  if (!loan) {
    return (
      <div className="schedule-container">
        <div className="page-header">
          <h2>Repayment Schedule</h2>
          <p>Detailed amortization table for your active loan</p>
        </div>
        <div className="page-loading">No active loan to show a schedule for.</div>
      </div>
    );
  }

  return (
    <div className="schedule-container">
      <div className="page-header">
        <h2>Repayment Schedule</h2>
        <p>Detailed amortization table for your active loan</p>
      </div>

      {/* Summary Card */}
      <div className="schedule-summary-card">
        <div className="summary-info">
          <h3>{loan.type}</h3>
          <p>Loan ID: {loan.id}</p>
        </div>
        <div className="summary-stats">
          <div className="stat-item">
            <span>Monthly EMI</span>
            <h4>{loan.nextEmi ? formatLKR(loan.nextEmi.amount) : '—'}</h4>
          </div>
          <div className="stat-item">
            <span>Interest Rate</span>
            <h4>{loan.interestRate}</h4>
          </div>
          <div className="stat-item">
            <span>Total Tenure</span>
            <h4>{loan.tenure}</h4>
          </div>
        </div>
        <Button variant="outline">Download PDF</Button>
      </div>

      {/* Amortization Table */}
      <div className="schedule-table-card">
        <table className="loanpro-table full-width">
          <thead>
            <tr>
              <th>No.</th>
              <th>Due Date</th>
              <th>EMI (LKR)</th>
              <th>Principal (LKR)</th>
              <th>Interest (LKR)</th>
              <th>Remaining Balance</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No schedule available.</td></tr>
            ) : (
              rows.map((row) => (
                <tr key={row.month} className={row.status === 'Next Due' ? 'highlight-row' : ''}>
                  <td className="month-col">{row.month}</td>
                  <td className="date-col">{formatDate(row.date)}</td>
                  <td className="bold-col">{formatLKR(row.emi)}</td>
                  <td>{formatLKR(row.principal)}</td>
                  <td>{formatLKR(row.interest)}</td>
                  <td className="bold-col">{formatLKR(row.balance)}</td>
                  <td>
                    <span className={`status-badge ${String(row.status).replace(' ', '-').toLowerCase()}`}>
                      {row.status}
                    </span>
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

export default RepaymentSchedule;
