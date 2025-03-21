import React, { useState } from 'react';
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
  MenuItem,
  Snackbar,
  Alert,
  Grid,
  Card,
  CardContent,
  Chip
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import styled from 'styled-components';

const StyledCard = styled(motion(Card))`
  height: 100%;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const AnimatedContainer = styled(motion.div)`
  width: 100%;
  overflow: visible;
`;

const Employees = () => {
  const [employees, setEmployees] = useState([
    {
      id: 1,
      name: 'John Smith',
      role: 'Chef',
      department: 'Kitchen',
      email: 'john.smith@restaurant.com',
      phone: '+1 (555) 123-4567',
      hireDate: '2023-01-15',
      status: 'Active',
      salary: 75000,
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      role: 'Server',
      department: 'Front of House',
      email: 'sarah.j@restaurant.com',
      phone: '+1 (555) 234-5678',
      hireDate: '2023-03-20',
      status: 'Active',
      salary: 45000,
    },
    {
      id: 3,
      name: 'Michael Brown',
      role: 'Manager',
      department: 'Management',
      email: 'michael.b@restaurant.com',
      phone: '+1 (555) 345-6789',
      hireDate: '2022-11-10',
      status: 'Active',
      salary: 85000,
    },
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const [formData, setFormData] = useState({
    name: '',
    role: '',
    department: '',
    email: '',
    phone: '',
    hireDate: new Date().toISOString().split('T')[0],
    status: 'Active',
    salary: '',
  });

  const roles = ['Chef', 'Server', 'Manager', 'Host', 'Bartender', 'Dishwasher'];
  const departments = ['Kitchen', 'Front of House', 'Management', 'Bar', 'Support'];
  const statuses = ['Active', 'On Leave', 'Terminated'];

  const handleOpenDialog = (employee = null) => {
    if (employee) {
      setEditMode(true);
      setCurrentEmployee(employee);
      setFormData(employee);
    } else {
      setEditMode(false);
      setCurrentEmployee(null);
      setFormData({
        name: '',
        role: '',
        department: '',
        email: '',
        phone: '',
        hireDate: new Date().toISOString().split('T')[0],
        status: 'Active',
        salary: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditMode(false);
    setCurrentEmployee(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    const processedData = {
      ...formData,
      salary: parseFloat(formData.salary),
    };

    if (editMode) {
      setEmployees((prev) =>
        prev.map((emp) =>
          emp.id === currentEmployee.id ? { ...processedData, id: emp.id } : emp
        )
      );
      setSnackbar({
        open: true,
        message: 'Employee updated successfully',
        severity: 'success',
      });
    } else {
      const newEmployee = {
        ...processedData,
        id: employees.length + 1,
      };
      setEmployees((prev) => [...prev, newEmployee]);
      setSnackbar({
        open: true,
        message: 'Employee added successfully',
        severity: 'success',
      });
    }
    handleCloseDialog();
  };

  const handleDelete = (id) => {
    setEmployees((prev) => prev.filter((emp) => emp.id !== id));
    setSnackbar({
      open: true,
      message: 'Employee deleted successfully',
      severity: 'success',
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'success';
      case 'On Leave':
        return 'warning';
      case 'Terminated':
        return 'error';
      default:
        return 'default';
    }
  };

  const calculateStats = () => {
    const totalEmployees = employees.length;
    const activeEmployees = employees.filter((emp) => emp.status === 'Active').length;
    const totalSalary = employees.reduce((sum, emp) => sum + emp.salary, 0);
    const averageSalary = totalSalary / totalEmployees || 0;

    return {
      totalEmployees,
      activeEmployees,
      totalSalary,
      averageSalary,
    };
  };

  const stats = calculateStats();

  return (
    <Container 
      maxWidth="lg" 
      className="page-container"
      sx={{ 
        pt: 3,
        pb: 4,
        overflowX: 'auto',
        width: '100%',
        maxWidth: '100%',
        boxSizing: 'border-box',
      }}
    >
      <AnimatedContainer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
          <Typography variant="h4" component="h1">
            Employee Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Add Employee
          </Button>
        </Box>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={3}>
            <StyledCard whileHover={{ y: -5 }} transition={{ duration: 0.3 }}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Employees
                </Typography>
                <Typography variant="h4">{stats.totalEmployees}</Typography>
              </CardContent>
            </StyledCard>
          </Grid>
          <Grid item xs={12} md={3}>
            <StyledCard whileHover={{ y: -5 }} transition={{ duration: 0.3 }}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Active Employees
                </Typography>
                <Typography variant="h4">{stats.activeEmployees}</Typography>
              </CardContent>
            </StyledCard>
          </Grid>
          <Grid item xs={12} md={3}>
            <StyledCard whileHover={{ y: -5 }} transition={{ duration: 0.3 }}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Salary
                </Typography>
                <Typography variant="h4">${stats.totalSalary.toLocaleString()}</Typography>
              </CardContent>
            </StyledCard>
          </Grid>
          <Grid item xs={12} md={3}>
            <StyledCard whileHover={{ y: -5 }} transition={{ duration: 0.3 }}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Average Salary
                </Typography>
                <Typography variant="h4">${stats.averageSalary.toLocaleString()}</Typography>
              </CardContent>
            </StyledCard>
          </Grid>
        </Grid>

        <TableContainer 
          component={Paper} 
          sx={{ 
            mb: 4,
            overflowX: 'auto',
            width: '100%'
          }}
        >
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Salary</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {employees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>{employee.name}</TableCell>
                  <TableCell>{employee.role}</TableCell>
                  <TableCell>{employee.department}</TableCell>
                  <TableCell>{employee.email}</TableCell>
                  <TableCell>{employee.phone}</TableCell>
                  <TableCell>
                    <Chip
                      label={employee.status}
                      color={getStatusColor(employee.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>${employee.salary.toLocaleString()}</TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleOpenDialog(employee)}
                      size="small"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(employee.id)}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>
            {editMode ? 'Edit Employee' : 'Add New Employee'}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              <TextField
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                fullWidth
                required
              />
              <TextField
                select
                label="Role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                fullWidth
                required
              >
                {roles.map((role) => (
                  <MenuItem key={role} value={role}>
                    {role}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                label="Department"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                fullWidth
                required
              >
                {departments.map((dept) => (
                  <MenuItem key={dept} value={dept}>
                    {dept}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                fullWidth
                required
              />
              <TextField
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                fullWidth
                required
              />
              <TextField
                label="Hire Date"
                name="hireDate"
                type="date"
                value={formData.hireDate}
                onChange={handleInputChange}
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                select
                label="Status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                fullWidth
                required
              >
                {statuses.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Salary"
                name="salary"
                type="number"
                value={formData.salary}
                onChange={handleInputChange}
                fullWidth
                required
                InputProps={{
                  startAdornment: '$',
                }}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              color="primary"
            >
              {editMode ? 'Update' : 'Add'}
            </Button>
          </DialogActions>
        </Dialog>

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
      </AnimatedContainer>
    </Container>
  );
};

export default Employees; 