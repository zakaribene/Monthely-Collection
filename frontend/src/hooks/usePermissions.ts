import { useAuth } from '../context/AuthContext';

export const usePermissions = () => {
  const { userInfo } = useAuth();

  const hasPermission = (page: string, action: string) => {
    if (!userInfo) return false;
    
    const permissions = userInfo.permissions;
    if (!permissions || !Array.isArray(permissions)) return false;

    const pagePerm = permissions.find((p: any) => p.name === page);
    if (!pagePerm || !pagePerm.actions) return false;
    
    return !!pagePerm.actions[action];
  };

  const getFirstAllowedPage = () => {
    if (!userInfo) return '/login';

    const pages = [
      { name: 'dashboard', path: '/dashboard' },
      { name: 'members', path: '/members' },
      { name: 'payments', path: '/payments' },
      { name: 'payment-methods', path: '/payment-methods' },
      { name: 'reports', path: '/reports' },
      { name: 'users', path: '/users' },
      { name: 'roles', path: '/roles' },
      { name: 'permissions', path: '/permissions' },
    ];

    for (const page of pages) {
      if (hasPermission(page.name, 'view')) {
        return page.path;
      }
    }

    return '/profile'; // Fallback
  };

  return { 
    hasPermission, 
    getFirstAllowedPage, 
    role: userInfo?.role,
    roleId: userInfo?.roleId 
  };
};
