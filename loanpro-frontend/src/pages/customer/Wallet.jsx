// Add spendingBreakdown and savingGoals to the import
import { walletData, recentTransactions, spendingBreakdown, savingGoals } from '../../data/mockData';
import ProgressBar from '../../components/ProgressBar'; // Import the new component
import './Wallet.css';
const Wallet = () => {
  return (
    <div className="wallet-container">
      
      {/* Top 4 Summary Cards */}
      <div className="summary-grid">
        {/* Main Blue Balance Card */}
        <div className="summary-card brand-bg">
          <div className="card-header">AVAILABLE BALANCE</div>
          <h2 className="balance-amount">LKR {walletData.balance}</h2>
          <p className="wallet-id">Wallet ID : {walletData.walletId}</p>
          <div className="card-actions">
            <button className="action-btn">Top-up</button>
            <button className="action-btn outline">Transfer</button>
            <button className="action-btn outline">Withdraw</button>
          </div>
        </div>

        {/* Credited Card */}
        <div className="summary-card">
          <div className="card-header">TOTAL CREDITED</div>
          <h2 className="amount success">LKR {walletData.totalCredited}</h2>
          <p className="trend positive">↑ +18% this month</p>
        </div>

        {/* Debited Card */}
        <div className="summary-card">
          <div className="card-header">TOTAL DEBITED</div>
          <h2 className="amount danger">LKR {walletData.totalDebited}</h2>
          <p className="trend negative">↓ -5% this month</p>
        </div>
      </div>

      {/* Main Content Area: Table and Sidebars */}
      <div className="wallet-main-content">
        
        {/* Left Column: Transactions Table */}
        <div className="table-card">
          <div className="table-header">
            <h3>Recent Transactions</h3>
            <a href="#view-all" className="view-all">View All →</a>
          </div>
          
          <table className="loanpro-table">
            <thead>
              <tr>
                <th>TXN ID</th>
                <th>Description</th>
                <th>Date</th>
                <th>Amount (LKR)</th>
                <th>Type</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions.map((txn) => (
                <tr key={txn.id}>
                  <td>{txn.id}</td>
                  <td>{txn.description}</td>
                  <td>{txn.type}</td>
                  <td className={txn.isCredit ? 'text-success' : 'text-danger'}>
                    {txn.amount}
                  </td>
                  <td>{txn.isCredit ? 'Credit' : 'Debit'}</td>
                  <td><span className="status-badge success">{txn.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Right Column: Spending & Goals */}
        <div className="side-widgets">
          
          <div className="widget-card">
            <div className="table-header">
               <h3>Spending Breakdown</h3>
            </div>
            <div className="widget-content">
              {spendingBreakdown.map(item => (
                <ProgressBar 
                  key={item.id}
                  label={item.label} 
                  percentage={item.percentage} 
                  variant={item.color} 
                />
              ))}
            </div>
          </div>

          <div className="widget-card">
            <div className="table-header">
               <h3>Saving Goals</h3>
               <a href="#goals" className="view-all">Saving Goals →</a>
            </div>
            <div className="widget-content">
              {savingGoals.map(goal => (
                <ProgressBar 
                  key={goal.id}
                  label={goal.label} 
                  percentage={goal.percentage} 
                  textValue={`LKR ${goal.current} / ${goal.target}`}
                  variant={goal.color} 
                />
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Wallet;