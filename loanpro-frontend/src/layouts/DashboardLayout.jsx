import { Outlet } from 'react-router-dom';
// We will build these two components next!
import Sidebar from './Sidebar'; 
import TopNav from './TopNav';
import './DashboardLayout.css';

const DashboardLayout = () => {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="main-content">
        <TopNav />
        <div className="page-content">
          {/* Outlet is where pages like Wallet or AdminDashboard will be injected */}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;