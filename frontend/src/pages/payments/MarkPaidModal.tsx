import React, { useState, useEffect } from 'react';
import { Button } from '../../components/common/Button';
import { CheckCircle, CreditCard, DollarSign, AlertCircle, X } from 'lucide-react';
import * as paymentService from '../../services/paymentsService';

const MarkPaidModal = ({ payment, onSuccess, onCancel }: any) => {
  const [methods, setMethods] = useState<any[]>([]);
  const [selectedMethod, setSelectedMethod] = useState('');
  const [amount, setAmount] = useState(payment?.amount || '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMethods = async () => {
      try {
        const { data } = await paymentService.getPaymentMethods();
        setMethods(data);
        if (data.length > 0) setSelectedMethod(data[0]._id);
      } catch (error: any) {
        console.error('Error fetching payment methods:', error);
        if (error.response?.status === 403) {
          alert('Access Denied: You do not have permission to view payment methods.');
        } else {
          alert('Error: Failed to load payment methods. Check your connection.');
        }
      }
    };
    fetchMethods();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMethod) return alert('Please select a payment method');
    
    setLoading(true);
    try {
      await paymentService.markAsPaid(payment._id, {
        paymentMethodId: selectedMethod,
        amount: Number(amount),
        datePaid: new Date()
      });
      onSuccess();
    } catch (error) {
      alert('Error marking payment as paid');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ animation: 'fadeIn 0.4s ease-out' }}>
      <div style={{ 
        marginBottom: '1.75rem', 
        padding: '1.25rem', 
        backgroundColor: '#f8fafc', 
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px'
      }}>
        <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#64748b', letterSpacing: '0.05em' }}>MARKING PAYMENT FOR:</span>
        <span style={{ fontWeight: '700', fontSize: '1.1rem', color: 'var(--foreground)' }}>
          {payment?.member?.fullName} — <span style={{ color: 'var(--primary)' }}>{payment?.month}/{payment?.year}</span>
        </span>
      </div>

      <div style={{ marginBottom: '1.75rem' }}>
        <label style={labelStyle}>
          <CreditCard size={14} style={{ marginRight: '6px' }} />
          PAYMENT METHOD
        </label>
        <div style={{ position: 'relative' }}>
          <select 
            value={selectedMethod}
            onChange={(e) => setSelectedMethod(e.target.value)}
            required
            className="input-premium"
            style={{ ...inputStyle, appearance: 'none', paddingRight: '2.5rem' }}
          >
            {methods.length === 0 ? (
              <option value="" disabled>No payment methods available</option>
            ) : (
              methods.map(m => (
                <option key={m._id} value={m._id}>{m.name}</option>
              ))
            )}
          </select>
          <div style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--primary)', opacity: 0.6 }}>
            <CreditCard size={18} />
          </div>
        </div>
        {methods.length === 0 && !loading && (
          <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--danger)', fontSize: '0.85rem' }}>
            <AlertCircle size={14} />
            <span>Please ensure payment methods are configured in settings.</span>
          </div>
        )}
      </div>

      <div style={{ marginBottom: '2.5rem' }}>
        <label style={labelStyle}>
          <DollarSign size={14} style={{ marginRight: '6px' }} />
          AMOUNT PAID ($)
        </label>
        <input 
          type="number" 
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          className="input-premium"
          style={inputStyle}
          placeholder="0.00"
        />
      </div>

      <div style={{ 
        display: 'flex', 
        gap: '1.25rem', 
        justifyContent: 'flex-end',
        paddingTop: '1.5rem',
        borderTop: '1px solid #f1f5f9'
      }}>
        <Button variant="secondary" type="button" onClick={onCancel} style={{ borderRadius: '14px', padding: '12px 24px', fontWeight: '600' }}>
          Dismiss
        </Button>
        <Button type="submit" disabled={loading || methods.length === 0} style={{ 
          borderRadius: '14px', 
          padding: '12px 32px',
          background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
          boxShadow: '0 10px 20px -5px rgba(34, 197, 94, 0.4)',
          fontWeight: '800',
          color: 'white'
        }}>
          {loading ? 'Processing...' : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle size={18} />
              Confirm Payment
            </div>
          )}
        </Button>
      </div>
      <style>{`
        .input-premium:focus { border-color: var(--primary) !important; box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1) !important; background: white !important; }
      `}</style>
    </form>
  );
};

const labelStyle = { 
  display: 'flex',
  alignItems: 'center',
  fontSize: '0.75rem', 
  fontWeight: '800', 
  marginBottom: '10px', 
  color: '#475569', 
  letterSpacing: '0.08em',
  textTransform: 'uppercase' as const
};

const inputStyle = { 
  borderRadius: '16px', 
  padding: '1rem 1.25rem', 
  border: '2px solid #e2e8f0', 
  backgroundColor: '#f8fafc',
  fontSize: '1rem',
  fontWeight: '500',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  width: '100%'
};

export default MarkPaidModal;
