import React, { useState } from 'react';
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
  Checkbox,
  FormControlLabel,
  MenuItem,
  FormHelperText
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import LockIcon from '@mui/icons-material/Lock';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import BadgeIcon from '@mui/icons-material/Badge';
import WorkIcon from '@mui/icons-material/Work';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import DiscountIcon from '@mui/icons-material/Discount';

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

const Signup = () => {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [signupError, setSignupError] = useState('');
  const [signupSuccess, setSignupSuccess] = useState('');
  
  // Form states
  const [customerForm, setCustomerForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false
  });
  
  const [employeeForm, setEmployeeForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    position: '',
    dateOfBirth: '',
    employeeCode: '',
    termsAccepted: false
  });

  // Positions for employee signup
  const positions = [
    'Manager',
    'Chef',
    'Sous Chef',
    'Server',
    'Host/Hostess',
    'Bartender',
    'Kitchen Staff',
    'Cashier',
    'Delivery Person',
    'Cleaner'
  ];

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setSignupError('');
    setSignupSuccess('');
  };

  const handleCustomerChange = (e) => {
    const { name, value, checked } = e.target;
    setCustomerForm({
      ...customerForm,
      [name]: name === 'termsAccepted' ? checked : value
    });
  };

  const handleEmployeeChange = (e) => {
    const { name, value, checked } = e.target;
    setEmployeeForm({
      ...employeeForm,
      [name]: name === 'termsAccepted' ? checked : value
    });
  };

  const validateCustomerForm = () => {
    if (customerForm.password !== customerForm.confirmPassword) {
      setSignupError('Passwords do not match');
      return false;
    }
    
    if (!customerForm.termsAccepted) {
      setSignupError('You must accept the terms and conditions');
      return false;
    }
    
    if (customerForm.password.length < 8) {
      setSignupError('Password must be at least 8 characters long');
      return false;
    }
    
    return true;
  };

  const validateEmployeeForm = () => {
    if (employeeForm.password !== employeeForm.confirmPassword) {
      setSignupError('Passwords do not match');
      return false;
    }
    
    if (!employeeForm.termsAccepted) {
      setSignupError('You must accept the terms and conditions');
      return false;
    }
    
    if (employeeForm.password.length < 8) {
      setSignupError('Password must be at least 8 characters long');
      return false;
    }
    
    if (!employeeForm.position) {
      setSignupError('Please select your position');
      return false;
    }
    
    return true;
  };

  const handleCustomerSubmit = (e) => {
    e.preventDefault();
    setSignupError('');
    setSignupSuccess('');
    
    // In a real application, you would validate and make an API call
    console.log('Customer signup attempt:', customerForm);
    
    if (validateCustomerForm()) {
      // Mock successful signup
      setSignupSuccess('Account created successfully! You can now login.');
      // Reset form
      setCustomerForm({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        termsAccepted: false
      });
      
      // In a real app, you might redirect after a delay
      // setTimeout(() => navigate('/login'), 2000);
    }
  };

  const handleEmployeeSubmit = (e) => {
    e.preventDefault();
    setSignupError('');
    setSignupSuccess('');
    
    // In a real application, you would validate and make an API call
    console.log('Employee signup attempt:', employeeForm);
    
    if (validateEmployeeForm()) {
      // Mock successful signup
      setSignupSuccess('Account created successfully! Your request will be reviewed by management.');
      // Reset form
      setEmployeeForm({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        position: '',
        dateOfBirth: '',
        employeeCode: '',
        termsAccepted: false
      });
      
      // In a real app, you might redirect after a delay
      // setTimeout(() => navigate('/login'), 2000);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 5, mb: 8 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Grid container spacing={4}>
          <Grid item xs={12} md={5}>
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
                Create Account
              </Typography>
              <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
                Join us to access personalized restaurant experiences, track orders, make reservations, and more.
              </Typography>
              <Box 
                sx={{ 
                  maxWidth: '100%', 
                  height: '180px',
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
                <RestaurantIcon sx={{ fontSize: '3.5rem', mb: 1, opacity: 0.7 }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                  Join Our Community
                </Typography>
                <Box sx={{ 
                  position: 'absolute', 
                  bottom: 0, 
                  width: '100%', 
                  height: '40px',
                  background: 'linear-gradient(45deg, #FF4B2B 30%, #FF8E53 90%)',
                  opacity: 0.2
                }} />
              </Box>
              <Box sx={{ mt: 4, display: { xs: 'none', md: 'block' } }}>
                <Typography variant="h6" gutterBottom>
                  Benefits of Signing Up
                </Typography>
                <Box sx={{ color: 'text.secondary' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                    <MenuBookIcon sx={{ mr: 1.5, fontSize: '1.2rem', color: 'primary.main' }} />
                    <Typography variant="body2">
                      Track your order history and favorites
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                    <LocalDiningIcon sx={{ mr: 1.5, fontSize: '1.2rem', color: 'primary.main' }} />
                    <Typography variant="body2">
                      Get personalized recommendations
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                    <DeliveryDiningIcon sx={{ mr: 1.5, fontSize: '1.2rem', color: 'primary.main' }} />
                    <Typography variant="body2">
                      Easy reservation management
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <DiscountIcon sx={{ mr: 1.5, fontSize: '1.2rem', color: 'primary.main' }} />
                    <Typography variant="body2">
                      Access to exclusive promotions
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={7}>
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

              {signupError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {signupError}
                </Alert>
              )}

              {signupSuccess && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  {signupSuccess}
                </Alert>
              )}

              {tabValue === 0 && (
                <Box component="form" onSubmit={handleCustomerSubmit}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="First Name"
                        name="firstName"
                        value={customerForm.firstName}
                        onChange={handleCustomerChange}
                        required
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PersonIcon color="action" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Last Name"
                        name="lastName"
                        value={customerForm.lastName}
                        onChange={handleCustomerChange}
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Email Address"
                        name="email"
                        type="email"
                        value={customerForm.email}
                        onChange={handleCustomerChange}
                        required
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <EmailIcon color="action" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Phone Number"
                        name="phone"
                        value={customerForm.phone}
                        onChange={handleCustomerChange}
                        required
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PhoneIcon color="action" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={customerForm.password}
                        onChange={handleCustomerChange}
                        required
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
                        helperText="Password must be at least 8 characters long"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Confirm Password"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={customerForm.confirmPassword}
                        onChange={handleCustomerChange}
                        required
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LockIcon color="action" />
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                edge="end"
                              >
                                {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                              </IconButton>
                            </InputAdornment>
                          )
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Checkbox 
                            name="termsAccepted" 
                            checked={customerForm.termsAccepted}
                            onChange={handleCustomerChange}
                            required
                            color="primary"
                          />
                        }
                        label={
                          <Typography variant="body2">
                            I agree to the{' '}
                            <MuiLink component={Link} to="/terms">
                              Terms and Conditions
                            </MuiLink>
                            {' '}and{' '}
                            <MuiLink component={Link} to="/privacy">
                              Privacy Policy
                            </MuiLink>
                          </Typography>
                        }
                      />
                    </Grid>
                  </Grid>
                  
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    sx={{ 
                      mt: 3, 
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
                    Create Account
                  </Button>
                  
                  <Divider sx={{ my: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      OR
                    </Typography>
                  </Divider>
                  
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      Already have an account?
                    </Typography>
                    <Button
                      component={Link}
                      to="/login"
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
                      Sign In
                    </Button>
                  </Box>
                </Box>
              )}

              {tabValue === 1 && (
                <Box component="form" onSubmit={handleEmployeeSubmit}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="First Name"
                        name="firstName"
                        value={employeeForm.firstName}
                        onChange={handleEmployeeChange}
                        required
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PersonIcon color="action" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Last Name"
                        name="lastName"
                        value={employeeForm.lastName}
                        onChange={handleEmployeeChange}
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Email Address"
                        name="email"
                        type="email"
                        value={employeeForm.email}
                        onChange={handleEmployeeChange}
                        required
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <EmailIcon color="action" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Phone Number"
                        name="phone"
                        value={employeeForm.phone}
                        onChange={handleEmployeeChange}
                        required
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PhoneIcon color="action" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        select
                        fullWidth
                        label="Position"
                        name="position"
                        value={employeeForm.position}
                        onChange={handleEmployeeChange}
                        required
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <WorkIcon color="action" />
                            </InputAdornment>
                          ),
                        }}
                      >
                        {positions.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Date of Birth"
                        name="dateOfBirth"
                        type="date"
                        value={employeeForm.dateOfBirth}
                        onChange={handleEmployeeChange}
                        required
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <CalendarTodayIcon color="action" />
                            </InputAdornment>
                          ),
                        }}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Employee Code (if provided by manager)"
                        name="employeeCode"
                        value={employeeForm.employeeCode}
                        onChange={handleEmployeeChange}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <BadgeIcon color="action" />
                            </InputAdornment>
                          ),
                        }}
                        helperText="Optional: Enter code provided by your manager to link your account"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={employeeForm.password}
                        onChange={handleEmployeeChange}
                        required
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
                        helperText="Password must be at least 8 characters long"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Confirm Password"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={employeeForm.confirmPassword}
                        onChange={handleEmployeeChange}
                        required
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LockIcon color="action" />
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                edge="end"
                              >
                                {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                              </IconButton>
                            </InputAdornment>
                          )
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Checkbox 
                            name="termsAccepted" 
                            checked={employeeForm.termsAccepted}
                            onChange={handleEmployeeChange}
                            required
                            color="primary"
                          />
                        }
                        label={
                          <Typography variant="body2">
                            I agree to the{' '}
                            <MuiLink component={Link} to="/terms">
                              Terms and Conditions
                            </MuiLink>
                            {' '}and{' '}
                            <MuiLink component={Link} to="/privacy">
                              Privacy Policy
                            </MuiLink>
                          </Typography>
                        }
                      />
                    </Grid>
                  </Grid>
                  
                  <FormHelperText sx={{ textAlign: 'center', mt: 1 }}>
                    Employee registrations require approval from management.
                  </FormHelperText>
                  
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    sx={{ 
                      mt: 3, 
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
                    Submit Application
                  </Button>
                  
                  <Divider sx={{ my: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      OR
                    </Typography>
                  </Divider>
                  
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      Already have an account?
                    </Typography>
                    <Button
                      component={Link}
                      to="/login"
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
                      Sign In
                    </Button>
                  </Box>
                </Box>
              )}
            </StyledPaper>
          </Grid>
        </Grid>
      </motion.div>
    </Container>
  );
};

export default Signup; 