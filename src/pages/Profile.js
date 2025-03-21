import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Grid, 
  Typography, 
  Paper, 
  Button, 
  TextField, 
  Avatar, 
  Divider, 
  Tab, 
  Tabs, 
  Switch,
  FormControlLabel,
  Snackbar,
  Alert,
  CircularProgress,
  IconButton
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

// Icons
import PersonIcon from '@mui/icons-material/Person';
import SecurityIcon from '@mui/icons-material/Security';
import HistoryIcon from '@mui/icons-material/History';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CameraAltIcon from '@mui/icons-material/CameraAlt';

// Styled components
const ProfilePaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: '16px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  marginBottom: theme.spacing(3),
}));

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: 120,
  height: 120,
  border: `4px solid ${theme.palette.background.paper}`,
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
  margin: '0 auto',
  position: 'relative',
}));

const AvatarEditButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  right: 0,
  backgroundColor: theme.palette.primary.main,
  color: '#fff',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  }
}));

const TabPanel = ({ children, value, index, ...props }) => {
  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...props}
    >
      {value === index && (
        <Box sx={{ p: { xs: 2, md: 3 } }}>
          {children}
        </Box>
      )}
    </Box>
  );
};

const Profile = () => {
  const { currentUser, userRole } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  
  // Profile form state
  const [profile, setProfile] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: '',
    phone: '(555) 123-4567',
    address: '123 Main St',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    birthDate: '1990-01-01',
    emailNotifications: true,
    smsNotifications: false,
    showOrderHistory: true,
    showProfilePublicly: false,
  });
  
  // Load order history from localStorage or use mock data
  const [orderHistory, setOrderHistory] = useState([]);
  
  useEffect(() => {
    // Try to load order history from localStorage
    const savedHistory = localStorage.getItem('orderHistory');
    
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory);
        if (Array.isArray(parsedHistory) && parsedHistory.length > 0) {
          setOrderHistory(parsedHistory);
          console.log('Loaded order history from localStorage:', parsedHistory);
          return;
        }
      } catch (error) {
        console.error('Error parsing order history:', error);
      }
    }
    
    // Fallback to mock data if no saved history exists
    const mockOrderHistory = [
      { id: 123456, date: '2023-03-01', total: 45.88, status: 'Delivered' },
      { id: 123455, date: '2023-02-15', total: 32.50, status: 'Delivered' },
      { id: 123454, date: '2023-02-01', total: 67.20, status: 'Delivered' }
    ];
    
    setOrderHistory(mockOrderHistory);
    console.log('Using mock order history data');
  }, []);
  
  // Load profile data from localStorage and set email from currentUser
  useEffect(() => {
    // Try to load saved profile first
    const savedProfile = localStorage.getItem('userProfile');
    
    if (savedProfile) {
      try {
        const parsedProfile = JSON.parse(savedProfile);
        setProfile(parsedProfile);
        console.log('Loaded saved profile:', parsedProfile);
      } catch (error) {
        console.error('Error parsing saved profile:', error);
      }
    } else {
      console.log('No saved profile found, using default values');
    }
    
    // Then ensure email is set from currentUser (takes precedence if available)
    if (currentUser && currentUser.email) {
      setProfile(prev => ({
        ...prev,
        email: currentUser.email
      }));
    }
  }, [currentUser]);
  
  // Show welcome message with instructions when component mounts
  useEffect(() => {
    // Show a welcome message after a short delay to ensure other UI elements are loaded
    const timer = setTimeout(() => {
      setSnackbar({
        open: true,
        message: 'Welcome to your profile! You can edit your information using the Edit buttons.',
        severity: 'info',
      });
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []); // Empty dependency array ensures this runs only once on mount
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleProfileChange = (e) => {
    const { name, value, checked } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: e.target.type === 'checkbox' ? checked : value
    }));
  };
  
  const handleSaveProfile = () => {
    setLoading(true);
    
    try {
      // Save profile to localStorage
      localStorage.setItem('userProfile', JSON.stringify(profile));
      
      // Log success for debugging
      console.log('Profile saved successfully:', profile);
      
      setEditMode(false);
      
      // Show success message
      setSnackbar({
        open: true,
        message: 'Profile updated successfully!',
        severity: 'success',
      });
    } catch (error) {
      // Handle errors
      console.error('Error saving profile:', error);
      
      setSnackbar({
        open: true,
        message: 'Failed to save profile. Please try again.',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false,
    });
  };
  
  return (
    <Container maxWidth="lg" sx={{ pt: 10, pb: 8 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Grid container spacing={4}>
          {/* Profile header */}
          <Grid item xs={12}>
            <ProfilePaper>
              <Box sx={{ textAlign: 'center', position: 'relative', pb: 2 }}>
                <ProfileAvatar src="/assets/profile-placeholder.jpg" alt="Profile Picture">
                  {profile.firstName.charAt(0) + profile.lastName.charAt(0)}
                  <AvatarEditButton size="small">
                    <CameraAltIcon fontSize="small" />
                  </AvatarEditButton>
                </ProfileAvatar>
                
                <Typography 
                  variant="h4" 
                  sx={{ 
                    mt: 2, 
                    fontWeight: 600,
                    background: 'linear-gradient(45deg, #FF4B2B 30%, #FF8E53 90%)',
                    backgroundClip: 'text',
                    textFillColor: 'transparent',
                  }}
                >
                  {profile.firstName} {profile.lastName}
                </Typography>
                
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
                </Typography>
                
                <Typography variant="body2" color="text.secondary">
                  Member since {new Date().getFullYear()}
                </Typography>
              </Box>
            </ProfilePaper>
          </Grid>
          
          {/* Profile tabs */}
          <Grid item xs={12}>
            <ProfilePaper sx={{ overflow: 'hidden' }}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs 
                  value={tabValue} 
                  onChange={handleTabChange}
                  variant="scrollable"
                  scrollButtons="auto"
                  sx={{
                    '& .MuiTab-root': { py: 2 },
                    '& .Mui-selected': { 
                      color: '#FF4B2B',
                      fontWeight: 'bold'
                    },
                    '& .MuiTabs-indicator': {
                      backgroundColor: '#FF4B2B'
                    }
                  }}
                >
                  <Tab 
                    icon={<PersonIcon />} 
                    label="Personal Info" 
                    iconPosition="start"
                  />
                  <Tab 
                    icon={<LocationOnIcon />} 
                    label="Address" 
                    iconPosition="start"
                  />
                  <Tab 
                    icon={<SecurityIcon />} 
                    label="Privacy" 
                    iconPosition="start"
                  />
                  <Tab 
                    icon={<HistoryIcon />} 
                    label="Order History" 
                    iconPosition="start"
                  />
                </Tabs>
              </Box>
              
              {/* Personal Info Tab */}
              <TabPanel value={tabValue} index={0}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                  {!editMode ? (
                    <Button
                      variant="outlined"
                      startIcon={<EditIcon />}
                      onClick={() => setEditMode(true)}
                      sx={{ 
                        color: '#FF4B2B',
                        borderColor: '#FF4B2B',
                        '&:hover': { 
                          borderColor: '#FF8E53',
                          backgroundColor: 'rgba(255, 75, 43, 0.05)'
                        }
                      }}
                    >
                      Edit Profile
                    </Button>
                  ) : (
                    <Box>
                      <Button
                        variant="outlined"
                        startIcon={<CancelIcon />}
                        onClick={() => setEditMode(false)}
                        sx={{ 
                          mr: 1,
                          color: 'text.secondary',
                          borderColor: 'divider',
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="contained"
                        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                        onClick={handleSaveProfile}
                        disabled={loading}
                        sx={{ 
                          background: 'linear-gradient(45deg, #FF4B2B 30%, #FF8E53 90%)',
                          color: 'white',
                          '&:hover': { 
                            background: 'linear-gradient(45deg, #FF8E53 30%, #FF4B2B 90%)',
                          }
                        }}
                      >
                        Save
                      </Button>
                    </Box>
                  )}
                </Box>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="First Name"
                      name="firstName"
                      value={profile.firstName}
                      onChange={handleProfileChange}
                      disabled={!editMode}
                      variant={editMode ? "outlined" : "filled"}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Last Name"
                      name="lastName"
                      value={profile.lastName}
                      onChange={handleProfileChange}
                      disabled={!editMode}
                      variant={editMode ? "outlined" : "filled"}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      name="email"
                      type="email"
                      value={profile.email}
                      onChange={handleProfileChange}
                      disabled
                      variant="filled"
                      margin="normal"
                      helperText="Email cannot be changed"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Phone"
                      name="phone"
                      value={profile.phone}
                      onChange={handleProfileChange}
                      disabled={!editMode}
                      variant={editMode ? "outlined" : "filled"}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Birth Date"
                      name="birthDate"
                      type="date"
                      value={profile.birthDate}
                      onChange={handleProfileChange}
                      disabled={!editMode}
                      variant={editMode ? "outlined" : "filled"}
                      margin="normal"
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                </Grid>
              </TabPanel>
              
              {/* Address Tab */}
              <TabPanel value={tabValue} index={1}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                  {!editMode ? (
                    <Button
                      variant="outlined"
                      startIcon={<EditIcon />}
                      onClick={() => setEditMode(true)}
                      sx={{ 
                        color: '#FF4B2B',
                        borderColor: '#FF4B2B',
                        '&:hover': { 
                          borderColor: '#FF8E53',
                          backgroundColor: 'rgba(255, 75, 43, 0.05)'
                        }
                      }}
                    >
                      Edit Address
                    </Button>
                  ) : (
                    <Box>
                      <Button
                        variant="outlined"
                        startIcon={<CancelIcon />}
                        onClick={() => setEditMode(false)}
                        sx={{ 
                          mr: 1,
                          color: 'text.secondary',
                          borderColor: 'divider',
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="contained"
                        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                        onClick={handleSaveProfile}
                        disabled={loading}
                        sx={{ 
                          background: 'linear-gradient(45deg, #FF4B2B 30%, #FF8E53 90%)',
                          color: 'white',
                          '&:hover': { 
                            background: 'linear-gradient(45deg, #FF8E53 30%, #FF4B2B 90%)',
                          }
                        }}
                      >
                        Save
                      </Button>
                    </Box>
                  )}
                </Box>
                
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Street Address"
                      name="address"
                      value={profile.address}
                      onChange={handleProfileChange}
                      disabled={!editMode}
                      variant={editMode ? "outlined" : "filled"}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="City"
                      name="city"
                      value={profile.city}
                      onChange={handleProfileChange}
                      disabled={!editMode}
                      variant={editMode ? "outlined" : "filled"}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      fullWidth
                      label="State"
                      name="state"
                      value={profile.state}
                      onChange={handleProfileChange}
                      disabled={!editMode}
                      variant={editMode ? "outlined" : "filled"}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      fullWidth
                      label="ZIP Code"
                      name="zipCode"
                      value={profile.zipCode}
                      onChange={handleProfileChange}
                      disabled={!editMode}
                      variant={editMode ? "outlined" : "filled"}
                      margin="normal"
                    />
                  </Grid>
                </Grid>
              </TabPanel>
              
              {/* Privacy Tab */}
              <TabPanel value={tabValue} index={2}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                  {!editMode ? (
                    <Button
                      variant="outlined"
                      startIcon={<EditIcon />}
                      onClick={() => setEditMode(true)}
                      sx={{ 
                        color: '#FF4B2B',
                        borderColor: '#FF4B2B',
                        '&:hover': { 
                          borderColor: '#FF8E53',
                          backgroundColor: 'rgba(255, 75, 43, 0.05)'
                        }
                      }}
                    >
                      Edit Settings
                    </Button>
                  ) : (
                    <Box>
                      <Button
                        variant="outlined"
                        startIcon={<CancelIcon />}
                        onClick={() => setEditMode(false)}
                        sx={{ 
                          mr: 1,
                          color: 'text.secondary',
                          borderColor: 'divider',
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="contained"
                        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                        onClick={handleSaveProfile}
                        disabled={loading}
                        sx={{ 
                          background: 'linear-gradient(45deg, #FF4B2B 30%, #FF8E53 90%)',
                          color: 'white',
                          '&:hover': { 
                            background: 'linear-gradient(45deg, #FF8E53 30%, #FF4B2B 90%)',
                          }
                        }}
                      >
                        Save
                      </Button>
                    </Box>
                  )}
                </Box>
                
                <Typography variant="h6" gutterBottom>
                  Notification Preferences
                </Typography>
                <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={profile.emailNotifications}
                        onChange={handleProfileChange}
                        name="emailNotifications"
                        disabled={!editMode}
                        color="primary"
                      />
                    }
                    label="Email Notifications"
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mb: 2 }}>
                    Receive updates about your orders, promotions, and discounts
                  </Typography>
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={profile.smsNotifications}
                        onChange={handleProfileChange}
                        name="smsNotifications"
                        disabled={!editMode}
                        color="primary"
                      />
                    }
                    label="SMS Notifications"
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
                    Receive text messages about your orders and delivery status
                  </Typography>
                </Paper>
                
                <Typography variant="h6" gutterBottom>
                  Privacy Settings
                </Typography>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={profile.showOrderHistory}
                        onChange={handleProfileChange}
                        name="showOrderHistory"
                        disabled={!editMode}
                        color="primary"
                      />
                    }
                    label="Allow order history to be used for recommendations"
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mb: 2 }}>
                    We'll use your order history to suggest items you might like
                  </Typography>
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={profile.showProfilePublicly}
                        onChange={handleProfileChange}
                        name="showProfilePublicly"
                        disabled={!editMode}
                        color="primary"
                      />
                    }
                    label="Make profile visible to restaurant staff"
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
                    Allow restaurant staff to view your profile details for better service
                  </Typography>
                </Paper>
              </TabPanel>
              
              {/* Order History Tab */}
              <TabPanel value={tabValue} index={3}>
                <Typography variant="h6" gutterBottom>
                  Recent Orders
                </Typography>
                
                {orderHistory.length > 0 ? (
                  orderHistory.map((order) => (
                    <Paper 
                      key={order.id} 
                      variant="outlined" 
                      sx={{ 
                        p: 2, 
                        mb: 2,
                        transition: 'all 0.3s',
                        '&:hover': {
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                        }
                      }}
                    >
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={4}>
                          <Typography variant="subtitle2">
                            Order #{order.id}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {new Date(order.date).toLocaleDateString()}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                          <Typography variant="subtitle2">
                            ${order.total.toFixed(2)}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                          <Typography 
                            variant="subtitle2" 
                            sx={{ 
                              color: order.status === 'Delivered' ? 'success.main' : 'primary.main',
                              fontWeight: 'medium'
                            }}
                          >
                            {order.status}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={2} sx={{ textAlign: 'right' }}>
                          <Button 
                            size="small" 
                            sx={{ 
                              color: '#FF4B2B',
                              '&:hover': { 
                                backgroundColor: 'rgba(255, 75, 43, 0.05)'
                              }
                            }}
                          >
                            View Details
                          </Button>
                        </Grid>
                      </Grid>
                    </Paper>
                  ))
                ) : (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                      You haven't placed any orders yet.
                    </Typography>
                  </Box>
                )}
              </TabPanel>
            </ProfilePaper>
          </Grid>
        </Grid>
      </motion.div>
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
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

export default Profile; 