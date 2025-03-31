'use client';

import { useRole } from '../../context/RoleContext';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Alert,
  Chip,
  Grid,
  TablePagination,
  Tooltip,
  CircularProgress,
  Divider,
  Card,
  CardContent,
  Switch,
  FormControlLabel,
  Tabs,
  Tab,
  Breadcrumbs
} from '@mui/material';

// Icons
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import BlockIcon from '@mui/icons-material/Block';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FilterListIcon from '@mui/icons-material/FilterList';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RefreshIcon from '@mui/icons-material/Refresh';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import PersonIcon from '@mui/icons-material/Person';

export default function EmployeesPage() {
  const { role } = useRole();
  const router = useRouter();
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('active');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [dialogType, setDialogType] = useState(''); // 'view', 'edit', 'deactivate', 'create'
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });
  const [warehouses, setWarehouses] = useState([]);

  // New employee form state
  const [formData, setFormData] = useState({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    role: 'employee',
    warehouseId: '',
    status: 'active',
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (!role || role !== 'admin') {
      router.push('/');
    } else {
      fetchEmployees();
      fetchWarehouses();
    }
  }, [role, router]);

  useEffect(() => {
    // Apply filters to the employees list
    let result = [...employees];
    
    if (searchTerm) {
      result = result.filter(emp => 
        emp.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (emp.firstName && emp.firstName.toLowerCase().includes(searchTerm.toLowerCase())) || 
        (emp.lastName && emp.lastName.toLowerCase().includes(searchTerm.toLowerCase())) || 
        (emp.email && emp.email.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    if (roleFilter) {
      result = result.filter(emp => emp.role === roleFilter);
    }
    
    if (statusFilter) {
      result = result.filter(emp => emp.status === statusFilter);
    }
    
    setFilteredEmployees(result);
  }, [employees, searchTerm, roleFilter, statusFilter]);

  const fetchEmployees = async () => {
    setLoading(true);
    // In a real app, replace with actual API call
    try {
      // Mocked data for demo purposes
      const mockEmployees = [
        { id: 1, username: 'john_doe', firstName: 'John', lastName: 'Doe', email: 'john@example.com', role: 'employee', status: 'active', warehouse: { id: 1, name: 'Main Warehouse' } },
        { id: 2, username: 'jane_smith', firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', role: 'manager', status: 'active', warehouse: { id: 2, name: 'East Facility' } },
        { id: 3, username: 'bob_admin', firstName: 'Bob', lastName: 'Admin', email: 'bob@example.com', role: 'admin', status: 'active', warehouse: null },
        { id: 4, username: 'alice_worker', firstName: 'Alice', lastName: 'Worker', email: 'alice@example.com', role: 'employee', status: 'inactive', warehouse: { id: 1, name: 'Main Warehouse' } },
        { id: 5, username: 'alex_supervisor', firstName: 'Alex', lastName: 'Supervisor', email: 'alex@example.com', role: 'manager', status: 'active', warehouse: { id: 3, name: 'West Facility' } },
      ];
      
      // Simulating API delay
      setTimeout(() => {
        setEmployees(mockEmployees);
        setFilteredEmployees(mockEmployees);
        setLoading(false);
      }, 800);
      
      // Actual API call would be:
      // const response = await fetch('http://localhost:8080/api/employees');
      // if (!response.ok) throw new Error('Failed to fetch employees');
      // const data = await response.json();
      // setEmployees(data);
      // setFilteredEmployees(data);
    } catch (error) {
      console.error('Error fetching employees:', error);
      showNotification('Failed to load employees', 'error');
      setLoading(false);
    }
  };

  const fetchWarehouses = async () => {
    // In a real app, replace with actual API call
    try {
      // Mocked data for demo purposes
      const mockWarehouses = [
        { id: 1, name: 'Main Warehouse', location: 'New York' },
        { id: 2, name: 'East Facility', location: 'Boston' },
        { id: 3, name: 'West Facility', location: 'San Francisco' },
        { id: 4, name: 'South Storage', location: 'Miami' },
      ];
      
      setWarehouses(mockWarehouses);
      
      // Actual API call would be:
      // const response = await fetch('http://localhost:8080/api/warehouses');
      // if (!response.ok) throw new Error('Failed to fetch warehouses');
      // const data = await response.json();
      // setWarehouses(data);
    } catch (error) {
      console.error('Error fetching warehouses:', error);
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleRoleFilterChange = (event) => {
    setRoleFilter(event.target.value);
    setPage(0);
  };

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenDialog = (type, employee = null) => {
    setDialogType(type);
    setCurrentEmployee(employee);
    
    if (type === 'create') {
      setFormData({
        username: '',
        firstName: '',
        lastName: '',
        email: '',
        role: 'employee',
        warehouseId: '',
        status: 'active',
        password: '',
        confirmPassword: ''
      });
    } else if (type === 'edit' && employee) {
      setFormData({
        username: employee.username,
        firstName: employee.firstName || '',
        lastName: employee.lastName || '',
        email: employee.email || '',
        role: employee.role || 'employee',
        warehouseId: employee.warehouse ? employee.warehouse.id : '',
        status: employee.status || 'active',
        password: '',
        confirmPassword: ''
      });
    }
    
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentEmployee(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async () => {
    // Validate form data
    if (dialogType === 'create' || dialogType === 'edit') {
      if (!formData.username || !formData.firstName || !formData.lastName || !formData.email || !formData.role) {
        showNotification('Please fill in all required fields', 'error');
        return;
      }
      
      if (dialogType === 'create' && (!formData.password || formData.password !== formData.confirmPassword)) {
        showNotification('Passwords do not match or are empty', 'error');
        return;
      }
    }
    
    // In a real app, make API calls based on dialog type
    try {
      if (dialogType === 'create') {
        // Create new employee
        // const response = await fetch('http://localhost:8080/api/employees', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(formData),
        //   credentials: 'include'
        // });
        // if (!response.ok) throw new Error('Failed to create employee');
        
        // Mock new employee creation
        const newEmployee = {
          id: employees.length + 1,
          ...formData,
          warehouse: formData.warehouseId ? warehouses.find(w => w.id === formData.warehouseId) : null
        };
        setEmployees([...employees, newEmployee]);
        showNotification('Employee created successfully', 'success');
      } 
      else if (dialogType === 'edit' && currentEmployee) {
        // Update existing employee
        // const response = await fetch(`http://localhost:8080/api/employees/${currentEmployee.id}`, {
        //   method: 'PUT',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(formData),
        //   credentials: 'include'
        // });
        // if (!response.ok) throw new Error('Failed to update employee');
        
        // Mock employee update
        const updatedEmployees = employees.map(emp => 
          emp.id === currentEmployee.id 
            ? { 
                ...emp, 
                ...formData, 
                warehouse: formData.warehouseId 
                  ? warehouses.find(w => w.id === formData.warehouseId) 
                  : null 
              } 
            : emp
        );
        setEmployees(updatedEmployees);
        showNotification('Employee updated successfully', 'success');
      } 
      else if (dialogType === 'deactivate' && currentEmployee) {
        // Deactivate employee
        // const response = await fetch(`http://localhost:8080/api/employees/${currentEmployee.id}/status`, {
        //   method: 'PATCH',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ status: 'inactive' }),
        //   credentials: 'include'
        // });
        // if (!response.ok) throw new Error('Failed to deactivate employee');
        
        // Mock employee deactivation
        const updatedEmployees = employees.map(emp => 
          emp.id === currentEmployee.id ? { ...emp, status: 'inactive' } : emp
        );
        setEmployees(updatedEmployees);
        showNotification('Employee deactivated successfully', 'success');
      }
      
      handleCloseDialog();
    } catch (error) {
      console.error('Error:', error);
      showNotification(error.message, 'error');
    }
  };

  const showNotification = (message, severity = 'info') => {
    setNotification({
      open: true,
      message,
      severity
    });
  };

  const handleCloseNotification = () => {
    setNotification({
      ...notification,
      open: false
    });
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="static" sx={{ bgcolor: '#1976d2' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            IMS - Employee Management
          </Typography>
          <Button 
            component={Link}
            href="/admin"
            color="inherit"
            startIcon={<ArrowBackIcon />}
            sx={{ mr: 2 }}
          >
            Dashboard
          </Button>
        </Toolbar>
      </AppBar>
      
      <Container sx={{ py: 4 }}>
        {/* Breadcrumbs */}
        <Breadcrumbs sx={{ mb: 3 }}>
          <Link href="/admin" style={{ textDecoration: 'none', color: '#1976d2' }}>
            Dashboard
          </Link>
          <Typography color="text.primary">Employees</Typography>
        </Breadcrumbs>
        
        {/* Page Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
            Employee Management
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog('create')}
          >
            Add Employee
          </Button>
        </Box>
        
        {/* Filter & Search Section */}
        <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search employees..."
                value={searchTerm}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel id="role-filter-label">Role</InputLabel>
                <Select
                  labelId="role-filter-label"
                  id="role-filter"
                  value={roleFilter}
                  label="Role"
                  onChange={handleRoleFilterChange}
                >
                  <MenuItem value="">All Roles</MenuItem>
                  <MenuItem value="employee">Employee</MenuItem>
                  <MenuItem value="manager">Manager</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel id="status-filter-label">Status</InputLabel>
                <Select
                  labelId="status-filter-label"
                  id="status-filter"
                  value={statusFilter}
                  label="Status"
                  onChange={handleStatusFilterChange}
                >
                  <MenuItem value="">All Status</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
                <Button
                  startIcon={<RefreshIcon />}
                  onClick={fetchEmployees}
                >
                  Refresh
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>
        
        {/* Employees Table */}
        <Paper elevation={2} sx={{ width: '100%', mb: 3, overflow: 'hidden' }}>
          <TableContainer sx={{ maxHeight: 'calc(100vh - 300px)' }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Username</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Role</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Warehouse</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                      <CircularProgress />
                      <Typography variant="body2" sx={{ mt: 1 }}>Loading employees...</Typography>
                    </TableCell>
                  </TableRow>
                ) : filteredEmployees.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                      <Typography variant="body1">No employees found</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEmployees
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((employee) => (
                      <TableRow key={employee.id} hover>
                        <TableCell>{employee.username}</TableCell>
                        <TableCell>{`${employee.firstName} ${employee.lastName}`}</TableCell>
                        <TableCell>{employee.email}</TableCell>
                        <TableCell>
                          <Chip
                            label={employee.role}
                            color={
                              employee.role === 'admin' ? 'error' :
                              employee.role === 'manager' ? 'warning' : 'info'
                            }
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{employee.warehouse ? employee.warehouse.name : 'Not Assigned'}</TableCell>
                        <TableCell>
                          <Chip
                            label={employee.status}
                            color={employee.status === 'active' ? 'success' : 'default'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Tooltip title="View Details">
                              <IconButton 
                                size="small" 
                                color="info"
                                onClick={() => handleOpenDialog('view', employee)}
                              >
                                <VisibilityIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Edit Employee">
                              <IconButton 
                                size="small" 
                                color="primary"
                                onClick={() => handleOpenDialog('edit', employee)}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            {employee.status === 'active' && (
                              <Tooltip title="Deactivate Employee">
                                <IconButton 
                                  size="small" 
                                  color="error"
                                  onClick={() => handleOpenDialog('deactivate', employee)}
                                >
                                  <BlockIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredEmployees.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Container>
      
      {/* Dialogs for Create, Edit, View, Deactivate */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth={dialogType === 'view'}>
        {/* View Employee Dialog */}
        {dialogType === 'view' && currentEmployee && (
          <>
            <DialogTitle sx={{ pb: 0 }}>
              <Typography variant="h6" component="div" fontWeight="bold">
                Employee Details
              </Typography>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3} sx={{ mt: 0 }}>
                <Grid item xs={12} md={4}>
                  <Card variant="outlined" sx={{ height: '100%' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Avatar 
                          sx={{ 
                            width: 80, 
                            height: 80, 
                            mb: 2, 
                            bgcolor: currentEmployee.status === 'active' ? 'primary.main' : 'text.disabled' 
                          }}
                        >
                          {currentEmployee.status === 'active' ? <PersonIcon fontSize="large" /> : <PersonOffIcon fontSize="large" />}
                        </Avatar>
                        <Typography variant="h6" align="center">
                          {`${currentEmployee.firstName} ${currentEmployee.lastName}`}
                        </Typography>
                        <Chip 
                          label={currentEmployee.status} 
                          color={currentEmployee.status === 'active' ? 'success' : 'default'}
                          size="small"
                          sx={{ mt: 1 }}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={8}>
                  <Card variant="outlined" sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        User Information
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2" color="text.secondary">Username</Typography>
                          <Typography variant="body1">{currentEmployee.username}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2" color="text.secondary">Email</Typography>
                          <Typography variant="body1">{currentEmployee.email}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2" color="text.secondary">Role</Typography>
                          <Chip
                            label={currentEmployee.role}
                            color={
                              currentEmployee.role === 'admin' ? 'error' :
                              currentEmployee.role === 'manager' ? 'warning' : 'info'
                            }
                            size="small"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2" color="text.secondary">Warehouse</Typography>
                          <Typography variant="body1">
                            {currentEmployee.warehouse ? currentEmployee.warehouse.name : 'Not Assigned'}
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Close</Button>
              <Button 
                onClick={() => {
                  handleCloseDialog();
                  handleOpenDialog('edit', currentEmployee);
                }}
                color="primary"
              >
                Edit Details
              </Button>
            </DialogActions>
          </>
        )}
        
        {/* Create/Edit Employee Dialog */}
        {(dialogType === 'create' || dialogType === 'edit') && (
          <>
            <DialogTitle>
              {dialogType === 'create' ? 'Add New Employee' : 'Edit Employee'}
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={2} sx={{ mt: 0 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="username"
                    label="Username"
                    value={formData.username}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    margin="dense"
                    disabled={dialogType === 'edit'} // Cannot change username when editing
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="email"
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    margin="dense"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="firstName"
                    label="First Name"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    margin="dense"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="lastName"
                    label="Last Name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    margin="dense"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth margin="dense" required>
                    <InputLabel>Role</InputLabel>
                    <Select
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      label="Role"
                    >
                      <MenuItem value="employee">Employee</MenuItem>
                      <MenuItem value="manager">Manager</MenuItem>
                      <MenuItem value="admin">Admin</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth margin="dense">
                    <InputLabel>Assigned Warehouse</InputLabel>
                    <Select
                      name="warehouseId"
                      value={formData.warehouseId}
                      onChange={handleInputChange}
                      label="Assigned Warehouse"
                    >
                      <MenuItem value="">Not Assigned</MenuItem>
                      {warehouses.map(warehouse => (
                        <MenuItem key={warehouse.id} value={warehouse.id}>
                          {warehouse.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                
                {dialogType === 'edit' && (
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={formData.status === 'active'}
                          onChange={(e) => setFormData({
                            ...formData,
                            status: e.target.checked ? 'active' : 'inactive'
                          })}
                          color="success"
                        />
                      }
                      label={formData.status === 'active' ? "Active" : "Inactive"}
                    />
                  </Grid>
                )}
                
                {dialogType === 'create' && (
                  <>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        name="password"
                        label="Password"
                        type="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        fullWidth
                        required
                        margin="dense"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        name="confirmPassword"
                        label="Confirm Password"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        fullWidth
                        required
                        margin="dense"
                        error={formData.password !== formData.confirmPassword && formData.confirmPassword !== ''}
                        helperText={formData.password !== formData.confirmPassword && formData.confirmPassword !== '' ? 'Passwords do not match' : ''}
                      />
                    </Grid>
                  </>
                )}
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Cancel</Button>
              <Button onClick={handleSubmit} color="primary" variant="contained">
                {dialogType === 'create' ? 'Create' : 'Save Changes'}
              </Button>
            </DialogActions>
          </>
        )}
        
        {/* Deactivate Employee Dialog */}
        {dialogType === 'deactivate' && currentEmployee && (
          <>
            <DialogTitle>
              Deactivate Employee
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to deactivate employee <strong>{`${currentEmployee.firstName} ${currentEmployee.lastName}`}</strong>? 
                This user will no longer be able to access the system but their data and history will be preserved.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Cancel</Button>
              <Button onClick={handleSubmit} color="error" variant="contained">
                Deactivate
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
      
      {/* Snackbar for notifications */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}