import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Eye } from 'lucide-react';
import { Table, TableRow, TableCell } from '../../components/common/Table';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Loader } from '../../components/common/Loader';
import * as memberService from '../../services/membersService';
import MemberForm from './MemberForm';
import MemberDetailsModal from './MemberDetailsModal';
import { usePermissions } from '../../hooks/usePermissions';

const MembersPage = () => {
  const [members, setMembers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const { hasPermission } = usePermissions();

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const { data } = await memberService.getMembers();
      setMembers(data);
    } catch (error) {
      console.error('Error fetching members:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const filteredMembers = members.filter(m =>
    m.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.phone.includes(searchTerm)
  );

  const handleEdit = (member: any) => {
    setSelectedMember(member);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      try {
        await memberService.deleteMember(id);
        fetchMembers();
      } catch (error) {
        alert('Failed to delete member');
      }
    }
  };

  const handleShowDetails = (member: any) => {
    setSelectedMember(member);
    setShowDetails(true);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div style={{ position: 'relative', width: '300px' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--secondary)' }} />
          <input
            type="text"
            placeholder="Search members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 16px 10px 40px',
              borderRadius: '10px',
              border: '1px solid var(--border)',
              outline: 'none'
            }}
          />
        </div>
        {hasPermission('members', 'create') && (
          <Button onClick={() => { setSelectedMember(null); setShowForm(true); }}>
            <Plus size={18} /> Add Member
          </Button>
        )}
      </div>

      <div className="card">
        {loading ? <Loader /> : (
          <Table headers={['Photo', 'Full Name', 'Phone', 'Address', 'Amount', 'Actions']}>
            {filteredMembers.map((member) => (
              <TableRow key={member._id}>
                <TableCell>
                  <img
                    src={member.photo || 'https://placehold.co/40'}
                    alt=""
                    style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                </TableCell>
                <TableCell style={{ fontWeight: '600' }}>{member.fullName}</TableCell>
                <TableCell>{member.phone}</TableCell>
                <TableCell>{member.address}</TableCell>
                <TableCell>${member.monthlyAmount}</TableCell>
                <TableCell>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Button variant="outline" size="sm" onClick={() => handleShowDetails(member)}>
                      <Eye size={16} />
                    </Button>
                    {hasPermission('members', 'update') && (
                      <Button variant="outline" size="sm" onClick={() => handleEdit(member)}>
                        <Edit2 size={16} />
                      </Button>
                    )}
                    {hasPermission('members', 'delete') && (
                      <Button variant="outline" size="sm" onClick={() => handleDelete(member._id)} style={{ color: 'var(--danger)' }}>
                        <Trash2 size={16} />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filteredMembers.length === 0 && (
              <TableRow>
                <TableCell colspan={6} style={{ textAlign: 'center', padding: '2rem', color: 'var(--secondary)' }}>
                  No members found
                </TableCell>
              </TableRow>
            )}
          </Table>
        )}
      </div>

      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title={selectedMember ? 'Edit Member' : 'Add New Member'}
      >
        <MemberForm
          member={selectedMember}
          onSuccess={() => { setShowForm(false); fetchMembers(); }}
          onClose={() => setShowForm(false)}
        />
      </Modal>

      {showDetails && (
        <MemberDetailsModal
          isOpen={showDetails}
          onClose={() => setShowDetails(false)}
          memberId={selectedMember?._id}
        />
      )}
    </div>
  );
};

export default MembersPage;
