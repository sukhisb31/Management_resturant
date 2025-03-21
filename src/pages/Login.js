import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  Grid, 
  Tabs, 
  Tab, 
  InputAdornment, 
  IconButton,
  Divider,
  Link as MuiLink,
  Alert,
  FormControlLabel,
  Checkbox,
  Snackbar
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import LockIcon from '@mui/icons-material/Lock';
import EmailIcon from '@mui/icons-material/Email';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import DiningIcon from '@mui/icons-material/DinnerDining';
import LocalBarIcon from '@mui/icons-material/LocalBar';
import RoomServiceIcon from '@mui/icons-material/RoomService';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import { useAuth, USER_ROLES } from '../contexts/AuthContext';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: '16px',
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
  overflow: 'hidden',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '4px',
    background: theme.palette.primary.main
  }
}));

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Form states
  const [customerForm, setCustomerForm] = useState({
    email: '',
    password: ''
  });
  
  const [employeeForm, setEmployeeForm] = useState({
    employeeId: '',
    password: ''
  });

  // Check for redirect after login
  const redirectPath = localStorage.getItem('redirectAfterLogin');

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setLoginError('');
  };

  const handleCustomerChange = (e) => {
    const { name, value } = e.target;
    setCustomerForm({
      ...customerForm,
      [name]: value
    });
  };

  const handleEmployeeChange = (e) => {
    const { name, value } = e.target;
    setEmployeeForm({
      ...employeeForm,
      [name]: value
    });
  };

  const handleCustomerSubmit = (e) => {
    e.preventDefault();
    // Use the same authentication logic as the main submit handler
    if (customerForm.email && customerForm.password) {
      // Set credentials for the main submit handler
      setCredentials({
        email: customerForm.email,
        password: customerForm.password,
        rememberMe: false
      });
      
      // Call the main submit handler
      handleSubmit(e);
    } else {
      setLoginError('Please enter both email and password');
    }
  };

  const handleEmployeeSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!employeeForm.employeeId || !employeeForm.password) {
      setLoginError('Please enter both employee ID and password');
      return;
    }

    // Mock employee validation - in real app, this would use an API
    // Employee IDs starting with 'A' are admins, 'E' are regular employees
    try {
      let role = USER_ROLES.EMPLOYEE;
      
      // Determine role based on employee ID prefix
      if (employeeForm.employeeId.startsWith('A')) {
        role = USER_ROLES.ADMIN;
      } else if (!employeeForm.employeeId.startsWith('E')) {
        throw new Error('Invalid employee ID format');
      }
      
      // Call the login method from AuthContext
      const success = login(employeeForm.employeeId, employeeForm.password, role);
      
      if (success) {
        setSnackbar({
          open: true,
          message: `Welcome back! Logged in as ${role}`,
          severity: 'success'
        });
        
        // Redirect after successful login
        setTimeout(() => {
          if (redirectPath) {
            localStorage.removeItem('redirectAfterLogin');
            navigate(redirectPath);
          } else {
            navigate('/');
          }
        }, 1500);
      }
    } catch (error) {
      setLoginError(error.message || 'Failed to log in');
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    const val = name === 'rememberMe' ? checked : value;
    setCredentials({
      ...credentials,
      [name]: val,
    });
    
    // Clear error on field change
    if (loginError) {
      setLoginError('');
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    const newErrors = {};
    if (!credentials.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(credentials.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!credentials.password) {
      newErrors.password = 'Password is required';
    } else if (credentials.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setLoginError(newErrors.email || newErrors.password);
      return;
    }
    
    try {
      // Call the login method from AuthContext
      const success = login(credentials.email, credentials.password, USER_ROLES.CUSTOMER);
      
      if (success) {
        // Store authentication status and user email
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userEmail', credentials.email);

        // Check if there's order data to process
        const orderData = JSON.parse(localStorage.getItem('orderData') || 'null');
        
        setSnackbar({
          open: true,
          message: orderData ? 'Login successful! Continuing with your order...' : 'Login successful!',
          severity: 'success'
        });
        
        // Redirect to the stored path or process the order
        setTimeout(() => {
          if (orderData) {
            // Clear stored order data to prevent duplicate orders
            localStorage.removeItem('orderData');
            
            // Navigate to shipping address with the order information
            navigate('/shipping-address', { 
              state: { 
                orderData: orderData
              } 
            });
          } else if (redirectPath) {
            localStorage.removeItem('redirectAfterLogin');
            navigate(redirectPath, { state: { justLoggedIn: true } });
          } else {
            navigate('/');
          }
        }, 1500);
      }
    } catch (error) {
      setLoginError(error.message || 'Failed to log in');
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5, mb: 8 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box 
              sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'center',
                height: '100%'
              }}
            >
              <Typography 
                variant="h3" 
                sx={{ 
                  fontWeight: 'bold', 
                  mb: 2,
                  background: 'linear-gradient(45deg, #FF4B2B 30%, #FF8E53 90%)',
                  backgroundClip: 'text',
                  textFillColor: 'transparent',
                }}
              >
                Welcome Back
              </Typography>
              <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
                Sign in to access your account and manage your reservations, orders, or work schedule.
              </Typography>
              <Box 
                sx={{ 
                  maxWidth: '100%', 
                  height: '220px',
                  display: { xs: 'none', md: 'flex' },
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  color: 'primary.main',
                  background: 'rgba(255, 75, 43, 0.05)',
                  borderRadius: 2,
                  position: 'relative',
                  overflow: 'hidden',
                  my: 2
                }} 
              >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                  <RestaurantIcon sx={{ fontSize: '3.5rem', opacity: 0.7 }} />
                </Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
                  Restaurant Pro Login
                </Typography>
                
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-around', 
                  width: '80%', 
                  mt: 1
                }}>
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    opacity: 0.7
                  }}>
                    <DiningIcon sx={{ fontSize: '1.8rem' }} />
                    <Typography variant="caption">Dining</Typography>
                  </Box>
                  
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    opacity: 0.7
                  }}>
                    <EventSeatIcon sx={{ fontSize: '1.8rem' }} />
                    <Typography variant="caption">Reserve</Typography>
                  </Box>
                  
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    opacity: 0.7
                  }}>
                    <RoomServiceIcon sx={{ fontSize: '1.8rem' }} />
                    <Typography variant="caption">Service</Typography>
                  </Box>
                  
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    opacity: 0.7
                  }}>
                    <LocalBarIcon sx={{ fontSize: '1.8rem' }} />
                    <Typography variant="caption">Drinks</Typography>
                  </Box>
                </Box>
                
                <Box sx={{ 
                  position: 'absolute', 
                  bottom: 0, 
                  width: '100%', 
                  height: '40px',
                  background: 'linear-gradient(45deg, #FF4B2B 30%, #FF8E53 90%)',
                  opacity: 0.2
                }} />
              </Box>
              
              <Box sx={{ mt: 3, display: { xs: 'none', md: 'block' } }}>
                <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
                  "Login to access your account and enjoy a seamless dining experience with personalized recommendations and easy reservations."
                </Typography>
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <StyledPaper>
              <Tabs 
                value={tabValue} 
                onChange={handleTabChange} 
                variant="fullWidth" 
                sx={{ mb: 3 }}
                TabIndicatorProps={{
                  style: {
                    background: 'linear-gradient(45deg, #FF4B2B 30%, #FF8E53 90%)',
                  }
                }}
              >
                <Tab 
                  icon={<PersonIcon />} 
                  label="Customer" 
                  iconPosition="start"
                  sx={{ 
                    fontWeight: tabValue === 0 ? 'bold' : 'normal',
                    textTransform: 'none'
                  }}
                />
                <Tab 
                  icon={<BusinessIcon />} 
                  label="Employee" 
                  iconPosition="start"
                  sx={{ 
                    fontWeight: tabValue === 1 ? 'bold' : 'normal',
                    textTransform: 'none'
                  }}
                />
              </Tabs>

              {loginError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {loginError}
                </Alert>
              )}

              {tabValue === 0 && (
                <Box component="form" onSubmit={handleCustomerSubmit}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    name="email"
                    type="email"
                    value={customerForm.email}
                    onChange={handleCustomerChange}
                    required
                    margin="normal"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={customerForm.password}
                    onChange={handleCustomerChange}
                    required
                    margin="normal"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon color="action" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, mt: 1 }}>
                    <MuiLink component={Link} to="/forgot-password" variant="body2">
                      Forgot password?
                    </MuiLink>
                  </Box>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    sx={{ 
                      mt: 2, 
                      mb: 2,
                      py: 1.2,
                      borderRadius: '8px',
                      background: 'linear-gradient(45deg, #FF4B2B 30%, #FF8E53 90%)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #FF4B2B 50%, #FF8E53 100%)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 16px rgba(255, 75, 43, 0.3)',
                      }
                    }}
                  >
                    Sign In
                  </Button>
                  <Divider sx={{ my: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      OR
                    </Typography>
                  </Divider>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      Don't have an account?
                    </Typography>
                    <Button
                      component={Link}
                      to="/signup"
                      variant="outlined"
                      fullWidth
                      sx={{ 
                        borderRadius: '8px',
                        py: 1.2,
                        borderColor: '#FF4B2B',
                        color: '#FF4B2B',
                        '&:hover': {
                          borderColor: '#FF4B2B',
                          backgroundColor: 'rgba(255, 75, 43, 0.04)',
                        }
                      }}
                    >
                      Create Account
                    </Button>
                  </Box>
                </Box>
              )}

              {tabValue === 1 && (
                <Box component="form" onSubmit={handleEmployeeSubmit}>
                  <TextField
                    fullWidth
                    label="Employee ID"
                    name="employeeId"
                    value={employeeForm.employeeId}
                    onChange={handleEmployeeChange}
                    required
                    margin="normal"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={employeeForm.password}
                    onChange={handleEmployeeChange}
                    required
                    margin="normal"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon color="action" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, mt: 1 }}>
                    <MuiLink component={Link} to="/employee-forgot-password" variant="body2">
                      Forgot password?
                    </MuiLink>
                  </Box>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    sx={{ 
                      mt: 2, 
                      mb: 2,
                      py: 1.2,
                      borderRadius: '8px',
                      background: 'linear-gradient(45deg, #FF4B2B 30%, #FF8E53 90%)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #FF4B2B 50%, #FF8E53 100%)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 16px rgba(255, 75, 43, 0.3)',
                      }
                    }}
                  >
                    Employee Sign In
                  </Button>
                  <Box sx={{ textAlign: 'center', mt: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Employee access is restricted. 
                      Contact your manager if you're having trouble signing in.
                    </Typography>
                  </Box>
                </Box>
              )}
            </StyledPaper>
          </Grid>
        </Grid>
      </motion.div>
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Login; 