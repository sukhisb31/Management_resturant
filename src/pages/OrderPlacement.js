import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  Divider, 
  Grid, 
  Button, 
  Stepper, 
  Step, 
  StepLabel,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Chip,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Snackbar,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tabs,
  Tab,
  IconButton,
  Card,
  CardContent
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HomeIcon from '@mui/icons-material/Home';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ReceiptIcon from '@mui/icons-material/Receipt';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HistoryIcon from '@mui/icons-material/History';
import VisibilityIcon from '@mui/icons-material/Visibility';

const OrderContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(1),
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
  marginBottom: theme.spacing(3),
}));

const OrderHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: theme.spacing(1),
  },
}));

const StepIcon = styled(Box)(({ theme, active }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 35,
  height: 35,
  borderRadius: '50%',
  background: active ? 'linear-gradient(45deg, #FF4B2B 30%, #FF8E53 90%)' : theme.palette.grey[200],
  color: active ? 'white' : theme.palette.text.secondary,
  marginRight: theme.spacing(1),
}));

const StatusChip = styled(Chip)(({ theme, status }) => {
  const colors = {
    placed: { bg: '#e3f2fd', color: '#1976d2' },
    preparing: { bg: '#fff8e1', color: '#f57c00' },
    shipping: { bg: '#e8f5e9', color: '#388e3c' },
    delivered: { bg: '#efebe9', color: '#5d4037' }
  };
  const statusColor = colors[status] || colors.placed;
  
  return {
    backgroundColor: statusColor.bg,
    color: statusColor.color,
    fontWeight: 600,
    borderRadius: theme.spacing(1),
  };
});

// Order status steps
const orderSteps = [
  { label: 'Order Placed', icon: <CheckCircleIcon />, status: 'placed' },
  { label: 'Preparing', icon: <RestaurantIcon />, status: 'preparing' },
  { label: 'On the Way', icon: <LocalShippingIcon />, status: 'shipping' },
  { label: 'Delivered', icon: <DeliveryDiningIcon />, status: 'delivered' },
];

const HistoryCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  border: '1px solid rgba(0, 0, 0, 0.06)',
  borderRadius: theme.spacing(1),
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    borderColor: theme.palette.primary.light,
  },
}));

const OrderPlacement = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Initialize state with order from location or from localStorage
  const [order, setOrder] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  
  // New state variables for order history
  const [orderHistory, setOrderHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [historyTab, setHistoryTab] = useState(0);
  const [selectedHistoryOrder, setSelectedHistoryOrder] = useState(null);
  
  useEffect(() => {
    // Try to get order from location state first
    if (location.state && location.state.order) {
      setOrder(location.state.order);
      setActiveStep(location.state.order.status || 0);
    } else {
      // Otherwise get from localStorage
      const currentOrder = JSON.parse(localStorage.getItem('currentOrder'));
      if (currentOrder) {
        setOrder(currentOrder);
        setActiveStep(currentOrder.status || 0);
      } else {
        // If no order is found, check orderHistory for the most recent order
        const orderHistory = JSON.parse(localStorage.getItem('orderHistory') || '[]');
        if (orderHistory.length > 0) {
          const mostRecentOrder = orderHistory[orderHistory.length - 1];
          setOrder(mostRecentOrder);
          setActiveStep(mostRecentOrder.status || 0);
        } else {
          // No orders found
          setSnackbar({
            open: true,
            message: 'No orders found. Redirecting to menu...',
            severity: 'info'
          });
          
          // Redirect after delay
          setTimeout(() => {
            navigate('/menu');
          }, 2000);
        }
      }
    }
    
    // Load order history from localStorage
    const historyData = JSON.parse(localStorage.getItem('orderHistory') || '[]');
    setOrderHistory(historyData);
  }, [location, navigate]);

  // Simulate order progress updates
  useEffect(() => {
    let timer;
    if (order && activeStep < 3) {
      timer = setTimeout(() => {
        const newStep = activeStep + 1;
        setActiveStep(newStep);
        
        // Update order status in state and localStorage
        const updatedOrder = { ...order, status: newStep };
        setOrder(updatedOrder);
        localStorage.setItem('currentOrder', JSON.stringify(updatedOrder));
        
        // Also update in order history
        const orderHistory = JSON.parse(localStorage.getItem('orderHistory') || '[]');
        const updatedHistory = orderHistory.map(historyOrder => 
          historyOrder.id === order.id ? updatedOrder : historyOrder
        );
        localStorage.setItem('orderHistory', JSON.stringify(updatedHistory));
      }, 15000); // Update every 15 seconds
    }
    
    return () => clearTimeout(timer);
  }, [order, activeStep]);

  // Function to handle when an order is fully delivered
  useEffect(() => {
    if (order && activeStep === 3) {
      // After 5 seconds of being delivered, clear the current order
      const timer = setTimeout(() => {
        // Don't remove from history, just clear as current
        localStorage.removeItem('currentOrder');
        setOrder(null);
        
        // Show message that order tracking is done
        setSnackbar({
          open: true,
          message: 'Order has been delivered! You can view it in your order history.',
          severity: 'success'
        });
        
        // Show history section
        setShowHistory(true);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [order, activeStep]);

  const getStatusLabel = (step) => {
    return orderSteps[step]?.status || 'placed';
  };

  const handleBackToMenu = () => {
    navigate('/menu');
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleToggleHistory = () => {
    setShowHistory(!showHistory);
    setSelectedHistoryOrder(null);
  };
  
  const handleHistoryTabChange = (event, newValue) => {
    setHistoryTab(newValue);
  };
  
  const handleViewHistoryOrder = (historyOrder) => {
    setSelectedHistoryOrder(historyOrder);
  };
  
  const handleBackToHistory = () => {
    setSelectedHistoryOrder(null);
  };
  
  const getFilteredOrders = () => {
    if (historyTab === 0) {
      // All orders
      return orderHistory;
    } else if (historyTab === 1) {
      // Delivered orders
      return orderHistory.filter(order => order.status === 3);
    } else {
      // In progress orders
      return orderHistory.filter(order => order.status < 3);
    }
  };

  const renderHistorySection = () => {
    if (selectedHistoryOrder) {
      // Show selected order details
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
            <Button 
              startIcon={<ArrowBackIcon />}
              onClick={handleBackToHistory}
              sx={{ mr: 2 }}
            >
              Back to history
            </Button>
            <Typography variant="h6">
              Order #{selectedHistoryOrder.id} Details
            </Typography>
          </Box>
          
          <OrderContainer elevation={2}>
            <OrderHeader>
              <Box>
                <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold' }}>
                  Order Summary
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CalendarTodayIcon fontSize="small" sx={{ color: 'text.secondary', mr: 0.5 }} />
                    <Typography variant="body2" color="text.secondary">
                      {new Date(selectedHistoryOrder.date).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <AccessTimeIcon fontSize="small" sx={{ color: 'text.secondary', mr: 0.5 }} />
                    <Typography variant="body2" color="text.secondary">
                      {new Date(selectedHistoryOrder.date).toLocaleTimeString()}
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <StatusChip 
                label={orderSteps[selectedHistoryOrder.status]?.label} 
                status={getStatusLabel(selectedHistoryOrder.status)}
                icon={React.cloneElement(orderSteps[selectedHistoryOrder.status]?.icon, { fontSize: 'small' })}
              />
            </OrderHeader>
            
            <Divider sx={{ my: 2 }} />
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={7}>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Items Ordered
                </Typography>
                <List disablePadding>
                  {selectedHistoryOrder.items.map((item) => (
                    <ListItem key={item.id} sx={{ py: 1, px: 0 }}>
                      <ListItemAvatar>
                        <Avatar variant="rounded" src={item.image} alt={item.name} />
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                            {item.name}
                          </Typography>
                        }
                        secondary={
                          <Typography variant="body2" color="text.secondary">
                            ${item.price.toFixed(2)} × {item.quantity}
                          </Typography>
                        }
                      />
                      <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                        ${(item.price * item.quantity).toFixed(2)}
                      </Typography>
                    </ListItem>
                  ))}
                </List>
                
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Total</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#FF4B2B' }}>
                    ${(parseFloat(selectedHistoryOrder.total) + 3.99).toFixed(2)}
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={5}>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Delivery Information
                </Typography>
                <Box sx={{ bgcolor: 'rgba(0, 0, 0, 0.02)', p: 2, borderRadius: 1 }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Recipient:</strong> {selectedHistoryOrder.shippingInfo.fullName}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Address:</strong> {selectedHistoryOrder.shippingInfo.address}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Phone:</strong> {selectedHistoryOrder.shippingInfo.phone}
                  </Typography>
                  {selectedHistoryOrder.shippingInfo.instructions && (
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Instructions:</strong> {selectedHistoryOrder.shippingInfo.instructions}
                    </Typography>
                  )}
                </Box>
              </Grid>
            </Grid>
          </OrderContainer>
        </motion.div>
      );
    }
    
    // Default history list view
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Box sx={{ mb: 3 }}>
          <Tabs 
            value={historyTab} 
            onChange={handleHistoryTabChange}
            indicatorColor="primary"
            textColor="primary"
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab label="All Orders" />
            <Tab label="Delivered" />
            <Tab label="In Progress" />
          </Tabs>
        </Box>
        
        {getFilteredOrders().length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" color="text.secondary">
              No orders found in this category.
            </Typography>
          </Box>
        ) : (
          getFilteredOrders().map((historyOrder) => (
            <HistoryCard key={historyOrder.id}>
              <CardContent>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={3} md={2}>
                    <Typography variant="body2" color="text.secondary">
                      Order #{historyOrder.id}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(historyOrder.date).toLocaleDateString()}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={4} md={3}>
                    <StatusChip 
                      label={orderSteps[historyOrder.status]?.label} 
                      status={getStatusLabel(historyOrder.status)}
                      size="small"
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={3} md={5}>
                    <Typography variant="body2">
                      {historyOrder.items.length} {historyOrder.items.length === 1 ? 'item' : 'items'} • 
                      ${(parseFloat(historyOrder.total) + 3.99).toFixed(2)}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={2} md={2} sx={{ textAlign: 'right' }}>
                    <IconButton 
                      color="primary"
                      onClick={() => handleViewHistoryOrder(historyOrder)}
                      size="small"
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              </CardContent>
            </HistoryCard>
          )).reverse() // Most recent first
        )}
      </motion.div>
    );
  };

  // If no order is found
  if (!order && orderHistory.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Looking for your order...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={handleBackToMenu}
              sx={{
                borderColor: '#FF4B2B',
                color: '#FF4B2B',
                '&:hover': {
                  borderColor: '#FF8E53',
                  backgroundColor: 'rgba(255, 75, 43, 0.04)',
                }
              }}
            >
              Back to Menu
            </Button>
            <Button
              variant="text"
              startIcon={<HomeIcon />}
              onClick={() => navigate('/')}
              sx={{
                color: 'text.secondary',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                }
              }}
            >
              Home
            </Button>
          </Box>
          
          <Button
            variant={showHistory ? "contained" : "outlined"}
            startIcon={<HistoryIcon />}
            onClick={handleToggleHistory}
            sx={{
              ...(showHistory ? {
                bgcolor: '#FF4B2B',
                '&:hover': {
                  bgcolor: '#FF8E53',
                }
              } : {
                borderColor: '#FF4B2B',
                color: '#FF4B2B',
                '&:hover': {
                  borderColor: '#FF8E53',
                }
              })
            }}
          >
            {showHistory ? 'Current Order' : 'Order History'}
          </Button>
        </Box>

        {!showHistory && order ? (
          <>
            <Typography variant="h4" component="h1" sx={{ 
              mb: 4, 
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #FF4B2B 30%, #FF8E53 90%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Your Order Status
            </Typography>

            {/* Order Summary Card */}
            <OrderContainer elevation={2}>
              <OrderHeader>
                <Box>
                  <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
                    Order #{order.id}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CalendarTodayIcon fontSize="small" sx={{ color: 'text.secondary', mr: 0.5 }} />
                      <Typography variant="body2" color="text.secondary">
                        {new Date(order.date).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <AccessTimeIcon fontSize="small" sx={{ color: 'text.secondary', mr: 0.5 }} />
                      <Typography variant="body2" color="text.secondary">
                        {new Date(order.date).toLocaleTimeString()}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <StatusChip 
                  label={orderSteps[activeStep]?.label} 
                  status={getStatusLabel(activeStep)}
                  icon={React.cloneElement(orderSteps[activeStep]?.icon, { fontSize: 'small' })}
                />
              </OrderHeader>

              <Divider sx={{ my: 2 }} />

              {/* Order Tracking Stepper */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                  Order Tracking
                </Typography>
                <Stepper 
                  activeStep={activeStep} 
                  alternativeLabel={!isMobile}
                  orientation={isMobile ? 'vertical' : 'horizontal'}
                >
                  {orderSteps.map((step, index) => (
                    <Step key={step.label}>
                      <StepLabel
                        StepIconComponent={() => (
                          <StepIcon active={index <= activeStep}>
                            {step.icon}
                          </StepIcon>
                        )}
                      >
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontWeight: index <= activeStep ? 'bold' : 'normal',
                            color: index <= activeStep ? '#FF4B2B' : 'text.secondary'
                          }}
                        >
                          {step.label}
                          {index === activeStep && (
                            <Typography variant="caption" display="block" sx={{ color: 'text.secondary' }}>
                              {index < 3 ? 'In progress' : 'Completed'}
                            </Typography>
                          )}
                        </Typography>
                      </StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </Box>

              {/* Estimated Delivery */}
              {activeStep < 3 && (
                <Box 
                  sx={{
                    p: 2,
                    bgcolor: 'rgba(255, 75, 43, 0.05)',
                    borderRadius: 1,
                    mb: 3,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <DeliveryDiningIcon sx={{ color: '#FF4B2B' }} />
                  <Typography variant="body1">
                    Estimated delivery by <b>{order.estimatedDelivery}</b>
                  </Typography>
                </Box>
              )}
            </OrderContainer>

            {/* Order Details and Delivery Information */}
            <Grid container spacing={3}>
              {/* Order Items */}
              <Grid item xs={12} md={7}>
                <OrderContainer elevation={2}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <ReceiptIcon sx={{ mr: 1, color: '#FF4B2B' }} />
                    <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold' }}>
                      Order Details
                    </Typography>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  
                  <List disablePadding>
                    {order.items.map((item) => (
                      <ListItem key={item.id} sx={{ py: 1, px: 0 }}>
                        <ListItemAvatar>
                          <Avatar variant="rounded" src={item.image} alt={item.name} />
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                              {item.name}
                            </Typography>
                          }
                          secondary={
                            <Typography variant="body2" color="text.secondary">
                              ${item.price.toFixed(2)} × {item.quantity}
                            </Typography>
                          }
                        />
                        <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                          ${(item.price * item.quantity).toFixed(2)}
                        </Typography>
                      </ListItem>
                    ))}
                  </List>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body1">Subtotal</Typography>
                    <Typography variant="body1">${order.total.toFixed(2)}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body1">Delivery Fee</Typography>
                    <Typography variant="body1">$3.99</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Total</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#FF4B2B' }}>
                      ${(parseFloat(order.total) + 3.99).toFixed(2)}
                    </Typography>
                  </Box>
                </OrderContainer>
              </Grid>
              
              {/* Delivery Information */}
              <Grid item xs={12} md={5}>
                <OrderContainer elevation={2}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <LocalShippingIcon sx={{ mr: 1, color: '#FF4B2B' }} />
                    <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold' }}>
                      Delivery Information
                    </Typography>
                  </Box>
                  <Divider sx={{ mb: 3 }} />
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                        Recipient
                      </Typography>
                      <Typography variant="body1">
                        {order.shippingInfo.fullName}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                        Phone Number
                      </Typography>
                      <Typography variant="body1">
                        {order.shippingInfo.phone}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                        Delivery Address
                      </Typography>
                      <Typography variant="body1">
                        {order.shippingInfo.address}
                      </Typography>
                    </Grid>
                    
                    {order.shippingInfo.instructions && (
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                          Delivery Instructions
                        </Typography>
                        <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                          "{order.shippingInfo.instructions}"
                        </Typography>
                      </Grid>
                    )}
                  </Grid>
                </OrderContainer>
                
                {/* Action buttons */}
                <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<ShoppingCartIcon />}
                    onClick={handleBackToMenu}
                    sx={{
                      py: 1.2,
                      borderRadius: '8px',
                      background: 'linear-gradient(45deg, #FF4B2B 30%, #FF8E53 90%)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #FF4B2B 50%, #FF8E53 100%)',
                        boxShadow: '0 4px 8px rgba(255, 75, 43, 0.3)',
                      }
                    }}
                  >
                    Order More
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </>
        ) : !showHistory ? (
          // No active orders view
          <Box sx={{ textAlign: 'center', py: 6, px: 2 }}>
            <Paper 
              elevation={2} 
              sx={{ 
                p: 4, 
                maxWidth: 600, 
                mx: 'auto',
                borderRadius: 2,
                bgcolor: 'rgba(255, 255, 255, 0.9)'
              }}
            >
              <DeliveryDiningIcon sx={{ fontSize: 60, color: '#FF4B2B', mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                No Active Orders
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                You don't have any active orders being tracked right now.
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 3 }}>
                <Button 
                  variant="outlined"
                  startIcon={<HistoryIcon />}
                  onClick={handleToggleHistory}
                  sx={{
                    borderColor: '#FF4B2B',
                    color: '#FF4B2B',
                    '&:hover': {
                      borderColor: '#FF8E53',
                    }
                  }}
                >
                  View Order History
                </Button>
                <Button
                  variant="contained"
                  startIcon={<ShoppingCartIcon />}
                  onClick={handleBackToMenu}
                  sx={{
                    background: 'linear-gradient(45deg, #FF4B2B 30%, #FF8E53 90%)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #FF4B2B 50%, #FF8E53 100%)',
                    }
                  }}
                >
                  Place a New Order
                </Button>
              </Box>
            </Paper>
          </Box>
        ) : (
          // Order History Section
          <>
            <Typography variant="h4" component="h1" sx={{ 
              mb: 4, 
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #FF4B2B 30%, #FF8E53 90%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Your Order History
            </Typography>

            {renderHistorySection()}
          </>
        )}
      </motion.div>
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default OrderPlacement; 