import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, LogOut, Key, Camera, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

const HeaderProfile = () => {
  const { userInfo, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ position: 'relative' }}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          cursor: 'pointer',
          padding: '4px 8px',
          borderRadius: '20px',
          transition: 'background-color 0.2s'
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
      >
        <img 
          src={userInfo?.photo || 'https://placehold.co/40'} 
          alt="User" 
          style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
        />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>{userInfo?.fullName}</span>
          <span style={{ fontSize: '0.8rem', color: 'var(--secondary)' }}>{userInfo?.role}</span>
        </div>
        <ChevronDown size={16} />
      </div>

      {isOpen && (
        <div className="glass" style={{
          position: 'absolute',
          right: 0,
          top: '100%',
          marginTop: '10px',
          width: '200px',
          zIndex: 100,
          borderRadius: 'var(--radius)',
          boxShadow: 'var(--shadow-lg)',
          padding: '8px 0',
          overflow: 'hidden'
        }}>
          <Link to="/profile" style={linkStyle} onClick={() => setIsOpen(false)}>
            <User size={18} /> Profile
          </Link>
          <Link to="/profile?tab=password" style={linkStyle} onClick={() => setIsOpen(false)}>
            <Key size={18} /> Change Password
          </Link>
          <Link to="/profile?tab=photo" style={linkStyle} onClick={() => setIsOpen(false)}>
            <Camera size={18} /> Change Photo
          </Link>
          <div style={{ borderTop: '1px solid var(--border)', margin: '8px 0' }} />
          <button onClick={logout} style={{ ...linkStyle, border: 'none', background: 'none', width: '100%', color: 'var(--danger)' }}>
            <LogOut size={18} /> Logout
          </button>
        </div>
      )}
    </div>
  );
};

const linkStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '10px 16px',
  textDecoration: 'none',
  color: 'var(--foreground)',
  fontSize: '0.9rem',
  transition: 'background-color 0.1s'
};

export default HeaderProfile;
