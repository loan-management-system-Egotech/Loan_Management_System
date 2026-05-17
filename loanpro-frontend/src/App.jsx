import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import Login from './pages/auth/Login';
import Wallet from './pages/customer/Wallet';
import ApplyForLoan from './pages/customer/ApplyForLoan';
import ReviewApplication from './pages/admin/ReviewApplication';
// (We will import these as we build them)
// import Register from './pages/auth/Register';
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

        {/* Dashboard Routes */}
        <Route element={<DashboardLayout />}>
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/apply" element={<ApplyForLoan />} />
          <Route path="/admin/review" element={<ReviewApplication />} />
          {/* Temporary redirect if they just go to /dashboard */}
          <Route path="/dashboard" element={<Navigate to="/wallet" replace />} />
        </Route>

        {/* Catch-all: Redirect any unknown URLs to the login page */}
        <Route path="*" element={<Navigate to="/login" replace />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;