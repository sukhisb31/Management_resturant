import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
  Menu,
  MenuItem,
  Collapse,
  Popper,
  Paper,
  Fade,
  ClickAwayListener,
  MenuList,
  Grow,
  Avatar,
  Tooltip,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { motion, AnimatePresence } from 'framer-motion';
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
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, currentUser, userRole, logout, hasPermission } = useAuth();
  
  // State for managing dropdown menus
  const [openDropdown, setOpenDropdown] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [profileMenuAnchor, setProfileMenuAnchor] = useState(null);

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

  // Define menu categories and their items
  const menuCategories = [
    { 
      id: 'main',
      title: 'Main',
      items: [
        { text: 'Home', path: '/', icon: <HomeIcon fontSize="small" /> },
        { text: 'Menu', path: '/menu', icon: <MenuBookIcon fontSize="small" /> },
      ]
    },
    {
      id: 'ordering',
      title: 'Ordering',
      items: [
        { text: 'Place Order', path: '/order-placement', icon: <ShoppingCartIcon fontSize="small" /> },
        { text: 'Orders', path: '/orders', icon: <ReceiptIcon fontSize="small" /> },
        { text: 'Reservations', path: '/reservations', icon: <EventSeatIcon fontSize="small" /> },
      ]
    },
    {
      id: 'management',
      title: 'Management',
      items: [
        { text: 'Customers', path: '/customers', icon: <PeopleIcon fontSize="small" /> },
        { text: 'Inventory', path: '/inventory', icon: <InventoryIcon fontSize="small" /> },
        { text: 'Employees', path: '/employees', icon: <BadgeIcon fontSize="small" /> },
      ]
    },
    {
      id: 'support',
      title: 'Support',
      items: [
        { text: 'Contact', path: '/contact', icon: <ContactMailIcon fontSize="small" /> },
        { text: 'Feedback', path: '/feedback', icon: <FeedbackIcon fontSize="small" /> },
      ]
    }
  ];

  // Filter menu items based on user permissions
  const getFilteredMenuItems = (items) => {
    return items.filter(item => hasPermission(item.path));
  };

  // Filter categories that have at least one accessible item
  const filteredMenuCategories = menuCategories.map(category => ({
    ...category,
    items: getFilteredMenuItems(category.items)
  })).filter(category => category.items.length > 0);

  // Flattened menu items for mobile view (only showing permitted items)
  const menuItems = filteredMenuCategories.flatMap(category => category.items);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Handle dropdown toggle
  const handleDropdownToggle = (event, dropdownId) => {
    if (openDropdown === dropdownId) {
      setOpenDropdown(null);
      setAnchorEl(null);
    } else {
      setOpenDropdown(dropdownId);
      setAnchorEl(event.currentTarget);
    }
  };

  // Handle dropdown close
  const handleDropdownClose = () => {
    setOpenDropdown(null);
    setAnchorEl(null);
  };

  // Handle profile menu
  const handleProfileMenuOpen = (event) => {
    setProfileMenuAnchor(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileMenuAnchor(null);
  };

  // Handle logout
  const handleLogout = () => {
    handleProfileMenuClose();
    if (mobileOpen) handleDrawerToggle();
    logout();
    navigate('/');
  };

  // Animation variants for dropdown
  const dropdownVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        duration: 0.2, 
        ease: "easeOut",
        staggerChildren: 0.05,
      }
    },
    exit: { 
      opacity: 0, 
      y: -10, 
      scale: 0.95,
      transition: { duration: 0.15 }
    }
  };

  const dropdownItemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.2 }
    }
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
      
      {/* Account Section */}
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
        
        {isAuthenticated ? (
          <>
            {/* User info */}
            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40, mr: 1.5 }}>
                {currentUser?.email?.charAt(0).toUpperCase() || 'U'}
              </Avatar>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  {currentUser?.email}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
                  {userRole}
                </Typography>
              </Box>
            </Box>
            
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: menuItems.length * 0.05 + 0.3, duration: 0.4, ease: "easeOut" }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                onClick={handleLogout}
                variant="outlined"
                fullWidth
                sx={{
                  borderRadius: '8px',
                  borderColor: theme.palette.error.main,
                  color: theme.palette.error.main,
                  py: 1,
                  justifyContent: 'flex-start',
                  '&:hover': {
                    backgroundColor: 'rgba(244, 67, 54, 0.08)',
                    borderColor: theme.palette.error.main,
                  },
                }}
                startIcon={<LogoutIcon />}
              >
                Logout
              </Button>
            </motion.div>
          </>
        ) : (
          <>
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
          </>
        )}
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
                {/* Map through categories for dropdown menus - only showing allowed categories */}
                {filteredMenuCategories.map((category) => (
                  <Box key={category.id} sx={{ position: 'relative', mx: 0.5 }}>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        aria-haspopup="true"
                        onClick={(e) => handleDropdownToggle(e, category.id)}
                        color="inherit"
                        endIcon={openDropdown === category.id ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        sx={{
                          borderRadius: '4px',
                          padding: isTablet ? '4px 6px' : '4px 10px',
                          fontWeight: category.items.some(item => location.pathname === item.path) ? 'bold' : 'normal',
                          color: category.items.some(item => location.pathname === item.path) ? 'primary.main' : 'inherit',
                          fontSize: isTablet ? '0.7rem' : '0.8rem',
                          '&:hover': {
                            backgroundColor: 'rgba(255, 75, 43, 0.08)',
                            color: 'primary.main',
                          },
                        }}
                      >
                        {category.title}
                      </Button>
                    </motion.div>

                    {/* Dropdown Menu */}
                    <Popper
                      open={openDropdown === category.id}
                      anchorEl={anchorEl}
                      placement="bottom-start"
                      transition
                      disablePortal
                      sx={{ zIndex: theme.zIndex.drawer + 2 }}
                    >
                      {({ TransitionProps }) => (
                        <ClickAwayListener onClickAway={handleDropdownClose}>
                          <Grow {...TransitionProps} style={{ transformOrigin: 'top left' }}>
                            <Paper
                              elevation={4}
                              sx={{
                                mt: 0.5,
                                borderRadius: '8px',
                                overflow: 'hidden',
                                width: 200,
                              }}
                            >
                              <AnimatePresence>
                                <motion.div
                                  key={category.id}
                                  variants={dropdownVariants}
                                  initial="hidden"
                                  animate="visible"
                                  exit="exit"
                                >
                                  <MenuList sx={{ p: 1 }}>
                                    {category.items.map((item) => (
                                      <motion.div key={item.text} variants={dropdownItemVariants}>
                                        <MenuItem
                                          component={Link}
                                          to={item.path}
                                          onClick={handleDropdownClose}
                                          selected={location.pathname === item.path}
                                          sx={{
                                            borderRadius: '4px',
                                            py: 1,
                                            mb: 0.5,
                                            color: location.pathname === item.path ? 'primary.main' : 'inherit',
                                            fontWeight: location.pathname === item.path ? 'bold' : 'normal',
                                            '&:hover': {
                                              backgroundColor: 'rgba(255, 75, 43, 0.08)',
                                            },
                                          }}
                                        >
                                          <ListItemIcon
                                            sx={{
                                              minWidth: '30px',
                                              color: location.pathname === item.path ? 'primary.main' : 'inherit',
                                            }}
                                          >
                                            {item.icon}
                                          </ListItemIcon>
                                          <ListItemText primary={item.text} />
                                        </MenuItem>
                                      </motion.div>
                                    ))}
                                  </MenuList>
                                </motion.div>
                              </AnimatePresence>
                            </Paper>
                          </Grow>
                        </ClickAwayListener>
                      )}
                    </Popper>
                  </Box>
                ))}
                
                <Divider orientation="vertical" flexItem sx={{ mx: 1, height: '60%' }} />
                
                {/* Login/Signup Buttons or User Profile */}
                {isAuthenticated ? (
                  <Box>
                    <Tooltip title={currentUser?.email || 'User Profile'}>
                      <IconButton 
                        onClick={handleProfileMenuOpen}
                        sx={{ 
                          ml: 1,
                          border: '1px solid',
                          borderColor: 'divider'
                        }}
                      >
                        <Avatar 
                          sx={{ 
                            width: 32, 
                            height: 32, 
                            backgroundColor: 'primary.main',
                            fontSize: '0.9rem'
                          }}
                        >
                          {currentUser?.email?.charAt(0).toUpperCase() || 'U'}
                        </Avatar>
                      </IconButton>
                    </Tooltip>
                    
                    <Menu
                      anchorEl={profileMenuAnchor}
                      open={Boolean(profileMenuAnchor)}
                      onClose={handleProfileMenuClose}
                      PaperProps={{
                        elevation: 3,
                        sx: { 
                          mt: 1.5,
                          minWidth: 200,
                          borderRadius: 2,
                          overflow: 'visible',
                          '&:before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                          },
                        }
                      }}
                      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    >
                      <Box sx={{ px: 2, py: 1.5 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                          {currentUser?.email}
                        </Typography>
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            color: 'text.secondary',
                            display: 'block',
                            mb: 1,
                            textTransform: 'capitalize'
                          }}
                        >
                          {userRole}
                        </Typography>
                      </Box>
                      <Divider />
                      <MenuItem 
                        onClick={handleProfileMenuClose}
                        component={Link}
                        to="/profile"
                        sx={{ py: 1.5 }}
                      >
                        <ListItemIcon>
                          <AccountCircleIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>My Profile</ListItemText>
                      </MenuItem>
                      <Divider />
                      <MenuItem 
                        onClick={handleLogout}
                        sx={{ 
                          py: 1.5,
                          color: 'error.main'
                        }}
                      >
                        <ListItemIcon sx={{ color: 'error.main' }}>
                          <LogoutIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Logout</ListItemText>
                      </MenuItem>
                    </Menu>
                  </Box>
                ) : (
                  <>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
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
                    </motion.div>
                    
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
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
                    </motion.div>
                  </>
                )}
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