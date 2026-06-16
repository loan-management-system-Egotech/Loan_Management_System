# LoanPro — REST API Reference

Base URL: `http://localhost:8080/api`

All endpoints return JSON. Unless marked **Public**, every request requires a
JWT in the `Authorization` header:

```
Authorization: Bearer <token>
```

Tokens are obtained from `/auth/login` or `/auth/register` and are valid for
24 hours (`app.jwt.expiration-ms=86400000`).

## Roles

| Marker | Meaning |
|--------|---------|
| **Public** | No authentication required |
| **Auth** | Any authenticated user |
| **Customer** | Authenticated `CUSTOMER` (data scoped to the caller) |
| **Admin** | Requires `ROLE_ADMIN` |

## Error format

All errors are returned by the global exception handler in this shape:

```json
{
  "success": false,
  "message": "Loan application not found with ID: APP-9999",
  "timestamp": "2026-06-16T10:30:00",
  "status": 404
}
```

| Status | When |
|--------|------|
| 400 | Validation failure, bad input, insufficient wallet funds |
| 401 | Missing/invalid/expired token |
| 403 | Authenticated but lacking the required role |
| 404 | Resource not found |
| 413 | Uploaded file exceeds the size limit |
| 500 | Unexpected server error |

---

## 1. Authentication — `/api/auth`

### `POST /auth/register` — **Public**
Registers a new `CUSTOMER` and auto-creates their wallet.

```json
{
  "fullName": "Nimal Perera",
  "email": "nimal@gmail.com",
  "password": "securePass123",
  "confirmPassword": "securePass123"
}
```

### `POST /auth/login` — **Public**
```json
{ "email": "nimal@gmail.com", "password": "securePass123" }
```

**Response** (both register and login):
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "user": { "id": 1, "name": "Nimal Perera", "email": "nimal@gmail.com", "role": "CUSTOMER" }
}
```

---

## 2. User Profile — `/api/users`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/users/profile` | Auth | Current user's profile |
| PUT | `/users/profile` | Auth | Update profile fields |
| PUT | `/users/password` | Auth | Change password |
| PUT | `/users/notifications-preferences` | Auth | Update email/SMS preferences |

**`PUT /users/profile`**
```json
{
  "fullName": "Nimal Perera",
  "phone": "+94 77 123 4567",
  "address": "123 Galle Road, Colombo 03",
  "nic": "901234567V",
  "gender": "Male",
  "maritalStatus": "Single",
  "city": "Colombo",
  "postalCode": "00300"
}
```

**`PUT /users/password`**
```json
{ "currentPassword": "oldPass123", "newPassword": "newPass456" }
```

**`PUT /users/notifications-preferences`**
```json
{ "emailAlerts": true, "smsNotifications": false }
```

---

## 3. Loan Applications — `/api`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/loan-types` | Auth | List active loan products |
| POST | `/applications` | Customer | Submit a loan application |
| GET | `/applications/my` | Customer | Caller's own applications |
| GET | `/applications/{id}` | Auth | Single application detail |

**`POST /applications`** (matches the 5-step form):
```json
{
  "loanType": "personal",
  "amountRequested": 100000,
  "purpose": "Home Renovation",
  "tenureMonths": 36,
  "fullName": "Nimal Perera",
  "dob": "1990-05-15",
  "address": "123 Galle Road",
  "city": "Colombo",
  "email": "nimal@gmail.com",
  "nic": "901234567V",
  "gender": "Male",
  "maritalStatus": "Single",
  "postalCode": "00300",
  "phone": "+94771234567",
  "empStatus": "Full-Time",
  "jobTitle": "Software Engineer",
  "workAddress": "456 Tech Park",
  "empName": "ABC Corp",
  "yearsEmp": 5,
  "workPhone": "+94112345678",
  "grossSalary": 120000,
  "netSalary": 95000,
  "existingEmis": 5000,
  "creditCard": 3000
}
```
Required: `loanType`, `amountRequested`, `purpose`, `tenureMonths`, `fullName`, `dob`, `grossSalary`.

---

## 4. Documents — `/api`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/applications/{appId}/documents` | Customer | Upload a document (multipart) |
| GET | `/applications/{appId}/documents` | Auth | List documents for an application |
| GET | `/documents/{id}/download` | Auth | Download a document file |

**`POST /applications/{appId}/documents`** — `multipart/form-data`:
- `file` — the binary file
- `documentType` — one of `NIC_PASSPORT`, `PROOF_OF_INCOME`, `BANK_STATEMENT`, `TAX_RETURN`

Files are stored on disk under the configured `app.upload.dir`; only metadata
is persisted to the `documents` table.

---

## 5. Admin — Application Review — `/api/admin`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/admin/applications` | Admin | List all applications (filterable) |
| GET | `/admin/applications/{id}` | Admin | Full application for review |
| PUT | `/admin/applications/{id}/decision` | Admin | Approve / reject / hold |

**`GET /admin/applications`** — optional query params: `status`
(`PENDING`/`UNDER_REVIEW`/`APPROVED`/`REJECTED`), `search`.

**`PUT /admin/applications/{id}/decision`**
```json
{
  "decision": "APPROVED",
  "approvedAmount": 80000,
  "interestRate": 8.5,
  "tenure": 36,
  "remarks": "Good credit history. Approved."
}
```
`decision` is an `ApplicationStatus` (`APPROVED` / `REJECTED` / `UNDER_REVIEW`).
On `APPROVED` the service creates a `Loan`, computes the EMI, generates the full
repayment schedule, and sends the customer a notification.

---

## 6. Loans — `/api/loans`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/loans/active` | Customer | Caller's most recent active loan |
| GET | `/loans/active/all` | Customer | All of the caller's active loans |
| GET | `/loans/{id}` | Auth | Loan detail |
| GET | `/loans/{id}/schedule` | Auth | Amortization schedule |
| GET | `/loans/{id}/payments` | Auth | Payments made against the loan |

**`GET /loans/active`** (example):
```json
{
  "id": "LN-84729",
  "type": "Personal Loan",
  "status": "ACTIVE",
  "principal": 80000,
  "totalPayable": 85600,
  "amountPaid": 35000,
  "paidPercentage": 40,
  "interestRate": 8.5,
  "tenure": 24,
  "startDate": "2024-01-15",
  "nextEmi": { "amount": 3566, "dueDate": "2024-05-15", "daysLeft": 12 }
}
```

---

## 7. Repayment — `/api`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/loans/{id}/pay` | Customer | Pay the next EMI |
| GET | `/payments/history` | Customer | All of the caller's payments |

**`POST /loans/{id}/pay`**
```json
{ "amount": 3566 }
```
Debits the wallet, records a `Payment`, advances the repayment schedule
(current → `PAID`, next → `NEXT_DUE`), updates the loan, writes a wallet
`Transaction`, and notifies the customer. Completing the last installment sets
the loan to `COMPLETED`.

---

## 8. Wallet — `/api/wallet`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/wallet` | Customer | Wallet summary |
| POST | `/wallet/topup` | Customer | Add funds |
| POST | `/wallet/transfer` | Customer | Transfer to a saving goal / target |
| POST | `/wallet/withdraw` | Customer | Withdraw funds |
| GET | `/wallet/transactions` | Customer | Recent transactions |
| GET | `/wallet/spending-breakdown` | Customer | Spending grouped by category |
| GET | `/wallet/saving-goals` | Customer | List saving goals |
| POST | `/wallet/saving-goals` | Customer | Create a saving goal |

**`POST /wallet/topup`**
```json
{ "amount": 10000, "paymentMethod": "CARD" }
```

**`POST /wallet/transfer`**
```json
{ "amount": 5000, "target": "SAVINGS", "savingGoalId": 3 }
```

**`POST /wallet/withdraw`**
```json
{ "amount": 2500, "paymentMethod": "BANK" }
```

**`POST /wallet/saving-goals`**
```json
{ "label": "Emergency Fund", "targetAmount": 100000, "color": "#6366f1" }
```

---

## 9. Notifications — `/api/notifications`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/notifications` | Auth | List the caller's notifications |
| GET | `/notifications/unread-count` | Auth | Unread count for the nav badge |
| PUT | `/notifications/{id}/read` | Auth | Mark one as read |
| PUT | `/notifications/read-all` | Auth | Mark all as read |

```json
{
  "id": 1,
  "title": "Payment Successful",
  "message": "Your EMI of LKR 3,566 was received.",
  "type": "SUCCESS",
  "isRead": false,
  "createdAt": "2026-06-16T08:30:00"
}
```

---

## 10. Admin Dashboard & Users — `/api/admin`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/admin/dashboard/stats` | Admin | Summary stat cards |
| GET | `/admin/dashboard/charts` | Admin | Chart aggregates (disbursements/collections) |
| GET | `/admin/users` | Admin | List all users |
| PUT | `/admin/users/{id}/role` | Admin | Change a user's role |

**`PUT /admin/users/{id}/role`** — body is the new role, e.g.:
```json
{ "role": "ADMIN" }
```

---

## Endpoint summary

| # | Method | Endpoint | Access |
|---|--------|----------|--------|
| 1 | POST | `/auth/register` | Public |
| 2 | POST | `/auth/login` | Public |
| 3 | GET | `/users/profile` | Auth |
| 4 | PUT | `/users/profile` | Auth |
| 5 | PUT | `/users/password` | Auth |
| 6 | PUT | `/users/notifications-preferences` | Auth |
| 7 | GET | `/loan-types` | Auth |
| 8 | POST | `/applications` | Customer |
| 9 | GET | `/applications/my` | Customer |
| 10 | GET | `/applications/{id}` | Auth |
| 11 | POST | `/applications/{appId}/documents` | Customer |
| 12 | GET | `/applications/{appId}/documents` | Auth |
| 13 | GET | `/documents/{id}/download` | Auth |
| 14 | GET | `/admin/applications` | Admin |
| 15 | GET | `/admin/applications/{id}` | Admin |
| 16 | PUT | `/admin/applications/{id}/decision` | Admin |
| 17 | GET | `/loans/active` | Customer |
| 18 | GET | `/loans/active/all` | Customer |
| 19 | GET | `/loans/{id}` | Auth |
| 20 | GET | `/loans/{id}/schedule` | Auth |
| 21 | GET | `/loans/{id}/payments` | Auth |
| 22 | POST | `/loans/{id}/pay` | Customer |
| 23 | GET | `/payments/history` | Customer |
| 24 | GET | `/wallet` | Customer |
| 25 | POST | `/wallet/topup` | Customer |
| 26 | POST | `/wallet/transfer` | Customer |
| 27 | POST | `/wallet/withdraw` | Customer |
| 28 | GET | `/wallet/transactions` | Customer |
| 29 | GET | `/wallet/spending-breakdown` | Customer |
| 30 | GET | `/wallet/saving-goals` | Customer |
| 31 | POST | `/wallet/saving-goals` | Customer |
| 32 | GET | `/notifications` | Auth |
| 33 | GET | `/notifications/unread-count` | Auth |
| 34 | PUT | `/notifications/{id}/read` | Auth |
| 35 | PUT | `/notifications/read-all` | Auth |
| 36 | GET | `/admin/dashboard/stats` | Admin |
| 37 | GET | `/admin/dashboard/charts` | Admin |
| 38 | GET | `/admin/users` | Admin |
| 39 | PUT | `/admin/users/{id}/role` | Admin |
