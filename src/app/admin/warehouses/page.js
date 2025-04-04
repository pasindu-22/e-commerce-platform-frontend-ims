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
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Snackbar,
  Alert,
  Tabs,
  Tab,
  Divider,
  FormControlLabel,
  Switch,
  List,
  Grid,
  TablePagination,
  Tooltip,
  CircularProgress,
  Breadcrumbs,
  Card,
  CardContent
} from '@mui/material';

// Icons
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import RefreshIcon from '@mui/icons-material/Refresh';
import VisibilityIcon from '@mui/icons-material/Visibility';
import StorageIcon from '@mui/icons-material/Storage';

export default function WarehousesManagementPage() {
  const { role } = useRole();
  const router = useRouter();
  
  // States for warehouse data
  const [warehouses, setWarehouses] = useState([]);
  const [filteredWarehouses, setFilteredWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // States for warehouse creation/editing
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState(''); // 'create', 'edit', 'view', 'deactivate'
  const [currentWarehouse, setCurrentWarehouse] = useState({
    id: '',
    warehouseCode: '',
    location: '',
    capacity: 0,
    isActive: true,
    description: ''
  });
  
  // States for notification
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  
  // States for employee assignment dialog
  const [openAssignDialog, setOpenAssignDialog] = useState(false);
  const [availableEmployees, setAvailableEmployees] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [assignedEmployees, setAssignedEmployees] = useState({});

  useEffect(() => {
    if (!role || role !== 'admin') {
      router.push('/');
    } else {
      fetchWarehouses();
      fetchEmployees();
    }
  }, [role, router]);

  useEffect(() => {
    // Apply filters to the warehouses list
    if (warehouses.length > 0) {
      let filtered = [...warehouses];
      
      // Filter by search term
      if (searchTerm) {
        filtered = filtered.filter(warehouse => 
          warehouse.warehouseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
          warehouse.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (warehouse.description && warehouse.description.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      }
      
      // Filter by status
      if (statusFilter) {
        filtered = filtered.filter(warehouse => 
          (statusFilter === 'active' && warehouse.isActive) || 
          (statusFilter === 'inactive' && !warehouse.isActive)
        );
      }
      
      setFilteredWarehouses(filtered);
    }
  }, [warehouses, searchTerm, statusFilter]);

  const fetchWarehouses = async () => {
    setLoading(true);
    try {
      // In production, replace with your actual API endpoint
      // const response = await fetch('http://localhost:8080/api/warehouses');
      
      // For demo purposes, using mock data
      const mockData = [
        { 
          id: '1', 
          warehouseCode: 'WH001', 
          location: 'Colomobo, Moratuwa', 
          capacity: 5000, 
          isActive: true,
          description: 'Main distribution center for East Coast operations'
        },
        { 
          id: '2', 
          warehouseCode: 'WH002', 
          location: 'Galle City', 
          capacity: 7500, 
          isActive: true,
          description: 'Primary warehouse for West Coast distribution'
        },
        { 
          id: '3', 
          warehouseCode: 'WH003', 
          location: 'Matara City', 
          capacity: 4000, 
          isActive: false,
          description: 'Central region storage facility (currently undergoing renovations)'
        },
        { 
          id: '4', 
          warehouseCode: 'WH004', 
          location: 'Kandy City', 
          capacity: 6000, 
          isActive: true,
          description: 'Southern distribution hub with refrigerated storage'
        },
        { 
          id: '5', 
          warehouseCode: 'WH005', 
          location: 'Jaffna City', 
          capacity: 3000, 
          isActive: true,
          description: 'Southwest regional fulfillment center'
        }
      ];
      
      // Simulating API delay
      setTimeout(() => {
        setWarehouses(mockData);
        setFilteredWarehouses(mockData);
        setLoading(false);
      }, 800);
    } catch (err) {
      console.error('Error fetching warehouses:', err);
      showNotification('Failed to load warehouses', 'error');
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      // In production, replace with your actual API endpoint
      // For demo purposes, using mock data
      const mockEmployees = [
        { id: '1', name: 'John Smith', email: 'john@example.com', role: 'manager' },
        { id: '2', name: 'Sarah Johnson', email: 'sarah@example.com', role: 'employee' },
        { id: '3', name: 'Michael Brown', email: 'michael@example.com', role: 'employee' },
        { id: '4', name: 'Emma Wilson', email: 'emma@example.com', role: 'employee' },
        { id: '5', name: 'Robert Davis', email: 'robert@example.com', role: 'manager' }
      ];
      
      setAvailableEmployees(mockEmployees);
      
      // Mock data for assigned employees
      const mockAssignedEmployees = {
        '1': ['1', '2'],
        '2': ['3'],
        '3': [],
        '4': ['2', '4'],
        '5': ['5']
      };
      
      setAssignedEmployees(mockAssignedEmployees);
    } catch (err) {
      console.error('Error fetching employees:', err);
    }
  };

  const handleOpenDialog = (type, warehouse = null) => {
    setDialogType(type);
    
    if (type === 'create') {
      setCurrentWarehouse({
        id: '',
        warehouseCode: '',
        location: '',
        capacity: 0,
        isActive: true,
        description: ''
      });
    } else if (warehouse) {
      setCurrentWarehouse({ ...warehouse });
    }
    
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentWarehouse({
      id: '',
      warehouseCode: '',
      location: '',
      capacity: 0,
      isActive: true,
      description: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCurrentWarehouse({
      ...currentWarehouse,
      [name]: type === 'checkbox' ? checked : name === 'capacity' ? Number(value) : value
    });
  };

  const handleOpenAssignDialog = (warehouse) => {
    setCurrentWarehouse(warehouse);
    setSelectedEmployees(assignedEmployees[warehouse.id] || []);
    setOpenAssignDialog(true);
  };

  const handleEmployeeSelection = (employeeId) => {
    const isSelected = selectedEmployees.includes(employeeId);
    
    if (isSelected) {
      setSelectedEmployees(selectedEmployees.filter(id => id !== employeeId));
    } else {
      setSelectedEmployees([...selectedEmployees, employeeId]);
    }
  };

  const handleSubmit = async () => {
    // Validate form data for create and edit operations
    if (dialogType === 'create' || dialogType === 'edit') {
      if (!currentWarehouse.warehouseCode || !currentWarehouse.location) {
        showNotification('Please fill in all required fields', 'error');
        return;
      }
    }
    
    try {
      if (dialogType === 'create') {
        // Mock adding a new warehouse
        const newWarehouse = {
          ...currentWarehouse,
          id: (warehouses.length + 1).toString()
        };
        
        setWarehouses([...warehouses, newWarehouse]);
        showNotification('Warehouse created successfully', 'success');
      } 
      else if (dialogType === 'edit') {
        // Mock updating a warehouse
        const updatedWarehouses = warehouses.map(warehouse =>
          warehouse.id === currentWarehouse.id ? currentWarehouse : warehouse
        );
        
        setWarehouses(updatedWarehouses);
        showNotification('Warehouse updated successfully', 'success');
      }
      else if (dialogType === 'deactivate') {
        // Mock toggling warehouse status
        const updatedWarehouses = warehouses.map(warehouse =>
          warehouse.id === currentWarehouse.id ? { ...warehouse, isActive: false } : warehouse
        );
        
        setWarehouses(updatedWarehouses);
        showNotification('Warehouse deactivated successfully', 'success');
      }
      
      handleCloseDialog();
    } catch (err) {
      console.error('Error:', err);
      showNotification(err.message || 'An error occurred', 'error');
    }
  };

  const handleSaveAssignedEmployees = async () => {
    try {
      // Mock updating assigned employees
      setAssignedEmployees({
        ...assignedEmployees,
        [currentWarehouse.id]: selectedEmployees
      });
      
      showNotification('Employees assigned successfully', 'success');
      setOpenAssignDialog(false);
    } catch (err) {
      console.error('Error assigning employees:', err);
      showNotification('Failed to assign employees', 'error');
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
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
            IMS - Warehouse Management
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
          <Typography color="text.primary">Warehouses</Typography>
        </Breadcrumbs>
        
        {/* Page Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
            Warehouse Management
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog('create')}
          >
            Add Warehouse
          </Button>
        </Box>
        
        {/* Filter & Search Section */}
        <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search warehouses..."
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
            <Grid item xs={12} sm={6} md={4}>
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
                  onClick={fetchWarehouses}
                >
                  Refresh
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>
        
        {/* Warehouses Table */}
        <Paper elevation={2} sx={{ width: '100%', mb: 3, overflow: 'hidden' }}>
          <TableContainer sx={{ maxHeight: 'calc(100vh - 300px)' }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Warehouse Code</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Location</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }} align="center">Capacity</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }} align="center">Status</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }} align="center">Assigned Employees</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }} align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                      <CircularProgress />
                      <Typography variant="body2" sx={{ mt: 1 }}>Loading warehouses...</Typography>
                    </TableCell>
                  </TableRow>
                ) : filteredWarehouses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                      <Typography variant="body1">No warehouses found</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredWarehouses
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((warehouse) => (
                      <TableRow key={warehouse.id} hover>
                        <TableCell>{warehouse.warehouseCode}</TableCell>
                        <TableCell>{warehouse.location}</TableCell>
                        <TableCell align="center">{warehouse.capacity.toLocaleString()} units</TableCell>
                        <TableCell align="center">
                          <Chip 
                            label={warehouse.isActive ? "Active" : "Inactive"} 
                            color={warehouse.isActive ? "success" : "default"}
                            size="small" 
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Chip 
                            label={`${assignedEmployees[warehouse.id]?.length || 0} Employees`}
                            color="primary"
                            variant="outlined"
                            size="small"
                            onClick={() => handleOpenAssignDialog(warehouse)}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                            <Tooltip title="View Details">
                              <IconButton 
                                size="small" 
                                color="info"
                                onClick={() => handleOpenDialog('view', warehouse)}
                              >
                                <VisibilityIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Edit Warehouse">
                              <IconButton 
                                size="small" 
                                color="primary"
                                onClick={() => handleOpenDialog('edit', warehouse)}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            {warehouse.isActive && (
                              <Tooltip title="Deactivate Warehouse">
                                <IconButton 
                                  size="small" 
                                  color="error"
                                  onClick={() => handleOpenDialog('deactivate', warehouse)}
                                >
                                  <DeleteIcon fontSize="small" />
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
            count={filteredWarehouses.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Container>
      
      {/* Dialogs for Create, Edit, View, Deactivate */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth={dialogType === 'view'}>
        {/* View Warehouse Dialog */}
        {dialogType === 'view' && currentWarehouse && (
          <>
            <DialogTitle sx={{ pb: 0 }}>
              <Typography variant="h6" component="div" fontWeight="bold">
                Warehouse Details
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
                            bgcolor: currentWarehouse.isActive ? 'primary.main' : 'text.disabled' 
                          }}
                        >
                          <WarehouseIcon fontSize="large" />
                        </Avatar>
                        <Typography variant="h6" align="center">
                          {currentWarehouse.warehouseCode}
                        </Typography>
                        <Chip 
                          label={currentWarehouse.isActive ? "Active" : "Inactive"} 
                          color={currentWarehouse.isActive ? "success" : "default"}
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
                        Warehouse Information
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2" color="text.secondary">Location</Typography>
                          <Typography variant="body1">{currentWarehouse.location}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2" color="text.secondary">Capacity</Typography>
                          <Typography variant="body1">{currentWarehouse.capacity.toLocaleString()} units</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2" color="text.secondary">Assigned Employees</Typography>
                          <Typography variant="body1">
                            {assignedEmployees[currentWarehouse.id]?.length || 0} employees
                          </Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="body2" color="text.secondary">Description</Typography>
                          <Typography variant="body1">
                            {currentWarehouse.description || 'No description provided'}
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
                  handleOpenDialog('edit', currentWarehouse);
                }}
                color="primary"
              >
                Edit Details
              </Button>
            </DialogActions>
          </>
        )}
        
        {/* Create/Edit Warehouse Dialog */}
        {(dialogType === 'create' || dialogType === 'edit') && (
          <>
            <DialogTitle>
              {dialogType === 'create' ? 'Add New Warehouse' : 'Edit Warehouse'}
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={2} sx={{ mt: 0 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="warehouseCode"
                    label="Warehouse Code"
                    value={currentWarehouse.warehouseCode}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    margin="dense"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="location"
                    label="Location"
                    value={currentWarehouse.location}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    margin="dense"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="capacity"
                    label="Capacity (units)"
                    type="number"
                    value={currentWarehouse.capacity}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    margin="dense"
                    InputProps={{
                      inputProps: { min: 0 }
                    }}
                  />
                </Grid>
                {dialogType === 'edit' && (
                  <Grid item xs={12} sm={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={currentWarehouse.isActive}
                          onChange={(e) => setCurrentWarehouse({
                            ...currentWarehouse,
                            isActive: e.target.checked
                          })}
                          color="success"
                        />
                      }
                      label={`Status: ${currentWarehouse.isActive ? 'Active' : 'Inactive'}`}
                      sx={{ mt: 2 }}
                    />
                  </Grid>
                )}
                <Grid item xs={12}>
                  <TextField
                    name="description"
                    label="Description"
                    value={currentWarehouse.description || ''}
                    onChange={handleInputChange}
                    fullWidth
                    multiline
                    rows={3}
                    margin="dense"
                  />
                </Grid>
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
        
        {/* Deactivate Warehouse Dialog */}
        {dialogType === 'deactivate' && currentWarehouse && (
          <>
            <DialogTitle>
              Deactivate Warehouse
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to deactivate warehouse <strong>{currentWarehouse.warehouseCode}</strong>? 
                This warehouse will be marked as inactive and unavailable for new inventory assignments.
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
      
      {/* Assign Employees Dialog */}
      <Dialog 
        open={openAssignDialog} 
        onClose={() => setOpenAssignDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <PersonAddIcon sx={{ mr: 1 }} />
            Assign Employees to {currentWarehouse?.warehouseCode}
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <DialogContentText sx={{ mb: 2 }}>
            Select employees to assign to this warehouse. Currently assigned: {selectedEmployees.length} employee(s).
          </DialogContentText>
          {availableEmployees.length === 0 ? (
            <Typography sx={{ py: 2, textAlign: 'center', color: 'text.secondary' }}>
              No employees available
            </Typography>
          ) : (
            <List sx={{ pt: 0 }}>
              {availableEmployees.map((employee) => (
                <MenuItem
                  key={employee.id}
                  selected={selectedEmployees.includes(employee.id)}
                  onClick={() => handleEmployeeSelection(employee.id)}
                  sx={{ 
                    mb: 1,
                    borderRadius: 1,
                    '&.Mui-selected': { bgcolor: 'primary.50' }
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                    <Typography>{employee.name}</Typography>
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ mr: 1 }}>
                        {employee.email}
                      </Typography>
                      <Chip 
                        label={employee.role.charAt(0).toUpperCase() + employee.role.slice(1)} 
                        size="small"
                        color={employee.role === 'manager' ? 'warning' : 'info'}
                        variant="outlined"
                      />
                    </Box>
                  </Box>
                </MenuItem>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAssignDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveAssignedEmployees} variant="contained" color="primary">
            Save Assignments
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Notifications */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}