import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, User, Lock, Shield, Image as ImageIcon, Mail, Camera } from 'lucide-react';
import { Table, TableRow, TableCell } from '../../components/common/Table';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Loader } from '../../components/common/Loader';
import * as userService from '../../services/usersService';
import * as rolesService from '../../services/rolesService';
import { usePermissions } from '../../hooks/usePermissions';

const UsersPage = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [formData, setFormData] = useState({ fullName: '', username: '', password: '', roleId: '' });
  const [photo, setPhoto] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { hasPermission } = usePermissions();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [{ data: usersData }, { data: rolesData }] = await Promise.all([
        userService.getUsers(),
        rolesService.getRoles()
      ]);
      setUsers(usersData);
      setRoles(rolesData);
      
      if (rolesData.length > 0 && !formData.roleId) {
        setFormData(prev => ({ ...prev, roleId: rolesData[0]._id }));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this user?')) {
      await userService.deleteUser(id);
      fetchData();
    }
  };

  const handleEdit = (user: any) => {
    setSelectedUser(user);
    setFormData({ 
      fullName: user.fullName, 
      username: user.username, 
      password: '', // Keep empty unless changing
      roleId: user.roleId?._id || '' 
    });
    setPhoto(null);
    setShowForm(true);
  };

  const handleCreateNew = () => {
    setSelectedUser(null);
    setFormData({ fullName: '', username: '', password: '', roleId: roles[0]?._id || '' });
    setPhoto(null);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const data = new FormData();
      data.append('fullName', formData.fullName);
      data.append('username', formData.username);
      if (formData.password) {
        data.append('password', formData.password);
      }
      data.append('roleId', formData.roleId);
      if (photo) {
        data.append('photo', photo);
      }

      if (selectedUser) {
        await userService.updateUser(selectedUser._id, data);
      } else {
        await userService.registerUser(data);
      }
      
      setShowForm(false);
      fetchData();
    } catch (error) {
      alert(selectedUser ? 'Error updating user' : 'Error creating user');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="text-2xl font-bold">Users Management</h1>
          <p className="text-secondary">Manage system users and their assigned roles</p>
        </div>
        {hasPermission('users', 'create') && (
          <Button onClick={handleCreateNew}>
            <Plus size={18} style={{ marginRight: '8px' }} /> Add New User
          </Button>
        )}
      </div>

      <div className="card">
        {loading ? <Loader /> : (
          <Table headers={['Photo', 'Full Name', 'Username', 'Role', 'Actions']}>
            {users.map((user) => (
              <TableRow key={user._id}>
                <TableCell>
                  <img src={user.photo || 'https://placehold.co/40'} alt="" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                </TableCell>
                <TableCell style={{ fontWeight: '600' }}>{user.fullName}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>
                  <span style={{ 
                    padding: '4px 12px', 
                    borderRadius: '20px', 
                    backgroundColor: 'rgba(var(--primary-rgb), 0.1)',
                    color: 'var(--primary)',
                    fontSize: '0.75rem',
                    fontWeight: '600'
                  }}>
                    {user.roleId?.name || 'No Role'}
                  </span>
                </TableCell>
                <TableCell>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    {hasPermission('users', 'update') && (
                      <button 
                        onClick={() => handleEdit(user)} 
                        className="btn-icon" 
                        title="Edit User"
                        style={{ color: 'var(--primary)' }}
                      >
                        <Edit size={18} />
                      </button>
                    )}
                    {hasPermission('users', 'delete') && (
                      <button 
                        onClick={() => handleDelete(user._id)} 
                        className="btn-icon" 
                        title="Delete User"
                        style={{ color: 'var(--danger)' }}
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {users.length === 0 && (
              <TableRow>
                <td colSpan={5} style={{ padding: '2rem', textAlign: 'center' }}>
                  No users found
                </td>
              </TableRow>
            )}
          </Table>
        )}
      </div>

      <Modal 
        isOpen={showForm} 
        onClose={() => setShowForm(false)} 
        title={selectedUser ? 'Edit User Profile' : 'Register New User'} 
        maxWidth="680px"
      >
        <form onSubmit={handleSubmit} style={{ animation: 'fadeIn 0.4s ease-out' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.75rem', marginBottom: '1.75rem' }}>
            <div>
              <label style={labelStyle}>
                <User size={14} style={{ marginRight: '6px' }} />
                FULL NAME
              </label>
              <input 
                type="text" 
                className="input-premium" 
                placeholder="John Doe" 
                style={inputStyle} 
                value={formData.fullName} 
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} 
                required 
              />
            </div>
            <div>
              <label style={labelStyle}>
                <Mail size={14} style={{ marginRight: '6px' }} />
                USERNAME
              </label>
              <input 
                type="text" 
                className="input-premium" 
                placeholder="johndoe" 
                style={inputStyle} 
                value={formData.username} 
                onChange={(e) => setFormData({ ...formData, username: e.target.value })} 
                required 
              />
            </div>
          </div>
          
          <div style={{ marginBottom: '1.75rem' }}>
            <label style={labelStyle}>
              <Lock size={14} style={{ marginRight: '6px' }} />
              PASSWORD {selectedUser && <span style={{ fontWeight: '400', opacity: 0.5, marginLeft: '4px' }}>(Leave blank to keep current)</span>}
            </label>
            <input 
              type="password" 
              className="input-premium" 
              placeholder="••••••••"
              style={inputStyle}
              value={formData.password} 
              onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
              required={!selectedUser} 
            />
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label style={labelStyle}>
              <Shield size={14} style={{ marginRight: '6px' }} />
              ASSIGNED ROLE
            </label>
            <div style={{ position: 'relative' }}>
              <select 
                className="input-premium" 
                style={{ ...inputStyle, appearance: 'none', paddingRight: '2.5rem' }} 
                value={formData.roleId} 
                onChange={(e) => setFormData({ ...formData, roleId: e.target.value })} 
                required
              >
                <option value="" disabled>Select a system role...</option>
                {roles.map(role => (
                  <option key={role._id} value={role._id}>{role.name}</option>
                ))}
              </select>
              <div style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--primary)' }}>
                <Plus size={18} style={{ transform: 'rotate(45deg)' }} />
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '2.5rem' }}>
            <label style={labelStyle}>
              <ImageIcon size={14} style={{ marginRight: '6px' }} />
              PROFILE PHOTO
            </label>
            <div 
              style={{ 
                border: '2px dashed #cbd5e1', 
                borderRadius: '20px', 
                padding: '2.5rem', 
                textAlign: 'center',
                backgroundColor: '#f8fafc',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px'
              }} 
              className="photo-upload-zone"
              onClick={() => document.getElementById('photo-upload')?.click()}
            >
              {photo ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                  <div style={{ background: 'var(--success)', color: 'white', borderRadius: '50%', padding: '8px' }}>
                    <Plus size={24} style={{ transform: 'rotate(45deg)' }} />
                  </div>
                  <span style={{ fontWeight: '700', color: 'var(--foreground)' }}>{photo.name}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--secondary)' }}>Click to change current selection</span>
                </div>
              ) : (
                <>
                  <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                    <Camera size={32} color="var(--primary)" />
                  </div>
                  <div>
                    <p style={{ margin: 0, color: 'var(--foreground)', fontWeight: '700', fontSize: '1rem' }}>Upload profile picture</p>
                    <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: 'var(--secondary)' }}>Select a high quality PNG or JPG (max 2MB)</p>
                  </div>
                </>
              )}
              <input 
                id="photo-upload"
                type="file" 
                accept="image/*" 
                style={{ display: 'none' }}
                onChange={(e) => setPhoto(e.target.files?.[0] || null)} 
              />
            </div>
          </div>

          <div style={{ 
            display: 'flex', 
            gap: '1.5rem', 
            justifyContent: 'flex-end',
            paddingTop: '1.5rem',
            borderTop: '1px solid #f1f5f9'
          }}>
            <Button variant="secondary" type="button" onClick={() => setShowForm(false)} style={{ borderRadius: '16px', padding: '12px 28px', fontWeight: '600' }}>
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
              {submitting ? 'Processing...' : selectedUser ? 'Update Profile' : 'Register User'}
            </Button>
          </div>
        </form>
        <style>{`
          .input-premium:focus { border-color: var(--primary) !important; box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1) !important; background: white !important; }
          .photo-upload-zone:hover { border-color: var(--primary) !important; background-color: white !important; box-shadow: 0 10px 30px -10px rgba(99, 102, 241, 0.2) !important; transform: translateY(-2px); }
        `}</style>
      </Modal>
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

export default UsersPage;
