import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiGet, apiPut } from '../../api/apiClient';
import { formatLKR, formatDate, errorMessage } from '../../utils/format';
import Button from '../../components/Button';
import Input from '../../components/Input';
import ProgressBar from '../../components/ProgressBar';
import './ReviewApplication.css';

const initials = (name) =>
  String(name || '?')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

const ReviewApplication = () => {
  const { id } = useParams();
  const [app, setApp] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState(null);

  const [decisionData, setDecisionData] = useState({
    approvedAmount: '',
    interestRate: '',
    tenure: '',
    remarks: '',
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await apiGet(`/admin/applications/${id}`);
        if (cancelled) return;
        setApp(data);
        setDecisionData({
          approvedAmount: data.approvedAmount ?? data.amountRequested ?? '',
          interestRate: data.interestRate ?? '',
          tenure: data.approvedTenure ?? data.tenureMonths ?? '',
          remarks: data.adminRemarks ?? '',
        });
        const docs = await apiGet(`/applications/${id}/documents`).catch(() => []);
        if (!cancelled) { setDocuments(Array.isArray(docs) ? docs : []); setError(''); }
      } catch (e) {
        if (!cancelled) setError(errorMessage(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDecisionData((prev) => ({ ...prev, [name]: value }));
  };

  const submitDecision = async (decision) => {
    setSubmitting(true);
    setNotice(null);
    try {
      const updated = await apiPut(`/admin/applications/${id}/decision`, {
        decision,
        approvedAmount: decisionData.approvedAmount === '' ? null : Number(decisionData.approvedAmount),
        interestRate: decisionData.interestRate === '' ? null : Number(decisionData.interestRate),
        tenure: decisionData.tenure === '' ? null : Number(decisionData.tenure),
        remarks: decisionData.remarks || null,
      });
      setApp(updated);
      setNotice({ type: 'success', text: `Application marked as ${decision}.` });
    } catch (e) {
      setNotice({ type: 'error', text: errorMessage(e) });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="page-loading">Loading application…</div>;
  if (error) return <div className="page-error">{error}</div>;
  if (!app) return <div className="page-error">Application not found.</div>;

  const details = {
    'Loan Type': app.type,
    'Amount Requested': formatLKR(app.amountRequested),
    Purpose: app.purpose || '—',
    Tenure: app.tenureMonths ? `${app.tenureMonths} months` : '—',
    'Monthly Income': formatLKR(app.grossSalary),
    'Credit Score': app.creditScore ?? '—',
    'NIC / Passport': app.nic || '—',
  };

  const creditPct = app.creditScore ? Math.min(100, Math.round((Number(app.creditScore) / 850) * 100)) : 0;

  return (
    <div className="review-container">
      {/* 1. Top Header Banner */}
      <div className="review-header-card">
        <div className="profile-section">
          <div className="avatar-circle">{initials(app.name)}</div>
          <div className="profile-info">
            <h2>{app.name}</h2>
            <div className="meta-info">
              <span>{app.email || '—'}</span>
              <span>{app.phone || '—'}</span>
            </div>
            <div className="meta-info bottom">
              <span>App ID : {app.id}</span>
              <span>Submitted : {app.submittedAt ? formatDate(app.submittedAt) : app.date}</span>
            </div>
          </div>
        </div>
        <div className="status-section">
          <span className={`badge pending-badge status-badge ${String(app.status).replace(' ', '-').toLowerCase()}`}>{app.status}</span>
        </div>
      </div>

      {/* 2. Three Column Grid */}
      <div className="review-grid-3col">
        {/* Column 1: Application Details */}
        <div className="review-panel">
          <h3 className="panel-title">Application Details</h3>
          <div className="details-list">
            {Object.entries(details).map(([key, value]) => (
              <div className="detail-item" key={key}>
                <span className="detail-label">{key}</span>
                <span className="detail-value">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Column 2: Documents & Risk */}
        <div className="review-panel">
          <h3 className="panel-title">Submitted Documents</h3>
          {documents.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>No documents uploaded.</p>
          ) : (
            <ul className="document-list">
              {documents.map((doc) => (
                <li key={doc.id} className={doc.verified ? 'verified' : 'missing'}>
                  <span className="icon">{doc.verified ? '✓' : '✗'}</span>
                  {doc.documentType} — {doc.fileName}
                </li>
              ))}
            </ul>
          )}

          <h3 className="panel-title risk-title">Risk Assessment</h3>
          <div className="risk-bars">
            <ProgressBar
              label="Credit Score"
              percentage={creditPct}
              textValue={app.creditScore ? `${app.creditScore} / 850` : 'N/A'}
              variant={creditPct >= 70 ? 'success' : creditPct >= 40 ? 'warning' : 'danger'}
            />
          </div>
        </div>

        {/* Column 3: Admin Decision Form */}
        <div className="review-panel">
          <h3 className="panel-title">Admin Decision</h3>

          <div className="decision-form">
            <Input label="Approved Amount (LKR)" name="approvedAmount" type="number" value={decisionData.approvedAmount} onChange={handleInputChange} />

            <div className="form-row">
              <Input label="Interest Rate (%)" name="interestRate" type="number" value={decisionData.interestRate} onChange={handleInputChange} />
              <Input label="Tenure (Month)" name="tenure" type="number" value={decisionData.tenure} onChange={handleInputChange} />
            </div>

            <div className="textarea-group">
              <label>Remark / Note</label>
              <textarea
                name="remarks"
                value={decisionData.remarks}
                onChange={handleInputChange}
                placeholder="Add Notes........"
                rows="4"
              ></textarea>
            </div>

            {notice && (
              <div className={`form-feedback ${notice.type === 'success' ? 'is-success' : 'is-error'}`}>
                {notice.text}
              </div>
            )}

            <div className="decision-actions">
              <Button variant="success" className="decision-btn" onClick={() => submitDecision('APPROVED')} disabled={submitting}>
                {submitting ? 'Saving…' : 'Approve Application'}
              </Button>
              <Button variant="danger" className="decision-btn" onClick={() => submitDecision('REJECTED')} disabled={submitting}>
                Reject Application
              </Button>
              <Button variant="warning" className="decision-btn outline-warning" onClick={() => submitDecision('UNDER_REVIEW')} disabled={submitting}>
                Mark Under Review
              </Button>
            </div>

            <div style={{ marginTop: '1rem', textAlign: 'center' }}>
              <Link to="/admin/applications" className="action-link">← Back to Applications</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewApplication;
