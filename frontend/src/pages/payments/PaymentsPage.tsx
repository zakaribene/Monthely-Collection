import { useState, useEffect } from 'react';
import { Filter, CheckCircle } from 'lucide-react';
import { Table, TableRow, TableCell } from '../../components/common/Table';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Loader } from '../../components/common/Loader';
import * as paymentService from '../../services/paymentsService';
import MarkPaidModal from './MarkPaidModal';

import { usePermissions } from '../../hooks/usePermissions';

const PaymentsPage = () => {
  const { hasPermission } = usePermissions();
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    status: ''
  });
  const [showMarkPaid, setShowMarkPaid] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<any>(null);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const { data } = await paymentService.getPayments(filters);
      setPayments(data);
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [filters]);

  const handleMarkPaid = (payment: any) => {
    setSelectedPayment(payment);
    setShowMarkPaid(true);
  };

  return (
    <div>
      <div className="card" style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Filter size={18} color="var(--secondary)" />
          <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>Filters:</span>
        </div>
        
        <select 
          value={filters.month} 
          onChange={(e) => setFilters({ ...filters, month: Number(e.target.value) })}
          style={selectStyle}
        >
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i + 1} value={i + 1}>{new Date(0, i).toLocaleString('default', { month: 'long' })}</option>
          ))}
        </select>

        <select 
          value={filters.year} 
          onChange={(e) => setFilters({ ...filters, year: Number(e.target.value) })}
          style={selectStyle}
        >
          {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
        </select>

        <select 
          value={filters.status} 
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          style={selectStyle}
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
        </select>

        <Button size="sm" onClick={fetchPayments} style={{ marginLeft: 'auto' }}>Apply</Button>
      </div>

      <div className="card">
        {loading ? <Loader /> : (
          <Table headers={['Member', 'Month/Year', 'Amount', 'Status', 'Method', 'Received By', 'Actions']}>
            {payments.map((payment) => (
              <TableRow key={payment._id}>
                <TableCell style={{ fontWeight: '600' }}>{payment.member?.fullName}</TableCell>
                <TableCell>{payment.month}/{payment.year}</TableCell>
                <TableCell>${payment.amount}</TableCell>
                <TableCell>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '6px',
                    backgroundColor: payment.status === 'paid' ? '#d1fae5' : '#fee2e2',
                    color: payment.status === 'paid' ? '#065f46' : '#991b1b',
                    fontSize: '0.8rem',
                    fontWeight: '600'
                  }}>
                    {payment.status}
                  </span>
                </TableCell>
                <TableCell>{payment.paymentMethod?.name || '-'}</TableCell>
                <TableCell>{payment.receivedBy || '-'}</TableCell>
                <TableCell>
                  {payment.status === 'pending' && hasPermission('payments', 'markPaid') && (
                    <Button size="sm" onClick={() => handleMarkPaid(payment)} variant="success">
                      <CheckCircle size={16} /> Mark Paid
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {payments.length === 0 && (
              <TableRow>
                <TableCell colspan={7} style={{ textAlign: 'center', padding: '2rem', color: 'var(--secondary)' }}>
                  No payment records found for this period
                </TableCell>
              </TableRow>
            )}
          </Table>
        )}
      </div>

      <Modal 
        isOpen={showMarkPaid} 
        onClose={() => setShowMarkPaid(false)} 
        title="Mark as Paid"
      >
        <MarkPaidModal 
          payment={selectedPayment} 
          onSuccess={() => { setShowMarkPaid(false); fetchPayments(); }} 
          onCancel={() => setShowMarkPaid(false)} 
        />
      </Modal>
    </div>
  );
};

const selectStyle = { padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border)', outline: 'none', fontSize: '0.9rem' };

export default PaymentsPage;
