'use client';

import { useRole } from '../../context/RoleContext';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ProfileProvider } from '../../context/ProfileContext';
import { PasswordProvider } from '@/app/context/PasswordContext';
import { SecurityProvider } from '@/app/context/SecurityContext';
import PersonalInfoTab from './components/PersonalInfoTab';
import ProfileSidebar from './components/ProfileSidebar';
import PasswordTab from './components/PasswordTab';
import SecurityTab from './components/SecurityTab';

import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  Paper,
  Grid,
  Breadcrumbs,
  Tab,
  Tabs,
  Snackbar,
  Alert,
  CircularProgress,
  
} from '@mui/material';


import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import SecurityIcon from '@mui/icons-material/Security';


export default function ProfileManagementPage() {
  const { role } = useRole();
  const router = useRouter();
  
  // Tab state
  const [activeTab, setActiveTab] = useState(0);
  
  // Notification state
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  
  // Loading state
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!role || role !== 'admin') {
      router.push('/');
    } else {
      // Simulate API call to fetch profile data
      setTimeout(() => {
        setLoading(false);
      }, 800);
    }
  }, [role, router]);
  
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
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
    <ProfileProvider>
      <PasswordProvider>
      <SecurityProvider>
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <AppBar position="static" sx={{ bgcolor: '#1976d2' }}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
              IMS - Profile Management
            </Typography>
            <Button 
              component={Link}
              href="/admin"
              color="inherit"
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
            <Typography color="text.primary">Profile Management</Typography>
          </Breadcrumbs>
          
          {/* Page Header */}
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: '#1976d2', mb: 4 }}>
            Profile Management
          </Typography>
          
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
              <CircularProgress />
            </Box>
          ) : (
            <Grid container spacing={4}>
              {/* Profile Summary */}
              <Grid item xs={12} md={4}>
                <ProfileSidebar />
              </Grid>
              
              {/* Tabs Section */}
              <Grid item xs={12} md={8}>
                <Paper elevation={2} sx={{ mb: 3 }}>
                  <Tabs 
                    value={activeTab} 
                    onChange={handleTabChange}
                    variant="fullWidth"
                    indicatorColor="primary"
                    textColor="primary"
                  >
                    <Tab label="Personal Information" icon={<PersonIcon />} iconPosition="start" />
                    <Tab label="Change Password" icon={<LockIcon />} iconPosition="start" />
                    <Tab label="Security Settings" icon={<SecurityIcon />} iconPosition="start" />
                  </Tabs>
                </Paper>
                
                {/* Personal Information Tab */}
                {activeTab === 0 && (
                  <PersonalInfoTab 
                    showNotification={showNotification} 
                    setLoading={setLoading} 
                  />
                )}
                
                {/* Other tabs - you'll implement these with their respective contexts */}
                {activeTab === 1 && (
                  <PasswordTab 
                    showNotification={showNotification} 
                    setLoading={setLoading} 
                  />
                )}
                
                {activeTab === 2 && (
                  // <SecurityTab 
                  //   showNotification={showNotification} 
                  //   setLoading={setLoading} 
                  // />
                  <div>Security Tab</div>
                )}
              </Grid>
            </Grid>
          )}

          {/* Notification Snackbar */}
          <Snackbar
            open={notification.open}
            autoHideDuration={6000}
            onClose={handleCloseNotification}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <Alert 
              onClose={handleCloseNotification} 
              severity={notification.severity}
              sx={{ width: '100%' }}
            >
              {notification.message}
            </Alert>
          </Snackbar>
        </Container>
      </Box>
      </SecurityProvider>
      </PasswordProvider>
    </ProfileProvider>
  );
}