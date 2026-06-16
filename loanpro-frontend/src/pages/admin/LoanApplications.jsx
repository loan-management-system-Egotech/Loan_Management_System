import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiGet } from '../../api/apiClient';
import { errorMessage } from '../../utils/format';
import Button from '../../components/Button';
import './LoanApplications.css';

const tabs = ['All Applications', 'Pending', 'Approved', 'Rejected'];
const STATUS_PARAM = {
  'All Applications': 'ALL',
  Pending: 'PENDING',
  Approved: 'APPROVED',
  Rejected: 'REJECTED',
};

const LoanApplications = () => {
  const [activeTab, setActiveTab] = useState('All Applications');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Debounce so typing in the search box doesn't fire a request per keystroke.
    const handle = setTimeout(async () => {
      try {
        setLoading(true);
        setError('');
        const status = STATUS_PARAM[activeTab] || 'ALL';
        const res = await apiGet(
          `/admin/applications?status=${status}&search=${encodeURIComponent(searchTerm)}&page=${page}&size=10`,
        );
        setApps(res?.content || []);
        setTotalPages(res?.totalPages || 1);
      } catch (e) {
        setError(errorMessage(e));
      } finally {
        setLoading(false);
      }
    }, 350);
    return () => clearTimeout(handle);
  }, [activeTab, searchTerm, page]);

  const changeTab = (tab) => { setActiveTab(tab); setPage(0); };
  const changeSearch = (value) => { setSearchTerm(value); setPage(0); };

  return (
    <div className="queue-container">
      <div className="queue-header">
        <div>
          <h2>Loan Applications</h2>
          <p>Manage and review all customer loan requests</p>
        </div>
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by name or ID..."
            value={searchTerm}
            onChange={(e) => changeSearch(e.target.value)}
            className="queue-search"
          />
        </div>
      </div>

      <div className="queue-card">
        <div className="queue-tabs">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
              onClick={() => changeTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="table-wrapper">
          <table className="loanpro-table full-width">
            <thead>
              <tr>
                <th>App ID</th>
                <th>Applicant Name</th>
                <th>Date Submitted</th>
                <th>Loan Type</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7" className="empty-state">Loading applications…</td></tr>
              ) : error ? (
                <tr><td colSpan="7" className="empty-state">{error}</td></tr>
              ) : apps.length > 0 ? (
                apps.map((app) => (
                  <tr key={app.id}>
                    <td className="app-id">{app.id}</td>
                    <td className="app-name">{app.name}</td>
                    <td>{app.date}</td>
                    <td>{app.type}</td>
                    <td className="app-amount">{app.amount}</td>
                    <td>
                      <span className={`status-badge ${String(app.status).replace(' ', '-').toLowerCase()}`}>
                        {app.status}
                      </span>
                    </td>
                    <td>
                      {String(app.status).toLowerCase() === 'pending' ? (
                        <Link to={`/admin/review/${app.id}`} className="action-link">
                          <Button variant="primary" className="sm-btn">Review</Button>
                        </Link>
                      ) : (
                        <Link to={`/admin/review/${app.id}`} className="view-link">View Details</Link>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="7" className="empty-state">No applications found.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {!loading && totalPages > 1 && (
          <div className="queue-pagination" style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', alignItems: 'center', padding: '1rem' }}>
            <Button variant="outline" className="sm-btn" onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0}>Prev</Button>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Page {page + 1} of {totalPages}</span>
            <Button variant="outline" className="sm-btn" onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}>Next</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoanApplications;
