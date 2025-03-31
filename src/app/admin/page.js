'use client';

import { useRole } from '../context/RoleContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  Paper,
  Stack,
  Grid,
  Card,
  CardContent,
  CardActions,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Badge
} from '@mui/material';

// Import icons
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import InventoryIcon from '@mui/icons-material/Inventory';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import PersonIcon from '@mui/icons-material/Person';
import WarningIcon from '@mui/icons-material/Warning';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export default function AdminPage() {
  const { role, clearRole } = useRole();
  const router = useRouter();
  const [dashboardStats, setDashboardStats] = useState({
    employees: 0,
    activeWarehouses: 0,
    lowStockItems: 0,
    totalStockItems: 0
  });

  useEffect(() => {
    if (!role || role !== 'admin') {
      router.push('/');
    } else {
      // Fetch dashboard statistics when component mounts
      fetchDashboardStats();
    }
  }, [role, router]);

  const fetchDashboardStats = async () => {
    // In a real application, you'd fetch this data from your API
    // This is mock data for demonstration
    setDashboardStats({
      employees: 24,
      activeWarehouses: 5,
      lowStockItems: 12,
      totalStockItems: 347
    });
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="static" sx={{ bgcolor: '#1976d2' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            IMS - Admin Portal
          </Typography>
          <Button 
            color="inherit" 
            onClick={clearRole}
            sx={{ 
              bgcolor: '#0d47a1', 
              '&:hover': { 
                bgcolor: '#002171' 
              }
            }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      
      <Container sx={{ py: 4 }}>
        <Typography 
          variant="h4" 
          component="h1" 
          sx={{ 
            mb: 4, 
            fontWeight: 'bold',
            color: '#1976d2'
          }}
        >
          Admin Dashboard
        </Typography>
        
        {/* Dashboard Stats */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper 
              elevation={2} 
              sx={{ 
                p: 2,
                bgcolor: '#e3f2fd',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <PeopleOutlineIcon fontSize="large" color="primary" />
              <Typography variant="h4" sx={{ mt: 1, fontWeight: 'medium' }}>
                {dashboardStats.employees}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Total Employees
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Paper 
              elevation={2} 
              sx={{ 
                p: 2,
                bgcolor: '#e8f5e9',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <WarehouseIcon fontSize="large" sx={{ color: '#2e7d32' }} />
              <Typography variant="h4" sx={{ mt: 1, fontWeight: 'medium', color: '#2e7d32' }}>
                {dashboardStats.activeWarehouses}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Active Warehouses
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Paper 
              elevation={2} 
              sx={{ 
                p: 2,
                bgcolor: '#fff3e0',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <WarningIcon fontSize="large" color="warning" />
              <Typography variant="h4" sx={{ mt: 1, fontWeight: 'medium', color: '#ed6c02' }}>
                {dashboardStats.lowStockItems}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Low Stock Alerts
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Paper 
              elevation={2} 
              sx={{ 
                p: 2,
                bgcolor: '#f5f5f5',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <InventoryIcon fontSize="large" sx={{ color: '#455a64' }} />
              <Typography variant="h4" sx={{ mt: 1, fontWeight: 'medium', color: '#455a64' }}>
                {dashboardStats.totalStockItems}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Total Stock Items
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Management Sections */}
        <Grid container spacing={3}>
          {/* Employee Management */}
          <Grid item xs={12} md={6}>
            <Card elevation={2}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PeopleOutlineIcon sx={{ mr: 1.5, color: 'primary.main' }} fontSize="large" />
                  <Typography variant="h5" component="h2" sx={{ fontWeight: 'medium' }}>
                    Employee Management
                  </Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                <List dense>
                  <ListItem>
                    <ListItemIcon sx={{ minWidth: '36px' }}>
                      <Badge badgeContent={dashboardStats.employees} color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Manage Employees" 
                      secondary="View, create, update, and deactivate employees" 
                    />
                  </ListItem>
                </List>
              </CardContent>
              <CardActions sx={{ justifyContent: 'flex-end', p: 2, pt: 0 }}>
                <Button 
                  component={Link}
                  href="/admin/employees"
                  endIcon={<ArrowForwardIcon />}
                  color="primary"
                >
                  Manage Employees
                </Button>
              </CardActions>
            </Card>
          </Grid>
          
          {/* Stock Management */}
          <Grid item xs={12} md={6}>
            <Card elevation={2}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <InventoryIcon sx={{ mr: 1.5, color: 'primary.main' }} fontSize="large" />
                  <Typography variant="h5" component="h2" sx={{ fontWeight: 'medium' }}>
                    Stock Management
                  </Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                <List dense>
                  <ListItem>
                    <ListItemIcon sx={{ minWidth: '36px' }}>
                      <Badge badgeContent={dashboardStats.lowStockItems} color="error" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Stock Overview" 
                      secondary="View centralized stock for all warehouses with alerts" 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Transfer Stock" 
                      secondary="Move inventory between warehouses" 
                    />
                  </ListItem>
                </List>
              </CardContent>
              <CardActions sx={{ justifyContent: 'flex-end', p: 2, pt: 0 }}>
                <Button 
                  component={Link}
                  href="/admin/stock"
                  endIcon={<ArrowForwardIcon />}
                  color="primary"
                >
                  Manage Stock
                </Button>
              </CardActions>
            </Card>
          </Grid>
          
          {/* Warehouse Management */}
          <Grid item xs={12} md={6}>
            <Card elevation={2}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <WarehouseIcon sx={{ mr: 1.5, color: 'primary.main' }} fontSize="large" />
                  <Typography variant="h5" component="h2" sx={{ fontWeight: 'medium' }}>
                    Warehouse Management
                  </Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                <List dense>
                  <ListItem>
                    <ListItemIcon sx={{ minWidth: '36px' }}>
                      <Badge badgeContent={dashboardStats.activeWarehouses} color="success" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Manage Warehouses" 
                      secondary="Add, update, and remove warehouses" 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Assign Employees" 
                      secondary="Assign employees to specific warehouses" 
                    />
                  </ListItem>
                </List>
              </CardContent>
              <CardActions sx={{ justifyContent: 'flex-end', p: 2, pt: 0 }}>
                <Button 
                  component={Link}
                  href="/admin/warehouses"
                  endIcon={<ArrowForwardIcon />}
                  color="primary"
                >
                  Manage Warehouses
                </Button>
              </CardActions>
            </Card>
          </Grid>
          
          {/* Profile Management */}
          <Grid item xs={12} md={6}>
            <Card elevation={2}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PersonIcon sx={{ mr: 1.5, color: 'primary.main' }} fontSize="large" />
                  <Typography variant="h5" component="h2" sx={{ fontWeight: 'medium' }}>
                    Profile Management
                  </Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                <List dense>
                  <ListItem>
                    <ListItemText 
                      primary="Update Profile" 
                      secondary="Manage your personal information" 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Security Settings" 
                      secondary="Update password and security preferences" 
                    />
                  </ListItem>
                </List>
              </CardContent>
              <CardActions sx={{ justifyContent: 'flex-end', p: 2, pt: 0 }}>
                <Button 
                  component={Link}
                  href="/admin/profile"
                  endIcon={<ArrowForwardIcon />}
                  color="primary"
                >
                  Manage Profile
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}