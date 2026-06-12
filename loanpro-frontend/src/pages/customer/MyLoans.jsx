import { myActiveLoan, loanPaymentHistory } from '../../data/mockData';
import Button from '../../components/Button';
import ProgressBar from '../../components/ProgressBar';
import './MyLoans.css';

const MyLoans = () => {
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
              <h3 className="loan-title">{myActiveLoan.type}</h3>
              <p className="loan-id">Loan ID: {myActiveLoan.id}</p>
            </div>
            <span className="status-badge approved">{myActiveLoan.status}</span>
          </div>

          <div className="loan-amounts-grid">
            <div className="amount-box">
              <span className="label">Principal Amount</span>
              <h4 className="value">LKR {myActiveLoan.principal}</h4>
            </div>
            <div className="amount-box">
              <span className="label">Total Payable</span>
              <h4 className="value">LKR {myActiveLoan.totalPayable}</h4>
            </div>
            <div className="amount-box">
              <span className="label">Interest Rate</span>
              <h4 className="value">{myActiveLoan.interestRate}</h4>
            </div>
            <div className="amount-box">
              <span className="label">Tenure</span>
              <h4 className="value">{myActiveLoan.tenure}</h4>
            </div>
          </div>

          <div className="repayment-progress">
            <ProgressBar 
              label="Repayment Progress" 
              percentage={myActiveLoan.paidPercentage} 
              textValue={`LKR ${myActiveLoan.amountPaid} Paid`} 
              variant="primary" 
            />
          </div>
        </div>

        {/* Right Card: Next EMI Action Box */}
        <div className="emi-card brand-bg">
          <div className="emi-header">NEXT EMI DUE</div>
          <h2 className="emi-amount">LKR {myActiveLoan.nextEmi.amount}</h2>
          <p className="emi-date">Due on {myActiveLoan.nextEmi.dueDate}</p>
          
          <div className="urgency-box">
            <span>⏱ {myActiveLoan.nextEmi.daysLeft} days left to pay</span>
          </div>

          <div className="emi-actions">
            <Button variant="secondary" className="full-width-btn">Pay Now</Button>
            <button className="text-btn">View Schedule</button>
          </div>
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
              {loanPaymentHistory.map(payment => (
                <tr key={payment.id}>
                  <td className="tx-id">{payment.id}</td>
                  <td>{payment.date}</td>
                  <td className="font-semibold">{payment.amount}</td>
                  <td>{payment.principal}</td>
                  <td>{payment.interest}</td>
                  <td>
                    <span className="status-badge success">✓ {payment.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default MyLoans;