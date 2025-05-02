import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Snackbar,
  Alert
} from '@mui/material';
import {
  People as PeopleIcon,
  AttachMoney as MoneyIcon,
  Assessment as AssessmentIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  TrendingUp as TrendingUpIcon,
  Schedule as ScheduleIcon,
  Inventory as InventoryIcon,
  ShoppingCart as ShoppingCartIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const StyledCard = styled(motion(Card))`
  height: 100%;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const DashboardContainer = styled(Container)`
  padding-top: 2rem;
  padding-bottom: 2rem;
`;

const EmployerDashboard = () => {
  const navigate = useNavigate();
  const { isEmployer } = useAuth();
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState('');
  const [formData, setFormData] = useState({
    employeeName: '',
    email: '',
    position: 'staff',
    startDate: new Date().toISOString().split('T')[0]
  });

  // Mock data for demonstration
  const [dashboardData] = useState({
    totalEmployees: 15,
    totalRevenue: 125000,
    pendingOrders: 8,
    lowStockItems: 5,
    recentActivities: [
      { id: 1, type: 'order', message: 'New order #1234 received', time: '5 minutes ago' },
      { id: 2, type: 'employee', message: 'John Doe updated their schedule', time: '1 hour ago' },
      { id: 3, type: 'inventory', message: 'Low stock alert for Tomatoes', time: '2 hours ago' },
      { id: 4, type: 'revenue', message: 'Daily revenue target achieved', time: '3 hours ago' }
    ],
    performanceMetrics: {
      dailyOrders: 45,
      averageOrderValue: 85.50,
      customerSatisfaction: 4.8,
      employeeAttendance: 98
    }
  });

  useEffect(() => {
    if (!isEmployer()) {
      navigate('/');
    }
  }, [navigate, isEmployer]);

  const handleOpenDialog = (type) => {
    setDialogType(type);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setDialogType('');
    // Reset form data
    setFormData({
      employeeName: '',
      email: '',
      position: 'staff',
      startDate: new Date().toISOString().split('T')[0]
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'order':
        return <ShoppingCartIcon color="primary" />;
      case 'employee':
        return <PeopleIcon color="secondary" />;
      case 'inventory':
        return <InventoryIcon color="error" />;
      case 'revenue':
        return <MoneyIcon color="success" />;
      default:
        return <NotificationsIcon />;
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    if (dialogType === 'addEmployee') {
      // Validate form data
      if (!formData.employeeName || !formData.email) {
        setSnackbar({
          open: true,
          message: 'Please fill in all required fields',
          severity: 'error'
        });
        return;
      }

      // Here you would typically make an API call to add the employee
      // For now, we'll just show a success message
      setSnackbar({
        open: true,
        message: 'Employee added successfully',
        severity: 'success'
      });
    } else if (dialogType === 'revenueReport') {
      // Here you would typically generate and download the report
      setSnackbar({
        open: true,
        message: 'Report generated successfully',
        severity: 'success'
      });
    }

    handleCloseDialog();
  };

  return (
    <DashboardContainer maxWidth="lg">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            Employer Dashboard
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Manage your restaurant operations
          </Typography>
        </Box>

        {/* Quick Stats */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={3}>
            <StyledCard whileHover={{ y: -5 }} transition={{ duration: 0.3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PeopleIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Employees</Typography>
                </Box>
                <Typography variant="h4">{dashboardData.totalEmployees}</Typography>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={() => handleOpenDialog('addEmployee')}
                  sx={{ mt: 2 }}
                >
                  Add Employee
                </Button>
              </CardContent>
            </StyledCard>
          </Grid>
          <Grid item xs={12} md={3}>
            <StyledCard whileHover={{ y: -5 }} transition={{ duration: 0.3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <MoneyIcon color="success" sx={{ mr: 1 }} />
                  <Typography variant="h6">Revenue</Typography>
                </Box>
                <Typography variant="h4">${dashboardData.totalRevenue.toLocaleString()}</Typography>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<AssessmentIcon />}
                  onClick={() => handleOpenDialog('revenueReport')}
                  sx={{ mt: 2 }}
                >
                  View Report
                </Button>
              </CardContent>
            </StyledCard>
          </Grid>
          <Grid item xs={12} md={3}>
            <StyledCard whileHover={{ y: -5 }} transition={{ duration: 0.3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <ShoppingCartIcon color="warning" sx={{ mr: 1 }} />
                  <Typography variant="h6">Pending Orders</Typography>
                </Box>
                <Typography variant="h4">{dashboardData.pendingOrders}</Typography>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<ScheduleIcon />}
                  onClick={() => navigate('/orders')}
                  sx={{ mt: 2 }}
                >
                  View Orders
                </Button>
              </CardContent>
            </StyledCard>
          </Grid>
          <Grid item xs={12} md={3}>
            <StyledCard whileHover={{ y: -5 }} transition={{ duration: 0.3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <InventoryIcon color="error" sx={{ mr: 1 }} />
                  <Typography variant="h6">Low Stock Items</Typography>
                </Box>
                <Typography variant="h4">{dashboardData.lowStockItems}</Typography>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<InventoryIcon />}
                  onClick={() => navigate('/inventory')}
                  sx={{ mt: 2 }}
                >
                  Check Inventory
                </Button>
              </CardContent>
            </StyledCard>
          </Grid>
        </Grid>

        {/* Performance Metrics and Recent Activities */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <StyledCard>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Performance Metrics
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <TrendingUpIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Daily Orders"
                      secondary={dashboardData.performanceMetrics.dailyOrders}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <MoneyIcon color="success" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Average Order Value"
                      secondary={`$${dashboardData.performanceMetrics.averageOrderValue.toFixed(2)}`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <AssessmentIcon color="info" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Customer Satisfaction"
                      secondary={`${dashboardData.performanceMetrics.customerSatisfaction}/5.0`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <PeopleIcon color="secondary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Employee Attendance"
                      secondary={`${dashboardData.performanceMetrics.employeeAttendance}%`}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </StyledCard>
          </Grid>
          <Grid item xs={12} md={6}>
            <StyledCard>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Recent Activities
                </Typography>
                <List>
                  {dashboardData.recentActivities.map((activity) => (
                    <ListItem
                      key={activity.id}
                      sx={{
                        mb: 1,
                        borderRadius: 1,
                        '&:hover': {
                          backgroundColor: 'rgba(0, 0, 0, 0.04)',
                        },
                      }}
                    >
                      <ListItemIcon>
                        {getActivityIcon(activity.type)}
                      </ListItemIcon>
                      <ListItemText
                        primary={activity.message}
                        secondary={activity.time}
                        primaryTypographyProps={{
                          variant: 'body2',
                          fontWeight: 500,
                        }}
                        secondaryTypographyProps={{
                          variant: 'caption',
                          color: 'text.secondary',
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => navigate('/reports')}
                  >
                    View All Activities
                  </Button>
                </Box>
              </CardContent>
            </StyledCard>
          </Grid>
        </Grid>

        {/* Quick Actions */}
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <StyledCard>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Quick Actions
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<PeopleIcon />}
                      onClick={() => navigate('/employees')}
                    >
                      Manage Employees
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<InventoryIcon />}
                      onClick={() => navigate('/inventory')}
                    >
                      Manage Inventory
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<AssessmentIcon />}
                      onClick={() => navigate('/reports')}
                    >
                      View Reports
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<SettingsIcon />}
                      onClick={() => navigate('/settings')}
                    >
                      Settings
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </StyledCard>
          </Grid>
        </Grid>

        {/* Dialogs */}
        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>
            {dialogType === 'addEmployee' ? 'Add New Employee' :
             dialogType === 'revenueReport' ? 'Revenue Report' : 'Action'}
          </DialogTitle>
          <DialogContent>
            {dialogType === 'addEmployee' && (
              <Box sx={{ pt: 2 }}>
                <TextField
                  fullWidth
                  label="Employee Name"
                  name="employeeName"
                  value={formData.employeeName}
                  onChange={handleInputChange}
                  variant="outlined"
                  sx={{ mb: 2 }}
                  required
                />
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  variant="outlined"
                  sx={{ mb: 2 }}
                  required
                />
                <TextField
                  fullWidth
                  label="Position"
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  variant="outlined"
                  select
                  sx={{ mb: 2 }}
                >
                  <MenuItem value="staff">Staff</MenuItem>
                  <MenuItem value="chef">Chef</MenuItem>
                  <MenuItem value="manager">Manager</MenuItem>
                </TextField>
                <TextField
                  fullWidth
                  label="Start Date"
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                  sx={{ mb: 2 }}
                />
              </Box>
            )}
            {dialogType === 'revenueReport' && (
              <Box sx={{ pt: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Revenue Summary
                </Typography>
                <List>
                  <ListItem>
                    <ListItemText primary="Daily Revenue" secondary={`$${(dashboardData.totalRevenue / 30).toFixed(2)}`} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Monthly Revenue" secondary={`$${dashboardData.totalRevenue.toLocaleString()}`} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Average Order Value" secondary={`$${dashboardData.performanceMetrics.averageOrderValue.toFixed(2)}`} />
                  </ListItem>
                </List>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              {dialogType === 'addEmployee' ? 'Add Employee' : 'Generate Report'}
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </motion.div>
    </DashboardContainer>
  );
};

export default EmployerDashboard; 