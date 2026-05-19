import { useState } from 'react';
import { Link } from 'react-router-dom';
import { allApplications } from '../../data/mockData';
import Button from '../../components/Button';
import './LoanApplications.css';

const tabs = ["All Applications", "Pending", "Approved", "Rejected"];

const LoanApplications = () => {
  // State to track the currently active tab
  const [activeTab, setActiveTab] = useState("All Applications");
  // State for a simple search bar
  const [searchTerm, setSearchTerm] = useState("");

  // 1. Filter by Tab
  let filteredData = allApplications;
  if (activeTab !== "All Applications") {
    filteredData = allApplications.filter(app => app.status === activeTab);
  }

  // 2. Then Filter by Search Term
  if (searchTerm) {
    filteredData = filteredData.filter(app => 
      app.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      app.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

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
            onChange={(e) => setSearchTerm(e.target.value)}
            className="queue-search"
          />
        </div>
      </div>

      <div className="queue-card">
        {/* Custom Tabs */}
        <div className="queue-tabs">
          {tabs.map(tab => (
            <button 
              key={tab}
              className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* The Data Table */}
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
              {filteredData.length > 0 ? (
                filteredData.map(app => (
                  <tr key={app.id}>
                    <td className="app-id">{app.id}</td>
                    <td className="app-name">{app.name}</td>
                    <td>{app.date}</td>
                    <td>{app.type}</td>
                    <td className="app-amount">{app.amount}</td>
                    <td>
                      <span className={`status-badge ${app.status.toLowerCase()}`}>
                        {app.status}
                      </span>
                    </td>
                    <td>
                      {app.status === "Pending" ? (
                        /* If Pending, give them a primary button that links to the Review page! */
                        <Link to="/admin/review" className="action-link">
                          <Button variant="primary" className="sm-btn">Review</Button>
                        </Link>
                      ) : (
                        /* Otherwise, just a ghost link to view details */
                        <Link to="#view" className="view-link">View Details</Link>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="empty-state">No applications found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LoanApplications;