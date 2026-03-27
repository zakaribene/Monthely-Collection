import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { ShieldCheck, TrendingUp, Users, ArrowRight, Lock, User, Wallet } from 'lucide-react';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/auth/login', { username, password });
      login(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', backgroundColor: '#f8fafc', overflow: 'hidden' }}>
      
      {/* Left Side - Brand & System Overview */}
      <div style={{
        flex: 1.2,
        background: 'linear-gradient(135deg, #4f46e5 0%, #2563eb 100%)',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '4rem 5rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative Blurred Orbs */}
        <div style={{ position: 'absolute', top: '-15%', right: '-10%', width: '500px', height: '500px', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: '50%', filter: 'blur(60px)' }} />
        <div style={{ position: 'absolute', bottom: '-20%', left: '-15%', width: '700px', height: '700px', backgroundColor: 'rgba(56,189,248,0.15)', borderRadius: '50%', filter: 'blur(80px)' }} />

        <div style={{ position: 'relative', zIndex: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '4rem' }}>
            <div style={{ backgroundColor: 'white', padding: '12px', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.15)' }}>
              <Wallet size={32} color="#4f46e5" strokeWidth={2.5} />
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '-0.5px' }}>MonthlyCollection.</h1>
          </div>
          
          <h2 style={{ fontSize: '4rem', fontWeight: 800, lineHeight: 1.1, marginBottom: '2rem', textShadow: '0 10px 30px rgba(0,0,0,0.1)', letterSpacing: '-1px' }}>
            Streamline your <br/> financial ecosystem.
          </h2>
          <p style={{ fontSize: '1.2rem', opacity: 0.9, maxWidth: '500px', lineHeight: 1.6, marginBottom: '4rem', fontWeight: 400 }}>
            The all-in-one platform for managing organization collections, tracking member subscriptions, and auditing expenditures seamlessly.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <FeatureCard icon={<Users />} title="Member Management" desc="Track active subscribers and monthly payment histories effortlessly." />
            <FeatureCard icon={<TrendingUp />} title="Financial Analytics" desc="Dynamic reports and cashflow insights directly on your dashboard." />
            <FeatureCard icon={<ShieldCheck />} title="Role-Based Security" desc="Granular access controls ensuring precision and data privacy." />
          </div>
        </div>
        
        <div style={{ position: 'relative', zIndex: 10, fontSize: '0.9rem', opacity: 0.6, fontWeight: 500 }}>
          &copy; {new Date().getFullYear()} Enterprise Collection System. All rights reserved.
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div style={{
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        position: 'relative'
      }}>
        <div style={{ width: '100%', maxWidth: '420px', padding: '2.5rem' }}>
          <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem', letterSpacing: '-0.5px' }}>Welcome Back</h2>
            <p style={{ color: '#64748b', fontSize: '1.05rem', fontWeight: 500 }}>Enter your admin credentials to continue</p>
          </div>

          {error && (
            <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '14px 16px', borderRadius: '12px', marginBottom: '2rem', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 600 }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={labelStyle}>Username</label>
              <div style={{ position: 'relative' }}>
                <User size={20} color="#94a3b8" style={{ position: 'absolute', left: '16px', top: '15px' }} />
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="Enter your username"
                  style={inputStyle}
                  onFocus={(e) => e.target.style.borderColor = '#4f46e5'}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>
            </div>

            <div style={{ marginBottom: '3rem' }}>
              <label style={labelStyle}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={20} color="#94a3b8" style={{ position: 'absolute', left: '16px', top: '15px' }} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                  style={inputStyle}
                  onFocus={(e) => e.target.style.borderColor = '#4f46e5'}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: '16px',
                backgroundColor: loading ? '#94a3b8' : '#4f46e5',
                color: 'white',
                fontSize: '1.1rem',
                fontWeight: 700,
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '10px',
                transition: 'all 0.3s ease',
                boxShadow: loading ? 'none' : '0 10px 25px -5px rgba(79, 70, 229, 0.4)'
              }}
              onMouseEnter={(e) => !loading && (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseLeave={(e) => !loading && (e.currentTarget.style.transform = 'translateY(0)')}
            >
              {loading ? 'Authenticating...' : (
                <>Sign In Securely <ArrowRight size={20} /></>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }: any) => (
  <div style={{ display: 'flex', gap: '18px', alignItems: 'center' }}>
    <div style={{ padding: '14px', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: '14px', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {React.cloneElement(icon, { size: 24, color: '#ffffff' })}
    </div>
    <div>
      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 4px 0', letterSpacing: '0.3px' }}>{title}</h3>
      <p style={{ fontSize: '0.9rem', opacity: 0.85, margin: 0, lineHeight: 1.4, fontWeight: 400 }}>{desc}</p>
    </div>
  </div>
);

const labelStyle = { 
  display: 'block', 
  fontSize: '0.8rem', 
  fontWeight: 700, 
  color: '#475569', 
  marginBottom: '8px', 
  textTransform: 'uppercase' as const, 
  letterSpacing: '0.05em' 
};

const inputStyle = { 
  width: '100%', 
  padding: '14px 16px 14px 48px', 
  borderRadius: '14px', 
  border: '2px solid #e2e8f0', 
  outline: 'none', 
  fontSize: '1rem', 
  fontWeight: 600, 
  backgroundColor: '#f8fafc', 
  transition: 'all 0.2s',
  color: '#0f172a'
};

export default LoginPage;
