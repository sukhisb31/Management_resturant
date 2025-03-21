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
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar
} from '@mui/material';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon, Refresh as RefreshIcon } from '@mui/icons-material';

const StyledCard = styled(motion(Card))`
  height: 100%;
  margin-bottom: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const TableCard = styled(StyledCard)`
  overflow: auto;
  max-height: 500px;
`;

const StatusChip = styled(Box)`
  padding: 4px 8px;
  border-radius: 16px;
  font-size: 0.8rem;
  display: inline-block;
  font-weight: 500;
  text-align: center;
  min-width: 80px;
`;

// Initial inventory items data
const initialInventory = [
  {
    id: 1,
    name: 'Tomatoes',
    category: 'Vegetables',
    quantity: 20,
    unit: 'kg',
    reorderLevel: 5,
    price: 3.99,
    supplier: 'Farm Fresh Supplies',
    lastUpdated: '2023-03-18'
  },
  {
    id: 2,
    name: 'Chicken Breast',
    category: 'Meat',
    quantity: 15,
    unit: 'kg',
    reorderLevel: 3,
    price: 9.99,
    supplier: 'Quality Meats Inc.',
    lastUpdated: '2023-03-17'
  },
  {
    id: 3,
    name: 'Olive Oil',
    category: 'Condiments',
    quantity: 8,
    unit: 'bottles',
    reorderLevel: 2,
    price: 12.99,
    supplier: 'Mediterranean Imports',
    lastUpdated: '2023-03-15'
  },
  {
    id: 4,
    name: 'Flour',
    category: 'Dry Goods',
    quantity: 25,
    unit: 'kg',
    reorderLevel: 5,
    price: 2.49,
    supplier: 'Baker\'s Supplies Co.',
    lastUpdated: '2023-03-16'
  },
  {
    id: 5,
    name: 'Red Wine',
    category: 'Beverages',
    quantity: 18,
    unit: 'bottles',
    reorderLevel: 6,
    price: 18.99,
    supplier: 'Vineyard Distributors',
    lastUpdated: '2023-03-14'
  },
];

const categories = ['All', 'Vegetables', 'Meat', 'Seafood', 'Dairy', 'Dry Goods', 'Condiments', 'Beverages'];
const units = ['kg', 'liters', 'bottles', 'packages', 'units', 'cans', 'boxes'];

const Inventory = () => {
  const [inventory, setInventory] = useState(initialInventory);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentItem, setCurrentItem] = useState({
    id: null,
    name: '',
    category: '',
    quantity: 0,
    unit: '',
    reorderLevel: 0,
    price: 0,
    supplier: '',
    lastUpdated: ''
  });
  const [filter, setFilter] = useState('All');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const filteredItems = filter === 'All'
    ? inventory
    : inventory.filter(item => item.category === filter);

  const handleOpenDialog = (isEdit = false, item = null) => {
    setEditMode(isEdit);
    if (isEdit && item) {
      setCurrentItem(item);
    } else {
      setCurrentItem({
        id: inventory.length > 0 ? Math.max(...inventory.map(i => i.id)) + 1 : 1,
        name: '',
        category: 'Vegetables',
        quantity: 0,
        unit: 'kg',
        reorderLevel: 0,
        price: 0,
        supplier: '',
        lastUpdated: new Date().toISOString().split('T')[0]
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentItem({
      ...currentItem,
      [name]: name === 'quantity' || name === 'reorderLevel' || name === 'price' 
        ? parseFloat(value) 
        : value
    });
  };

  const handleSubmit = () => {
    if (editMode) {
      // Update existing item
      setInventory(inventory.map(item => 
        item.id === currentItem.id ? currentItem : item
      ));
      setSnackbar({
        open: true,
        message: 'Inventory item updated successfully',
        severity: 'success'
      });
    } else {
      // Add new item
      setInventory([...inventory, currentItem]);
      setSnackbar({
        open: true,
        message: 'New inventory item added successfully',
        severity: 'success'
      });
    }
    handleCloseDialog();
  };

  const handleDeleteItem = (id) => {
    setInventory(inventory.filter(item => item.id !== id));
    setSnackbar({
      open: true,
      message: 'Inventory item deleted',
      severity: 'warning'
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

  const getStockStatus = (quantity, reorderLevel) => {
    if (quantity <= reorderLevel * 0.5) {
      return { text: 'Low', color: '#f44336' };
    } else if (quantity <= reorderLevel) {
      return { text: 'Reorder', color: '#ff9800' };
    } else {
      return { text: 'In Stock', color: '#4caf50' };
    }
  };

  const getTotalInventoryValue = () => {
    return inventory.reduce((total, item) => total + (item.quantity * item.price), 0).toFixed(2);
  };

  const getLowStockItems = () => {
    return inventory.filter(item => item.quantity <= item.reorderLevel);
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
            Inventory Management
          </Typography>
          <Typography variant="h6" textAlign="center" color="text.secondary" paragraph>
            Track and manage your restaurant inventory
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap', gap: 2 }}>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Category Filter</InputLabel>
              <Select
                value={filter}
                label="Category Filter"
                onChange={(e) => setFilter(e.target.value)}
              >
                {categories.map(category => (
                  <MenuItem key={category} value={category}>{category}</MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <Button 
              variant="contained" 
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog(false)}
            >
              Add Inventory Item
            </Button>
          </Box>

          <TableCard>
            <TableContainer component={Paper}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Unit</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Supplier</TableCell>
                    <TableCell>Last Updated</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredItems.map((item) => {
                    const status = getStockStatus(item.quantity, item.reorderLevel);
                    return (
                      <TableRow key={item.id}>
                        <TableCell>{item.id}</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{item.unit}</TableCell>
                        <TableCell>${item.price.toFixed(2)}</TableCell>
                        <TableCell>
                          <StatusChip sx={{ backgroundColor: status.color, color: 'white' }}>
                            {status.text}
                          </StatusChip>
                        </TableCell>
                        <TableCell>{item.supplier}</TableCell>
                        <TableCell>{item.lastUpdated}</TableCell>
                        <TableCell>
                          <IconButton 
                            color="primary" 
                            size="small"
                            onClick={() => handleOpenDialog(true, item)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton 
                            color="error" 
                            size="small"
                            onClick={() => handleDeleteItem(item.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </TableCard>

          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12} md={4}>
              <StyledCard>
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    Inventory Summary
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body1">
                      Total Items: <strong>{inventory.length}</strong>
                    </Typography>
                    <Typography variant="body1">
                      Total Value: <strong>${getTotalInventoryValue()}</strong>
                    </Typography>
                    <Typography variant="body1">
                      Items to Reorder: <strong>{getLowStockItems().length}</strong>
                    </Typography>
                  </Box>
                </CardContent>
              </StyledCard>
            </Grid>

            <Grid item xs={12} md={8}>
              <StyledCard>
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    Low Stock Items
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    {getLowStockItems().length > 0 ? (
                      getLowStockItems().map(item => (
                        <Box key={item.id} sx={{ mb: 1, display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body1">
                            <strong>{item.name}</strong> - {item.quantity} {item.unit} 
                            (Reorder level: {item.reorderLevel})
                          </Typography>
                          <Button 
                            size="small" 
                            startIcon={<RefreshIcon />}
                            onClick={() => handleOpenDialog(true, item)}
                          >
                            Update
                          </Button>
                        </Box>
                      ))
                    ) : (
                      <Typography variant="body1">
                        No items need reordering at this time.
                      </Typography>
                    )}
                  </Box>
                </CardContent>
              </StyledCard>
            </Grid>
          </Grid>
        </motion.div>
      </Container>

      {/* Dialog for adding/editing inventory items */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{editMode ? 'Edit Inventory Item' : 'Add New Inventory Item'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoFocus
                name="name"
                label="Item Name"
                type="text"
                fullWidth
                variant="outlined"
                value={currentItem.name}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={currentItem.category}
                  label="Category"
                  onChange={handleInputChange}
                >
                  {categories.filter(c => c !== 'All').map(category => (
                    <MenuItem key={category} value={category}>{category}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="quantity"
                label="Quantity"
                type="number"
                fullWidth
                variant="outlined"
                value={currentItem.quantity}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Unit</InputLabel>
                <Select
                  name="unit"
                  value={currentItem.unit}
                  label="Unit"
                  onChange={handleInputChange}
                >
                  {units.map(unit => (
                    <MenuItem key={unit} value={unit}>{unit}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="reorderLevel"
                label="Reorder Level"
                type="number"
                fullWidth
                variant="outlined"
                value={currentItem.reorderLevel}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="price"
                label="Price ($)"
                type="number"
                fullWidth
                variant="outlined"
                value={currentItem.price}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="supplier"
                label="Supplier"
                type="text"
                fullWidth
                variant="outlined"
                value={currentItem.supplier}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="lastUpdated"
                label="Last Updated"
                type="date"
                fullWidth
                variant="outlined"
                value={currentItem.lastUpdated}
                onChange={handleInputChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editMode ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleCloseSnackbar}>
        <Alert severity={snackbar.severity} onClose={handleCloseSnackbar}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Inventory; 