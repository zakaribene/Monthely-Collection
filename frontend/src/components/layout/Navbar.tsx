import React, { useState } from 'react';
import HeaderProfile from './HeaderProfile';
import { useLocation } from 'react-router-dom';
import { usePermissions } from '../../hooks/usePermissions';

const Navbar = () => {
  const location = useLocation();
  const { hasPermission } = usePermissions();
  const pathName = location.pathname.substring(1);
  let pageTitle = pathName.charAt(0).toUpperCase() + pathName.slice(1).replace('-', ' ');
  
  if (!pageTitle && pathName === '' && hasPermission('dashboard', 'view')) {
    pageTitle = 'Dashboard';
  }

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '2rem',
      backgroundColor: 'white',
      padding: '1rem 1.5rem',
      borderRadius: 'var(--radius)',
      boxShadow: 'var(--shadow)'
    }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: 'var(--foreground)' }}>
        {pageTitle || 'Dashboard'}
      </h2>
      
      <HeaderProfile />
    </div>
  );
};

export default Navbar;
