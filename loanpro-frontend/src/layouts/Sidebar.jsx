import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <aside className="loanpro-sidebar">
      {/* Brand Logo Area */}
      <div className="sidebar-brand">
        <h1>LoanPro</h1>
      </div>

      {/* Navigation Links */}
      <nav className="sidebar-nav">
        {/* We use NavLink instead of <a> tags so the page doesn't refresh! */}
        <NavLink to="/dashboard" className="nav-item">Dashboard</NavLink>
        <NavLink to="/loans" className="nav-item">My Loans</NavLink>
        <NavLink to="/apply" className="nav-item">Apply For Loan</NavLink>
        <NavLink to="/schedule" className="nav-item">Repayment Schedule</NavLink>
        <NavLink to="/history" className="nav-item">Payment History</NavLink>
        <NavLink to="/notifications" className="nav-item">Notifications</NavLink>
        <NavLink to="/wallet" className="nav-item">Wallet</NavLink>
        <NavLink to="/profile" className="nav-item">Profile</NavLink>
      </nav>

      {/* Footer Area */}
      <div className="sidebar-footer">
        <NavLink to="/support" className="nav-item">Help & Support</NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;