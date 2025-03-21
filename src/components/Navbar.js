import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  useTheme,
  useMediaQuery,
  Container,
  ListItemIcon,
  Divider,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { motion } from 'framer-motion';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import HomeIcon from '@mui/icons-material/Home';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PeopleIcon from '@mui/icons-material/People';
import InventoryIcon from '@mui/icons-material/Inventory';
import BadgeIcon from '@mui/icons-material/Badge';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import FeedbackIcon from '@mui/icons-material/Feedback';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();

  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Home';
    return path.substring(1).charAt(0).toUpperCase() + path.substring(2);
  };

  const menuItems = [
    { text: 'Home', path: '/', icon: <HomeIcon fontSize="small" /> },
    { text: 'Menu', path: '/menu', icon: <MenuBookIcon fontSize="small" /> },
    { text: 'Reservations', path: '/reservations', icon: <EventSeatIcon fontSize="small" /> },
    { text: 'Orders', path: '/orders', icon: <ReceiptIcon fontSize="small" /> },
    { text: 'Customers', path: '/customers', icon: <PeopleIcon fontSize="small" /> },
    { text: 'Inventory', path: '/inventory', icon: <InventoryIcon fontSize="small" /> },
    { text: 'Employees', path: '/employees', icon: <BadgeIcon fontSize="small" /> },
    { text: 'Feedback', path: '/feedback', icon: <FeedbackIcon fontSize="small" /> },
    { text: 'Contact', path: '/contact', icon: <ContactMailIcon fontSize="small" /> },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <List>
      {menuItems.map((item, index) => (
        <motion.div
          key={item.text}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 + index * 0.05, duration: 0.3 }}
        >
          <ListItem
            button
          component={Link}
          to={item.path}
          onClick={handleDrawerToggle}
            selected={location.pathname === item.path}
            sx={{
              color: location.pathname === item.path ? 'primary.main' : 'inherit',
              fontWeight: location.pathname === item.path ? 'bold' : 'normal',
              py: 1.2,
            }}
          >
            <ListItemIcon sx={{ 
              color: location.pathname === item.path ? 'primary.main' : 'inherit',
              minWidth: '40px'
            }}>
              {item.icon}
            </ListItemIcon>
          <ListItemText primary={item.text} />
        </ListItem>
        </motion.div>
      ))}
      
      <Divider sx={{ my: 2 }} />
      
      <Box sx={{ px: 2, py: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: menuItems.length * 0.05 + 0.2, duration: 0.4 }}
        >
          <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 'bold', color: 'text.secondary' }}>
            Account Access
          </Typography>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: menuItems.length * 0.05 + 0.3, duration: 0.4, ease: "easeOut" }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            component={Link}
            to="/login"
            variant="outlined"
            fullWidth
            onClick={handleDrawerToggle}
            sx={{
              mb: 1.5,
              borderRadius: '8px',
              borderColor: 'primary.main',
              color: 'primary.main',
              py: 1,
              justifyContent: 'flex-start',
              '&:hover': {
                backgroundColor: 'rgba(255, 75, 43, 0.08)',
                borderColor: 'primary.main',
              },
            }}
            startIcon={<PersonIcon />}
          >
            Login
          </Button>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: menuItems.length * 0.05 + 0.4, duration: 0.4, ease: "easeOut" }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            component={Link}
            to="/signup"
            variant="contained"
            fullWidth
            onClick={handleDrawerToggle}
            sx={{
              borderRadius: '8px',
              py: 1,
              justifyContent: 'flex-start',
              background: 'linear-gradient(45deg, #FF4B2B 30%, #FF8E53 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #FF4B2B 50%, #FF8E53 100%)',
                boxShadow: '0 2px 10px rgba(255, 75, 43, 0.3)',
              },
            }}
            startIcon={<BusinessIcon />}
          >
            Sign Up
          </Button>
        </motion.div>
      </Box>
    </List>
  );

  return (
    <motion.div
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <AppBar 
        position="fixed" 
        color="default" 
        elevation={scrolled ? 4 : 1}
        className={scrolled ? 'scrolled' : ''}
        sx={{ 
          backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.97)' : 'white',
          borderBottom: '1px solid #e0e0e0',
          zIndex: (theme) => theme.zIndex.drawer + 1,
          top: 0,
          left: 0,
          right: 0,
          width: '100%',
          height: scrolled ? '50px' : '60px'
        }}
      >
        <Container maxWidth="lg" sx={{ height: '100%' }}>
          <Toolbar 
            disableGutters 
            sx={{ 
              height: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              px: { xs: 1, sm: 2 }
            }}
          >
            {/* Logo Section - Left Side */}
            <Box sx={{ 
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'center'
            }}>
              <RestaurantIcon sx={{ mr: 0.5, color: 'primary.main', fontSize: '1.2rem' }} />
          <Typography
                variant="subtitle1"
            component={Link}
            to="/"
            sx={{
              textDecoration: 'none',
              color: 'primary.main',
              fontWeight: 'bold',
                  letterSpacing: '0.5px',
                  fontSize: '1.1rem',
                  '&:hover': {
                    transform: 'scale(1.02)',
                  }
            }}
          >
                Restaurant Pro
          </Typography>
            </Box>

            {/* Mobile Menu Button - Right Side */}
            {isMobile && (
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
            <IconButton
              color="inherit"
              aria-label="open drawer"
                  edge="end"
              onClick={handleDrawerToggle}
                  size="small"
                  sx={{ p: 0.8 }}
                >
                  <Box sx={{ width: 24, height: 24, position: 'relative' }}>
                    <motion.span
                      style={{
                        position: 'absolute',
                        top: '25%',
                        left: 0,
                        right: 0,
                        height: 2,
                        background: mobileOpen ? 'transparent' : theme.palette.primary.main,
                        borderRadius: 4
                      }}
                      animate={mobileOpen ? { rotate: 45, y: 6, background: theme.palette.primary.main } : { rotate: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                    <motion.span
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left: 0,
                        right: 0,
                        height: 2,
                        background: theme.palette.primary.main,
                        borderRadius: 4,
                        marginTop: -1
                      }}
                      animate={mobileOpen ? { rotate: -45 } : { rotate: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                    <motion.span
                      style={{
                        position: 'absolute',
                        bottom: '25%',
                        left: 0,
                        right: 0,
                        height: 2,
                        background: mobileOpen ? 'transparent' : theme.palette.primary.main,
                        borderRadius: 4
                      }}
                      animate={mobileOpen ? { rotate: -45, y: -6, background: theme.palette.primary.main } : { rotate: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  </Box>
            </IconButton>
              </motion.div>
            )}

            {/* Navigation Buttons - Right Side */}
            {!isMobile && (
              <Box 
                sx={{ 
                  display: 'flex',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  height: '100%'
                }}
              >
              {menuItems.map((item) => (
                <Button
                  key={item.text}
                  component={Link}
                  to={item.path}
                  color="inherit"
                  sx={{
                      borderRadius: '4px',
                      padding: isTablet ? '4px 6px' : '4px 10px',
                      mx: isTablet ? 0.5 : 0.75,
                      fontWeight: location.pathname === item.path ? 'bold' : 'normal',
                      color: location.pathname === item.path ? 'primary.main' : 'inherit',
                      fontSize: isTablet ? '0.7rem' : '0.8rem',
                      position: 'relative',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 75, 43, 0.08)',
                        color: 'primary.main',
                      },
                      '&::after': location.pathname === item.path ? {
                        content: '""',
                        position: 'absolute',
                        bottom: 0,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '60%',
                        height: '3px',
                        backgroundColor: 'primary.main',
                        borderRadius: '2px',
                      } : {},
                    }}
                  >
                    {item.text}
                  </Button>
                ))}
                
                <Divider orientation="vertical" flexItem sx={{ mx: 1, height: '60%' }} />
                
                {/* Login/Signup Buttons */}
                <Button
                  component={Link}
                  to="/login"
                  variant="outlined"
                  size="small"
                  sx={{
                    borderRadius: '20px',
                    borderColor: 'primary.main',
                    color: 'primary.main',
                    ml: 1,
                    fontSize: '0.75rem',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 75, 43, 0.08)',
                      borderColor: 'primary.main',
                    },
                  }}
                >
                  Login
                </Button>
                
                <Button
                  component={Link}
                  to="/signup"
                  variant="contained"
                  size="small"
                  sx={{
                    borderRadius: '20px',
                    ml: 1,
                    fontSize: '0.75rem',
                    background: 'linear-gradient(45deg, #FF4B2B 30%, #FF8E53 90%)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #FF4B2B 50%, #FF8E53 100%)',
                      boxShadow: '0 2px 10px rgba(255, 75, 43, 0.3)',
                    },
                  }}
                >
                  Sign Up
                </Button>
            </Box>
          )}
        </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          '& .MuiDrawer-paper': { 
            width: 250,
            boxSizing: 'border-box',
            boxShadow: '0 8px 10px -5px rgba(0,0,0,0.2)',
          },
        }}
        SlideProps={{
          timeout: 400,
          easing: 'cubic-bezier(0.25, 0.8, 0.25, 1)'
        }}
      >
        <Box sx={{ 
          p: 1.5, 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center',
          borderBottom: '1px solid #e0e0e0'
        }}>
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <RestaurantIcon sx={{ mr: 0.5, color: 'primary.main', fontSize: '1.2rem' }} />
              <Typography variant="subtitle1" sx={{ color: 'primary.main', fontWeight: 'bold', fontSize: '1.1rem' }}>
                Restaurant Pro
              </Typography>
            </Box>
          </motion.div>
          <Divider sx={{ width: '100%', my: 1.5 }} />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
          >
            <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.85rem' }}>
              Current Page: <span style={{ color: theme.palette.primary.main }}>{getPageTitle()}</span>
            </Typography>
          </motion.div>
        </Box>
        {drawer}
      </Drawer>
    </motion.div>
  );
};

export default Navbar; 