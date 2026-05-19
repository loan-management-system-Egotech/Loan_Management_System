import { useState } from 'react';
import { useAuth } from '../../context/useAuth';
import Input from '../../components/Input';
import Button from '../../components/Button';
import './UserProfile.css';

const UserProfile = () => {
  // Pull the currently logged-in user from our AuthContext!
  const { user } = useAuth();

  // State for the profile form (pre-filled with the context data)
  const [profileData, setProfileData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '+94 77 123 4567',
    address: '123 Galle Road, Colombo 03',
  });

  // State for the password change form
  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleSecurityChange = (e) => {
    setSecurityData({ ...securityData, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    alert("Profile details updated successfully!");
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    if (securityData.newPassword !== securityData.confirmPassword) {
      alert("New passwords do not match!");
      return;
    }
    alert("Password updated securely.");
    setSecurityData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  return (
    <div className="profile-container">
      <div className="page-header">
        <h2>My Profile</h2>
        <p>Manage your personal information and security settings</p>
      </div>

      <div className="profile-grid">
        
        {/* Left Column: Personal Information */}
        <div className="profile-card">
          <div className="profile-card-header">
            <div className="avatar-large">{user?.name ? user.name.charAt(0) : 'U'}</div>
            <div>
              <h3 className="profile-name">{user?.name || 'User'}</h3>
              <p className="profile-role">Customer Account</p>
            </div>
          </div>

          <form onSubmit={handleSaveProfile} className="profile-form">
            <h4 className="section-title">Personal Details</h4>
            
            <Input 
              label="Full Name" 
              name="fullName" 
              value={profileData.fullName} 
              onChange={handleProfileChange} 
            />
            <Input 
              label="Email Address" 
              name="email" 
              type="email" 
              value={profileData.email} 
              onChange={handleProfileChange} 
            />
            <Input 
              label="Phone Number" 
              name="phone" 
              value={profileData.phone} 
              onChange={handleProfileChange} 
            />
            <Input 
              label="Home Address" 
              name="address" 
              value={profileData.address} 
              onChange={handleProfileChange} 
            />

            <div className="form-actions right mt-4">
              <Button type="submit" variant="primary">Save Changes</Button>
            </div>
          </form>
        </div>

        {/* Right Column: Security & Preferences */}
        <div className="profile-right-col">
          
          {/* Password Update Card */}
          <div className="profile-card">
            <h4 className="section-title">Security Settings</h4>
            <form onSubmit={handleUpdatePassword} className="profile-form">
              <Input 
                label="Current Password" 
                name="currentPassword" 
                type="password" 
                value={securityData.currentPassword} 
                onChange={handleSecurityChange} 
                required
              />
              <Input 
                label="New Password" 
                name="newPassword" 
                type="password" 
                value={securityData.newPassword} 
                onChange={handleSecurityChange} 
                required
              />
              <Input 
                label="Confirm New Password" 
                name="confirmPassword" 
                type="password" 
                value={securityData.confirmPassword} 
                onChange={handleSecurityChange} 
                required
              />
              
              <div className="form-actions right mt-4">
                <Button type="submit" variant="secondary">Update Password</Button>
              </div>
            </form>
          </div>

          {/* Notifications Card */}
          <div className="profile-card">
            <h4 className="section-title">Notification Preferences</h4>
            <div className="toggle-list">
              <div className="toggle-item">
                <div>
                  <strong>Email Alerts</strong>
                  <p>Updates on your loan status and EMIs</p>
                </div>
                <label className="switch">
                  <input type="checkbox" defaultChecked />
                  <span className="slider round"></span>
                </label>
              </div>
              <div className="toggle-item">
                <div>
                  <strong>SMS Notifications</strong>
                  <p>Urgent payment reminders</p>
                </div>
                <label className="switch">
                  <input type="checkbox" defaultChecked />
                  <span className="slider round"></span>
                </label>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default UserProfile;