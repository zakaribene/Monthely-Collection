import React, { useState, useEffect } from 'react';
import { Save, Info } from 'lucide-react';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { Loader } from '../../components/common/Loader';
import * as permissionService from '../../services/permissionsService';

interface RolePermissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: {
    _id: string;
    name: string;
  };
}

const PAGES = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'members', label: 'Members', icon: '👥' },
  { id: 'payments', label: 'Payments', icon: '💰' },
  { id: 'expenses', label: 'Expenses', icon: '💸' },
  { id: 'payment-methods', label: 'Payment Methods', icon: '⚙️' },

  { id: 'reports', label: 'Reports', icon: '📈' },
  { id: 'users', label: 'Users', icon: '👤' },
  { id: 'roles', label: 'Roles', icon: '🛡️' },
  { id: 'permissions', label: 'Permissions', icon: '🔑' },
];

const ACTIONS = [
  { id: 'view', label: 'View' },
  { id: 'create', label: 'Create' },
  { id: 'update', label: 'Update' },
  { id: 'delete', label: 'Delete' },
  { id: 'export', label: 'Export' },
  { id: 'markPaid', label: 'Mark Paid' },
  { id: 'assignPermissions', label: 'Assign' },
];

const RolePermissionsModal: React.FC<RolePermissionsModalProps> = ({ isOpen, onClose, role }) => {
  const [permissions, setPermissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchPermissions = async () => {
    setLoading(true);
    try {
      const { data } = await permissionService.getPermissionByRoleId(role._id);
      setPermissions(data.pages || []);
    } catch (error: any) {
      console.error('Error fetching permissions:', error);
      setPermissions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && role) {
      fetchPermissions();
    }
  }, [isOpen, role]);

  const handleToggle = (pageId: string, actionId: string) => {
    const newPerms = [...permissions];
    let pageIdx = newPerms.findIndex(p => p.name === pageId);
    
    if (pageIdx === -1) {
      newPerms.push({ name: pageId, actions: { [actionId]: true } });
    } else {
      const actions = { ...newPerms[pageIdx].actions };
      actions[actionId] = !actions[actionId];
      newPerms[pageIdx] = { ...newPerms[pageIdx], actions };
    }
    
    setPermissions(newPerms);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await permissionService.updatePermissionByRoleId(role._id, permissions);
      alert('Permissions updated successfully');
      onClose();
    } catch (error) {
      alert('Error updating permissions');
    } finally {
      setSaving(false);
    }
  };

  const isChecked = (pageId: string, actionId: string) => {
    const page = permissions.find(p => p.name === pageId);
    return page?.actions?.[actionId] || false;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Configure Permissions: ${role.name}`}
      maxWidth="1200px"
    >
      {loading ? (
        <div style={{ padding: '4rem 0' }}><Loader /></div>
      ) : (
        <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '16px', 
            background: 'rgba(99, 102, 241, 0.08)', 
            padding: '1.25rem 1.5rem', 
            borderRadius: '20px',
            marginBottom: '2rem',
            border: '1px solid rgba(99, 102, 241, 0.15)'
          }}>
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '8px',
              display: 'flex',
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)'
            }}>
              <Info size={24} color="var(--primary)" />
            </div>
            <p style={{ margin: 0, fontSize: '0.95rem', color: '#475569', lineHeight: '1.5', fontWeight: '500' }}>
              Define access levels for <span style={{ color: 'var(--primary)', fontWeight: '700' }}>{role.name}</span>. 
              Toggle actions to grant or revoke permissions. Changes apply globally upon next session.
            </p>
          </div>

          <div style={{ 
            overflow: 'hidden', 
            borderRadius: '24px', 
            border: '1px solid var(--border)',
            boxShadow: '0 10px 30px -10px rgba(0,0,0,0.1)',
            backgroundColor: 'white'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid var(--border)' }}>
                  <th style={{ ...headerStyle, padding: '20px 24px', width: '250px' }}>Module / Page</th>
                  {ACTIONS.map(action => (
                    <th key={action.id} style={{ ...headerStyle, textAlign: 'center', padding: '20px 12px' }}>
                      {action.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PAGES.map((page, idx) => (
                  <tr key={page.id} style={{ 
                    borderBottom: idx === PAGES.length - 1 ? 'none' : '1px solid #f1f5f9',
                    transition: 'all 0.2s'
                  }} className="perm-row">
                    <td style={{ padding: '20px 24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <span style={{ 
                          fontSize: '1.5rem',
                          background: '#f1f5f9',
                          padding: '8px',
                          borderRadius: '12px',
                          width: '44px',
                          height: '44px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>{page.icon}</span>
                        <span style={{ fontWeight: '700', color: 'var(--foreground)', fontSize: '1rem' }}>{page.label}</span>
                      </div>
                    </td>
                    {ACTIONS.map(action => (
                      <td key={action.id} style={{ padding: '16px 12px', textAlign: 'center' }}>
                        <div 
                          onClick={() => handleToggle(page.id, action.id)}
                          style={{
                            width: '48px',
                            height: '24px',
                            backgroundColor: isChecked(page.id, action.id) ? 'var(--success)' : '#e2e8f0',
                            borderRadius: '20px',
                            padding: '3px',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            position: 'relative'
                          }}
                        >
                          <div style={{
                            width: '18px',
                            height: '18px',
                            backgroundColor: 'white',
                            borderRadius: '50%',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            transform: isChecked(page.id, action.id) ? 'translateX(24px)' : 'translateX(0)',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                          }} />
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ 
            display: 'flex', 
            gap: '1.25rem', 
            justifyContent: 'flex-end',
            marginTop: '2.5rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid var(--border)'
          }}>
            <Button variant="secondary" onClick={onClose} style={{ borderRadius: '14px', padding: '12px 24px' }}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving} style={{ 
              borderRadius: '14px', 
              padding: '12px 32px',
              boxShadow: '0 10px 20px -5px rgba(99, 102, 241, 0.4)',
              fontWeight: '700'
            }}>
              <Save size={18} style={{ marginRight: '8px' }} />
              {saving ? 'Applying...' : 'Save Permissions'}
            </Button>
          </div>
        </div>
      )}
      <style>{`
        .perm-row:hover { background-color: #f8fafc !important; }
        .perm-row:hover td { transform: scale(1.002); }
      `}</style>
    </Modal>
  );
};

const headerStyle = {
  padding: '16px',
  fontSize: '0.75rem',
  fontWeight: '700',
  color: '#64748b',
  textTransform: 'uppercase' as const,
  textAlign: 'left' as const,
  letterSpacing: '0.05em'
};

export default RolePermissionsModal;
