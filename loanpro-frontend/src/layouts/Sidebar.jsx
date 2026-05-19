import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import './Sidebar.css';

const Sidebar = () => {
  // Bring in the logout function and the navigator
  const { logout } = useAuth();
  const navigate = useNavigate();

  // The function that runs when they click Logout
  const handleLogout = () => {
    logout(); // Clears the user from our global state
    navigate('/login'); // Kicks them back to the login page
  };

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
      </nav>

      {/* Footer Area */}
      <div className="sidebar-footer">
        <NavLink to="/profile" className="nav-item">Profile</NavLink>
        <NavLink to="/support" className="nav-item">Help & Support</NavLink>
        
        {/* The New Logout Button */}
        <button onClick={handleLogout} className="nav-item logout-btn">
          Log Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;