import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Shield, Search, FileText } from 'lucide-react';
import { Table, TableRow, TableCell } from '../../components/common/Table';
import { Button } from '../../components/common/Button';
import { Loader } from '../../components/common/Loader';
import { Modal } from '../../components/common/Modal';
import * as rolesService from '../../services/rolesService';
import RolePermissionsModal from './RolePermissionsModal.tsx';
import { usePermissions } from '../../hooks/usePermissions';

const RolesPage = () => {
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showPermModal, setShowPermModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<any>(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [submitting, setSubmitting] = useState(false);
  
  const { hasPermission } = usePermissions();

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const { data } = await rolesService.getRoles();
      setRoles(data);
    } catch (error) {
      console.error('Error fetching roles:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleCreate = () => {
    setSelectedRole(null);
    setFormData({ name: '', description: '' });
    setShowModal(true);
  };

  const handleEdit = (role: any) => {
    setSelectedRole(role);
    setFormData({ name: role.name, description: role.description });
    setShowModal(true);
  };

  const handleDelete = async (role: any) => {
    if (window.confirm(`Are you sure you want to delete role "${role.name}"?`)) {
      try {
        await rolesService.deleteRole(role._id);
        fetchRoles();
      } catch (error: any) {
        alert(error.response?.data?.message || 'Error deleting role');
      }
    }
  };

  const handleManagePermissions = (role: any) => {
    setSelectedRole(role);
    setShowPermModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (selectedRole) {
        await rolesService.updateRole(selectedRole._id, formData);
      } else {
        await rolesService.createRole(formData);
      }
      setShowModal(false);
      fetchRoles();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error saving role');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredRoles = roles.filter(role => 
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-fade-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="text-2xl font-bold">Roles Management</h1>
          <p className="text-secondary">Create and manage system roles and permissions</p>
        </div>
        {hasPermission('roles', 'create') && (
          <Button onClick={handleCreate}>
            <Plus size={18} style={{ marginRight: '8px' }} /> Create New Role
          </Button>
        )}
      </div>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{ position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--secondary)' }} />
          <input
            type="text"
            placeholder="Search roles by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input"
            style={{ paddingLeft: '40px' }}
          />
        </div>
      </div>

      <div className="card">
        {loading ? (
          <Loader />
        ) : (
          <Table headers={['Role Name', 'Description', 'Created Date', 'Actions']}>
            {filteredRoles.map((role) => (
              <TableRow key={role._id}>
                <TableCell>
                  <div style={{ fontWeight: '600', color: 'var(--primary)' }}>{role.name}</div>
                </TableCell>
                <TableCell>{role.description}</TableCell>
                <TableCell>{new Date(role.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    {hasPermission('roles', 'assignPermissions') && (
                      <button 
                        onClick={() => handleManagePermissions(role)}
                        className="btn-icon" 
                        title="Manage Permissions"
                        style={{ color: 'var(--success)' }}
                      >
                        <Shield size={18} />
                      </button>
                    )}
                    {hasPermission('roles', 'update') && (
                      <button 
                        onClick={() => handleEdit(role)} 
                        className="btn-icon" 
                        title="Edit Role"
                        style={{ color: 'var(--primary)' }}
                      >
                        <Edit size={18} />
                      </button>
                    )}
                    {hasPermission('roles', 'delete') && (
                      <button 
                        onClick={() => handleDelete(role)} 
                        className="btn-icon" 
                        title="Delete Role"
                        style={{ color: 'var(--danger)' }}
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filteredRoles.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} style={{ padding: '2rem', textAlign: 'center' }}>
                  No roles found
                </TableCell>
              </TableRow>
            )}
          </Table>
        )}
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={selectedRole ? 'Edit Role' : 'Create New Role'}
        maxWidth="580px"
      >
        <form onSubmit={handleSubmit} style={{ animation: 'fadeIn 0.4s ease-out' }}>
          <div style={{ marginBottom: '2rem' }}>
            <label style={labelStyle}>
              <Shield size={16} style={{ marginRight: '6px' }} />
              ROLE NAME
            </label>
            <input 
              type="text" 
              className="input-premium" 
              placeholder="e.g. System Administrator"
              style={inputStyle}
              value={formData.name} 
              onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
              required 
            />
          </div>
          <div style={{ marginBottom: '2.5rem' }}>
            <label style={labelStyle}>
              <FileText size={16} style={{ marginRight: '6px' }} />
              DESCRIPTION
            </label>
            <textarea 
              className="input-premium" 
              placeholder="Briefly describe what users with this role can do..."
              style={{ ...inputStyle, minHeight: '130px', resize: 'none', lineHeight: '1.6' }}
              value={formData.description} 
              onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
              required
            />
          </div>
          <div style={{ 
            display: 'flex', 
            gap: '1.5rem', 
            justifyContent: 'flex-end',
            paddingTop: '1.5rem',
            borderTop: '1px solid #f1f5f9'
          }}>
            <Button variant="secondary" type="button" onClick={() => setShowModal(false)} style={{ borderRadius: '16px', padding: '12px 28px', fontWeight: '600' }}>
              Dismiss
            </Button>
            <Button type="submit" disabled={submitting} style={{ 
              borderRadius: '16px', 
              padding: '12px 40px',
              background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
              boxShadow: '0 10px 25px -5px rgba(99, 102, 241, 0.4)',
              fontWeight: '800',
              color: 'white'
            }}>
              {submitting ? 'Saving...' : selectedRole ? 'Update Role' : 'Create Role'}
            </Button>
          </div>
        </form>
        <style>{`
          .input-premium:focus { border-color: var(--primary) !important; box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1) !important; background: white !important; }
        `}</style>
      </Modal>

      {showPermModal && selectedRole && (
        <RolePermissionsModal
          isOpen={showPermModal}
          onClose={() => setShowPermModal(false)}
          role={selectedRole}
        />
      )}
    </div>
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

export default RolesPage;
