import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import Sidebar from './components/layout/Sidebar';
import Navbar from './components/layout/Navbar';
import { usePermissions } from './hooks/usePermissions';

// Lazy load pages
import LoginPage from './pages/login/LoginPage.tsx';
import DashboardPage from './pages/dashboard/DashboardPage.tsx';
import MembersPage from './pages/members/MembersPage.tsx';
import PaymentsPage from './pages/payments/PaymentsPage.tsx';
import PaymentMethodsPage from './pages/paymentMethods/PaymentMethodsPage.tsx';
import ReportsPage from './pages/reports/ReportsPage.tsx';
import UsersPage from './pages/users/UsersPage.tsx';
import RolesPage from './pages/roles/RolesPage.tsx';
import PermissionsPage from './pages/permissions/PermissionsPage.tsx';
import ProfilePage from './pages/profile/ProfilePage.tsx';
import ExpensesPage from './pages/expenses/ExpensesPage.tsx';


import { useAutoLogout } from './utils/autoLogout';

import PermissionRoute from './routes/PermissionRoute';

const App = () => {
  const { logout } = useAuth();
  const { getFirstAllowedPage } = usePermissions();
  
  // Use auto logout logic
  useAutoLogout(logout);

  return (
    <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <div className="app-container">
                <Sidebar />
                <div className="main-content">
                  <Navbar />
                  <Routes>
                    <Route path="/dashboard" element={<PermissionRoute page="dashboard"><DashboardPage /></PermissionRoute>} />
                    <Route path="/members" element={<PermissionRoute page="members"><MembersPage /></PermissionRoute>} />
                    <Route path="/payments" element={<PermissionRoute page="payments"><PaymentsPage /></PermissionRoute>} />
                    <Route path="/expenses" element={<PermissionRoute page="expenses"><ExpensesPage /></PermissionRoute>} />

                    <Route path="/payment-methods" element={<PermissionRoute page="payment-methods"><PaymentMethodsPage /></PermissionRoute>} />
                    <Route path="/reports" element={<PermissionRoute page="reports"><ReportsPage /></PermissionRoute>} />
                    <Route path="/users" element={<PermissionRoute page="users"><UsersPage /></PermissionRoute>} />
                    <Route path="/roles" element={<PermissionRoute page="roles"><RolesPage /></PermissionRoute>} />
                    <Route path="/permissions" element={<PermissionRoute page="permissions"><PermissionsPage /></PermissionRoute>} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/" element={<Navigate to={getFirstAllowedPage()} replace />} />
                  </Routes>
                </div>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
  );
};

export default App;
