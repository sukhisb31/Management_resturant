import React, { createContext, useState, useContext, useEffect } from 'react';

// Define user roles and their permissions
export const USER_ROLES = {
  GUEST: 'guest',
  CUSTOMER: 'CUSTOMER',
  EMPLOYEE: 'EMPLOYEE',
  EMPLOYER: 'EMPLOYER',
  ADMIN: 'ADMIN',
  SUPER_ADMIN: 'SUPER_ADMIN'
};

// Define which routes are accessible to each role
export const ROUTE_PERMISSIONS = {
  '/': [USER_ROLES.GUEST, USER_ROLES.CUSTOMER, USER_ROLES.EMPLOYEE, USER_ROLES.EMPLOYER, USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN],
  '/menu': [USER_ROLES.GUEST, USER_ROLES.CUSTOMER, USER_ROLES.EMPLOYEE, USER_ROLES.EMPLOYER, USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN],
  '/login': [USER_ROLES.GUEST],
  '/signup': [USER_ROLES.GUEST],
  '/contact': [USER_ROLES.GUEST, USER_ROLES.CUSTOMER, USER_ROLES.EMPLOYEE, USER_ROLES.EMPLOYER, USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN],
  '/feedback': [USER_ROLES.GUEST, USER_ROLES.CUSTOMER, USER_ROLES.EMPLOYEE, USER_ROLES.EMPLOYER, USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN],
  '/order-placement': [USER_ROLES.CUSTOMER, USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN],
  '/orders': [USER_ROLES.EMPLOYEE, USER_ROLES.EMPLOYER, USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN],
  '/reservations': [USER_ROLES.CUSTOMER, USER_ROLES.EMPLOYEE, USER_ROLES.EMPLOYER, USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN],
  '/profile': [USER_ROLES.CUSTOMER, USER_ROLES.EMPLOYEE, USER_ROLES.EMPLOYER, USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN],
  '/customers': [USER_ROLES.EMPLOYEE, USER_ROLES.EMPLOYER, USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN],
  '/inventory': [USER_ROLES.EMPLOYEE, USER_ROLES.EMPLOYER, USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN],
  '/employees': [USER_ROLES.EMPLOYER, USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN],
  '/employer-dashboard': [USER_ROLES.EMPLOYER, USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN],
  '/reports': [USER_ROLES.EMPLOYER, USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN],
  '/settings': [USER_ROLES.EMPLOYER, USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN],
  '/super-admin': [USER_ROLES.SUPER_ADMIN],
  '/super-admin/dashboard': [USER_ROLES.SUPER_ADMIN],
  '/unauthorized': [USER_ROLES.GUEST, USER_ROLES.CUSTOMER, USER_ROLES.EMPLOYEE, USER_ROLES.EMPLOYER, USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN]
};

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

// Add these functions before the AuthProvider component
const generateAdminId = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let id = '';
  for (let i = 0; i < 8; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
};

const validateAdminId = (adminId) => {
  // Check if adminId exists in localStorage
  const adminIds = JSON.parse(localStorage.getItem('adminIds') || '[]');
  return adminIds.some(admin => admin.id === adminId && admin.isActive);
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing authentication on mount
    const storedAuth = localStorage.getItem('isAuthenticated');
    const storedEmail = localStorage.getItem('userEmail');
    const storedRole = localStorage.getItem('userRole');

    if (storedAuth === 'true' && storedEmail && storedRole) {
      setIsAuthenticated(true);
      setCurrentUser({ email: storedEmail });
      setUserRole(storedRole);
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password, adminId = null) => {
    try {
      // Check for super admin credentials
      if (email === 'sukhisb31@gmail.com' && password === '123456789') {
        setIsAuthenticated(true);
        setCurrentUser({ email });
        setUserRole(USER_ROLES.SUPER_ADMIN);
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userRole', USER_ROLES.SUPER_ADMIN);
        return true;
      }

      // Check for employer login
      if (adminId) {
        const savedEmployerIds = JSON.parse(localStorage.getItem('employerIds') || '[]');
        const validEmployer = savedEmployerIds.find(
          emp => emp.id === adminId && 
          emp.isActive && 
          new Date(emp.validUntil) > new Date()
        );

        if (validEmployer) {
          setIsAuthenticated(true);
          setCurrentUser({ email });
          setUserRole(USER_ROLES.EMPLOYER);
          localStorage.setItem('isAuthenticated', 'true');
          localStorage.setItem('userEmail', email);
          localStorage.setItem('userRole', USER_ROLES.EMPLOYER);
          return true;
        }
      }

      // Regular customer login
      setIsAuthenticated(true);
      setCurrentUser({ email });
      setUserRole(USER_ROLES.CUSTOMER);
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userEmail', email);
      localStorage.setItem('userRole', USER_ROLES.CUSTOMER);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setUserRole(null);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
  };

  const hasPermission = (route) => {
    if (!userRole) return false;
    return ROUTE_PERMISSIONS[route]?.includes(userRole) || false;
  };

  const isEmployee = () => userRole === USER_ROLES.EMPLOYEE;
  const isEmployer = () => userRole === USER_ROLES.EMPLOYER;
  const isAdmin = () => userRole === USER_ROLES.ADMIN;
  const isSuperAdmin = () => userRole === USER_ROLES.SUPER_ADMIN;

  const value = {
    isAuthenticated,
    currentUser,
    userRole,
    login,
    logout,
    hasPermission,
    isEmployee,
    isEmployer,
    isAdmin,
    isSuperAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 