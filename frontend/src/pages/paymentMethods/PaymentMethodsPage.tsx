import React, { useState, useEffect } from 'react';
import { Plus, Edit2 } from 'lucide-react';
import { Table, TableRow, TableCell } from '../../components/common/Table';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Loader } from '../../components/common/Loader';
import * as paymentService from '../../services/paymentsService';
import api from '../../services/api';
import { usePermissions } from '../../hooks/usePermissions';

const PaymentMethodsPage = () => {
  const { hasPermission } = usePermissions();
  const [methods, setMethods] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<any>(null);
  const [name, setName] = useState('');
  const [details, setDetails] = useState('');

  const fetchMethods = async () => {
    setLoading(true);
    try {
      const { data } = await paymentService.getPaymentMethods();
      setMethods(data);
    } catch (error) {
      console.error('Error fetching methods:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMethods();
  }, []);

  const handleEdit = (method: any) => {
    setSelectedMethod(method);
    setName(method.name);
    setDetails(method.details);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedMethod) {
        await api.put(`/payment-methods/${selectedMethod._id}`, { name, details });
      } else {
        await api.post('/payment-methods', { name, details });
      }
      setShowForm(false);
      fetchMethods();
    } catch (error) {
      alert('Error saving payment method');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '2rem' }}>
        {hasPermission('payment-methods', 'create') && (
          <Button onClick={() => { setSelectedMethod(null); setName(''); setDetails(''); setShowForm(true); }}>
            <Plus size={18} /> Add Method
          </Button>
        )}
      </div>

      <div className="card">
        {loading ? <Loader /> : (
          <Table headers={['Name', 'Details', 'Actions']}>
            {methods.map((method) => (
              <TableRow key={method._id}>
                <TableCell style={{ fontWeight: '600' }}>{method.name}</TableCell>
                <TableCell>{method.details}</TableCell>
                <TableCell>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {hasPermission('payment-methods', 'update') && (
                      <Button variant="outline" size="sm" onClick={() => handleEdit(method)}>
                        <Edit2 size={16} />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </Table>
        )}
      </div>

      <Modal 
        isOpen={showForm} 
        onClose={() => setShowForm(false)} 
        title={selectedMethod ? 'Edit Payment Method' : 'Add Payment Method'}
      >
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyle}>Method Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required style={inputStyle} placeholder="e.g. Cash, EVC Plus" />
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={labelStyle}>Details (Optional)</label>
            <input type="text" value={details} onChange={(e) => setDetails(e.target.value)} style={inputStyle} placeholder="e.g. Account number" />
          </div>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <Button variant="outline" type="button" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button type="submit">Save Method</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

const labelStyle = { display: 'block', fontSize: '0.85rem', fontWeight: '500', marginBottom: '6px', color: 'var(--secondary)' };
const inputStyle = { width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', outline: 'none' };

export default PaymentMethodsPage;
