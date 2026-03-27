import React from 'react';
import { Table, TableRow, TableCell } from '../../components/common/Table';

const RecentPayments = ({ payments }: { payments: any[] }) => {
  return (
    <div className="card">
      <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>Recent Payments</h3>
      <Table headers={['Member', 'Month', 'Amount', 'Method', 'Date']}>
        {payments?.map((payment) => (
          <TableRow key={payment._id}>
            <TableCell>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <img 
                  src={payment.member?.photo || 'https://placehold.co/32'} 
                  alt="" 
                  style={{ width: '32px', height: '32px', borderRadius: '50%' }} 
                />
                {payment.member?.fullName}
              </div>
            </TableCell>
            <TableCell>{payment.month}/{payment.year}</TableCell>
            <TableCell style={{ fontWeight: '600' }}>${payment.amount}</TableCell>
            <TableCell>
              <span style={{
                padding: '4px 8px',
                borderRadius: '6px',
                backgroundColor: '#f1f5f9',
                fontSize: '0.8rem'
              }}>
                {payment.paymentMethod?.name || 'N/A'}
              </span>
            </TableCell>
            <TableCell>{new Date(payment.datePaid).toLocaleDateString()}</TableCell>
          </TableRow>
        ))}
        {(!payments || payments.length === 0) && (
          <TableRow>
            <TableCell colspan={5} style={{ textAlign: 'center', color: 'var(--secondary)', padding: '2rem' }}>
              No recent payments found
            </TableCell>
          </TableRow>
        )}
      </Table>
    </div>
  );
};

export default RecentPayments;
