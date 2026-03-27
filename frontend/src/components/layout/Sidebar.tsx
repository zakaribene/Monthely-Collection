import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  CreditCard,
  Receipt,
  Settings, 
  BarChart3, 
  UserCog, 
  ShieldCheck, 
  LogOut 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { usePermissions } from '../../hooks/usePermissions';

const Sidebar = () => {
  const { logout } = useAuth();
  const { hasPermission } = usePermissions();

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} />, page: 'dashboard' },
    { name: 'Members', path: '/members', icon: <Users size={20} />, page: 'members' },
    { name: 'Payments', path: '/payments', icon: <CreditCard size={20} />, page: 'payments' },
    { name: 'Expenses', path: '/expenses', icon: <Receipt size={20} />, page: 'expenses' },
    { name: 'Payment Methods', path: '/payment-methods', icon: <Settings size={20} />, page: 'payment-methods' },
    { name: 'Reports', path: '/reports', icon: <BarChart3 size={20} />, page: 'reports' },
    { name: 'Users', path: '/users', icon: <UserCog size={20} />, page: 'users' },
    { name: 'Roles', path: '/roles', icon: <ShieldCheck size={20} />, page: 'roles' },
  ].filter(item => hasPermission(item.page, 'view'));


  return (
    <div className="sidebar" style={{
      width: '260px',
      backgroundColor: 'var(--sidebar-bg)',
      color: 'var(--sidebar-text)',
      height: '100vh',
      position: 'fixed',
      left: 0,
      top: 0,
      display: 'flex',
      flexDirection: 'column',
      padding: '1.5rem 1rem'
    }}>
      <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '2rem', textAlign: 'center' }}>
        FinanceHub
      </div>
      
      <nav style={{ flex: 1 }}>
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              color: 'var(--sidebar-text)',
              textDecoration: 'none',
              borderRadius: '8px',
              marginBottom: '4px',
              backgroundColor: isActive ? 'var(--primary)' : 'transparent',
              transition: 'background-color 0.2s'
            })}
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <button 
        onClick={logout}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '12px 16px',
          color: '#fb7185',
          backgroundColor: 'transparent',
          border: 'none',
          textAlign: 'left',
          width: '100%',
          borderRadius: '8px',
          marginTop: 'auto'
        }}
      >
        <LogOut size={20} />
        <span>Logout</span>
      </button>
    </div>
  );
};

export default Sidebar;
