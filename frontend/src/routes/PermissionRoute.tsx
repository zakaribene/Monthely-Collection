import React from 'react';
import { Navigate } from 'react-router-dom';
import { usePermissions } from '../hooks/usePermissions';

interface PermissionRouteProps {
  children: React.ReactNode;
  page: string;
  action?: string;
}

const PermissionRoute = ({ children, page, action = 'view' }: PermissionRouteProps) => {
  const { hasPermission, getFirstAllowedPage } = usePermissions();

  if (!hasPermission(page, action)) {
    return <Navigate to={getFirstAllowedPage()} replace />;
  }

  return <>{children}</>;
};

export default PermissionRoute;
