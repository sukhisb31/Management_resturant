import React, { createContext, useState, useContext, useEffect } from 'react';

// Define user roles and their permissions
export const USER_ROLES = {
  GUEST: 'guest',
  CUSTOMER: 'customer',
  EMPLOYEE: 'employee',
  ADMIN: 'admin',
};

// Define which routes are accessible to each role
export const ROUTE_PERMISSIONS = {
  '/': [USER_ROLES.GUEST, USER_ROLES.CUSTOMER, USER_ROLES.EMPLOYEE, USER_ROLES.ADMIN],
  '/menu': [USER_ROLES.GUEST, USER_ROLES.CUSTOMER, USER_ROLES.EMPLOYEE, USER_ROLES.ADMIN],
  '/login': [USER_ROLES.GUEST],
  '/signup': [USER_ROLES.GUEST],
  '/contact': [USER_ROLES.GUEST, USER_ROLES.CUSTOMER, USER_ROLES.EMPLOYEE, USER_ROLES.ADMIN],
  '/feedback': [USER_ROLES.GUEST, USER_ROLES.CUSTOMER, USER_ROLES.EMPLOYEE, USER_ROLES.ADMIN],
  '/order-placement': [USER_ROLES.CUSTOMER, USER_ROLES.ADMIN],
  '/orders': [USER_ROLES.CUSTOMER, USER_ROLES.EMPLOYEE, USER_ROLES.ADMIN],
  '/reservations': [USER_ROLES.CUSTOMER, USER_ROLES.EMPLOYEE, USER_ROLES.ADMIN],
  '/profile': [USER_ROLES.CUSTOMER, USER_ROLES.EMPLOYEE, USER_ROLES.ADMIN],
  '/customers': [USER_ROLES.EMPLOYEE, USER_ROLES.ADMIN],
  '/inventory': [USER_ROLES.EMPLOYEE, USER_ROLES.ADMIN],
  '/employees': [USER_ROLES.ADMIN],
};

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(USER_ROLES.GUEST);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated on component mount
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const storedEmail = localStorage.getItem('userEmail');
    const storedRole = localStorage.getItem('userRole');
    
    if (isAuthenticated && storedEmail) {
      setCurrentUser({
        email: storedEmail,
      });
      setUserRole(storedRole || USER_ROLES.CUSTOMER); // Default to customer if no role stored
    } else {
      setCurrentUser(null);
      setUserRole(USER_ROLES.GUEST);
    }
    
    setIsLoading(false);
  }, []);

  // Login function
  const login = (email, password, role = USER_ROLES.CUSTOMER) => {
    // In a real application, you would validate credentials with your API
    // and retrieve the user's role and other details from the response
    
    // For this demo, we'll simulate a successful login
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userEmail', email);
    localStorage.setItem('userRole', role);
    
    setCurrentUser({
      email: email,
    });
    setUserRole(role);
    
    return true;
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    
    setCurrentUser(null);
    setUserRole(USER_ROLES.GUEST);
  };

  // Check if a user has permission to access a specific route
  const hasPermission = (path) => {
    // Extract the base path (e.g., "/orders/123" → "/orders")
    const basePath = '/' + path.split('/')[1];
    
    // Check if the current user role has permission to access this route
    const allowedRoles = ROUTE_PERMISSIONS[basePath] || [];
    return allowedRoles.includes(userRole);
  };

  // Determine if a user is an employee (including admin)
  const isEmployee = () => {
    return userRole === USER_ROLES.EMPLOYEE || userRole === USER_ROLES.ADMIN;
  };

  // Determine if a user is an admin
  const isAdmin = () => {
    return userRole === USER_ROLES.ADMIN;
  };

  const value = {
    currentUser,
    userRole,
    login,
    logout,
    hasPermission,
    isEmployee,
    isAdmin,
    isAuthenticated: !!currentUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 