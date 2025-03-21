import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Tabs,
  Tab,
  Chip,
  Button,
  CardActions,
  Snackbar,
  Alert,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Avatar,
  TextField,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
  Collapse,
  Stack,
  Badge,
} from '@mui/material';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import LunchDiningIcon from '@mui/icons-material/LunchDining';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';
import LocalBarIcon from '@mui/icons-material/LocalBar';
import CakeIcon from '@mui/icons-material/Cake';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import LocalPizzaIcon from '@mui/icons-material/LocalPizza';

const MenuCard = styled(motion(Card))`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const MenuImage = styled(CardMedia)`
  height: 200px;
  object-fit: cover;
`;

const PriceChip = styled(Chip)`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: rgba(255, 75, 43, 0.9);
  color: white;
`;

const CartPaper = styled(Paper)`
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  max-height: 100%;
  margin-bottom: 20px;
`;

const menuItems = [
  {
    id: 1,
    name: 'Margherita Pizza',
    description: 'Fresh tomatoes, mozzarella, basil, and olive oil',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'Pizza',
  },
  {
    id: 2,
    name: 'Pasta Carbonara',
    description: 'Spaghetti with eggs, cheese, pancetta, and black pepper',
    price: 14.99,
    image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'Pasta',
  },
  {
    id: 3,
    name: 'Caesar Salad',
    description: 'Romaine lettuce, croutons, parmesan cheese with caesar dressing',
    price: 8.99,
    image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'Salads',
  },
  {
    id: 4,
    name: 'Chocolate Cake',
    description: 'Rich chocolate cake with a layer of ganache and fresh berries',
    price: 7.99,
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'Desserts',
  },
  {
    id: 5,
    name: 'Iced Coffee',
    description: 'Cold brewed coffee served over ice with cream and sugar',
    price: 4.99,
    image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'Beverages',
  },
  {
    id: 6,
    name: 'BBQ Chicken Pizza',
    description: 'Grilled chicken, BBQ sauce, red onions, and cilantro',
    price: 15.99,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'Pizza',
  },
];

const categories = ['All', 'Pizza', 'Pasta', 'Salads', 'Desserts', 'Beverages'];

const Menu = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cart, setCart] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [checkoutMode, setCheckoutMode] = useState(false);
  const [shippingInfo, setShippingInfo] = useState({});
  const [loading, setLoading] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);

  // Load cart from localStorage on component mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
    
    // We'll still load the current order for data consistency, but won't display it
    const savedOrder = localStorage.getItem('currentOrder');
    if (savedOrder) {
      setCurrentOrder(JSON.parse(savedOrder));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);
  
  // Save current order to localStorage whenever it changes
  useEffect(() => {
    if (currentOrder) {
      localStorage.setItem('currentOrder', JSON.stringify(currentOrder));
    }
  }, [currentOrder]);

  const filteredItems = selectedCategory === 'All'
    ? menuItems
    : menuItems.filter(item => item.category === selectedCategory);

  const addToCart = (item) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    
    if (existingItem) {
      // Item already exists, increment quantity
      updateCartItemQuantity(item.id, existingItem.quantity + 1);
    } else {
      // Add new item to cart
      setCart([...cart, { ...item, quantity: 1 }]);
      
      // Show success message
      setSnackbar({
        open: true,
        message: `${item.name} added to cart`,
        severity: 'success',
      });
    }
  };
  
  const updateCartItemQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      // Remove item if quantity is zero or less
      removeFromCart(itemId);
      return;
    }
    
    setCart(cart.map(item => 
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    ));
  };
  
  const removeFromCart = (itemId) => {
    setCart(cart.filter(item => item.id !== itemId));
    
    setSnackbar({
      open: true,
      message: 'Item removed from cart',
      severity: 'info',
    });
  };
  
  const clearCart = () => {
    setCart([]);
    setSnackbar({
      open: true,
      message: 'Cart cleared',
      severity: 'info',
    });
  };
  
  // Calculation functions
  const getCartSubtotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };
  
  const getTaxAmount = () => {
    return (parseFloat(getCartSubtotal()) * 0.07).toFixed(2);
  };
  
  const getCartTotal = () => {
    return (parseFloat(getCartSubtotal()) + parseFloat(getTaxAmount())).toFixed(2);
  };
  
  // Handle checkout process
  const handleCheckout = () => {
    if (cart.length === 0) {
      setSnackbar({
        open: true,
        message: 'Your cart is empty',
        severity: 'warning',
      });
      return;
    }
    
    setCheckoutMode(true);
  };
  
  // Update tax and total calculations in the placeOrder function
  const placeOrder = () => {
    // Validate shipping information
    if (!shippingInfo.fullName || !shippingInfo.address || !shippingInfo.phone) {
      setSnackbar({
        open: true,
        message: 'Please fill in all required shipping details',
        severity: 'error',
      });
      return;
    }
    
    setLoading(true);
    
    // Simulate order processing
    setTimeout(() => {
      const orderNumber = Math.floor(100000 + Math.random() * 900000);
      const newOrder = {
        id: orderNumber,
        items: [...cart],
        total: parseFloat(getCartTotal()),
        date: new Date().toISOString(),
        status: 0, // First step: Order Placed
        shippingInfo: { ...shippingInfo },
        estimatedDelivery: new Date(Date.now() + 45 * 60000).toLocaleTimeString() // 45 min from now
      };
      
      // Store order in order history
      const orderHistory = JSON.parse(localStorage.getItem('orderHistory') || '[]');
      orderHistory.push(newOrder);
      localStorage.setItem('orderHistory', JSON.stringify(orderHistory));
      
      // Set as current order for tracking
      localStorage.setItem('currentOrder', JSON.stringify(newOrder));
      
      // Clear cart and checkout mode
      setCart([]);
      setCheckoutMode(false);
      setLoading(false);
      
      // Show success message
      setSnackbar({
        open: true,
        message: `Order #${orderNumber} placed successfully! Redirecting to order tracking...`,
        severity: 'success',
      });
      
      // Navigate to the OrderPlacement page
      setTimeout(() => {
        navigate('/order-placement', { 
          state: { 
            order: newOrder 
          } 
        });
      }, 1500);
    }, 2000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const proceedToCheckout = () => {
    setCheckoutMode(true);
  };
  
  const backToShopping = () => {
    setCheckoutMode(false);
  };

  const closeOrderTracking = () => {
    localStorage.removeItem('currentOrder');
    setCurrentOrder(null);
  };

  return (
    <Box sx={{ pt: 8, pb: 4 }}>
      <Container maxWidth="xl">
        <Grid container spacing={3}>
          <Grid item xs={12} md={8} lg={9}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Typography variant="h3" component="h1" textAlign="center" gutterBottom>
                Our Menu
              </Typography>
              
              <Box 
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                  mb: 4
                }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Tabs 
                    value={selectedCategory} 
                    onChange={(e, newValue) => setSelectedCategory(newValue)}
                    variant="scrollable"
                    scrollButtons="auto"
                    TabIndicatorProps={{
                      style: {
                        background: 'linear-gradient(45deg, #FF4B2B 30%, #FF8E53 90%)',
                      }
                    }}
                    sx={{ 
                      mb: 3,
                      '& .MuiTab-root.Mui-selected': {
                        color: '#FF4B2B',
                        fontWeight: 'bold'
                      }
                    }}
                  >
                    {categories.map((category) => (
                      <Tab 
                        key={category}
                        value={category}
                        label={category}
                        icon={
                          category === 'Pizza' ? <LocalPizzaIcon /> :
                          category === 'Pasta' ? <LunchDiningIcon /> :
                          category === 'Salads' ? <FastfoodIcon /> :
                          category === 'Desserts' ? <CakeIcon /> :
                          category === 'Beverages' ? <LocalCafeIcon /> :
                          <RestaurantIcon />
                        }
                        iconPosition="start"
                      />
                    ))}
                  </Tabs>
                </motion.div>
              </Box>
              
              <Grid container spacing={3}>
                {filteredItems.map((item, index) => (
                  <Grid item xs={12} sm={6} md={4} key={item.id}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      whileHover={{ y: -10, transition: { duration: 0.2 } }}
                    >
                      <MenuCard>
                        <Box sx={{ position: 'relative' }}>
                          <MenuImage
                            component="img"
                            image={item.image}
                            alt={item.name}
                          />
                          <PriceChip label={`$${item.price.toFixed(2)}`} />
                        </Box>
                        <CardContent sx={{ flexGrow: 1 }}>
                          <Typography variant="h6" component="h2" gutterBottom>
                            {item.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {item.description}
                          </Typography>
                        </CardContent>
                        <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button 
                              variant="contained" 
                              startIcon={<AddShoppingCartIcon />}
                              onClick={() => addToCart(item)}
                              sx={{ 
                                background: 'linear-gradient(45deg, #FF4B2B 30%, #FF8E53 90%)',
                                color: 'white',
                                fontWeight: 'bold',
                                borderRadius: '20px',
                                boxShadow: '0 4px 10px rgba(255, 75, 43, 0.3)',
                                '&:hover': {
                                  background: 'linear-gradient(45deg, #FF8E53 30%, #FF4B2B 90%)',
                                  boxShadow: '0 6px 15px rgba(255, 75, 43, 0.4)',
                                }
                              }}
                            >
                              Add to Cart
                            </Button>
                          </motion.div>
                        </CardActions>
                      </MenuCard>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </motion.div>
          </Grid>

          {/* Cart Section */}
          <Grid item xs={12} md={4} lg={3}>
            <Box sx={{ position: 'sticky', top: 100 }}>
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Paper 
                  elevation={3}
                  sx={{ 
                    p: 3, 
                    borderRadius: '16px',
                    background: 'linear-gradient(to bottom, #fefefe, #f8f9fa)',
                    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
                    overflow: 'hidden'
                  }}
                >
                  <Typography 
                    variant="h5" 
                    gutterBottom 
                    sx={{ 
                      fontWeight: 'bold',
                      color: '#333',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <ShoppingCartIcon sx={{ mr: 1, color: '#FF4B2B' }} />
                    {checkoutMode ? 'Checkout' : 'Your Cart'} {!checkoutMode && cart.length > 0 && `(${cart.length})`}
                  </Typography>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  {checkoutMode ? (
                    // Checkout Mode
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
                        <Button
                          startIcon={<ArrowBackIcon />}
                          onClick={backToShopping}
                          sx={{
                            color: '#FF4B2B',
                            '&:hover': {
                              backgroundColor: 'rgba(255, 75, 43, 0.1)'
                            }
                          }}
                        >
                          Back to Cart
                        </Button>
                      </Box>
                      
                      <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 'bold' }}>
                        Shipping Information
                      </Typography>
                      
                      <Stack spacing={2} sx={{ mb: 3 }}>
                        <TextField
                          fullWidth
                          label="Full Name"
                          name="fullName"
                          value={shippingInfo.fullName || ''}
                          onChange={handleInputChange}
                          required
                          size="small"
                          error={!shippingInfo.fullName && shippingInfo.fullName !== undefined}
                          helperText={!shippingInfo.fullName && shippingInfo.fullName !== undefined ? "Full name is required" : ""}
                        />
                        <TextField
                          fullWidth
                          label="Address"
                          name="address"
                          value={shippingInfo.address || ''}
                          onChange={handleInputChange}
                          required
                          size="small"
                          error={!shippingInfo.address && shippingInfo.address !== undefined}
                          helperText={!shippingInfo.address && shippingInfo.address !== undefined ? "Address is required" : ""}
                        />
                        <TextField
                          fullWidth
                          label="Phone Number"
                          name="phone"
                          value={shippingInfo.phone || ''}
                          onChange={handleInputChange}
                          required
                          size="small"
                          error={!shippingInfo.phone && shippingInfo.phone !== undefined}
                          helperText={!shippingInfo.phone && shippingInfo.phone !== undefined ? "Phone number is required" : ""}
                        />
                        <TextField
                          fullWidth
                          label="Delivery Instructions (Optional)"
                          name="instructions"
                          value={shippingInfo.instructions || ''}
                          onChange={handleInputChange}
                          multiline
                          rows={2}
                          size="small"
                        />
                      </Stack>
                      
                      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
                        Order Summary
                      </Typography>
                      
                      <Paper 
                        elevation={0} 
                        sx={{ 
                          p: 2, 
                          mb: 3, 
                          backgroundColor: 'rgba(255, 75, 43, 0.05)', 
                          borderRadius: '8px' 
                        }}
                      >
                        {cart.map((item) => (
                          <Box 
                            key={item.id} 
                            sx={{ 
                              display: 'flex', 
                              justifyContent: 'space-between', 
                              mb: 1 
                            }}
                          >
                            <Typography variant="body2">
                              {item.quantity} × {item.name}
                            </Typography>
                            <Typography variant="body2" fontWeight="medium">
                              ${(item.price * item.quantity).toFixed(2)}
                            </Typography>
                          </Box>
                        ))}
                        
                        <Divider sx={{ my: 1.5 }} />
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2" color="text.secondary">Subtotal:</Typography>
                          <Typography variant="body2">${getCartSubtotal()}</Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2" color="text.secondary">Tax (7%):</Typography>
                          <Typography variant="body2">${getTaxAmount()}</Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="subtitle2" fontWeight="bold">Total:</Typography>
                          <Typography variant="subtitle2" fontWeight="bold" color="#FF4B2B">
                            ${getCartTotal()}
                          </Typography>
                        </Box>
                      </Paper>
                      
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                          fullWidth
                          variant="contained"
                          size="large"
                          onClick={placeOrder}
                          disabled={loading}
                          startIcon={loading ? null : <LocalShippingIcon />}
                          sx={{
                            background: 'linear-gradient(45deg, #FF4B2B 30%, #FF8E53 90%)',
                            color: 'white',
                            fontWeight: 'bold',
                            py: 1.5,
                            borderRadius: '10px',
                            boxShadow: '0 4px 10px rgba(255, 75, 43, 0.3)',
                            '&:hover': {
                              background: 'linear-gradient(45deg, #FF8E53 30%, #FF4B2B 90%)',
                              boxShadow: '0 6px 15px rgba(255, 75, 43, 0.4)',
                            }
                          }}
                        >
                          {loading ? (
                            <CircularProgress size={24} color="inherit" />
                          ) : (
                            'Place Order'
                          )}
                        </Button>
                      </motion.div>
                    </motion.div>
                  ) : (
                    // Cart Mode
                    <>
                      {cart.length === 0 ? (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.5 }}
                        >
                          <Box 
                            sx={{ 
                              py: 4, 
                              display: 'flex', 
                              flexDirection: 'column', 
                              alignItems: 'center'
                            }}
                          >
                            <ShoppingCartIcon sx={{ fontSize: 60, color: '#ccc', mb: 2 }} />
                            <Typography variant="subtitle1" color="text.secondary" align="center">
                              Your cart is empty
                            </Typography>
                            <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 2 }}>
                              Add some delicious items to get started!
                            </Typography>
                          </Box>
                        </motion.div>
                      ) : (
                        <>
                          <Box sx={{ maxHeight: '300px', overflowY: 'auto', pr: 1 }}>
                            {cart.map((item, index) => (
                              <motion.div
                                key={`${item.id}-${index}`}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                              >
                                <Box 
                                  sx={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-between', 
                                    alignItems: 'center',
                                    mb: 2,
                                    p: 1,
                                    borderRadius: '8px',
                                    '&:hover': {
                                      backgroundColor: 'rgba(0, 0, 0, 0.02)'
                                    }
                                  }}
                                >
                                  <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                                    <Avatar 
                                      src={item.image} 
                                      alt={item.name} 
                                      variant="rounded"
                                      sx={{ 
                                        width: 48, 
                                        height: 48, 
                                        mr: 2,
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                      }}
                                    />
                                    <Box>
                                      <Typography variant="subtitle2" noWrap sx={{ maxWidth: '150px' }}>
                                        {item.name}
                                      </Typography>
                                      <Typography variant="body2" color="text.secondary">
                                        ${item.price.toFixed(2)} × {item.quantity}
                                      </Typography>
                                    </Box>
                                  </Box>
                                  
                                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <motion.div whileTap={{ scale: 0.9 }}>
                                      <IconButton 
                                        size="small" 
                                        onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)}
                                        sx={{ 
                                          color: '#FF4B2B',
                                          backgroundColor: 'rgba(255, 75, 43, 0.1)',
                                          '&:hover': {
                                            backgroundColor: 'rgba(255, 75, 43, 0.2)'
                                          },
                                          mr: 1
                                        }}
                                      >
                                        <RemoveIcon fontSize="small" />
                                      </IconButton>
                                    </motion.div>
                                    
                                    <motion.div whileTap={{ scale: 0.9 }}>
                                      <IconButton 
                                        size="small"
                                        onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                                        sx={{ 
                                          color: '#FF4B2B',
                                          backgroundColor: 'rgba(255, 75, 43, 0.1)',
                                          '&:hover': {
                                            backgroundColor: 'rgba(255, 75, 43, 0.2)'
                                          }
                                        }}
                                      >
                                        <AddIcon fontSize="small" />
                                      </IconButton>
                                    </motion.div>
                                  </Box>
                                </Box>
                              </motion.div>
                            ))}
                          </Box>
                          
                          <Divider sx={{ my: 2 }} />
                          
                          <Box sx={{ mb: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                              <Typography variant="body2" color="text.secondary">Subtotal:</Typography>
                              <Typography variant="body2">${getCartSubtotal()}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                              <Typography variant="body2" color="text.secondary">Tax (7%):</Typography>
                              <Typography variant="body2">${getTaxAmount()}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                              <Typography variant="subtitle1" fontWeight="bold">Total:</Typography>
                              <Typography variant="subtitle1" fontWeight="bold" color="#FF4B2B">
                                ${getCartTotal()}
                              </Typography>
                            </Box>
                          </Box>
                          
                          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button
                              fullWidth
                              variant="contained"
                              size="large"
                              onClick={proceedToCheckout}
                              disabled={loading}
                              sx={{
                                background: 'linear-gradient(45deg, #FF4B2B 30%, #FF8E53 90%)',
                                color: 'white',
                                fontWeight: 'bold',
                                py: 1.5,
                                borderRadius: '10px',
                                boxShadow: '0 4px 10px rgba(255, 75, 43, 0.3)',
                                '&:hover': {
                                  background: 'linear-gradient(45deg, #FF8E53 30%, #FF4B2B 90%)',
                                  boxShadow: '0 6px 15px rgba(255, 75, 43, 0.4)',
                                }
                              }}
                            >
                              {loading ? (
                                <CircularProgress size={24} color="inherit" />
                              ) : (
                                'Checkout'
                              )}
                            </Button>
                          </motion.div>
                          
                          <Button
                            fullWidth
                            variant="outlined"
                            size="medium"
                            onClick={clearCart}
                            sx={{
                              mt: 2,
                              color: '#FF4B2B',
                              borderColor: '#FF4B2B',
                              '&:hover': {
                                borderColor: '#FF8E53',
                                backgroundColor: 'rgba(255, 75, 43, 0.05)'
                              }
                            }}
                          >
                            Clear Cart
                          </Button>
                        </>
                      )}
                    </>
                  )}
                </Paper>
              </motion.div>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Menu; 