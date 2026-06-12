import { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/Button';
import Input from '../../components/Input';
import './Register.css';

function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Connect to backend auth
    console.log('Register:', form);
  };

  return (
    <div className="register">
      <h2 className="register__title">Create Account</h2>
      <p className="register__subtitle">Start your LoanPro journey today</p>

      <form className="register__form" onSubmit={handleSubmit}>
        <Input id="reg-name" label="Full Name" placeholder="John Doe" value={form.name} onChange={update('name')} required />
        <Input id="reg-email" label="Email Address" type="email" placeholder="you@example.com" value={form.email} onChange={update('email')} required />
        <Input id="reg-password" label="Password" type="password" placeholder="Create a password" value={form.password} onChange={update('password')} required />
        <Input id="reg-confirm" label="Confirm Password" type="password" placeholder="Confirm your password" value={form.confirm} onChange={update('confirm')} required />
        <Button type="submit" variant="primary" fullWidth>Create Account</Button>
      </form>

      <p className="register__footer">
        Already have an account? <Link to="/login" className="register__link">Sign In</Link>
      </p>
    </div>
  );
}

export default Register;
