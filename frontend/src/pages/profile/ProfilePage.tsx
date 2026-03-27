import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/Button';
import * as userService from '../../services/usersService';

const ProfilePage = () => {
  const { userInfo, logout } = useAuth();
  const [formData, setFormData] = useState({
    fullName: userInfo?.fullName || '',
    password: '',
    confirmPassword: '',
    photo: userInfo?.photo || ''
  });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password && formData.password !== formData.confirmPassword) {
      return setMessage({ type: 'error', text: 'Passwords do not match' });
    }

    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const data = new FormData();
      data.append('fullName', formData.fullName);
      if (formData.password) data.append('password', formData.password);
      if (photoFile) data.append('photo', photoFile);

      await userService.updateProfile(data);
      setMessage({ type: 'success', text: 'Profile updated. Please log in again to see changes.' });
      setTimeout(() => logout(), 2000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Error updating profile' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div className="card">
        <h3 style={{ marginBottom: '2rem' }}>User Profile</h3>

        {message.text && (
          <div style={{
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '1.5rem',
            backgroundColor: message.type === 'success' ? '#d1fae5' : '#fee2e2',
            color: message.type === 'success' ? '#065f46' : '#991b1b',
            fontSize: '0.9rem'
          }}>
            {message.text}
          </div>
        )}

        <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem' }}>
          <img
            src={formData.photo || 'https://placehold.co/100'}
            alt="Profile"
            style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: '4px solid var(--border)' }}
          />
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>{userInfo?.fullName}</h4>
            <p style={{ color: 'var(--secondary)', fontSize: '0.9rem' }}>@{userInfo?.username}</p>
            <p style={{ fontSize: '0.8rem', marginTop: '8px' }}>Role: <strong>{userInfo?.role}</strong></p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={labelStyle}>Full Name</label>
            <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required style={inputStyle} />
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={labelStyle}>Profile Photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
              style={inputStyle}
            />
          </div>

          <div style={{ borderTop: '1px solid var(--border)', margin: '2rem 0', paddingTop: '1.5rem' }}>
            <h4 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Change Password</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>New Password</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Confirm Password</label>
                <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} style={inputStyle} />
              </div>
            </div>
          </div>

          <Button type="submit" disabled={loading} fullWidth>
            {loading ? 'Updating...' : 'Save Changes'}
          </Button>
        </form>
      </div>
    </div>
  );
};

const labelStyle = { display: 'block', fontSize: '0.85rem', fontWeight: '500', marginBottom: '6px', color: 'var(--secondary)' };
const inputStyle = { width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', outline: 'none' };

export default ProfilePage;
