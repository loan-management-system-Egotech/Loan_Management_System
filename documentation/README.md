# LoanPro — Documentation

LoanPro is a web-based Loan Management System covering the full lifecycle of a
loan: application, document upload, admin review/approval, disbursement,
amortization, EMI repayment, and an in-app wallet. It has a React (Vite)
frontend and a Spring Boot + PostgreSQL backend with JWT authentication.

## Contents

| Document | What's inside |
|----------|---------------|
| [`API.md`](API.md) | Complete REST API reference (39 endpoints, request/response shapes) |
| [`../database/README.md`](../database/README.md) | Schema, ER diagram, and enumerations |
| [`../database/schema.sql`](../database/schema.sql) | PostgreSQL DDL |
| [`../database/seed_data.sql`](../database/seed_data.sql) | Default accounts and loan types |

Interactive API docs are also served by Swagger UI at
`http://localhost:8080/swagger-ui.html` when the backend is running.

## Tech stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18 + Vite, React Router, Axios |
| Backend | Java 17, Spring Boot 3.3.0 (Web, Data JPA, Security, Validation) |
| Auth | JWT (stateless), BCrypt password hashing |
| Database | PostgreSQL 15+ (H2 in-memory profile for local dev) |
| API docs | springdoc-openapi (Swagger UI) |

## Architecture

```
React (Vite, :5173)
      │  REST + JWT (Authorization: Bearer)
      ▼
Spring Boot API (:8080, /api)
  Controller → Service → Repository (Spring Data JPA)
      │
      ▼
PostgreSQL  (or H2 in-memory for dev)
```

The backend is a layered application:

- **controller/** — REST endpoints, validation, role checks (`@PreAuthorize`)
- **service/** — business logic (auth, applications, EMI calculation, wallet, etc.)
- **repository/** — Spring Data JPA interfaces
- **entity/** — JPA entities (11 tables); see the database docs
- **dto/** — request/response objects (entities are never exposed directly)
- **config/** — Spring Security, JWT filter, CORS
- **exception/** — custom exceptions + `GlobalExceptionHandler`

## Running locally

### Prerequisites
- Java 17, Maven 3.9+
- Node.js 18+
- PostgreSQL 15+ (or use the bundled H2 profile — no DB install needed)

### Backend — PostgreSQL (default profile)
1. Create the database: `createdb loanpro_db`
2. Set credentials in `backend/loanpro-backend/src/main/resources/application.properties`
   (`spring.datasource.username` / `password`).
3. Run:
   ```bash
   mvn -f backend/loanpro-backend/pom.xml spring-boot:run
   ```
   Hibernate creates the schema (`ddl-auto=update`) and `data.sql` seeds the
   admin/customer accounts and loan types.

### Backend — H2 (no database install)
```bash
mvn -f backend/loanpro-backend/pom.xml "-Dspring-boot.run.profiles=h2" spring-boot:run
```
Uses an in-memory H2 database (`data-h2.sql` seed); the H2 console is at
`http://localhost:8080/h2-console`. Data is reset on every restart.

### Frontend
```bash
cd loanpro-frontend
npm install
npm run dev          # http://localhost:5173
```
The API base URL defaults to `http://localhost:8080/api`; override it by copying
`.env.example` to `.env` and setting `VITE_API_URL`.

## Default accounts

| Email | Password | Role |
|-------|----------|------|
| `admin@loanpro.com` | `admin123` | ADMIN |
| `nimal@gmail.com` | `customer123` | CUSTOMER |

## Core flows

- **Customer:** register → apply for a loan (5-step form + document upload) →
  track status → once approved, view the loan, repayment schedule, and pay EMIs
  from the wallet.
- **Admin:** review submitted applications → approve/reject with terms
  (amount, rate, tenure). Approval auto-creates the loan, computes the EMI, and
  generates the amortization schedule.

### EMI calculation
Standard reducing-balance amortization:

```
EMI = [P × r × (1+r)^n] / [(1+r)^n − 1]

P = principal,  r = monthly rate (annual / 12 / 100),  n = tenure in months
```

For each installment: interest = remaining balance × r, principal = EMI −
interest, remaining balance reduces by the principal component.

## Security notes

- Stateless JWT auth; tokens expire after 24h.
- `/api/auth/**`, Swagger, and the H2 console are public; everything else
  requires authentication. `/api/admin/**` requires `ROLE_ADMIN`.
- Passwords are BCrypt-hashed; the JWT secret and DB credentials in
  `application.properties` are development defaults and **must** be overridden
  (e.g. via environment variables) before any non-local deployment.
