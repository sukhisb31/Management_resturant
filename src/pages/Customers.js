import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';

const StyledCard = styled(motion(Card))`
  height: 100%;
  margin-bottom: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const TableCard = styled(StyledCard)`
  overflow: auto;
  max-height: 500px;
`;

// Dummy data for customers
const initialCustomers = [
  { id: 1, name: 'John Smith', email: 'john@example.com', phone: '(555) 123-4567', visits: 8, lastVisit: '2023-03-15' },
  { id: 2, name: 'Emma Johnson', email: 'emma@example.com', phone: '(555) 234-5678', visits: 12, lastVisit: '2023-03-18' },
  { id: 3, name: 'Michael Brown', email: 'michael@example.com', phone: '(555) 345-6789', visits: 5, lastVisit: '2023-03-10' },
  { id: 4, name: 'Sophia Davis', email: 'sophia@example.com', phone: '(555) 456-7890', visits: 15, lastVisit: '2023-03-19' },
  { id: 5, name: 'Robert Wilson', email: 'robert@example.com', phone: '(555) 567-8901', visits: 3, lastVisit: '2023-03-05' },
];

const Customers = () => {
  const [customers, setCustomers] = useState(initialCustomers);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState({
    id: null,
    name: '',
    email: '',
    phone: '',
    visits: 0,
    lastVisit: ''
  });

  const handleOpenDialog = (isEdit = false, customer = null) => {
    setEditMode(isEdit);
    if (isEdit && customer) {
      setCurrentCustomer(customer);
    } else {
      setCurrentCustomer({
        id: customers.length > 0 ? Math.max(...customers.map(c => c.id)) + 1 : 1,
        name: '',
        email: '',
        phone: '',
        visits: 0,
        lastVisit: new Date().toISOString().split('T')[0]
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentCustomer({
      ...currentCustomer,
      [name]: value
    });
  };

  const handleSubmit = () => {
    if (editMode) {
      // Update existing customer
      setCustomers(customers.map(c => 
        c.id === currentCustomer.id ? currentCustomer : c
      ));
    } else {
      // Add new customer
      setCustomers([...customers, currentCustomer]);
    }
    handleCloseDialog();
  };

  const handleDeleteCustomer = (id) => {
    setCustomers(customers.filter(c => c.id !== id));
  };

  return (
    <Box sx={{ pt: 8, pb: 4 }}>
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography variant="h3" component="h1" textAlign="center" gutterBottom>
            Customer Management
          </Typography>
          <Typography variant="h6" textAlign="center" color="text.secondary" paragraph>
            Track and manage your restaurant customers
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <Button 
              variant="contained" 
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog(false)}
            >
              Add Customer
            </Button>
          </Box>

          <TableCard>
            <TableContainer component={Paper}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Visits</TableCell>
                    <TableCell>Last Visit</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {customers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell>{customer.id}</TableCell>
                      <TableCell>{customer.name}</TableCell>
                      <TableCell>{customer.email}</TableCell>
                      <TableCell>{customer.phone}</TableCell>
                      <TableCell>{customer.visits}</TableCell>
                      <TableCell>{customer.lastVisit}</TableCell>
                      <TableCell>
                        <IconButton 
                          color="primary" 
                          size="small"
                          onClick={() => handleOpenDialog(true, customer)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton 
                          color="error" 
                          size="small"
                          onClick={() => handleDeleteCustomer(customer.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TableCard>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <StyledCard>
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    Customer Statistics
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body1">
                      Total Customers: <strong>{customers.length}</strong>
                    </Typography>
                    <Typography variant="body1">
                      Total Visits: <strong>{customers.reduce((sum, c) => sum + c.visits, 0)}</strong>
                    </Typography>
                    <Typography variant="body1">
                      Average Visits per Customer: <strong>
                        {(customers.reduce((sum, c) => sum + c.visits, 0) / customers.length).toFixed(1)}
                      </strong>
                    </Typography>
                  </Box>
                </CardContent>
              </StyledCard>
            </Grid>

            <Grid item xs={12} md={6}>
              <StyledCard>
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    Top Customers
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    {[...customers]
                      .sort((a, b) => b.visits - a.visits)
                      .slice(0, 3)
                      .map((customer, index) => (
                        <Box key={customer.id} sx={{ mb: 1 }}>
                          <Typography variant="body1">
                            {index + 1}. <strong>{customer.name}</strong> - {customer.visits} visits
                          </Typography>
                        </Box>
                      ))
                    }
                  </Box>
                </CardContent>
              </StyledCard>
            </Grid>
          </Grid>
        </motion.div>
      </Container>

      {/* Dialog for adding/editing customers */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{editMode ? 'Edit Customer' : 'Add New Customer'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Full Name"
            type="text"
            fullWidth
            variant="outlined"
            value={currentCustomer.name}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="email"
            label="Email Address"
            type="email"
            fullWidth
            variant="outlined"
            value={currentCustomer.email}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="phone"
            label="Phone Number"
            type="text"
            fullWidth
            variant="outlined"
            value={currentCustomer.phone}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="visits"
            label="Number of Visits"
            type="number"
            fullWidth
            variant="outlined"
            value={currentCustomer.visits}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="lastVisit"
            label="Last Visit Date"
            type="date"
            fullWidth
            variant="outlined"
            value={currentCustomer.lastVisit}
            onChange={handleInputChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editMode ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Customers; 