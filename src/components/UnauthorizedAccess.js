import React from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import LockIcon from '@mui/icons-material/Lock';
import HomeIcon from '@mui/icons-material/Home';
import { useAuth } from '../contexts/AuthContext';

/**
 * UnauthorizedAccess - A component that displays when a user attempts to access a restricted page
 */
const UnauthorizedAccess = () => {
  const { userRole, isAuthenticated } = useAuth();
  
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '70vh' 
      }}
    >
      <Paper
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        sx={{
          p: 4,
          maxWidth: 500,
          borderRadius: 2,
          textAlign: 'center',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
          overflow: 'hidden',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '4px',
            background: theme => theme.palette.error.main
          }
        }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <LockIcon 
            sx={{ 
              fontSize: 70, 
              color: 'error.main',
              mb: 2,
            }} 
          />
        </motion.div>
        
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom
          sx={{ 
            fontWeight: 'bold',
            mb: 2,
          }}
        >
          Access Restricted
        </Typography>
        
        <Typography 
          variant="body1" 
          sx={{ mb: 3, color: 'text.secondary' }}
        >
          {isAuthenticated ? (
            `Sorry, your current role (${userRole}) doesn't have permission to access this page. Please contact an administrator if you believe this is an error.`
          ) : (
            `You need to be logged in with appropriate permissions to access this page.`
          )}
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 3 }}>
          <Button
            component={Link}
            to="/"
            variant="outlined"
            startIcon={<HomeIcon />}
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1,
            }}
          >
            Return Home
          </Button>
          
          {!isAuthenticated && (
            <Button
              component={Link}
              to="/login"
              variant="contained"
              sx={{
                borderRadius: 2,
                px: 3,
                py: 1,
                background: 'linear-gradient(45deg, #FF4B2B 30%, #FF8E53 90%)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #FF4B2B 50%, #FF8E53 100%)',
                  boxShadow: '0 2px 10px rgba(255, 75, 43, 0.3)',
                },
              }}
            >
              Login
            </Button>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default UnauthorizedAccess; 