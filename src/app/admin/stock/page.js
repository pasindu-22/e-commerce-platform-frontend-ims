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
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Grid,
  TablePagination,
  Tooltip,
  CircularProgress,
  Breadcrumbs,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  Badge,
  Menu,
  Autocomplete
} from '@mui/material';

// Icons
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import InventoryIcon from '@mui/icons-material/Inventory';
import WarningIcon from '@mui/icons-material/Warning';
import RefreshIcon from '@mui/icons-material/Refresh';
import VisibilityIcon from '@mui/icons-material/Visibility';
import TransferWithinAStationIcon from '@mui/icons-material/TransferWithinAStation';
import FilterListIcon from '@mui/icons-material/FilterList';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import DateRangeIcon from '@mui/icons-material/DateRange';

export default function StockManagementPage() {
  const { role } = useRole();
  const router = useRouter();
  
  // States for stock data
  const [stockItems, setStockItems] = useState([]);
  const [filteredStock, setFilteredStock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [warehouseFilter, setWarehouseFilter] = useState('');
  const [alertFilter, setAlertFilter] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // States for warehouses (for filters and transfers)
  const [warehouses, setWarehouses] = useState([]);
  
  // States for stock creation/editing
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState(''); // 'create', 'edit', 'view', 'transfer'
  const [currentStock, setCurrentStock] = useState({
    id: '',
    sku: '',
    name: '',
    description: '',
    category: '',
    quantity: 0,
    minQuantity: 10,
    maxQuantity: 100,
    warehouseId: '',
    expiryDate: '',
    lastUpdated: new Date().toISOString().split('T')[0]
  });
  
  // States for transfer
  const [transferData, setTransferData] = useState({
    fromWarehouse: '',
    toWarehouse: '',
    quantity: 0,
    transferDate: new Date().toISOString().split('T')[0]
  });
  
  // States for notification
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  
  // States for filters menu
  const [anchorEl, setAnchorEl] = useState(null);
  const openFiltersMenu = Boolean(anchorEl);

  useEffect(() => {
    if (!role || role !== 'admin') {
      router.push('/');
    } else {
      fetchStockItems();
      fetchWarehouses();
    }
  }, [role, router]);

  useEffect(() => {
    // Apply filters to the stock list
    if (stockItems.length > 0) {
      let filtered = [...stockItems];
      
      // Filter by search term
      if (searchTerm) {
        filtered = filtered.filter(item => 
          item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      }
      
      // Filter by status
      if (statusFilter) {
        filtered = filtered.filter(item => 
          (statusFilter === 'active' && item.quantity > 0) || 
          (statusFilter === 'outofstock' && item.quantity <= 0)
        );
      }
      
      // Filter by warehouse
      if (warehouseFilter) {
        filtered = filtered.filter(item => item.warehouseId === warehouseFilter);
      }
      
      // Filter by alerts
      if (alertFilter) {
        filtered = filtered.filter(item => {
          if (alertFilter === 'low') return item.quantity < item.minQuantity;
          if (alertFilter === 'over') return item.quantity > item.maxQuantity;
          if (alertFilter === 'expiring') {
            if (!item.expiryDate) return false;
            const expiryDate = new Date(item.expiryDate);
            const today = new Date();
            const diffTime = expiryDate - today;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays <= 30 && diffDays >= 0;
          }
          return false;
        });
      }
      
      setFilteredStock(filtered);
    }
  }, [stockItems, searchTerm, statusFilter, warehouseFilter, alertFilter]);

  const fetchStockItems = async () => {
    setLoading(true);
    try {
      // Mock data - in production, replace with API call
      const mockData = [
        { 
          id: '1', 
          sku: 'SKU001', 
          name: 'Tikiri Mari', 
          description: 'Milk flavor', 
          category: 'Biscuits',
          quantity: 15,
          minQuantity: 20,
          maxQuantity: 100,
          warehouseId: '1',
          expiryDate: '2025-12-31',
          lastUpdated: '2025-03-15'
        },
        { 
          id: '2', 
          sku: 'SKU002', 
          name: 'Samba rice', 
          description: 'Long grain rice', 
          category: 'Grains',
          quantity: 120,
          minQuantity: 50,
          maxQuantity: 100,
          warehouseId: '2',
          expiryDate: '2025-06-30',
          lastUpdated: '2025-03-10'
        },
        { 
          id: '3', 
          sku: 'SKU003', 
          name: 'Chicken', 
          description: 'Fresh chicken', 
          category: 'Meat',
          quantity: 5,
          minQuantity: 10,
          maxQuantity: 50,
          warehouseId: '1',
          expiryDate: '2025-09-15',
          lastUpdated: '2025-03-12'
        },
        { 
          id: '4', 
          sku: 'SKU004', 
          name: 'Soap', 
          description: 'Cleansing soap', 
          category: 'Household',
          quantity: 0,
          minQuantity: 5,
          maxQuantity: 25,
          warehouseId: '3',
          expiryDate: '2025-05-01',
          lastUpdated: '2023-06-01'
        },
        { 
          id: '5', 
          sku: 'SKU005', 
          name: 'Banana', 
          description: 'Fresh bananas', 
          category: 'Fruits',
          quantity: 75,
          minQuantity: 20,
          maxQuantity: 80,
          warehouseId: '2',
          expiryDate: '2025-02-20',
          lastUpdated: '2025-03-14'
        }
      ];
      
      // Simulate API delay
      setTimeout(() => {
        setStockItems(mockData);
        setFilteredStock(mockData);
        setLoading(false);
      }, 800);
    } catch (err) {
      console.error('Error fetching stock items:', err);
      showNotification('Failed to load stock items', 'error');
      setLoading(false);
    }
  };

  const fetchWarehouses = async () => {
    try {
      // Mock data - in production, replace with API call
      const mockWarehouses = [
        { id: '1', warehouseCode: 'WH001', location: 'Colombo-01' },
        { id: '2', warehouseCode: 'WH002', location: 'Galle' },
        { id: '3', warehouseCode: 'WH003', location: 'Matara' },
        { id: '4', warehouseCode: 'WH004', location: 'Jaffna' },
        { id: '5', warehouseCode: 'WH005', location: 'Kandy' }
      ];
      
      setWarehouses(mockWarehouses);
    } catch (err) {
      console.error('Error fetching warehouses:', err);
    }
  };

  const handleOpenDialog = (type, stockItem = null) => {
    setDialogType(type);
    
    if (type === 'create') {
      setCurrentStock({
        id: '',
        sku: '',
        name: '',
        description: '',
        category: '',
        quantity: 0,
        minQuantity: 10,
        maxQuantity: 100,
        warehouseId: warehouses[0]?.id || '',
        expiryDate: '',
        lastUpdated: new Date().toISOString().split('T')[0]
      });
    } else if (type === 'transfer') {
      setTransferData({
        fromWarehouse: stockItem?.warehouseId || '',
        toWarehouse: '',
        quantity: 0,
        transferDate: new Date().toISOString().split('T')[0]
      });
      setCurrentStock(stockItem || {
        id: '',
        sku: '',
        name: '',
        quantity: 0,
        warehouseId: ''
      });
    } else if (stockItem) {
      setCurrentStock({ ...stockItem });
    }
    
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentStock({
      id: '',
      sku: '',
      name: '',
      description: '',
      category: '',
      quantity: 0,
      minQuantity: 10,
      maxQuantity: 100,
      warehouseId: '',
      expiryDate: '',
      lastUpdated: new Date().toISOString().split('T')[0]
    });
  };

  const handleStockInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCurrentStock({
      ...currentStock,
      [name]: type === 'checkbox' ? checked : name.endsWith('Quantity') || name === 'quantity' ? Number(value) : value
    });
  };

  const handleTransferInputChange = (e) => {
    const { name, value } = e.target;
    setTransferData({
      ...transferData,
      [name]: name === 'quantity' ? Number(value) : value
    });
  };

  const handleSubmit = async () => {
    // Validate form data for create and edit operations
    if (dialogType === 'create' || dialogType === 'edit') {
      if (!currentStock.sku || !currentStock.name || !currentStock.warehouseId) {
        showNotification('Please fill in all required fields', 'error');
        return;
      }
    }
    
    // Validate transfer operation
    if (dialogType === 'transfer') {
      if (!transferData.fromWarehouse || !transferData.toWarehouse || transferData.quantity <= 0) {
        showNotification('Please fill in all transfer details', 'error');
        return;
      }
      if (transferData.fromWarehouse === transferData.toWarehouse) {
        showNotification('Cannot transfer to the same warehouse', 'error');
        return;
      }
      if (transferData.quantity > currentStock.quantity) {
        showNotification('Transfer quantity cannot exceed available stock', 'error');
        return;
      }
    }
    
    try {
      if (dialogType === 'create') {
        // Mock adding a new stock item
        const newStockItem = {
          ...currentStock,
          id: (stockItems.length + 1).toString(),
          lastUpdated: new Date().toISOString().split('T')[0]
        };
        
        setStockItems([...stockItems, newStockItem]);
        showNotification('Stock item created successfully', 'success');
      } 
      else if (dialogType === 'edit') {
        // Mock updating a stock item
        const updatedStockItems = stockItems.map(item =>
          item.id === currentStock.id ? { ...currentStock, lastUpdated: new Date().toISOString().split('T')[0] } : item
        );
        
        setStockItems(updatedStockItems);
        showNotification('Stock item updated successfully', 'success');
      }
      else if (dialogType === 'transfer') {
        // Mock transferring stock
        const updatedStockItems = stockItems.map(item => {
          if (item.id === currentStock.id) {
            // Reduce quantity in source warehouse
            if (item.warehouseId === transferData.fromWarehouse) {
              return { ...item, quantity: item.quantity - transferData.quantity };
            }
            // Increase quantity in destination warehouse if item exists there
            if (item.warehouseId === transferData.toWarehouse && item.sku === currentStock.sku) {
              return { ...item, quantity: item.quantity + transferData.quantity };
            }
          }
          return item;
        });
        
        // If item doesn't exist in destination warehouse, add it
        const existsInDestination = stockItems.some(
          item => item.warehouseId === transferData.toWarehouse && item.sku === currentStock.sku
        );
        
        if (!existsInDestination) {
          const newStockItem = {
            ...currentStock,
            id: (stockItems.length + 1).toString(),
            warehouseId: transferData.toWarehouse,
            quantity: transferData.quantity,
            lastUpdated: new Date().toISOString().split('T')[0]
          };
          updatedStockItems.push(newStockItem);
        }
        
        setStockItems(updatedStockItems);
        showNotification('Stock transferred successfully', 'success');
      }
      
      handleCloseDialog();
    } catch (err) {
      console.error('Error:', err);
      showNotification(err.message || 'An error occurred', 'error');
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

  const handleWarehouseFilterChange = (event) => {
    setWarehouseFilter(event.target.value);
    setPage(0);
  };

  const handleAlertFilterChange = (event) => {
    setAlertFilter(event.target.value);
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFiltersMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFiltersMenuClose = () => {
    setAnchorEl(null);
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

  const getStockStatus = (item) => {
    if (item.quantity <= 0) {
      return { text: 'Out of Stock', color: 'error', icon: <ErrorIcon /> };
    }
    if (item.quantity < item.minQuantity) {
      return { text: 'Low Stock', color: 'warning', icon: <WarningIcon /> };
    }
    if (item.quantity > item.maxQuantity) {
      return { text: 'Overstock', color: 'info', icon: <InfoIcon /> };
    }
    if (item.expiryDate) {
      const expiryDate = new Date(item.expiryDate);
      const today = new Date();
      const diffTime = expiryDate - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays <= 30 && diffDays >= 0) {
        return { text: `Expiring in ${diffDays} days`, color: 'warning', icon: <WarningIcon /> };
      }
      if (diffDays < 0) {
        return { text: 'Expired', color: 'error', icon: <ErrorIcon /> };
      }
    }
    return { text: 'In Stock', color: 'success', icon: <CheckCircleIcon /> };
  };

  const getWarehouseName = (id) => {
    const warehouse = warehouses.find(w => w.id === id);
    return warehouse ? `${warehouse.warehouseCode} (${warehouse.location})` : 'Unknown Warehouse';
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="static" sx={{ bgcolor: '#1976d2' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            IMS - Stock Management
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
          <Typography color="text.primary">Stock Management</Typography>
        </Breadcrumbs>
        
        {/* Page Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
            Stock Management
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog('create')}
          >
            Add Stock Item
          </Button>
        </Box>
        
        {/* Filter & Search Section */}
        <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search stock items..."
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
            <Grid item xs={12} sm={4} md={2}>
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
                  <MenuItem value="active">In Stock</MenuItem>
                  <MenuItem value="outofstock">Out of Stock</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel id="warehouse-filter-label">Warehouse</InputLabel>
                <Select
                  labelId="warehouse-filter-label"
                  id="warehouse-filter"
                  value={warehouseFilter}
                  label="Warehouse"
                  onChange={handleWarehouseFilterChange}
                >
                  <MenuItem value="">All Warehouses</MenuItem>
                  {warehouses.map(warehouse => (
                    <MenuItem key={warehouse.id} value={warehouse.id}>
                      {warehouse.warehouseCode}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4} md={2}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  startIcon={<RefreshIcon />}
                  onClick={fetchStockItems}
                >
                  Refresh
                </Button>
                <IconButton
                  aria-label="more filters"
                  aria-controls={openFiltersMenu ? 'filters-menu' : undefined}
                  aria-expanded={openFiltersMenu ? 'true' : undefined}
                  aria-haspopup="true"
                  onClick={handleFiltersMenuClick}
                >
                  <FilterListIcon />
                </IconButton>
                <Menu
                  id="filters-menu"
                  anchorEl={anchorEl}
                  open={openFiltersMenu}
                  onClose={handleFiltersMenuClose}
                  MenuListProps={{
                    'aria-labelledby': 'more-filters-button',
                  }}
                >
                  <MenuItem disabled>Alerts</MenuItem>
                  <MenuItem 
                    selected={alertFilter === 'low'}
                    onClick={() => {
                      setAlertFilter(alertFilter === 'low' ? '' : 'low');
                      handleFiltersMenuClose();
                    }}
                  >
                    Low Stock
                  </MenuItem>
                  <MenuItem 
                    selected={alertFilter === 'over'}
                    onClick={() => {
                      setAlertFilter(alertFilter === 'over' ? '' : 'over');
                      handleFiltersMenuClose();
                    }}
                  >
                    Overstock
                  </MenuItem>
                  <MenuItem 
                    selected={alertFilter === 'expiring'}
                    onClick={() => {
                      setAlertFilter(alertFilter === 'expiring' ? '' : 'expiring');
                      handleFiltersMenuClose();
                    }}
                  >
                    Expiring Soon
                  </MenuItem>
                </Menu>
              </Box>
            </Grid>
          </Grid>
        </Paper>
        
        {/* Stock Items Table */}
        <Paper elevation={2} sx={{ width: '100%', mb: 3, overflow: 'hidden' }}>
          <TableContainer sx={{ maxHeight: 'calc(100vh - 300px)' }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>SKU</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Item Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Category</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }} align="center">Quantity</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }} align="center">Status</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Warehouse</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Expiry Date</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }} align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                      <CircularProgress />
                      <Typography variant="body2" sx={{ mt: 1 }}>Loading stock items...</Typography>
                    </TableCell>
                  </TableRow>
                ) : filteredStock.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                      <Typography variant="body1">No stock items found</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredStock
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((item) => {
                      const status = getStockStatus(item);
                      return (
                        <TableRow key={item.id} hover>
                          <TableCell>{item.sku}</TableCell>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.category}</TableCell>
                          <TableCell align="center">
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Typography sx={{ minWidth: 40 }}>
                                {item.quantity.toLocaleString()}
                              </Typography>
                              {item.quantity > 0 && (
                                <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                                  (min: {item.minQuantity}, max: {item.maxQuantity})
                                </Typography>
                              )}
                            </Box>
                          </TableCell>
                          <TableCell align="center">
                            <Chip 
                              icon={status.icon}
                              label={status.text}
                              color={status.color}
                              size="small"
                              variant="outlined"
                              sx={{ 
                                '& .MuiChip-icon': { 
                                  color: `${status.color}.main`,
                                  fontSize: '1rem',
                                  ml: 0.5
                                }
                              }}
                            />
                          </TableCell>
                          <TableCell>{getWarehouseName(item.warehouseId)}</TableCell>
                          <TableCell>
                            {item.expiryDate ? (
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <DateRangeIcon color="action" sx={{ mr: 0.5, fontSize: '1rem' }} />
                                {new Date(item.expiryDate).toLocaleDateString()}
                              </Box>
                            ) : 'N/A'}
                          </TableCell>
                          <TableCell align="right">
                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                              <Tooltip title="View Details">
                                <IconButton 
                                  size="small" 
                                  color="info"
                                  onClick={() => handleOpenDialog('view', item)}
                                >
                                  <VisibilityIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Edit Item">
                                <IconButton 
                                  size="small" 
                                  color="primary"
                                  onClick={() => handleOpenDialog('edit', item)}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Transfer Stock">
                                <IconButton 
                                  size="small" 
                                  color="secondary"
                                  onClick={() => handleOpenDialog('transfer', item)}
                                  disabled={item.quantity <= 0}
                                >
                                  <TransferWithinAStationIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                        </TableRow>
                      );
                    })
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredStock.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
        
        {/* Stock Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={2}>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary">
                  Total Stock Items
                </Typography>
                <Typography variant="h4">
                  {stockItems.length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={2}>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary">
                  Low Stock Items
                </Typography>
                <Typography variant="h4" color="warning.main">
                  {stockItems.filter(item => item.quantity > 0 && item.quantity < item.minQuantity).length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={2}>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary">
                  Overstock Items
                </Typography>
                <Typography variant="h4" color="info.main">
                  {stockItems.filter(item => item.quantity > item.maxQuantity).length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={2}>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary">
                  Expiring Soon
                </Typography>
                <Typography variant="h4" color="error.main">
                  {stockItems.filter(item => {
                    if (!item.expiryDate) return false;
                    const expiryDate = new Date(item.expiryDate);
                    const today = new Date();
                    const diffTime = expiryDate - today;
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    return diffDays <= 30 && diffDays >= 0;
                  }).length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
      
      {/* Dialogs for Create, Edit, View, Transfer */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth={dialogType === 'view'}>
        {/* View Stock Item Dialog */}
        {dialogType === 'view' && currentStock && (
          <>
            <DialogTitle sx={{ pb: 0 }}>
              <Typography variant="h6" component="div" fontWeight="bold">
                Stock Item Details
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
                            bgcolor: currentStock.quantity > 0 ? 'primary.main' : 'text.disabled' 
                          }}
                        >
                          <InventoryIcon fontSize="large" />
                        </Avatar>
                        <Typography variant="h6" align="center">
                          {currentStock.sku}
                        </Typography>
                        <Typography variant="body1" align="center">
                          {currentStock.name}
                        </Typography>
                        <Box sx={{ mt: 2 }}>
                          {getStockStatus(currentStock).icon}
                          <Typography variant="body2" color="text.secondary" align="center">
                            {getStockStatus(currentStock).text}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={8}>
                  <Card variant="outlined" sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Stock Information
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2" color="text.secondary">Category</Typography>
                          <Typography variant="body1">{currentStock.category || 'N/A'}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2" color="text.secondary">Current Quantity</Typography>
                          <Typography variant="body1">{currentStock.quantity.toLocaleString()}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2" color="text.secondary">Min Quantity</Typography>
                          <Typography variant="body1">{currentStock.minQuantity.toLocaleString()}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2" color="text.secondary">Max Quantity</Typography>
                          <Typography variant="body1">{currentStock.maxQuantity.toLocaleString()}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2" color="text.secondary">Warehouse</Typography>
                          <Typography variant="body1">{getWarehouseName(currentStock.warehouseId)}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2" color="text.secondary">Expiry Date</Typography>
                          <Typography variant="body1">
                            {currentStock.expiryDate ? new Date(currentStock.expiryDate).toLocaleDateString() : 'N/A'}
                          </Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="body2" color="text.secondary">Description</Typography>
                          <Typography variant="body1">
                            {currentStock.description || 'No description provided'}
                          </Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="body2" color="text.secondary">Last Updated</Typography>
                          <Typography variant="body1">
                            {new Date(currentStock.lastUpdated).toLocaleDateString()}
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
                  handleOpenDialog('edit', currentStock);
                }}
                color="primary"
              >
                Edit Details
              </Button>
            </DialogActions>
          </>
        )}
        
        {/* Create/Edit Stock Item Dialog */}
        {(dialogType === 'create' || dialogType === 'edit') && (
          <>
            <DialogTitle>
              {dialogType === 'create' ? 'Add New Stock Item' : 'Edit Stock Item'}
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={2} sx={{ mt: 0 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="sku"
                    label="SKU"
                    value={currentStock.sku}
                    onChange={handleStockInputChange}
                    fullWidth
                    required
                    margin="dense"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="name"
                    label="Item Name"
                    value={currentStock.name}
                    onChange={handleStockInputChange}
                    fullWidth
                    required
                    margin="dense"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="category"
                    label="Category"
                    value={currentStock.category}
                    onChange={handleStockInputChange}
                    fullWidth
                    margin="dense"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth margin="dense" required>
                    <InputLabel id="warehouse-label">Warehouse</InputLabel>
                    <Select
                      labelId="warehouse-label"
                      id="warehouse"
                      name="warehouseId"
                      value={currentStock.warehouseId}
                      onChange={handleStockInputChange}
                      label="Warehouse"
                    >
                      {warehouses.map(warehouse => (
                        <MenuItem key={warehouse.id} value={warehouse.id}>
                          {warehouse.warehouseCode} ({warehouse.location})
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    name="quantity"
                    label="Quantity"
                    type="number"
                    value={currentStock.quantity}
                    onChange={handleStockInputChange}
                    fullWidth
                    required
                    margin="dense"
                    InputProps={{
                      inputProps: { min: 0 }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    name="maxQuantity"
                    label="Max Quantity"
                    type="number"
                    value={currentStock.maxQuantity}
                    onChange={handleStockInputChange}
                    fullWidth
                    required
                    margin="dense"
                    InputProps={{
                      inputProps: { min: 0 }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="expiryDate"
                    label="Expiry Date"
                    type="date"
                    value={currentStock.expiryDate || ''}
                    onChange={handleStockInputChange}
                    fullWidth
                    margin="dense"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="description"
                    label="Description"
                    value={currentStock.description || ''}
                    onChange={handleStockInputChange}
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
        
        {/* Transfer Stock Dialog */}
        {dialogType === 'transfer' && currentStock && (
          <>
            <DialogTitle>
              Transfer Stock
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12}>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    Transferring: <strong>{currentStock.name}</strong> (SKU: {currentStock.sku})
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth margin="dense" required>
                    <InputLabel id="from-warehouse-label">From Warehouse</InputLabel>
                    <Select
                      labelId="from-warehouse-label"
                      id="from-warehouse"
                      name="fromWarehouse"
                      value={transferData.fromWarehouse}
                      onChange={handleTransferInputChange}
                      label="From Warehouse"
                    >
                      {warehouses.map(warehouse => (
                        <MenuItem key={warehouse.id} value={warehouse.id}>
                          {warehouse.warehouseCode} ({warehouse.location})
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth margin="dense" required>
                    <InputLabel id="to-warehouse-label">To Warehouse</InputLabel>
                    <Select
                      labelId="to-warehouse-label"
                      id="to-warehouse"
                      name="toWarehouse"
                      value={transferData.toWarehouse}
                      onChange={handleTransferInputChange}
                      label="To Warehouse"
                    >
                      {warehouses
                        .filter(warehouse => warehouse.id !== transferData.fromWarehouse)
                        .map(warehouse => (
                          <MenuItem key={warehouse.id} value={warehouse.id}>
                            {warehouse.warehouseCode} ({warehouse.location})
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="quantity"
                    label="Quantity to Transfer"
                    type="number"
                    value={transferData.quantity}
                    onChange={handleTransferInputChange}
                    fullWidth
                    required
                    margin="dense"
                    InputProps={{
                      inputProps: { 
                        min: 1,
                        max: currentStock.quantity
                      }
                    }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    Available: {currentStock.quantity}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="transferDate"
                    label="Transfer Date"
                    type="date"
                    value={transferData.transferDate}
                    onChange={handleTransferInputChange}
                    fullWidth
                    margin="dense"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Cancel</Button>
              <Button onClick={handleSubmit} color="primary" variant="contained">
                Confirm Transfer
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
      
      {/* Notification Snackbar */}
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