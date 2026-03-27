import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export const Modal = ({ isOpen, onClose, title, children, maxWidth }: ModalProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(15, 23, 42, 0.4)', // Slightly more transparent overlay
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start', // Better for tall content
      padding: '2rem 1rem', // Space from screen edges
      overflowY: 'auto', // Enable scrolling
      zIndex: 1000,
      backdropFilter: 'blur(12px)',
      animation: 'fadeIn 0.2s ease-out'
    }} onClick={onClose}>
      <div 
        className="glass" 
        style={{
          width: '90%',
          maxWidth: maxWidth || '500px',
          backgroundColor: 'rgba(255, 255, 255, 0.95)', // Slightly translucent
          borderRadius: '28px', // More rounded
          boxShadow: '0 40px 100px -20px rgba(0, 0, 0, 0.35)', // More dramatic shadow
          overflow: 'hidden',
          border: '1px solid rgba(255, 255, 255, 0.3)', // Subtle inner border
          animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1.75rem 2.5rem', // More spacious padding
          background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', // More vibrant gradient
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Subtle decoration */}
          <div style={{ 
            position: 'absolute', 
            top: '-50%', 
            right: '-10%', 
            width: '200px', 
            height: '200px', 
            background: 'rgba(255, 255, 255, 0.1)', 
            borderRadius: '50%',
            pointerEvents: 'none'
          }} />
          
          <h3 style={{ 
            margin: 0, 
            fontSize: '1.5rem', // Larger title
            fontWeight: '800', 
            letterSpacing: '-0.03em',
            zIndex: 1
          }}>{title}</h3>
          
          <button 
            onClick={onClose}
            style={{ 
              background: 'rgba(255, 255, 255, 0.2)', 
              border: 'none', 
              borderRadius: '14px', // Modern squircle
              padding: '10px',
              display: 'flex',
              color: 'white',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              cursor: 'pointer',
              zIndex: 1,
              backdropFilter: 'blur(4px)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
              e.currentTarget.style.transform = 'rotate(90deg) scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.transform = 'rotate(0deg) scale(1)';
            }}
          >
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>
        <div style={{ padding: '2.5rem' }}>
          {children}
        </div>
      </div>
    </div>
  );
};
