import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import './Sidebar.css';

// Nav links per role. Admin and customer see different sections.
const CUSTOMER_LINKS = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/loans', label: 'My Loans' },
  { to: '/apply', label: 'Apply For Loan' },
  { to: '/schedule', label: 'Repayment Schedule' },
  { to: '/history', label: 'Payment History' },
  { to: '/notifications', label: 'Notifications' },
  { to: '/wallet', label: 'Wallet' },
];

const ADMIN_LINKS = [
  { to: '/admin/dashboard', label: 'Dashboard' },
  { to: '/admin/applications', label: 'Loan Applications' },
  { to: '/admin/users', label: 'Users' },
];

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const isAdmin = String(user?.role).toUpperCase() === 'ADMIN';
  const links = isAdmin ? ADMIN_LINKS : CUSTOMER_LINKS;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="loanpro-sidebar">
      {/* Brand Logo Area */}
      <div className="sidebar-brand">
        <h1>LoanPro</h1>
        {isAdmin && <span className="brand-role">Admin</span>}
      </div>

      {/* Navigation Links */}
      <nav className="sidebar-nav">
        {links.map((link) => (
          <NavLink key={link.to} to={link.to} className="nav-item">
            {link.label}
          </NavLink>
        ))}
      </nav>

      {/* Footer Area */}
      <div className="sidebar-footer">
        <NavLink to="/profile" className="nav-item">Profile</NavLink>
        <button onClick={handleLogout} className="nav-item logout-btn">
          Log Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
