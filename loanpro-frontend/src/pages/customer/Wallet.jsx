import { useState, useEffect, useMemo } from 'react';
import { apiGet, apiPost } from '../../api/apiClient';
import { formatLKR, formatDate, errorMessage } from '../../utils/format';
import ProgressBar from '../../components/ProgressBar';
import './Wallet.css';

const GOAL_VARIANTS = ['primary', 'success', 'warning', 'danger'];

// Small reusable amount-entry modal for top-up / transfer / withdraw.
const ActionModal = ({ mode, goals, onClose, onSubmit }) => {
  const [amount, setAmount] = useState('');
  const [goalId, setGoalId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const title = { topup: 'Top-up Wallet', transfer: 'Transfer Funds', withdraw: 'Withdraw Funds' }[mode];

  const submit = async (e) => {
    e.preventDefault();
    const value = Number(amount);
    if (!value || value <= 0) { setError('Enter a valid amount greater than 0.'); return; }
    setSubmitting(true);
    setError('');
    try {
      await onSubmit(value, goalId ? Number(goalId) : null);
    } catch (err) {
      setError(errorMessage(err));
      setSubmitting(false);
    }
  };

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <h3 style={{ marginBottom: '1rem' }}>{title}</h3>
        <form onSubmit={submit}>
          <label style={labelStyle}>Amount (LKR)</label>
          <input
            type="number"
            min="1"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={inputStyle}
            placeholder="0.00"
            autoFocus
          />

          {mode === 'transfer' && (
            <>
              <label style={labelStyle}>Destination</label>
              <select value={goalId} onChange={(e) => setGoalId(e.target.value)} style={inputStyle}>
                <option value="">External transfer</option>
                {goals.map((g) => (
                  <option key={g.id} value={g.id}>Saving goal: {g.label}</option>
                ))}
              </select>
            </>
          )}

          {error && <div className="form-feedback is-error">{error}</div>}

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
            <button type="submit" className="action-btn" disabled={submitting} style={{ background: '#3b5bdb', color: '#fff' }}>
              {submitting ? 'Processing…' : 'Confirm'}
            </button>
            <button type="button" className="action-btn outline" onClick={onClose} style={{ color: '#3b5bdb', border: '1px solid #cbd5e1' }}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const overlayStyle = {
  position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.45)',
  display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
};
const modalStyle = {
  background: '#fff', borderRadius: '14px', padding: '1.75rem', width: '90%', maxWidth: '380px',
  boxShadow: '0 20px 40px -15px rgba(0,0,0,0.25)',
};
const labelStyle = { display: 'block', fontSize: '0.82rem', fontWeight: 500, color: '#475569', margin: '0.75rem 0 0.4rem' };
const inputStyle = { width: '100%', padding: '0.7rem 0.9rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.9rem' };

const Wallet = () => {
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [breakdown, setBreakdown] = useState({});
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modal, setModal] = useState(null); // 'topup' | 'transfer' | 'withdraw' | null
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [walletRes, txns, brk, gls] = await Promise.all([
          apiGet('/wallet'),
          apiGet('/wallet/transactions').catch(() => []),
          apiGet('/wallet/spending-breakdown').catch(() => ({})),
          apiGet('/wallet/saving-goals').catch(() => []),
        ]);
        if (cancelled) return;
        setWallet(walletRes);
        setTransactions(Array.isArray(txns) ? txns : []);
        setBreakdown(brk || {});
        setGoals(Array.isArray(gls) ? gls : []);
        setError('');
      } catch (e) {
        if (!cancelled) setError(errorMessage(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [refreshKey]);

  const spendingBars = useMemo(() => {
    const emi = Number(breakdown?.emi) || 0;
    const transfers = Number(breakdown?.transfers) || 0;
    const withdrawals = Number(breakdown?.withdrawals) || 0;
    const total = emi + transfers + withdrawals;
    const pct = (v) => (total > 0 ? Math.round((v / total) * 100) : 0);
    return [
      { label: 'EMI Payments', percentage: pct(emi), variant: 'primary' },
      { label: 'Transfers', percentage: pct(transfers), variant: 'success' },
      { label: 'Withdrawals', percentage: pct(withdrawals), variant: 'warning' },
    ];
  }, [breakdown]);

  const handleAction = async (value, goalId) => {
    if (modal === 'topup') {
      await apiPost('/wallet/topup', { amount: value, paymentMethod: 'BANK' });
    } else if (modal === 'withdraw') {
      await apiPost('/wallet/withdraw', { amount: value });
    } else if (modal === 'transfer') {
      await apiPost('/wallet/transfer', {
        amount: value,
        target: goalId ? 'SAVINGS' : 'EXTERNAL',
        savingGoalId: goalId,
      });
    }
    setModal(null);
    setRefreshKey((k) => k + 1);
  };

  if (loading) return <div className="page-loading">Loading your wallet…</div>;
  if (error) return <div className="page-error">{error}</div>;

  return (
    <div className="wallet-container">
      {/* Top Summary Cards */}
      <div className="summary-grid">
        <div className="summary-card brand-bg">
          <div className="card-header">AVAILABLE BALANCE</div>
          <h2 className="balance-amount">{formatLKR(wallet?.balance)}</h2>
          <p className="wallet-id">Wallet ID : {wallet?.walletId}</p>
          <div className="card-actions">
            <button className="action-btn" onClick={() => setModal('topup')}>Top-up</button>
            <button className="action-btn outline" onClick={() => setModal('transfer')}>Transfer</button>
            <button className="action-btn outline" onClick={() => setModal('withdraw')}>Withdraw</button>
          </div>
        </div>

        <div className="summary-card">
          <div className="card-header">TOTAL CREDITED</div>
          <h2 className="amount success">{formatLKR(wallet?.totalCredited)}</h2>
          <p className="trend positive">Lifetime credited</p>
        </div>

        <div className="summary-card">
          <div className="card-header">TOTAL DEBITED</div>
          <h2 className="amount danger">{formatLKR(wallet?.totalDebited)}</h2>
          <p className="trend negative">Lifetime debited</p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="wallet-main-content">
        {/* Transactions Table */}
        <div className="table-card">
          <div className="table-header">
            <h3>Recent Transactions</h3>
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
              {transactions.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No transactions yet.</td></tr>
              ) : (
                transactions.map((txn) => (
                  <tr key={txn.id}>
                    <td>{txn.id}</td>
                    <td>{txn.description}</td>
                    <td>{formatDate(txn.createdAt)}</td>
                    <td className={txn.isCredit ? 'text-success' : 'text-danger'}>
                      {txn.isCredit ? '' : '-'}{formatLKR(Math.abs(Number(txn.amount)))}
                    </td>
                    <td>{txn.isCredit ? 'Credit' : 'Debit'}</td>
                    <td><span className="status-badge success">{txn.status}</span></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Spending & Goals */}
        <div className="side-widgets">
          <div className="widget-card">
            <div className="table-header">
              <h3>Spending Breakdown</h3>
            </div>
            <div className="widget-content">
              {spendingBars.map((item) => (
                <ProgressBar key={item.label} label={item.label} percentage={item.percentage} variant={item.variant} />
              ))}
            </div>
          </div>

          <div className="widget-card">
            <div className="table-header">
              <h3>Saving Goals</h3>
            </div>
            <div className="widget-content">
              {goals.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No saving goals yet.</p>
              ) : (
                goals.map((goal, i) => {
                  const pct = goal.progressPercentage ??
                    (Number(goal.targetAmount) > 0
                      ? Math.round((Number(goal.currentAmount) / Number(goal.targetAmount)) * 100)
                      : 0);
                  return (
                    <ProgressBar
                      key={goal.id}
                      label={goal.label}
                      percentage={pct}
                      textValue={`${formatLKR(goal.currentAmount)} / ${formatLKR(goal.targetAmount)}`}
                      variant={GOAL_VARIANTS[i % GOAL_VARIANTS.length]}
                    />
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {modal && (
        <ActionModal
          mode={modal}
          goals={goals}
          onClose={() => setModal(null)}
          onSubmit={handleAction}
        />
      )}
    </div>
  );
};

export default Wallet;
