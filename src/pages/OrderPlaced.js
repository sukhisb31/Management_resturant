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
  useMediaQuery
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

const OrderPlaced = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Initialize state with order from location or from localStorage
  const [order, setOrder] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  
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
        }
      }
    }
  }, [location]);

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
      }, 20000); // Update every 20 seconds (for demo purposes)
    }
    
    return () => clearTimeout(timer);
  }, [order, activeStep]);

  const getStatusLabel = (step) => {
    return orderSteps[step]?.status || 'placed';
  };

  const handleBackToMenu = () => {
    navigate('/menu');
  };

  // If no order is found
  if (!order) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h5" gutterBottom>
              No Recent Order Found
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              We couldn't find any recent order information.
            </Typography>
            <Button
              variant="contained"
              startIcon={<ArrowBackIcon />}
              onClick={handleBackToMenu}
              sx={{
                background: 'linear-gradient(45deg, #FF4B2B 30%, #FF8E53 90%)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #FF4B2B 50%, #FF8E53 100%)',
                }
              }}
            >
              Go to Menu
            </Button>
          </Paper>
        </motion.div>
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
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
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

        <Typography variant="h4" component="h1" sx={{ 
          mb: 4, 
          fontWeight: 'bold',
          background: 'linear-gradient(45deg, #FF4B2B 30%, #FF8E53 90%)',
          backgroundClip: 'text',
          textFillColor: 'transparent',
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
                <Typography variant="body1">$0.00</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Total</Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#FF4B2B' }}>
                  ${order.total.toFixed(2)}
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
      </motion.div>
    </Container>
  );
};

export default OrderPlaced; 