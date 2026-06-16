import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import Button from '../../components/Button';
import Input from '../../components/Input';
import './Register.css';

function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirm) {
      setError('Passwords do not match.');
      return;
    }

    setSubmitting(true);
    try {
      const user = await register({
        fullName: form.name,
        email: form.email,
        password: form.password,
        confirmPassword: form.confirm,
      });
      navigate(
        String(user?.role).toUpperCase() === 'ADMIN' ? '/admin/dashboard' : '/dashboard',
        { replace: true },
      );
    } catch (err) {
      setError(err?.message || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="register">
      <h2 className="register__title">Create Account</h2>
      <p className="register__subtitle">Start your LoanPro journey today</p>

      {error && <div className="register__error">{error}</div>}

      <form className="register__form" onSubmit={handleSubmit}>
        <Input name="name" label="Full Name" placeholder="John Doe" value={form.name} onChange={update('name')} required />
        <Input name="email" label="Email Address" type="email" placeholder="you@example.com" value={form.email} onChange={update('email')} required />
        <Input name="password" label="Password" type="password" placeholder="Create a password" value={form.password} onChange={update('password')} required />
        <Input name="confirm" label="Confirm Password" type="password" placeholder="Confirm your password" value={form.confirm} onChange={update('confirm')} required />
        <Button type="submit" variant="primary" fullWidth disabled={submitting}>
          {submitting ? 'Creating…' : 'Create Account'}
        </Button>
      </form>

      <p className="register__footer">
        Already have an account? <Link to="/login" className="register__link">Sign In</Link>
      </p>
    </div>
  );
}

export default Register;
