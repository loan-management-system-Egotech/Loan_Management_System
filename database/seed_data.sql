-- =====================================================================
--  LoanPro — Seed Data (PostgreSQL)
-- =====================================================================
--  This mirrors backend/loanpro-backend/src/main/resources/data.sql,
--  which Spring Boot runs automatically on startup. Use this file to
--  seed a database provisioned manually from schema.sql.
--
--  Default credentials:
--    admin@loanpro.com / admin123       (ADMIN)
--    nimal@gmail.com   / customer123    (CUSTOMER)
--  Password hashes below are BCrypt; do NOT change them or the seeded
--  logins will stop working.
-- =====================================================================

-- Default admin user (password: admin123)
INSERT INTO users (full_name, email, password_hash, role, email_alerts, sms_notifications, created_at, updated_at)
VALUES ('System Admin', 'admin@loanpro.com', '$2a$10$wMuA/V4sYjlYlB8BC2Tk1OIptVIjgtgWUhzmHpfxrFAwGDtNmNO8m', 'ADMIN', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (email) DO NOTHING;

-- Default customer user (password: customer123)
INSERT INTO users (full_name, email, password_hash, role, phone, address, nic, email_alerts, sms_notifications, created_at, updated_at)
VALUES ('Nimal Perera', 'nimal@gmail.com', '$2a$10$Ms72gwPE0Ko7e2kgxQ8bweQiPXvUuz1ySdrVJRabbJCzBp6YkSs26', 'CUSTOMER', '+94 77 123 4567', '123 Galle Road, Colombo', '901234567V', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (email) DO NOTHING;

-- Wallet for the seeded customer
INSERT INTO wallets (user_id, balance, total_credited, total_debited, wallet_id, created_at)
SELECT id, 24500.00, 85000.00, 60500.00, 'WLT-2024-ADS', CURRENT_TIMESTAMP
FROM users WHERE email = 'nimal@gmail.com'
ON CONFLICT DO NOTHING;

-- Loan product catalog
INSERT INTO loan_types (name, code, max_limit, description, min_interest_rate, max_interest_rate, active)
VALUES
('Personal Loan', 'personal', 500000,  'For Personal expenses, medical, educational', 8.5, 12.0, true),
('Business Loan', 'business', 2000000, 'For scaling business operations',            10.0, 15.0, true),
('Home Loan',     'home',     5000000, 'For home construction or purchase',           7.5,  9.5, true),
('Vehicle Loan',  'vehicle',  800000,  'For vehicle purchase',                        9.0, 11.0, true)
ON CONFLICT (code) DO NOTHING;
