import React, { useState } from 'react';
import { Button } from '../../components/common/Button';
import * as memberService from '../../services/membersService';

interface MemberFormProps {
  member?: any; // Define a proper type for member if available
  onClose: () => void;
  onSuccess: () => void;
}

const MemberForm = ({ member, onClose, onSuccess }: MemberFormProps) => {
  const [formData, setFormData] = useState({
    fullName: member?.fullName || '',
    phone: member?.phone || '',
    address: member?.address || '',
    monthlyAmount: member?.monthlyAmount || '',
  });
  const [photo, setPhoto] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      data.append('fullName', formData.fullName);
      data.append('phone', formData.phone);
      data.append('address', formData.address);
      data.append('monthlyAmount', formData.monthlyAmount.toString());
      if (photo) {
        data.append('photo', photo);
      }

      if (member) {
        await memberService.updateMember(member._id, data);
      } else {
        await memberService.createMember(data);
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving member:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: '1rem' }}>
        <label style={labelStyle}>Full Name</label>
        <input 
          type="text" 
          value={formData.fullName}
          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          required
          style={inputStyle}
        />
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <label style={labelStyle}>Phone</label>
        <input 
          type="text" 
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          required
          style={inputStyle}
        />
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <label style={labelStyle}>Address</label>
        <input 
          type="text" 
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          required
          style={inputStyle}
        />
      </div>
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={labelStyle}>Monthly Amount</label>
        <input 
          type="number" 
          value={formData.monthlyAmount}
          onChange={(e) => setFormData({ ...formData, monthlyAmount: e.target.value })}
          required
          style={inputStyle}
        />
      </div>
            <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Photo</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPhoto(e.target.files?.[0] || null)}
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid var(--border)',
              borderRadius: '8px'
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem' }}>
          <Button variant="secondary" onClick={onClose} type="button">Cancel</Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : member ? 'Update Member' : 'Save Member'}
          </Button>
        </div>
    </form>
  );
};

const labelStyle = { display: 'block', fontSize: '0.85rem', fontWeight: '500', marginBottom: '6px', color: 'var(--secondary)' };
const inputStyle = { width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', outline: 'none' };

export default MemberForm;
