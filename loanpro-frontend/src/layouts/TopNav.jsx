import { useLocation } from 'react-router-dom';
import './TopNav.css';

const pageTitles = {
  '/':       'Dashboard',
  '/wallet': 'My Wallet',
  '/apply':  'Apply for Loan',
  '/users':  'User Management',
};

function TopNav({ onMenuToggle }) {
  const location = useLocation();
  const title = pageTitles[location.pathname] || 'LoanPro';

  return (
    <header className="topnav">
      <div className="topnav__left">
        <button className="topnav__menu-btn" onClick={onMenuToggle} aria-label="Toggle menu">
          <span className="topnav__hamburger" />
        </button>
        <h1 className="topnav__title">{title}</h1>
      </div>

      <div className="topnav__right">
        {/* Search */}
        <div className="topnav__search">
          <span className="topnav__search-icon">🔍</span>
          <input
            type="text"
            className="topnav__search-input"
            placeholder="Search..."
            id="global-search"
          />
        </div>

        {/* Notifications */}
        <button className="topnav__icon-btn" id="notifications-btn" aria-label="Notifications">
          🔔
          <span className="topnav__badge">3</span>
        </button>

        {/* Profile */}
        <button className="topnav__icon-btn" id="profile-btn" aria-label="Profile">
          👤
        </button>
      </div>
    </header>
  );
}

export default TopNav;
