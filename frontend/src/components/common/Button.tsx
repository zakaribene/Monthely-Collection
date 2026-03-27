import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  style,
  ...props 
}: ButtonProps) => {
  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    borderRadius: '8px',
    fontWeight: '500',
    transition: 'all 0.2s',
    border: 'none',
    width: fullWidth ? '100%' : 'auto',
    ...style
  };

  const variants = {
    primary: { backgroundColor: 'var(--primary)', color: 'white' },
    secondary: { backgroundColor: 'var(--secondary)', color: 'white' },
    danger: { backgroundColor: 'var(--danger)', color: 'white' },
    success: { backgroundColor: 'var(--success)', color: 'white' },
    outline: { backgroundColor: 'transparent', border: '1px solid var(--border)', color: 'var(--foreground)' }
  };

  const sizes = {
    sm: { padding: '6px 12px', fontSize: '0.8rem' },
    md: { padding: '10px 20px', fontSize: '0.9rem' },
    lg: { padding: '14px 28px', fontSize: '1rem' }
  };

  const combinedStyle = { ...baseStyle, ...variants[variant], ...sizes[size] };

  return (
    <button 
      style={combinedStyle} 
      onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
      onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
      {...props}
    >
      {children}
    </button>
  );
};
