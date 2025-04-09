import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import { AuthProvider, useAuth } from './contexts/AuthContext';
// Remove this import since you're defining it locally
// import ProtectedRoute from './components/ProtectedRoute';
import UnauthorizedAccess from './components/UnauthorizedAccess';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Reservations from './pages/Reservations';
import Contact from './pages/Contact';
import Orders from './pages/Orders';
import Customers from './pages/Customers';
import Inventory from './pages/Inventory';
import Employees from './pages/Employees';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Feedback from './pages/Feedback';
import OrderPlacement from './pages/OrderPlacement';
import OrderPlaced from './pages/OrderPlaced';
import ShippingAddress from './pages/ShippingAddress';
import Profile from './pages/Profile';
import LoginPage from './pages/LoginPage';
import EmployerDashboard from './pages/EmployerDashboard';
import ManageEmployerIds from './pages/ManageEmployerIds';
import SuperAdmin from './pages/SuperAdmin';
import './App.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#FF4B2B',
    },
    secondary: {
      main: '#2B2B2B',
    },
    error: {
      main: '#f44336',
    }
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '3.5rem',
      fontWeight: 700,
    },
    h2: {
      fontSize: '2.5rem',
      fontWeight: 600,
    },
    h3: {
      fontSize: '2rem',
      fontWeight: 600,
    },
    h4: {
      fontSize: '1.75rem',
      fontWeight: 600,
    },
    h5: {
      fontSize: '1.5rem',
      fontWeight: 500,
    },
    h6: {
      fontSize: '1.25rem',
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          padding: '8px 24px',
        },
      },
    },
  },
});

// Component to handle unauthorized access and redirect
const UnauthorizedRedirect = () => {
  const location = useLocation();
  
  useEffect(() => {
    console.log('Unauthorized access attempt to:', location.pathname);
  }, [location]);
  
  return <Navigate to="/unauthorized" replace />;
};

// Keep your local definition of ProtectedRoute
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, hasPermission } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Define public routes that don't require authentication
    const publicRoutes = ['/login', '/signup', '/menu', '/contact', '/', '/feedback'];
    const isPublicRoute = publicRoutes.includes(location.pathname);
    
    // Only redirect to login if not authenticated AND not on a public route
    if (!isAuthenticated && !isPublicRoute) {
      // Store the attempted path for redirection after login
      localStorage.setItem('redirectPath', location.pathname);
      navigate('/login');
    }
  }, [isAuthenticated, location.pathname, navigate]);
  
  // Check if user has permission to access the route only if authentication is required
  const publicRoutes = ['/login', '/signup', '/menu', '/contact', '/', '/feedback'];
  const isPublicRoute = publicRoutes.includes(location.pathname);
  
  if (!isPublicRoute && isAuthenticated) {
    const hasAccess = hasPermission(location.pathname);
    if (!hasAccess) {
      return <Navigate to="/" replace />;
    }
  }
  
  return children;
};

function App() {
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        document.body.classList.add('scrolled-page');
      } else {
        document.body.classList.remove('scrolled-page');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <Router>
          <div className="App" style={{ 
            display: 'flex', 
            flexDirection: 'column',
            minHeight: '100vh'
          }}>
            <Navbar />
            <main style={{ flex: 1 }}>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                } />
                <Route path="/menu" element={
                  <ProtectedRoute>
                    <Menu />
                  </ProtectedRoute>
                } />
                <Route path="/contact" element={
                  <ProtectedRoute>
                    <Contact />
                  </ProtectedRoute>
                } />
                <Route path="/login" element={
                  <ProtectedRoute>
                    <Login />
                  </ProtectedRoute>
                } />
                <Route path="/signup" element={
                  <ProtectedRoute>
                    <Signup />
                  </ProtectedRoute>
                } />
                <Route path="/feedback" element={
                  <ProtectedRoute>
                    <Feedback />
                  </ProtectedRoute>
                } />
                
                {/* Customer routes */}
                <Route path="/reservations" element={
                  <ProtectedRoute>
                    <Reservations />
                  </ProtectedRoute>
                } />
                <Route path="/orders" element={
                  <ProtectedRoute>
                    <Orders />
                  </ProtectedRoute>
                } />
                <Route path="/order-placement" element={
                  <ProtectedRoute>
                    <OrderPlacement />
                  </ProtectedRoute>
                } />
                <Route path="/shipping-address" element={
                  <ProtectedRoute>
                    <ShippingAddress />
                  </ProtectedRoute>
                } />
                <Route path="/order-placed" element={
                  <ProtectedRoute>
                    <OrderPlaced />
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
                
                {/* Employee/Admin routes */}
                <Route path="/customers" element={
                  <ProtectedRoute>
                    <Customers />
                  </ProtectedRoute>
                } />
                <Route path="/inventory" element={
                  <ProtectedRoute>
                    <Inventory />
                  </ProtectedRoute>
                } />
                <Route path="/employer-dashboard" element={
                  <ProtectedRoute>
                    <EmployerDashboard />
                  </ProtectedRoute>
                } />
                
                {/* Admin-only routes */}
                <Route path="/employees" element={
                  <ProtectedRoute>
                    <Employees />
                  </ProtectedRoute>
                } />
                
                {/* Admin Routes */}
                <Route path="/admin/manage-employer-ids" element={
                  <ProtectedRoute>
                    <ManageEmployerIds />
                  </ProtectedRoute>
                } />
                
                {/* Super Admin Routes */}
                <Route path="/super-admin" element={
                  <ProtectedRoute>
                    <SuperAdmin />
                  </ProtectedRoute>
                } />
                
                {/* Unauthorized access page */}
                <Route path="/unauthorized" element={<UnauthorizedAccess />} />
                
                {/* Fallback for any unmatched routes */}
                <Route path="*" element={<UnauthorizedRedirect />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
