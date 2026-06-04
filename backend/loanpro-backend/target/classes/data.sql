-- Insert default admin user (password is 'admin123' encoded with BCrypt)
INSERT INTO users (full_name, email, password_hash, role, email_alerts, sms_notifications, created_at, updated_at) 
VALUES ('System Admin', 'admin@loanpro.com', '$2a$10$fWJcT.F9eH5w01H5Dk/5MOhp9lU6w.g2tG2hV4mC12cW.qG3vK3L.', 'ADMIN', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (email) DO NOTHING;

-- Insert default customer user (password is 'customer123' encoded with BCrypt)
INSERT INTO users (full_name, email, password_hash, role, phone, address, nic, email_alerts, sms_notifications, created_at, updated_at) 
VALUES ('Nimal Perera', 'nimal@gmail.com', '$2a$10$wOaM5X7v82Nf7D56VnF2L.x9H9Y4kZ6jP.0mU.c53J5K3m2f1E5Oq', 'CUSTOMER', '+94 77 123 4567', '123 Galle Road, Colombo', '901234567V', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (email) DO NOTHING;

-- Insert wallet for customer user
INSERT INTO wallet (user_id, balance, total_credited, total_debited, wallet_id, created_at)
SELECT id, 24500.00, 85000.00, 60500.00, 'WLT-2024-ADS', CURRENT_TIMESTAMP 
FROM users WHERE email = 'nimal@gmail.com'
ON CONFLICT DO NOTHING;

-- Insert Loan Types
INSERT INTO loan_type (name, code, max_limit, description, min_interest_rate, max_interest_rate, active)
VALUES 
('Personal Loan', 'personal', 500000, 'For Personal expenses, medical, educational', 8.5, 12.0, true),
('Business Loan', 'business', 2000000, 'For scaling business operations', 10.0, 15.0, true),
('Home Loan', 'home', 5000000, 'For home construction or purchase', 7.5, 9.5, true),
('Vehicle Loan', 'vehicle', 800000, 'For vehicle purchase', 9.0, 11.0, true)
ON CONFLICT (code) DO NOTHING;
