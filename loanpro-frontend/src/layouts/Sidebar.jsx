import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const navItems = [
  { path: '/',             label: 'Dashboard',    icon: '📊' },
  { path: '/wallet',       label: 'My Wallet',    icon: '💳' },
  { path: '/apply',        label: 'Apply for Loan', icon: '📝' },
  { path: '/users',        label: 'Users',        icon: '👥' },
];

function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && <div className="sidebar-backdrop" onClick={onClose} />}

      <aside className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}>
        {/* Brand */}
        <div className="sidebar__brand">
          <div className="sidebar__logo">LP</div>
          <span className="sidebar__brand-text">LoanPro</span>
        </div>

        {/* Navigation */}
        <nav className="sidebar__nav">
          <ul className="sidebar__list">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.path === '/'}
                  className={({ isActive }) =>
                    `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
                  }
                  onClick={onClose}
                >
                  <span className="sidebar__link-icon">{item.icon}</span>
                  <span className="sidebar__link-label">{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="sidebar__footer">
          <div className="sidebar__user">
            <div className="sidebar__avatar">A</div>
            <div className="sidebar__user-info">
              <span className="sidebar__user-name">Admin</span>
              <span className="sidebar__user-role">Manager</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
