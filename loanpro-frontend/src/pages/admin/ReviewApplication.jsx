import { useState } from 'react';
import { reviewData } from '../../data/mockData';
import Button from '../../components/Button';
import Input from '../../components/Input';
import ProgressBar from '../../components/ProgressBar';
import './ReviewApplication.css';

const ReviewApplication = () => {
  // State for the Admin Decision form
  const [decisionData, setDecisionData] = useState({
    approvedAmount: '80000',
    interestRate: '8.5',
    tenure: '36',
    remarks: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDecisionData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="review-container">
      
      {/* 1. Top Header Banner */}
      <div className="review-header-card">
        <div className="profile-section">
          <div className="avatar-circle">{reviewData.applicant.initials}</div>
          <div className="profile-info">
            <h2>{reviewData.applicant.name}</h2>
            <div className="meta-info">
              <span>{reviewData.applicant.email}</span>
              <span>{reviewData.applicant.phone}</span>
              <span>Customer Since {reviewData.applicant.customerSince}</span>
            </div>
            <div className="meta-info bottom">
              <span>App ID : {reviewData.appId}</span>
              <span>Submitted : {reviewData.applicant.submittedDate}</span>
            </div>
          </div>
        </div>
        <div className="status-section">
          <span className="badge pending-badge">{reviewData.applicant.status}</span>
        </div>
      </div>

      {/* 2. Three Column Grid */}
      <div className="review-grid-3col">
        
        {/* Column 1: Application Details */}
        <div className="review-panel">
          <h3 className="panel-title">Application Details</h3>
          <div className="details-list">
            {Object.entries(reviewData.details).map(([key, value]) => (
              <div className="detail-item" key={key}>
                <span className="detail-label">{key}</span>
                <span className="detail-value">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Column 2: Documents & Risk */}
        <div className="review-panel">
          <h3 className="panel-title">Submitted Document</h3>
          <ul className="document-list">
            {reviewData.documents.map(doc => (
              <li key={doc.id} className={doc.verified ? 'verified' : 'missing'}>
                <span className="icon">{doc.verified ? '✓' : '✗'}</span>
                {doc.name}
              </li>
            ))}
          </ul>

          <h3 className="panel-title risk-title">Risk Assessment</h3>
          <div className="risk-bars">
            {reviewData.risk.map(item => (
              <ProgressBar 
                key={item.id}
                label={item.label}
                percentage={item.percentage}
                variant={item.color}
              />
            ))}
          </div>
        </div>

        {/* Column 3: Admin Decision Form */}
        <div className="review-panel">
          <h3 className="panel-title">Admin Decision</h3>
          
          <div className="decision-form">
            <Input 
              label="Approved Amount (LKR)" 
              name="approvedAmount" 
              type="number" 
              value={decisionData.approvedAmount} 
              onChange={handleInputChange} 
            />
            
            <div className="form-row">
              <Input 
                label="Interest Rate (%)" 
                name="interestRate" 
                type="number" 
                value={decisionData.interestRate} 
                onChange={handleInputChange} 
              />
              <Input 
                label="Tenure (Month)" 
                name="tenure" 
                type="number" 
                value={decisionData.tenure} 
                onChange={handleInputChange} 
              />
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

            <div className="decision-actions">
              <Button variant="success" className="decision-btn">Approved Application</Button>
              <Button variant="danger" className="decision-btn">Rejected Application</Button>
              <Button variant="warning" className="decision-btn outline-warning">Pending Application</Button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ReviewApplication;