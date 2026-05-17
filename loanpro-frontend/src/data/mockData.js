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