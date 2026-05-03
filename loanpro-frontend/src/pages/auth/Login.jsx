import { useState } from 'react';
import Input from '../../components/Input';
import Button from '../../components/Button';
import './Login.css';

const Login = () => {
  // Set up React State to track what the user types
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // This function updates the state whenever a user types in a field
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // This runs when the user clicks "Sign In"
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevents the page from refreshing
    console.log("Attempting to login with:", formData);
    // Later, this is where we will check if the user exists!
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Logo Area */}
        <div className="logo-container">
          <div className="logo-box">LoanPro</div>
        </div>

        {/* Header Area */}
        <div className="login-header">
          <h2>Welcome Back</h2>
          <div className="role-toggle">
            <button className="role-btn active">Customer</button>
            <button className="role-btn">Admin</button>
          </div>
        </div>

        {/* The Login Form */}
        <form onSubmit={handleSubmit} className="login-form">
          <Input 
            label="Email Address" 
            name="email"
            type="email" 
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email" 
            required
          />
          
          <Input 
            label="Password" 
            name="password"
            type="password" 
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••" 
            required
          />

          <div className="forgot-password">
            <a href="#forgot">Forgot Password?</a>
          </div>

          <Button type="submit" variant="primary">
            Sign In
          </Button>
        </form>

        {/* Social Login & Footer */}
        <div className="login-footer">
          <div className="divider">
            <span>OR CONTINUE WITH</span>
          </div>
          
          <div className="social-buttons">
            <Button variant="secondary" className="social-btn">
              <span className="icon">G</span> GOOGLE
            </Button>
            <Button variant="secondary" className="social-btn">
              <span className="icon">f</span> FACEBOOK
            </Button>
          </div>

          <p className="create-account-text">
            Don't Have An Account? <a href="#register"><strong>Create</strong></a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;