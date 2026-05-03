/**
 * Mock Data for LoanPro UI
 * Replace these with real API calls once the backend is ready.
 */

// ─── Dashboard Stats ───────────────────────────────────
export const dashboardStats = [
  { label: 'Total Loans',    value: '1,284',  change: '+12%', icon: '💰', color: '#3b5bdb' },
  { label: 'Active Clients', value: '847',     change: '+5%',  icon: '👥', color: '#0ca678' },
  { label: 'Payments Today', value: '$52,400', change: '+18%', icon: '💳', color: '#f59f00' },
  { label: 'Overdue',        value: '23',      change: '-8%',  icon: '⚠️', color: '#e03131' },
];

// ─── Recent Loans ──────────────────────────────────────
export const recentLoans = [
  { id: 'LN-1042', customer: 'John Doe',      amount: '$15,000', status: 'Active',  date: '2026-05-02' },
  { id: 'LN-1041', customer: 'Jane Smith',    amount: '$8,500',  status: 'Pending', date: '2026-05-01' },
  { id: 'LN-1040', customer: 'Robert Wilson', amount: '$22,000', status: 'Active',  date: '2026-04-30' },
  { id: 'LN-1039', customer: 'Sarah Johnson', amount: '$5,200',  status: 'Closed',  date: '2026-04-29' },
  { id: 'LN-1038', customer: 'Mike Brown',    amount: '$12,750', status: 'Overdue', date: '2026-04-28' },
];

// ─── All Loans (Admin view) ───────────────────────────
export const allLoans = [
  { id: 'LN-1042', customer: 'John Doe',      amount: 15000, rate: 5.5, term: 24, status: 'Active',  date: '2026-05-02' },
  { id: 'LN-1041', customer: 'Jane Smith',    amount: 8500,  rate: 6.0, term: 12, status: 'Pending', date: '2026-05-01' },
  { id: 'LN-1040', customer: 'Robert Wilson', amount: 22000, rate: 4.8, term: 36, status: 'Active',  date: '2026-04-30' },
  { id: 'LN-1039', customer: 'Sarah Johnson', amount: 5200,  rate: 7.2, term: 6,  status: 'Closed',  date: '2026-04-29' },
  { id: 'LN-1038', customer: 'Mike Brown',    amount: 12750, rate: 5.0, term: 18, status: 'Overdue', date: '2026-04-28' },
];

// ─── Customers ─────────────────────────────────────────
export const customers = [
  { id: 'C-301', name: 'John Doe',      email: 'john@example.com',   phone: '(555) 123-4567', loans: 3, status: 'Active'   },
  { id: 'C-302', name: 'Jane Smith',    email: 'jane@example.com',   phone: '(555) 234-5678', loans: 1, status: 'Active'   },
  { id: 'C-303', name: 'Robert Wilson', email: 'robert@example.com', phone: '(555) 345-6789', loans: 2, status: 'Active'   },
  { id: 'C-304', name: 'Sarah Johnson', email: 'sarah@example.com',  phone: '(555) 456-7890', loans: 0, status: 'Inactive' },
  { id: 'C-305', name: 'Mike Brown',    email: 'mike@example.com',   phone: '(555) 567-8901', loans: 1, status: 'Active'   },
];

// ─── Payments ──────────────────────────────────────────
export const payments = [
  { id: 'PAY-2010', loanId: 'LN-1042', customer: 'John Doe',      amount: 650, method: 'Bank Transfer', date: '2026-05-03', status: 'Completed' },
  { id: 'PAY-2009', loanId: 'LN-1040', customer: 'Robert Wilson', amount: 720, method: 'Credit Card',   date: '2026-05-02', status: 'Completed' },
  { id: 'PAY-2008', loanId: 'LN-1038', customer: 'Mike Brown',    amount: 850, method: 'Cash',          date: '2026-05-01', status: 'Pending'   },
  { id: 'PAY-2007', loanId: 'LN-1042', customer: 'John Doe',      amount: 650, method: 'Bank Transfer', date: '2026-04-30', status: 'Completed' },
  { id: 'PAY-2006', loanId: 'LN-1041', customer: 'Jane Smith',    amount: 475, method: 'Online',        date: '2026-04-29', status: 'Failed'    },
];

// ─── Wallet / Customer Data ────────────────────────────
export const walletData = {
  balance: 24500.00,
  accountNumber: '****-****-****-4821',
  recentTransactions: [
    { id: 'TXN-001', type: 'Payment',    amount: -650,  date: '2026-05-03', description: 'Loan LN-1042 Monthly' },
    { id: 'TXN-002', type: 'Deposit',    amount: 2000,  date: '2026-05-01', description: 'Bank Transfer In'     },
    { id: 'TXN-003', type: 'Payment',    amount: -475,  date: '2026-04-29', description: 'Loan LN-1041 Monthly' },
    { id: 'TXN-004', type: 'Deposit',    amount: 5000,  date: '2026-04-25', description: 'Salary Deposit'       },
  ],
};

// ─── Loan Application Options ──────────────────────────
export const loanTypes = [
  { id: 'personal',  label: 'Personal Loan',  maxAmount: 50000,  minRate: 5.0,  maxTerm: 60 },
  { id: 'business',  label: 'Business Loan',  maxAmount: 200000, minRate: 4.5,  maxTerm: 120 },
  { id: 'education', label: 'Education Loan', maxAmount: 100000, minRate: 3.8,  maxTerm: 180 },
  { id: 'home',      label: 'Home Loan',      maxAmount: 500000, minRate: 3.2,  maxTerm: 360 },
];

// ─── Admin: User Management ───────────────────────────
export const users = [
  { id: 'U-101', name: 'Admin User',   email: 'admin@loanpro.com',  role: 'Admin',    status: 'Active',   lastLogin: '2026-05-03' },
  { id: 'U-102', name: 'John Doe',     email: 'john@example.com',   role: 'Customer', status: 'Active',   lastLogin: '2026-05-02' },
  { id: 'U-103', name: 'Jane Smith',   email: 'jane@example.com',   role: 'Customer', status: 'Active',   lastLogin: '2026-05-01' },
  { id: 'U-104', name: 'Risk Officer', email: 'risk@loanpro.com',   role: 'Admin',    status: 'Active',   lastLogin: '2026-04-30' },
  { id: 'U-105', name: 'Sarah Johnson',email: 'sarah@example.com',  role: 'Customer', status: 'Suspended',lastLogin: '2026-04-15' },
];

// ─── Current Logged-in User ────────────────────────────
export const currentUser = {
  id: 'U-101',
  name: 'Admin User',
  email: 'admin@loanpro.com',
  role: 'Admin',
  avatar: 'A',
};
