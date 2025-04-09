import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  MenuItem,
  Snackbar,
  Alert,
  Grid,
  Card,
  CardContent,
  Chip,
  Divider,
  FormControl,
  InputLabel,
  Select,
  Badge
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon, ShoppingCart as ShoppingCartIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import RemoveIcon from '@mui/icons-material/Remove';
import PaymentIcon from '@mui/icons-material/Payment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useAuth } from '../contexts/AuthContext';

const StyledCard = styled(motion(Card))`
  height: 100%;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const AnimatedContainer = styled(motion.div)`
  width: 100%;
`;

// Check if user is authenticated
const isAuthenticated = () => {
  return localStorage.getItem('isAuthenticated') === 'true';
};

const Orders = () => {
  const navigate = useNavigate();
  const { userRole, isEmployee, isEmployer } = useAuth();
  const [orders, setOrders] = useState([
    {
      id: 1,
      customerName: 'John Doe',
      items: ['Grilled Salmon', 'Caesar Salad', 'Ice Cream'],
      total: 58.97,
      status: 'Completed',
      date: '2023-06-15',
      time: '19:30',
      paymentMethod: 'Credit Card',
      tableNumber: 5
    },
    {
      id: 2,
      customerName: 'Lisa Smith',
      items: ['Pasta Carbonara', 'Garlic Bread', 'Tiramisu'],
      total: 42.50,
      status: 'In Progress',
      date: '2023-06-15',
      time: '20:15',
      paymentMethod: 'Cash',
      tableNumber: 8
    },
    {
      id: 3,
      customerName: 'Michael Johnson',
      items: ['Steak', 'Mashed Potatoes', 'Red Wine'],
      total: 87.25,
      status: 'Pending',
      date: '2023-06-15',
      time: '20:45',
      paymentMethod: 'Credit Card',
      tableNumber: 3
    }
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const [formData, setFormData] = useState({
    customerName: '',
    items: [],
    total: '',
    status: 'Pending',
    date: '',
    time: '',
    paymentMethod: 'Credit Card',
    tableNumber: ''
  });

  const statuses = ['Pending', 'In Progress', 'Completed', 'Cancelled'];
  const paymentMethods = ['Credit Card', 'Cash', 'Mobile Payment'];

  useEffect(() => {
    // Check if user is authenticated and has appropriate role
    if (!isEmployee() && !isEmployer()) {
      setSnackbar({
        open: true,
        message: 'Access denied. This page is for employees and employers only.',
        severity: 'error',
      });
      
      // Redirect after a short delay
      const timer = setTimeout(() => {
        navigate('/');
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [navigate, isEmployee, isEmployer]);

  const handleOpenDialog = (order = null) => {
    if (order) {
      setEditMode(true);
      setCurrentOrder(order);
      setFormData({
        ...order,
        items: order.items.join(', ')
      });
    } else {
      setEditMode(false);
      setCurrentOrder(null);
      setFormData({
        customerName: '',
        items: '',
        total: '',
        status: 'Pending',
        date: new Date().toISOString().split('T')[0],
        time: '',
        paymentMethod: 'Credit Card',
        tableNumber: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditMode(false);
    setCurrentOrder(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    // Convert comma-separated items to array
    const itemsArray = formData.items.split(',').map(item => item.trim());
    
    const processedData = {
      ...formData,
      items: itemsArray,
      total: parseFloat(formData.total),
      tableNumber: parseInt(formData.tableNumber)
    };

    if (editMode) {
      setOrders((prev) =>
        prev.map((order) =>
          order.id === currentOrder.id ? { ...processedData, id: order.id } : order
        )
      );
      setSnackbar({
        open: true,
        message: 'Order updated successfully',
        severity: 'success'
      });
    } else {
      const newOrder = {
        ...processedData,
        id: orders.length + 1
      };
      setOrders((prev) => [...prev, newOrder]);
      setSnackbar({
        open: true,
        message: 'Order added successfully',
        severity: 'success'
      });
    }
    handleCloseDialog();
  };

  const handleDelete = (id) => {
    setOrders((prev) => prev.filter((order) => order.id !== id));
    setSnackbar({
      open: true,
      message: 'Order deleted successfully',
      severity: 'success'
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'success';
      case 'In Progress':
        return 'primary';
      case 'Pending':
        return 'warning';
      case 'Cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const calculateStats = () => {
    const totalOrders = orders.length;
    const completedOrders = orders.filter(order => order.status === 'Completed').length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const averageOrderValue = totalRevenue / totalOrders || 0;

    return {
      totalOrders,
      completedOrders,
      totalRevenue,
      averageOrderValue
    };
  };

  const stats = calculateStats();

  return (
    <Container maxWidth="lg" sx={{ pt: 10, pb: 8 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            Order Management
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Manage and track all restaurant orders
          </Typography>
        </Box>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={3}>
            <StyledCard whileHover={{ y: -5 }} transition={{ duration: 0.3 }}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Orders
                </Typography>
                <Typography variant="h4">{stats.totalOrders}</Typography>
              </CardContent>
            </StyledCard>
          </Grid>
          <Grid item xs={12} md={3}>
            <StyledCard whileHover={{ y: -5 }} transition={{ duration: 0.3 }}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Completed Orders
                </Typography>
                <Typography variant="h4">{stats.completedOrders}</Typography>
              </CardContent>
            </StyledCard>
          </Grid>
          <Grid item xs={12} md={3}>
            <StyledCard whileHover={{ y: -5 }} transition={{ duration: 0.3 }}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Revenue
                </Typography>
                <Typography variant="h4">${stats.totalRevenue.toFixed(2)}</Typography>
              </CardContent>
            </StyledCard>
          </Grid>
          <Grid item xs={12} md={3}>
            <StyledCard whileHover={{ y: -5 }} transition={{ duration: 0.3 }}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Average Order Value
                </Typography>
                <Typography variant="h4">${stats.averageOrderValue.toFixed(2)}</Typography>
              </CardContent>
            </StyledCard>
          </Grid>
        </Grid>

        <TableContainer component={Paper} sx={{ mb: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order ID</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Items</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Date & Time</TableCell>
                <TableCell>Table</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>#{order.id}</TableCell>
                  <TableCell>{order.customerName}</TableCell>
                  <TableCell>{order.items.join(', ')}</TableCell>
                  <TableCell>${order.total.toFixed(2)}</TableCell>
                  <TableCell>{order.date} {order.time}</TableCell>
                  <TableCell>{order.tableNumber}</TableCell>
                  <TableCell>
                    <Chip
                      label={order.status}
                      color={getStatusColor(order.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleOpenDialog(order)}
                      size="small"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(order.id)}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>
            {editMode ? 'Edit Order' : 'Add New Order'}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              <TextField
                label="Customer Name"
                name="customerName"
                value={formData.customerName}
                onChange={handleInputChange}
                fullWidth
              />
              <TextField
                label="Items (comma separated)"
                name="items"
                value={formData.items}
                onChange={handleInputChange}
                fullWidth
                multiline
                rows={2}
                helperText="Enter items separated by commas"
              />
              <TextField
                label="Total Amount"
                name="total"
                type="number"
                value={formData.total}
                onChange={handleInputChange}
                fullWidth
                InputProps={{
                  startAdornment: '$',
                }}
              />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    label="Date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Time"
                    name="time"
                    type="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    label="Table Number"
                    name="tableNumber"
                    type="number"
                    value={formData.tableNumber}
                    onChange={handleInputChange}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    select
                    label="Status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    fullWidth
                  >
                    {statuses.map((status) => (
                      <MenuItem key={status} value={status}>
                        {status}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </Grid>
              <TextField
                select
                label="Payment Method"
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleInputChange}
                fullWidth
              >
                {paymentMethods.map((method) => (
                  <MenuItem key={method} value={method}>
                    {method}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              color="primary"
            >
              {editMode ? 'Update' : 'Add'}
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
    </Container>
  );
};

export default Orders; 