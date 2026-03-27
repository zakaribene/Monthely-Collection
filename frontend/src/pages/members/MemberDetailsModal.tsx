import React, { useState, useEffect } from 'react';
import { Modal } from '../../components/common/Modal';
import { Table, TableRow, TableCell } from '../../components/common/Table';
import { Loader } from '../../components/common/Loader';
import * as memberService from '../../services/membersService';
import { usePermissions } from '../../hooks/usePermissions';

const MemberDetailsModal = ({ isOpen, onClose, memberId }: any) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { hasPermission } = usePermissions();

  useEffect(() => {
    if (memberId && isOpen) {
      const fetchDetails = async () => {
        setLoading(true);
        try {
          const { data } = await memberService.getMemberDetails(memberId);
          setData(data);
        } catch (error) {
          console.error('Error fetching member details:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchDetails();
    }
  }, [memberId, isOpen]);

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Member Details & History">
      {loading ? <Loader /> : (
        <div>
          <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem', alignItems: 'center' }}>
            <img 
              src={data.member.photo || 'https://placehold.co/80'} 
              alt="" 
              style={{ width: '80px', height: '80px', borderRadius: '12px', objectFit: 'cover' }} 
            />
            <div>
              <h3 style={{ marginBottom: '4px' }}>{data.member.fullName}</h3>
              <p style={{ color: 'var(--secondary)', fontSize: '0.9rem' }}>{data.member.phone}</p>
              <p style={{ color: 'var(--secondary)', fontSize: '0.9rem' }}>{data.member.address}</p>
              <p style={{ fontWeight: '600', marginTop: '8px' }}>Monthly: ${data.member.monthlyAmount}</p>
            </div>
          </div>

          {hasPermission('payments', 'view') && (
            <>
              <h4 style={{ marginBottom: '1rem' }}>Payment History</h4>
              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                <Table headers={['Month/Year', 'Amount', 'Status', 'Method']}>
                  {data.history.map((p: any) => (
                    <TableRow key={p._id}>
                      <TableCell>{p.month}/{p.year}</TableCell>
                      <TableCell>${p.amount}</TableCell>
                      <TableCell>
                        <span style={{
                          padding: '4px 8px',
                          borderRadius: '6px',
                          backgroundColor: p.status === 'paid' ? '#d1fae5' : '#fee2e2',
                          color: p.status === 'paid' ? '#065f46' : '#991b1b',
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          textTransform: 'capitalize'
                        }}>
                          {p.status}
                        </span>
                      </TableCell>
                      <TableCell>{p.paymentMethod?.name || '-'}</TableCell>
                    </TableRow>
                  ))}
                  {data.history.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} style={{ textAlign: 'center', padding: '1rem', color: 'var(--secondary)' }}>
                        No payment history
                      </TableCell>
                    </TableRow>
                  )}
                </Table>
              </div>
            </>
          )}
        </div>
      )}
    </Modal>
  );
};

export default MemberDetailsModal;
