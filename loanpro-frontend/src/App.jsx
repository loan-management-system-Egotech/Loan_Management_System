import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Layouts
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Auth Pages
import Login from './pages/auth/Login';

// Customer Pages
import CustomerDashboard from './pages/customer/CustomerDashboard';
import Wallet from './pages/customer/Wallet';
import ApplyForLoan from './pages/customer/ApplyForLoan';
import MyLoans from './pages/customer/MyLoans';
import UserProfile from './pages/customer/UserProfile';
import RepaymentSchedule from './pages/customer/RepaymentSchedule';
import PaymentHistory from './pages/customer/PaymentHistory';
import Notifications from './pages/customer/Notifications';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ReviewApplication from './pages/admin/ReviewApplication';
import LoanApplications from './pages/admin/LoanApplications';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          
          {/* Public Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
          </Route>

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              {/* Customer Routes */}
              <Route path="/dashboard" element={<CustomerDashboard />} />
              <Route path="/wallet" element={<Wallet />} />
              <Route path="/apply" element={<ApplyForLoan />} />
              <Route path="/loans" element={<MyLoans />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/schedule" element={<RepaymentSchedule />} />
              <Route path="/history" element={<PaymentHistory />} />
              <Route path="/notifications" element={<Notifications />} />
              
              {/* Admin Routes */}
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/applications" element={<LoanApplications />} />
              <Route path="/admin/review" element={<ReviewApplication />} />
            </Route>
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/login" replace />} />
          
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;