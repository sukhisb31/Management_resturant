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
  Snackbar,
  Alert,
  Chip,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  ContentCopy as CopyIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const StyledCard = styled(motion(Card))`
  height: 100%;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const ManageEmployerIds = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [employerIds, setEmployerIds] = useState([]);
  const [formData, setFormData] = useState({
    employerName: '',
    email: '',
    restaurantName: '',
    validUntil: ''
  });

  useEffect(() => {
    if (!isAdmin()) {
      navigate('/');
      return;
    }

    // Load employer IDs from localStorage
    const savedEmployerIds = localStorage.getItem('employerIds');
    if (savedEmployerIds) {
      setEmployerIds(JSON.parse(savedEmployerIds));
    }
  }, [navigate, isAdmin]);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({
      employerName: '',
      email: '',
      restaurantName: '',
      validUntil: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const generateEmployerId = () => {
    // Generate a random 8-character ID
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let id = '';
    for (let i = 0; i < 8; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  };

  const handleSubmit = () => {
    // Validate form data
    if (!formData.employerName || !formData.email || !formData.restaurantName || !formData.validUntil) {
      setSnackbar({
        open: true,
        message: 'Please fill in all required fields',
        severity: 'error'
      });
      return;
    }

    const newEmployerId = {
      id: generateEmployerId(),
      ...formData,
      createdAt: new Date().toISOString(),
      isActive: true
    };

    // Add to state and localStorage
    const updatedEmployerIds = [...employerIds, newEmployerId];
    setEmployerIds(updatedEmployerIds);
    localStorage.setItem('employerIds', JSON.stringify(updatedEmployerIds));

    setSnackbar({
      open: true,
      message: 'Employer ID generated successfully',
      severity: 'success'
    });

    handleCloseDialog();
  };

  const handleDelete = (id) => {
    const updatedEmployerIds = employerIds.filter(emp => emp.id !== id);
    setEmployerIds(updatedEmployerIds);
    localStorage.setItem('employerIds', JSON.stringify(updatedEmployerIds));
    setSnackbar({
      open: true,
      message: 'Employer ID deleted successfully',
      severity: 'success'
    });
  };

  const handleCopyId = (id) => {
    navigator.clipboard.writeText(id);
    setSnackbar({
      open: true,
      message: 'Employer ID copied to clipboard',
      severity: 'success'
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const getStatusColor = (isActive) => {
    return isActive ? 'success' : 'error';
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            Manage Employer IDs
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Generate and manage employer access IDs
          </Typography>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <StyledCard>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Total Employer IDs
                </Typography>
                <Typography variant="h3">
                  {employerIds.length}
                </Typography>
              </CardContent>
            </StyledCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <StyledCard>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Active IDs
                </Typography>
                <Typography variant="h3">
                  {employerIds.filter(emp => emp.isActive).length}
                </Typography>
              </CardContent>
            </StyledCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <StyledCard>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Expired IDs
                </Typography>
                <Typography variant="h3">
                  {employerIds.filter(emp => !emp.isActive).length}
                </Typography>
              </CardContent>
            </StyledCard>
          </Grid>
        </Grid>

        {/* Action Button */}
        <Box sx={{ mb: 3 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenDialog}
            sx={{ mr: 2 }}
          >
            Generate New ID
          </Button>
        </Box>

        {/* Employer IDs Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Employer Name</TableCell>
                <TableCell>Restaurant</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Employer ID</TableCell>
                <TableCell>Valid Until</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {employerIds.map((employer) => (
                <TableRow key={employer.id}>
                  <TableCell>{employer.employerName}</TableCell>
                  <TableCell>{employer.restaurantName}</TableCell>
                  <TableCell>{employer.email}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="body2" sx={{ mr: 1 }}>
                        {employer.id}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => handleCopyId(employer.id)}
                      >
                        <CopyIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                  <TableCell>{new Date(employer.validUntil).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Chip
                      icon={employer.isActive ? <CheckCircleIcon /> : <CancelIcon />}
                      label={employer.isActive ? 'Active' : 'Expired'}
                      color={getStatusColor(employer.isActive)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(employer.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Generate ID Dialog */}
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>Generate New Employer ID</DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2 }}>
              <TextField
                fullWidth
                label="Employer Name"
                name="employerName"
                value={formData.employerName}
                onChange={handleInputChange}
                variant="outlined"
                sx={{ mb: 2 }}
                required
              />
              <TextField
                fullWidth
                label="Restaurant Name"
                name="restaurantName"
                value={formData.restaurantName}
                onChange={handleInputChange}
                variant="outlined"
                sx={{ mb: 2 }}
                required
              />
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                variant="outlined"
                sx={{ mb: 2 }}
                required
              />
              <TextField
                fullWidth
                label="Valid Until"
                name="validUntil"
                type="date"
                value={formData.validUntil}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                sx={{ mb: 2 }}
                required
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Generate ID
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar */}
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

export default ManageEmployerIds; 