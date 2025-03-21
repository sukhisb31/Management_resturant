import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * ProtectedRoute - A component that controls access to routes based on user authentication and role
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - The child components to render if access is allowed
 */
const ProtectedRoute = ({ children }) => {
  const { hasPermission, isAuthenticated } = useAuth();
  const location = useLocation();
  
  // Check if the current user has permission to access this route
  const hasAccess = hasPermission(location.pathname);
  
  // For login and signup routes, redirect to home if already authenticated
  if ((location.pathname === '/login' || location.pathname === '/signup') && isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  
  // If user doesn't have permission, redirect to login or appropriate page
  if (!hasAccess) {
    // Store the current location for redirecting back after login
    if (!isAuthenticated) {
      localStorage.setItem('redirectAfterLogin', location.pathname);
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
    
    // If authenticated but still doesn't have access, redirect to home (unauthorized)
    return <Navigate to="/" state={{ unauthorized: true, from: location }} replace />;
  }
  
  // If access is allowed, render the children
  return children;
};

export default ProtectedRoute; 