import { amortizationSchedule, myActiveLoan } from '../../data/mockData';
import Button from '../../components/Button';
import './RepaymentSchedule.css';

const RepaymentSchedule = () => {
  return (
    <div className="schedule-container">
      <div className="page-header">
        <h2>Repayment Schedule</h2>
        <p>Detailed amortization table for your active loan</p>
      </div>

      {/* Summary Card */}
      <div className="schedule-summary-card">
        <div className="summary-info">
          <h3>{myActiveLoan.type}</h3>
          <p>Loan ID: {myActiveLoan.id}</p>
        </div>
        <div className="summary-stats">
          <div className="stat-item">
            <span>Monthly EMI</span>
            <h4>LKR {myActiveLoan.nextEmi.amount}</h4>
          </div>
          <div className="stat-item">
            <span>Interest Rate</span>
            <h4>{myActiveLoan.interestRate}</h4>
          </div>
          <div className="stat-item">
            <span>Total Tenure</span>
            <h4>{myActiveLoan.tenure}</h4>
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
            {amortizationSchedule.map((row) => (
              // Add a special class if this is the next due payment
              <tr key={row.month} className={row.status === 'Next Due' ? 'highlight-row' : ''}>
                <td className="month-col">{row.month}</td>
                <td className="date-col">{row.date}</td>
                <td className="bold-col">{row.emi}</td>
                <td>{row.principal}</td>
                <td>{row.interest}</td>
                <td className="bold-col">{row.balance}</td>
                <td>
                  <span className={`status-badge ${row.status.replace(' ', '-').toLowerCase()}`}>
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RepaymentSchedule;