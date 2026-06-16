# LoanPro — Database

PostgreSQL 15+ schema for the LoanPro Loan Management System.

> The application runs with Hibernate `ddl-auto=update`, so tables are created
> automatically from the JPA entities on first startup. The files here are a
> hand-maintained mirror for documentation, manual provisioning, and review.

## Files

| File | Purpose |
|------|---------|
| [`schema.sql`](schema.sql) | Full DDL — all 11 tables, constraints, and indexes |
| [`seed_data.sql`](seed_data.sql) | Default admin/customer accounts, wallet, and loan types |

## Provisioning manually

```bash
createdb loanpro_db
psql -d loanpro_db -f database/schema.sql
psql -d loanpro_db -f database/seed_data.sql
```

If you instead let the app create the schema, only `seed_data.sql`/`data.sql`
is needed (Spring Boot runs `data.sql` automatically).

## Default accounts

| Email | Password | Role |
|-------|----------|------|
| `admin@loanpro.com` | `admin123` | ADMIN |
| `nimal@gmail.com` | `customer123` | CUSTOMER |

## Entity-Relationship Diagram

```mermaid
erDiagram
    USERS ||--o| WALLETS : has
    USERS ||--o{ LOAN_APPLICATIONS : submits
    USERS ||--o{ LOANS : holds
    USERS ||--o{ PAYMENTS : makes
    USERS ||--o{ NOTIFICATIONS : receives
    USERS ||--o{ SAVING_GOALS : creates

    WALLETS ||--o{ TRANSACTIONS : contains

    LOAN_TYPES ||--o{ LOAN_APPLICATIONS : "is type of"
    LOAN_APPLICATIONS ||--o{ DOCUMENTS : has
    LOAN_APPLICATIONS ||--|| LOANS : "approved into"

    LOANS ||--o{ REPAYMENT_SCHEDULES : "amortized as"
    LOANS ||--o{ PAYMENTS : receives

    USERS {
        bigint id PK
        varchar email UK
        varchar password_hash
        varchar role "CUSTOMER | ADMIN"
    }
    WALLETS {
        bigint id PK
        bigint user_id FK,UK
        varchar wallet_id UK
        numeric balance
    }
    TRANSACTIONS {
        bigint id PK
        bigint wallet_id FK
        varchar txn_id UK
        varchar type "CREDIT | DEBIT"
        varchar category
    }
    LOAN_TYPES {
        bigint id PK
        varchar code UK
        numeric max_limit
    }
    LOAN_APPLICATIONS {
        bigint id PK
        varchar application_id UK
        bigint user_id FK
        bigint loan_type_id FK
        bigint reviewed_by FK
        varchar status "PENDING | UNDER_REVIEW | APPROVED | REJECTED"
    }
    DOCUMENTS {
        bigint id PK
        bigint application_id FK
        varchar document_type
    }
    LOANS {
        bigint id PK
        varchar loan_id UK
        bigint user_id FK
        bigint application_id FK,UK
        varchar status "ACTIVE | COMPLETED | DEFAULTED | CLOSED"
    }
    REPAYMENT_SCHEDULES {
        bigint id PK
        bigint loan_id FK
        int installment_number
        varchar status
    }
    PAYMENTS {
        bigint id PK
        varchar txn_id UK
        bigint loan_id FK
        bigint user_id FK
    }
    NOTIFICATIONS {
        bigint id PK
        bigint user_id FK
        varchar type "SUCCESS | WARNING | INFO | DANGER"
    }
    SAVING_GOALS {
        bigint id PK
        bigint user_id FK
    }
```

> `loan_applications.reviewed_by` is a second FK to `users` (the admin who
> reviewed the application), in addition to `user_id` (the applicant).

## Tables at a glance

| Table | Description |
|-------|-------------|
| `users` | CUSTOMER and ADMIN accounts; implements Spring Security `UserDetails` |
| `wallets` | One per user, auto-created on registration |
| `transactions` | Every credit/debit against a wallet |
| `loan_types` | Product catalog (Personal, Business, Home, Vehicle) |
| `loan_applications` | Full 5-step application form + admin decision fields |
| `documents` | Uploaded file metadata linked to an application |
| `loans` | Created on approval; 1:1 with the originating application |
| `repayment_schedules` | One row per installment (amortization table) |
| `payments` | Actual EMI payments made by customers |
| `notifications` | In-app notifications |
| `saving_goals` | Customer-created saving targets shown on the wallet page |

## Enumerations

Stored as `VARCHAR` (Hibernate `EnumType.STRING`):

| Enum | Values |
|------|--------|
| `Role` | `CUSTOMER`, `ADMIN` |
| `ApplicationStatus` | `PENDING`, `UNDER_REVIEW`, `APPROVED`, `REJECTED` |
| `LoanStatus` | `ACTIVE`, `COMPLETED`, `DEFAULTED`, `CLOSED` |
| `PaymentStatus` | `PAID`, `NEXT_DUE`, `PENDING`, `OVERDUE`, `FAILED` |
| `TransactionType` | `CREDIT`, `DEBIT` |
| `TransactionCategory` | `EMI_PAYMENT`, `TOP_UP`, `TRANSFER`, `WITHDRAWAL`, `CASHBACK` |
| `NotificationType` | `SUCCESS`, `WARNING`, `INFO`, `DANGER` |
