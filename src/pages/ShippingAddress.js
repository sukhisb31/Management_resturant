import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Divider,
  FormControlLabel,
  Checkbox,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import { motion } from 'framer-motion';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import HomeIcon from '@mui/icons-material/Home';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const ShippingAddress = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const orderData = location.state?.orderData;
  
  const [loading, setLoading] = useState(false);
  const [saveAddress, setSaveAddress] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States',
    phoneNumber: '',
    email: '',
    deliveryInstructions: ''
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Validate if we have orderData
  useEffect(() => {
    if (!orderData) {
      setSnackbar({
        open: true,
        message: 'No order information found, redirecting to menu...',
        severity: 'error'
      });
      
      // Redirect to menu if no order data
      setTimeout(() => {
        navigate('/menu');
      }, 2000);
    }
  }, [orderData, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo({ ...shippingInfo, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    setSaveAddress(e.target.checked);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleContinue = () => {
    if (validateForm()) {
      setActiveStep(1);
    } else {
      setSnackbar({
        open: true,
        message: 'Please fill all required fields',
        severity: 'warning'
      });
    }
  };

  const handleBack = () => {
    setActiveStep(0);
  };

  const validateForm = () => {
    const requiredFields = ['fullName', 'addressLine1', 'city', 'state', 'postalCode', 'phoneNumber'];
    return requiredFields.every(field => shippingInfo[field].trim() !== '');
  };

  const handleSubmit = () => {
    setLoading(true);
    
    // Combine order data with shipping information
    const completeOrderData = {
      ...orderData,
      shippingInfo: { ...shippingInfo, saveAddress }
    };
    
    // In a real app, you would send this to a backend
    console.log('Complete order with shipping:', completeOrderData);
    
    // Store in localStorage for demo purposes
    if (saveAddress) {
      localStorage.setItem('savedShippingAddress', JSON.stringify(shippingInfo));
    }
    
    // Store the complete order
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push(completeOrderData);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    // Format shipping information for the OrderPlaced page
    const formattedOrder = {
      ...completeOrderData,
      id: orderData.orderNumber,
      date: new Date().toISOString(),
      status: 0,
      estimatedDelivery: new Date(Date.now() + 45 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      shippingInfo: {
        fullName: shippingInfo.fullName,
        phone: shippingInfo.phoneNumber,
        address: `${shippingInfo.addressLine1}, ${shippingInfo.addressLine2 ? shippingInfo.addressLine2 + ', ' : ''}${shippingInfo.city}, ${shippingInfo.state} ${shippingInfo.postalCode}, ${shippingInfo.country}`,
        instructions: shippingInfo.deliveryInstructions
      }
    };
    
    // Store as current order for tracking
    localStorage.setItem('currentOrder', JSON.stringify(formattedOrder));
    
    // Add to order history
    const orderHistory = JSON.parse(localStorage.getItem('orderHistory') || '[]');
    orderHistory.push(formattedOrder);
    localStorage.setItem('orderHistory', JSON.stringify(orderHistory));
    
    // Simulate processing
    setTimeout(() => {
      setLoading(false);
      navigate('/order-placement', { 
        state: { 
          order: formattedOrder
        } 
      });
    }, 2000);
  };

  // If no order data, show loading until redirect
  if (!orderData) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Checking order information...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Paper
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        elevation={3}
        sx={{ p: 4, borderRadius: 2 }}
      >
        <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
          <LocalShippingIcon sx={{ mr: 1, fontSize: 36 }} />
          Shipping Information
        </Typography>
        
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          <Step>
            <StepLabel>Shipping Address</StepLabel>
          </Step>
          <Step>
            <StepLabel>Confirm Order</StepLabel>
          </Step>
        </Stepper>
        
        {activeStep === 0 ? (
          <Box>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                  <HomeIcon sx={{ mr: 1 }} /> Contact & Delivery Details
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Full Name*"
                  name="fullName"
                  value={shippingInfo.fullName}
                  onChange={handleInputChange}
                  required
                  variant="outlined"
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone Number*"
                  name="phoneNumber"
                  value={shippingInfo.phoneNumber}
                  onChange={handleInputChange}
                  required
                  variant="outlined"
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email Address"
                  name="email"
                  type="email"
                  value={shippingInfo.email}
                  onChange={handleInputChange}
                  variant="outlined"
                />
              </Grid>
              
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" sx={{ mb: 2, mt: 2, display: 'flex', alignItems: 'center' }}>
                  <LocationOnIcon sx={{ mr: 1 }} /> Shipping Address
                </Typography>
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address Line 1*"
                  name="addressLine1"
                  value={shippingInfo.addressLine1}
                  onChange={handleInputChange}
                  required
                  variant="outlined"
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address Line 2 (Apartment, Suite, etc.)"
                  name="addressLine2"
                  value={shippingInfo.addressLine2}
                  onChange={handleInputChange}
                  variant="outlined"
                />
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="City*"
                  name="city"
                  value={shippingInfo.city}
                  onChange={handleInputChange}
                  required
                  variant="outlined"
                />
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="State/Province*"
                  name="state"
                  value={shippingInfo.state}
                  onChange={handleInputChange}
                  required
                  variant="outlined"
                />
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Postal Code*"
                  name="postalCode"
                  value={shippingInfo.postalCode}
                  onChange={handleInputChange}
                  required
                  variant="outlined"
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Country"
                  name="country"
                  value={shippingInfo.country}
                  onChange={handleInputChange}
                  variant="outlined"
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Delivery Instructions"
                  name="deliveryInstructions"
                  value={shippingInfo.deliveryInstructions}
                  onChange={handleInputChange}
                  multiline
                  rows={3}
                  variant="outlined"
                  placeholder="Special instructions for delivery"
                />
              </Grid>
              
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={saveAddress}
                      onChange={handleCheckboxChange}
                      color="primary"
                    />
                  }
                  label="Save this address for future orders"
                />
              </Grid>
            </Grid>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button 
                variant="outlined" 
                startIcon={<ArrowBackIcon />} 
                onClick={() => navigate(-1)}
              >
                Back to Order
              </Button>
              <Button 
                variant="contained" 
                onClick={handleContinue}
                sx={{
                  background: 'linear-gradient(45deg, #FF4B2B 30%, #FF8E53 90%)',
                  boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
                }}
              >
                Continue
              </Button>
            </Box>
          </Box>
        ) : (
          <Box>
            <Grid container spacing={3}>
              <Grid item xs={12} md={7}>
                <Card variant="outlined" sx={{ mb: 3 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Shipping Address
                    </Typography>
                    <Typography variant="body1">
                      {shippingInfo.fullName}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      {shippingInfo.phoneNumber}
                    </Typography>
                    <Typography variant="body2">
                      {shippingInfo.addressLine1}
                    </Typography>
                    {shippingInfo.addressLine2 && (
                      <Typography variant="body2">
                        {shippingInfo.addressLine2}
                      </Typography>
                    )}
                    <Typography variant="body2">
                      {shippingInfo.city}, {shippingInfo.state} {shippingInfo.postalCode}
                    </Typography>
                    <Typography variant="body2">
                      {shippingInfo.country}
                    </Typography>
                    
                    {shippingInfo.deliveryInstructions && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle2">Delivery Instructions:</Typography>
                        <Typography variant="body2">
                          {shippingInfo.deliveryInstructions}
                        </Typography>
                      </Box>
                    )}
                    
                    <Button 
                      size="small" 
                      sx={{ mt: 2 }} 
                      onClick={handleBack}
                    >
                      Edit Address
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={5}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Order Summary
                    </Typography>
                    <Chip 
                      label={`Order #${orderData.orderNumber}`} 
                      sx={{ mb: 2 }} 
                      color="primary"
                    />
                    
                    {orderData.items.map((item, index) => (
                      <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">
                          {item.quantity} x {item.name}
                        </Typography>
                        <Typography variant="body2">
                          ${(item.price * item.quantity).toFixed(2)}
                        </Typography>
                      </Box>
                    ))}
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Subtotal:</Typography>
                      <Typography variant="body2">
                        ${orderData.total}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Delivery Fee:</Typography>
                      <Typography variant="body2">$3.99</Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', mt: 1 }}>
                      <Typography variant="subtitle1">Total:</Typography>
                      <Typography variant="subtitle1">
                        ${(parseFloat(orderData.total) + 3.99).toFixed(2)}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button 
                variant="outlined" 
                onClick={handleBack}
              >
                Back
              </Button>
              <Button 
                variant="contained" 
                onClick={handleSubmit}
                disabled={loading}
                sx={{
                  background: 'linear-gradient(45deg, #FF4B2B 30%, #FF8E53 90%)',
                  boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
                }}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <CheckCircleIcon />}
              >
                {loading ? 'Processing...' : 'Complete Order'}
              </Button>
            </Box>
          </Box>
        )}
      </Paper>
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
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

export default ShippingAddress; 