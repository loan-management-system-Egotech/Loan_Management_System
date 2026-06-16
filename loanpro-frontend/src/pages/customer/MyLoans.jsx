import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiGet, apiPost } from '../../api/apiClient';
import { formatLKR, formatDate, errorMessage } from '../../utils/format';
import Button from '../../components/Button';
import ProgressBar from '../../components/ProgressBar';
import './MyLoans.css';

const MyLoans = () => {
  const navigate = useNavigate();
  const [loan, setLoan] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [paying, setPaying] = useState(false);
  const [notice, setNotice] = useState(null); // { type: 'success'|'error', text }
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        let loanRes = null;
        try {
          loanRes = await apiGet('/loans/active');
        } catch (e) {
          if (e.status !== 404) throw e;
        }
        if (cancelled) return;
        setLoan(loanRes);
        if (loanRes) {
          const pay = await apiGet(`/loans/${loanRes.id}/payments`).catch(() => []);
          if (!cancelled) setPayments(Array.isArray(pay) ? pay : []);
        } else {
          setPayments([]);
        }
        if (!cancelled) setError('');
      } catch (e) {
        if (!cancelled) setError(errorMessage(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [refreshKey]);

  const handlePay = async () => {
    if (!loan?.nextEmi) return;
    setPaying(true);
    setNotice(null);
    try {
      await apiPost(`/loans/${loan.id}/pay`, { amount: loan.nextEmi.amount });
      setNotice({ type: 'success', text: 'Payment successful.' });
      setRefreshKey((k) => k + 1);
    } catch (e) {
      setNotice({ type: 'error', text: errorMessage(e) });
    } finally {
      setPaying(false);
    }
  };

  if (loading) return <div className="page-loading">Loading your loans…</div>;
  if (error) return <div className="page-error">{error}</div>;

  if (!loan) {
    return (
      <div className="my-loans-container">
        <div className="page-header">
          <h2>My Loans</h2>
          <p>Track your active loans and repayment schedules</p>
        </div>
        <div className="page-loading">You have no active loans yet.</div>
      </div>
    );
  }

  return (
    <div className="my-loans-container">
      <div className="page-header">
        <h2>My Loans</h2>
        <p>Track your active loans and repayment schedules</p>
      </div>

      <div className="loans-top-grid">
        {/* Left Card: The Active Loan Details */}
        <div className="active-loan-card">
          <div className="card-header-flex">
            <div>
              <h3 className="loan-title">{loan.type}</h3>
              <p className="loan-id">Loan ID: {loan.id}</p>
            </div>
            <span className="status-badge approved">{loan.status}</span>
          </div>

          <div className="loan-amounts-grid">
            <div className="amount-box">
              <span className="label">Principal Amount</span>
              <h4 className="value">{formatLKR(loan.principal)}</h4>
            </div>
            <div className="amount-box">
              <span className="label">Total Payable</span>
              <h4 className="value">{formatLKR(loan.totalPayable)}</h4>
            </div>
            <div className="amount-box">
              <span className="label">Interest Rate</span>
              <h4 className="value">{loan.interestRate}</h4>
            </div>
            <div className="amount-box">
              <span className="label">Tenure</span>
              <h4 className="value">{loan.tenure}</h4>
            </div>
          </div>

          <div className="repayment-progress">
            <ProgressBar
              label="Repayment Progress"
              percentage={loan.paidPercentage}
              textValue={`${formatLKR(loan.amountPaid)} Paid`}
              variant="primary"
            />
          </div>
        </div>

        {/* Right Card: Next EMI Action Box */}
        <div className="emi-card brand-bg">
          <div className="emi-header">NEXT EMI DUE</div>
          {loan.nextEmi ? (
            <>
              <h2 className="emi-amount">{formatLKR(loan.nextEmi.amount)}</h2>
              <p className="emi-date">Due on {formatDate(loan.nextEmi.dueDate)}</p>
              <div className="urgency-box">
                <span>⏱ {loan.nextEmi.daysLeft} days left to pay</span>
              </div>
            </>
          ) : (
            <>
              <h2 className="emi-amount">—</h2>
              <p className="emi-date">No upcoming payment</p>
            </>
          )}

          <div className="emi-actions">
            <Button
              variant="secondary"
              className="full-width-btn"
              onClick={handlePay}
              disabled={paying || !loan.nextEmi}
            >
              {paying ? 'Processing…' : 'Pay Now'}
            </Button>
            <button className="text-btn" onClick={() => navigate('/schedule')}>View Schedule</button>
          </div>
          {notice && (
            <div className={`form-feedback ${notice.type === 'success' ? 'is-success' : 'is-error'}`}>
              {notice.text}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Section: Payment History Table */}
      <div className="history-section">
        <div className="history-header">
          <h3>Payment History</h3>
          <button className="download-btn">↓ Download Statement</button>
        </div>

        <div className="table-card">
          <table className="loanpro-table full-width">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Payment Date</th>
                <th>Total EMI</th>
                <th>Principal Component</th>
                <th>Interest Component</th>
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
                      <span className="status-badge success">✓ {payment.status}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MyLoans;
