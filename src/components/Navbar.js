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
  Slide,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
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
import AssessmentIcon from '@mui/icons-material/Assessment';
import SettingsIcon from '@mui/icons-material/Settings';
import { VpnKey as VpnKeyIcon } from '@mui/icons-material';
import { AdminPanelSettings as SuperAdminIcon } from '@mui/icons-material';
import {
  Menu as MenuIconMui,
  Login as LoginIcon,
  PersonAdd as SignupIcon
} from '@mui/icons-material';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, currentUser, userRole, logout, hasPermission, isEmployer, isAdmin } = useAuth();
  
  // State for managing dropdown menus
  const [openDropdown, setOpenDropdown] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [profileMenuAnchor, setProfileMenuAnchor] = useState(null);
  const [loginMenuAnchor, setLoginMenuAnchor] = useState(null);
  const [profileDrawerOpen, setProfileDrawerOpen] = useState(false);

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
        { text: 'Employer Dashboard', path: '/employer-dashboard', icon: <BusinessIcon fontSize="small" />, requireEmployer: true },
        { text: 'Customers', path: '/customers', icon: <PeopleIcon fontSize="small" /> },
        { text: 'Inventory', path: '/inventory', icon: <InventoryIcon fontSize="small" /> },
        { text: 'Employees', path: '/employees', icon: <BadgeIcon fontSize="small" />, requireEmployer: true },
        { text: 'Reports', path: '/reports', icon: <AssessmentIcon fontSize="small" />, requireEmployer: true },
        { text: 'Settings', path: '/settings', icon: <SettingsIcon fontSize="small" />, requireEmployer: true },
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

  // Filter menu items based on user permissions and employer role
  const getFilteredMenuItems = (items) => {
    return items.filter(item => {
      if (item.requireEmployer && !isEmployer()) {
        return false;
      }
      return hasPermission(item.path);
    });
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

  // Handle login menu
  const handleLoginMenu = (event) => {
    setLoginMenuAnchor(event.currentTarget);
  };

  const handleLoginMenuClose = () => {
    setLoginMenuAnchor(null);
  };

  // Handle logout
  const handleLogout = () => {
    handleProfileMenuClose();
    handleLoginMenuClose();
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
                onClick={handleLoginMenu}
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
                startIcon={<LoginIcon />}
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
                onClick={handleLoginMenu}
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
                startIcon={<SignupIcon />}
              >
                Sign Up
              </Button>
            </motion.div>
          </>
        )}
      </Box>

      {/* Admin Menu Items */}
      {isAdmin() && (
        <>
          <MenuItem onClick={() => navigate('/admin/manage-employer-ids')}>
            <ListItemIcon>
              <VpnKeyIcon fontSize="small" />
            </ListItemIcon>
            Manage Employer IDs
          </MenuItem>
          <MenuItem onClick={() => navigate('/super-admin')}>
            <ListItemIcon>
              <SuperAdminIcon fontSize="small" />
            </ListItemIcon>
            Super Admin Panel
          </MenuItem>
        </>
      )}
    </List>
  );

  // Add this function to handle profile drawer
  const handleProfileDrawerToggle = () => {
    setProfileDrawerOpen(!profileDrawerOpen);
  };

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

            {/* Navigation Menu and Profile - Right Side */}
            <Box sx={{ 
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              {/* Navigation Buttons */}
              <Box sx={{ 
                display: { xs: 'none', md: 'flex' },
                alignItems: 'center',
                gap: 1,
                mr: 2
              }}>
                <Button
                  component={Link}
                  to="/"
                  color="inherit"
                  startIcon={<HomeIcon />}
                  size="small"
                  sx={{
                    fontWeight: location.pathname === '/' ? 'bold' : 'normal',
                    color: location.pathname === '/' ? 'primary.main' : 'inherit',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 75, 43, 0.08)',
                      color: 'primary.main',
                    },
                  }}
                >
                  Home
                </Button>
                <Button
                  component={Link}
                  to="/menu"
              color="inherit"
                  startIcon={<MenuBookIcon />}
                  size="small"
                  sx={{
                    fontWeight: location.pathname === '/menu' ? 'bold' : 'normal',
                    color: location.pathname === '/menu' ? 'primary.main' : 'inherit',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 75, 43, 0.08)',
                      color: 'primary.main',
                    },
                  }}
                >
                  Menu
                </Button>
                <Button
                  component={Link}
                  to="/order-placement"
                  color="inherit"
                  startIcon={<ShoppingCartIcon />}
                  size="small"
                  sx={{
                    fontWeight: location.pathname === '/order-placement' ? 'bold' : 'normal',
                    color: location.pathname === '/order-placement' ? 'primary.main' : 'inherit',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 75, 43, 0.08)',
                      color: 'primary.main',
                    },
                  }}
                >
                  Order
                </Button>
              </Box>

              {/* Profile Icon */}
              <Tooltip title="Profile">
                <IconButton
                  onClick={handleProfileDrawerToggle}
                  sx={{
                    border: '1px solid',
                    borderColor: 'divider',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 75, 43, 0.08)',
                    }
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
                    {isAuthenticated ? currentUser?.email?.charAt(0).toUpperCase() : 'U'}
                  </Avatar>
                </IconButton>
              </Tooltip>
            </Box>
        </Toolbar>
        </Container>
      </AppBar>

      {/* Profile Drawer */}
      <Drawer
        anchor="right"
        open={profileDrawerOpen}
        onClose={handleProfileDrawerToggle}
        PaperProps={{
          sx: {
            width: 300,
            backgroundColor: 'background.paper',
            boxShadow: '0 8px 10px -5px rgba(0,0,0,0.2)',
          }
        }}
      >
        <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Account
          </Typography>
        </Box>

        <List sx={{ p: 2 }}>
          {isAuthenticated ? (
            <>
              <ListItem>
                <ListItemIcon>
                  <AccountCircleIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary={currentUser?.email}
                  secondary={userRole}
                />
              </ListItem>
              <Divider sx={{ my: 1 }} />
              <ListItem 
                button 
                component={Link} 
                to="/profile"
                onClick={handleProfileDrawerToggle}
              >
                <ListItemIcon>
                  <PersonIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="My Profile" />
              </ListItem>
              <ListItem 
                button 
                onClick={() => {
                  handleProfileDrawerToggle();
                  handleLogout();
                }}
              >
                <ListItemIcon>
                  <LogoutIcon color="error" />
                </ListItemIcon>
                <ListItemText primary="Logout" sx={{ color: 'error.main' }} />
              </ListItem>
            </>
          ) : (
            <>
              <ListItem 
                button 
                component={Link} 
                to="/login"
                onClick={handleProfileDrawerToggle}
              >
                <ListItemIcon>
                  <LoginIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="Login" />
              </ListItem>
              <ListItem 
                button 
                component={Link} 
                to="/signup"
                onClick={handleProfileDrawerToggle}
              >
                <ListItemIcon>
                  <SignupIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="Sign Up" />
              </ListItem>
              <Divider sx={{ my: 1 }} />
              <ListItem 
                button 
                component={Link} 
                to="/super-admin/login"
                onClick={handleProfileDrawerToggle}
              >
                <ListItemIcon>
                  <SuperAdminIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="Super Admin Login" />
              </ListItem>
            </>
          )}
        </List>
      </Drawer>
    </motion.div>
  );
};

export default Navbar; 