import React, { useState, useEffect } from 'react';
import { Shield, Save } from 'lucide-react';
import { Table, TableRow, TableCell } from '../../components/common/Table';
import { Button } from '../../components/common/Button';
import { Loader } from '../../components/common/Loader';
import * as permissionService from '../../services/permissionsService';

const PAGES = ['dashboard', 'members', 'payments', 'paymentMethods', 'reports', 'users', 'permissions'];
const ACTIONS = ['view', 'create', 'update', 'delete', 'markPaid', 'exportPdf', 'exportExcel', 'assignPermissions'];

const PermissionsPage = () => {
  const [selectedRole, setSelectedRole] = useState('Staff');
  const [permissions, setPermissions] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchPermissions = async () => {
    setLoading(true);
    try {
      const { data } = await permissionService.getPermissionByRole(selectedRole);
      setPermissions(data.permissions || {});
    } catch (error) {
      setPermissions({}); // Clear if not found
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, [selectedRole]);

  const handleToggle = (page: string, action: string) => {
    const newPerms = { ...permissions };
    if (!newPerms[page]) newPerms[page] = {};
    newPerms[page][action] = !newPerms[page][action];
    setPermissions(newPerms);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await permissionService.updatePermission(selectedRole, permissions);
      alert('Permissions saved successfully');
    } catch (error) {
      alert('Error saving permissions');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="card" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <label style={{ fontWeight: '600' }}>Select Role:</label>
          <select 
            value={selectedRole} 
            onChange={(e) => setSelectedRole(e.target.value)}
            style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border)', outline: 'none' }}
          >
            <option value="Staff">Staff</option>
            <option value="Manager">Manager</option>
          </select>
        </div>
        <Button onClick={handleSave} disabled={saving || selectedRole === 'Admin'}>
          <Save size={18} /> {saving ? 'Saving...' : 'Save Matrix'}
        </Button>
      </div>

      <div className="card">
        {loading ? <Loader /> : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border)' }}>
                  <th style={headerStyle}>Page / Module</th>
                  {ACTIONS.map(action => <th key={action} style={headerStyle}>{action.replace(/([A-Z])/g, ' $1').toLowerCase()}</th>)}
                </tr>
              </thead>
              <tbody>
                {PAGES.map(page => (
                  <tr key={page} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '16px', fontWeight: '600', textTransform: 'capitalize' }}>{page.replace(/([A-Z])/g, ' $1')}</td>
                    {ACTIONS.map(action => (
                      <td key={action} style={{ padding: '16px', textAlign: 'center' }}>
                        <input 
                          type="checkbox" 
                          checked={permissions[page]?.[action] || false}
                          onChange={() => handleToggle(page, action)}
                          disabled={selectedRole === 'Admin'}
                          style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

const headerStyle = { padding: '12px 16px', fontSize: '0.75rem', color: 'var(--secondary)', textTransform: 'uppercase' as const };

export default PermissionsPage;
