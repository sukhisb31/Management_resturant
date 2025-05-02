import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Alert,
  Card,
  CardContent,
  Divider,
  Grid,
  Paper
} from '@mui/material';
import { motion } from 'framer-motion';
import { AdminPanelSettings as SuperAdminIcon } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const SuperAdmin = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, user, setUserRole } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Check if user is already logged in as admin
  useEffect(() => {
    if (isAuthenticated && user && user.role === 'admin') {
      // User is already logged in as admin, show admin dashboard
      setError('');
    }
  }, [isAuthenticated, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Simplified login - bypass authentication checks for admin
      if (formData.email === 'sukhisb31@gmail.com' && formData.password === '123456789') {
      // Direct login without additional checks
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userRole', 'admin');
      localStorage.setItem('adminAccess', 'full');
      localStorage.setItem('userEmail', formData.email);
      
      // Force authentication state update
      if (login) {
        await login(formData.email, formData.password);
      } else {
        // Fallback if login function is not available
        window.location.reload();
      }
      
      // Navigate to admin dashboard
      navigate('/super-admin');
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      setError(error.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  // If already logged in as admin, show admin dashboard
  if (isAuthenticated && user && user.role === 'admin') {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Super Admin Dashboard
            </Typography>
            <Typography variant="body1" paragraph>
              Welcome to the Super Admin Dashboard. You have full access to all system features.
            </Typography>
            
            <Grid container spacing={3} sx={{ mt: 2 }}>
              <Grid item xs={12} md={4}>
                <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
                  <Typography variant="h6" gutterBottom>User Management</Typography>
                  <Button 
                    variant="contained" 
                    fullWidth 
                    onClick={() => navigate('/employees')}
                    sx={{ mb: 2 }}
                  >
                    Manage Employees
                  </Button>
                  <Button 
                    variant="contained" 
                    fullWidth 
                    onClick={() => navigate('/customers')}
                  >
                    Manage Customers
                  </Button>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
                  <Typography variant="h6" gutterBottom>System Settings</Typography>
                  <Button 
                    variant="contained" 
                    fullWidth 
                    onClick={() => navigate('/admin/manage-employer-ids')}
                    sx={{ mb: 2 }}
                  >
                    Manage Employer IDs
                  </Button>
                  <Button 
                    variant="contained" 
                    fullWidth
                  >
                    System Configuration
                  </Button>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
                  <Typography variant="h6" gutterBottom>Restaurant Management</Typography>
                  <Button 
                    variant="contained" 
                    fullWidth 
                    onClick={() => navigate('/inventory')}
                    sx={{ mb: 2 }}
                  >
                    Inventory Management
                  </Button>
                  <Button 
                    variant="contained" 
                    fullWidth
                    onClick={() => navigate('/orders')}
                  >
                    Order Management
                  </Button>
                </Paper>
              </Grid>
            </Grid>
          </Paper>
        </motion.div>
      </Container>
    );
  }

  // Otherwise show login form
  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card elevation={3} sx={{ borderRadius: 2 }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <SuperAdminIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
              <Typography variant="h4" component="h1" gutterBottom>
                Super Admin Login
              </Typography>
            </Box>
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Access the super admin dashboard with your credentials
            </Typography>

            <Alert severity="info" sx={{ mb: 3 }}>
              Default super admin credentials:
              <br />
              Email: sukhisb31@gmail.com
              <br />
              Password: 123456789
            </Alert>

            <Divider sx={{ my: 3 }} />

            <Box component="form" onSubmit={handleSubmit}>
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                margin="normal"
                required
                autoComplete="email"
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                margin="normal"
                required
                autoComplete="current-password"
                sx={{ mb: 3 }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={isLoading}
                sx={{
                  py: 1.5,
                  background: 'linear-gradient(45deg, #FF4B2B 30%, #FF8E53 90%)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #FF4B2B 50%, #FF8E53 100%)',
                    boxShadow: '0 2px 10px rgba(255, 75, 43, 0.3)',
                  },
                }}
              >
                {isLoading ? 'Logging in...' : 'Login as Super Admin'}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </motion.div>
    </Container>
  );
};

export default SuperAdmin;