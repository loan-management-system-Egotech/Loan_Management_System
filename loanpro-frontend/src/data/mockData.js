export const walletData = {
  balance: "24,500.00",
  walletId: "WLT-2024-ADS",
  totalCredited: "85,000",
  totalDebited: "60,500",
  pending: "2,340",
  saved: "15,000"
};

export const recentTransactions = [
  { id: "TXN-0020", description: "EMI-Payment - personal", type: "Personal", amount: "-LKR 2340.50", status: "Success", isCredit: false },
  { id: "TXN-0019", description: "Wallet Top-Up via bank", type: "Business", amount: "LKR 10,000.00", status: "Success", isCredit: true },
  { id: "TXN-0018", description: "EMI-Payment - personal", type: "Personal", amount: "-LKR 3,890.00", status: "Success", isCredit: false },
  { id: "TXN-0017", description: "Transfer to saving goal", type: "Business", amount: "-LKR 5000.00", status: "Success", isCredit: false },
  { id: "TXN-0016", description: "Cashback rewards", type: "Personal", amount: "LKR 250.00", status: "Success", isCredit: true },
];

// ... keep your existing walletData and recentTransactions ...

export const spendingBreakdown = [
  { id: 1, label: "EMI Payment", percentage: 62, color: "primary" },
  { id: 2, label: "Top-Up", percentage: 20, color: "success" },
  { id: 3, label: "Transfer", percentage: 11, color: "warning" },
  { id: 4, label: "Others", percentage: 7, color: "danger" }
];

export const savingGoals = [
  { id: 1, label: "Emergency Fund", current: "8,000", target: "20,000", percentage: 40, color: "primary" },
  { id: 2, label: "Vacation 2026", current: "7,000", target: "15,000", percentage: 46, color: "success" }
];

// ... existing mock data ...

export const loanTypes = [
  { id: "personal", title: "Personal Loan", limit: "Up to LKR 500,000", desc: "For Personal expenses, medical, educational" },
  { id: "business", title: "Business Loan", limit: "Up to LKR 2,000,000", desc: "For Business Growth" },
  { id: "home", title: "Home Loan", limit: "Up to LKR 5,000,000", desc: "For Home purchase or renovation" },
  { id: "vehicle", title: "Vehicle Loan", limit: "Up to LKR 800,000", desc: "For vehicle" }
];

// ... existing mock data ...

export const reviewData = {
  appId: "#A-0234",
  applicant: {
    initials: "NP",
    name: "Nimal Perera",
    email: "nimal@gmail.com",
    phone: "+94 7 111 2345",
    customerSince: "Jan 2024",
    submittedDate: "Apr 10, 2026 at 10.30 a.m",
    status: "Pending Review"
  },
  details: {
    "Loan Type": "Personal Loan",
    "Amount Requested": "LKR 80,000",
    "Purpose": "Home Renovation",
    "Tenure": "36 Month",
    "Interest Rate": "8.5% p.a.",
    "Monthly EMI": "LKR 2,522",
    "Monthly Income": "LKR 32,000",
    "Employment": "ABC Corp",
    "DTI Ratio": "42%",
    "Credit Score": "720"
  },
  documents: [
    { id: 1, name: "NIC/Passport Copy", verified: true },
    { id: 2, name: "Bank Statement (3 Month)", verified: true },
    { id: 3, name: "Salary Certificate", verified: true },
    { id: 4, name: "Tax Return (2025)", verified: false }
  ],
  risk: [
    { id: 1, label: "Income Stability", percentage: 80, color: "success" },
    { id: 2, label: "Debt -To - Income", percentage: 57, color: "danger" },
    { id: 3, label: "Credit History", percentage: 72, color: "primary" },
    { id: 4, label: "Employment", percentage: 90, color: "success" }
  ]
};

// ... existing mock data ...

export const adminStats = [
  { id: 1, title: "Active Loans", value: "1240", trend: "+8% this month", type: "positive" },
  { id: 2, title: "Total Disbursed", value: "LKR 650M", trend: "+18% YTD", type: "positive" },
  { id: 3, title: "Pending Review", value: "23", trend: "Needs Attention", type: "warning" },
  { id: 4, title: "Default Rate", value: "0.8%", trend: "-0.2% improved", type: "positive" }
];

export const adminCharts = {
  // We use percentages (0-100) to easily set the CSS height of the bars
  barChart: [
    { month: 'Oct', disbursed: 40, collected: 60 },
    { month: 'Nov', disbursed: 55, collected: 70 },
    { month: 'Dec', disbursed: 80, collected: 65 },
    { month: 'Jan', disbursed: 95, collected: 85 },
    { month: 'Feb', disbursed: 70, collected: 90 },
  ]
};

export const recentApplications = [
  { id: 1, applicant: "Nimal Perera", type: "Personal", amount: "LKR 8,000", score: 720, status: "Pending" },
  { id: 2, applicant: "Kamani Silva", type: "Business", amount: "LKR 25,000", score: 695, status: "Under Review" },
  { id: 3, applicant: "Ravi Kumara", type: "Home Loan", amount: "LKR 150,000", score: 740, status: "Approved" }
];

// ... existing mock data ...

export const allApplications = [
  { id: "APP-0234", name: "Nimal Perera", date: "Oct 12, 2024", type: "Personal Loan", amount: "LKR 80,000", status: "Pending" },
  { id: "APP-0233", name: "Kamani Silva", date: "Oct 11, 2024", type: "Business Loan", amount: "LKR 250,000", status: "Approved" },
  { id: "APP-0232", name: "Ravi Kumara", date: "Oct 10, 2024", type: "Home Loan", amount: "LKR 1,500,000", status: "Rejected" },
  { id: "APP-0231", name: "Kasun Kalhara", date: "Oct 09, 2024", type: "Vehicle Loan", amount: "LKR 400,000", status: "Pending" },
  { id: "APP-0230", name: "Amala Fernando", date: "Oct 08, 2024", type: "Personal Loan", amount: "LKR 50,000", status: "Approved" }
];


// ... existing mock data ...

export const myActiveLoan = {
  id: "LN-84729",
  type: "Personal Loan",
  status: "Active",
  principal: "80,000",
  totalPayable: "85,600",
  amountPaid: "35,000",
  paidPercentage: 40,
  interestRate: "8.5%",
  tenure: "24 Months",
  startDate: "Jan 15, 2024",
  nextEmi: {
    amount: "3,566",
    dueDate: "May 15, 2024",
    daysLeft: 12
  }
};

export const loanPaymentHistory = [
  { id: "TXN-0991", date: "Apr 15, 2024", amount: "LKR 3,566", principal: "LKR 2,900", interest: "LKR 666", status: "Paid" },
  { id: "TXN-0842", date: "Mar 15, 2024", amount: "LKR 3,566", principal: "LKR 2,850", interest: "LKR 716", status: "Paid" },
  { id: "TXN-0711", date: "Feb 15, 2024", amount: "LKR 3,566", principal: "LKR 2,800", interest: "LKR 766", status: "Paid" },
  { id: "TXN-0650", date: "Jan 15, 2024", amount: "LKR 3,566", principal: "LKR 2,750", interest: "LKR 816", status: "Paid" }
];

// ... existing mock data ...

export const amortizationSchedule = [
  { month: 1, date: "Jan 15, 2024", emi: "3,566", principal: "2,750", interest: "816", balance: "77,250", status: "Paid" },
  { month: 2, date: "Feb 15, 2024", emi: "3,566", principal: "2,800", interest: "766", balance: "74,450", status: "Paid" },
  { month: 3, date: "Mar 15, 2024", emi: "3,566", principal: "2,850", interest: "716", balance: "71,600", status: "Paid" },
  { month: 4, date: "Apr 15, 2024", emi: "3,566", principal: "2,900", interest: "666", balance: "68,700", status: "Paid" },
  // This is the "Next Due" payment
  { month: 5, date: "May 15, 2024", emi: "3,566", principal: "2,950", interest: "616", balance: "65,750", status: "Next Due" },
  // Future payments
  { month: 6, date: "Jun 15, 2024", emi: "3,566", principal: "3,000", interest: "566", balance: "62,750", status: "Pending" },
  { month: 7, date: "Jul 15, 2024", emi: "3,566", principal: "3,050", interest: "516", balance: "59,700", status: "Pending" },
  { month: 8, date: "Aug 15, 2024", emi: "3,566", principal: "3,100", interest: "466", balance: "56,600", status: "Pending" }
];

// ... existing mock data ...

export const userNotifications = [
  { id: 1, title: "Payment Successful", message: "Your EMI of LKR 3,566 was received.", time: "2 hours ago", unread: true, type: "success" },
  { id: 2, title: "Upcoming EMI", message: "Your next payment is due in 3 days.", time: "1 day ago", unread: true, type: "warning" },
  { id: 3, title: "Application Approved", message: "Your Personal Loan was approved!", time: "Oct 12, 2024", unread: false, type: "info" }
];