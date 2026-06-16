import { useState, useEffect } from 'react';
import { useAuth } from '../../context/useAuth';
import { apiGet, apiPut } from '../../api/apiClient';
import { errorMessage } from '../../utils/format';
import Input from '../../components/Input';
import Button from '../../components/Button';
import './UserProfile.css';

const UserProfile = () => {
  const { user } = useAuth();

  const [profileData, setProfileData] = useState({ fullName: '', email: '', phone: '', address: '' });
  const [role, setRole] = useState('CUSTOMER');
  const [prefs, setPrefs] = useState({ emailAlerts: true, smsNotifications: false });
  const [securityData, setSecurityData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [profileNotice, setProfileNotice] = useState(null);
  const [passwordNotice, setPasswordNotice] = useState(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setLoading(true);
        setError('');
        const p = await apiGet('/users/profile');
        if (!active) return;
        setProfileData({
          fullName: p.fullName || '',
          email: p.email || '',
          phone: p.phone || '',
          address: p.address || '',
        });
        setRole(p.role || 'CUSTOMER');
        setPrefs({
          emailAlerts: p.emailAlerts ?? true,
          smsNotifications: p.smsNotifications ?? false,
        });
      } catch (e) {
        if (active) setError(errorMessage(e));
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  const handleProfileChange = (e) => setProfileData({ ...profileData, [e.target.name]: e.target.value });
  const handleSecurityChange = (e) => setSecurityData({ ...securityData, [e.target.name]: e.target.value });

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileNotice(null);
    try {
      await apiPut('/users/profile', {
        fullName: profileData.fullName,
        phone: profileData.phone,
        address: profileData.address,
      });
      setProfileNotice({ type: 'success', text: 'Profile details updated successfully.' });
    } catch (err) {
      setProfileNotice({ type: 'error', text: errorMessage(err) });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setPasswordNotice(null);
    if (securityData.newPassword !== securityData.confirmPassword) {
      setPasswordNotice({ type: 'error', text: 'New passwords do not match.' });
      return;
    }
    setSavingPassword(true);
    try {
      await apiPut('/users/password', {
        currentPassword: securityData.currentPassword,
        newPassword: securityData.newPassword,
      });
      setPasswordNotice({ type: 'success', text: 'Password updated securely.' });
      setSecurityData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPasswordNotice({ type: 'error', text: errorMessage(err) });
    } finally {
      setSavingPassword(false);
    }
  };

  const togglePref = async (key) => {
    const next = { ...prefs, [key]: !prefs[key] };
    setPrefs(next);
    try {
      await apiPut('/users/notifications-preferences', next);
    } catch {
      setPrefs(prefs); // revert on failure
    }
  };

  if (loading) return <div className="page-loading">Loading your profile…</div>;
  if (error) return <div className="page-error">{error}</div>;

  const displayName = profileData.fullName || user?.name || 'User';
  const roleLabel = role ? role.charAt(0) + role.slice(1).toLowerCase() : 'Customer';

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
            <div className="avatar-large">{displayName.charAt(0)}</div>
            <div>
              <h3 className="profile-name">{displayName}</h3>
              <p className="profile-role">{roleLabel} Account</p>
            </div>
          </div>

          <form onSubmit={handleSaveProfile} className="profile-form">
            <h4 className="section-title">Personal Details</h4>

            <Input label="Full Name" name="fullName" value={profileData.fullName} onChange={handleProfileChange} />
            <Input label="Email Address" name="email" type="email" value={profileData.email} onChange={handleProfileChange} />
            <Input label="Phone Number" name="phone" value={profileData.phone} onChange={handleProfileChange} />
            <Input label="Home Address" name="address" value={profileData.address} onChange={handleProfileChange} />

            {profileNotice && (
              <div className={`form-feedback ${profileNotice.type === 'success' ? 'is-success' : 'is-error'}`}>
                {profileNotice.text}
              </div>
            )}

            <div className="form-actions right mt-4">
              <Button type="submit" variant="primary" disabled={savingProfile}>
                {savingProfile ? 'Saving…' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </div>

        {/* Right Column: Security & Preferences */}
        <div className="profile-right-col">
          {/* Password Update Card */}
          <div className="profile-card">
            <h4 className="section-title">Security Settings</h4>
            <form onSubmit={handleUpdatePassword} className="profile-form">
              <Input label="Current Password" name="currentPassword" type="password" value={securityData.currentPassword} onChange={handleSecurityChange} required />
              <Input label="New Password" name="newPassword" type="password" value={securityData.newPassword} onChange={handleSecurityChange} required />
              <Input label="Confirm New Password" name="confirmPassword" type="password" value={securityData.confirmPassword} onChange={handleSecurityChange} required />

              {passwordNotice && (
                <div className={`form-feedback ${passwordNotice.type === 'success' ? 'is-success' : 'is-error'}`}>
                  {passwordNotice.text}
                </div>
              )}

              <div className="form-actions right mt-4">
                <Button type="submit" variant="secondary" disabled={savingPassword}>
                  {savingPassword ? 'Updating…' : 'Update Password'}
                </Button>
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
                  <input type="checkbox" checked={prefs.emailAlerts} onChange={() => togglePref('emailAlerts')} />
                  <span className="slider round"></span>
                </label>
              </div>
              <div className="toggle-item">
                <div>
                  <strong>SMS Notifications</strong>
                  <p>Urgent payment reminders</p>
                </div>
                <label className="switch">
                  <input type="checkbox" checked={prefs.smsNotifications} onChange={() => togglePref('smsNotifications')} />
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
