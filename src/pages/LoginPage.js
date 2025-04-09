import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, FormControlLabel, Checkbox, Button, Typography } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    employerId: ''
  });
  const [isEmployerLogin, setIsEmployerLogin] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isEmployerLogin && !formData.employerId) {
        setError('Employer ID is required for employer login');
        return;
      }

      const success = await login(
        formData.email,
        formData.password,
        isEmployerLogin ? formData.employerId : null
      );

      if (success) {
        // Get the stored redirect path or default to home
        const redirectPath = localStorage.getItem('redirectPath') || '/';
        localStorage.removeItem('redirectPath'); // Clear the stored path
        navigate(redirectPath);
      }
    } catch (error) {
      setError(error.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
      <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        label="Email Address"
        name="email"
        autoComplete="email"
        autoFocus
        value={formData.email}
        onChange={handleChange}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="password"
        label="Password"
        type="password"
        id="password"
        autoComplete="current-password"
        value={formData.password}
        onChange={handleChange}
      />
      {isEmployerLogin && (
        <TextField
          margin="normal"
          required
          fullWidth
          name="employerId"
          label="Employer ID"
          id="employerId"
          value={formData.employerId}
          onChange={handleChange}
          helperText="Enter the employer ID provided by the administrator"
        />
      )}
      <FormControlLabel
        control={
          <Checkbox
            checked={isEmployerLogin}
            onChange={(e) => setIsEmployerLogin(e.target.checked)}
            color="primary"
          />
        }
        label="Login as Employer"
      />
      {error && (
        <Typography color="error" sx={{ mt: 1 }}>
          {error}
        </Typography>
      )}
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        disabled={isLoading}
      >
        Sign In
      </Button>
    </Box>
  );
};

export default LoginPage; 