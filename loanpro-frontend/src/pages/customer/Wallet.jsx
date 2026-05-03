import Card from '../../components/Card';
import { walletData } from '../../data/mockData';
import './Wallet.css';

function Wallet() {
  return (
    <div className="wallet-page">
      <h2 className="wallet-page__title">My Wallet</h2>
      <p className="wallet-page__subtitle">Manage your funds and view transactions</p>

      {/* Balance Card */}
      <div className="wallet-page__balance-card">
        <span className="wallet-page__balance-label">Available Balance</span>
        <span className="wallet-page__balance-value">${walletData.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
        <span className="wallet-page__account">{walletData.accountNumber}</span>
      </div>

      {/* Recent Transactions */}
      <Card title="Recent Transactions" subtitle="Your latest activity" icon="📄">
        <div className="wallet-page__table-wrap">
          <table className="wallet-page__table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Type</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {walletData.recentTransactions.map((txn) => (
                <tr key={txn.id}>
                  <td className="wallet-page__txn-id">{txn.id}</td>
                  <td>
                    <span className={`txn-type txn-type--${txn.type.toLowerCase()}`}>{txn.type}</span>
                  </td>
                  <td>{txn.description}</td>
                  <td className={`wallet-page__amount ${txn.amount > 0 ? 'wallet-page__amount--positive' : 'wallet-page__amount--negative'}`}>
                    {txn.amount > 0 ? '+' : ''}${Math.abs(txn.amount).toLocaleString()}
                  </td>
                  <td className="wallet-page__date">{txn.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

export default Wallet;
