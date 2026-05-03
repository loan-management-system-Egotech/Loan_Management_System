import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import Login from './pages/auth/Login';
// (We will import these as we build them)
// import Register from './pages/auth/Register';
// import Wallet from './pages/customer/Wallet';
// import AdminDashboard from './pages/admin/AdminDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        {/* Auth Routes (Uses the blank AuthLayout) */}
        <Route element={<AuthLayout />}>
          {/* When the user goes to /login, show the Login page */}
          <Route path="/login" element={<Login />} />
          {/* <Route path="/register" element={<Register />} /> */}
        </Route>

        {/* Dashboard Routes (Uses the DashboardLayout with Sidebar) */}
        <Route element={<DashboardLayout />}>
           {/* Temporary placeholder until we build the Dashboards */}
          <Route path="/dashboard" element={<div>Dashboard Coming Soon</div>} />
          {/* <Route path="/wallet" element={<Wallet />} /> */}
        </Route>

        {/* Catch-all: Redirect any unknown URLs to the login page */}
        <Route path="*" element={<Navigate to="/login" replace />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;