'use client';

import { useRole } from './context/RoleContext';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar,
  Paper,
  Avatar,
  CircularProgress
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

export default function RoleSelection() {
  const { role, selectRole } = useRole();
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    if (role) {
      router.push(`/${role}`);
    }
  }, [role, router]);

  const roles = [
    { id: 'employee', title: 'Employee', description: 'View and manage stock items' },
    { id: 'manager', title: 'Warehouse Manager', description: 'Manage warehouses and inventory' },
    { id: 'admin', title: 'IMS Admin', description: 'System administration and reporting' }
  ];

  const handleLogin = async (event) => {
    event.preventDefault();
    
    if (!username || !password || !selectedRole) {
      setError('Please fill in all fields');
      setShowError(true);
      return;
    }
    
    setLoading(true);
    
    try {
      // API call to authenticate user
      const response = await fetch('http://localhost:8080/api/auth/employee/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
          role: selectedRole
        }),
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Login failed. Please check your credentials.');
      }
      
      const data = await response.json();

        // Store the JWT token in localStorage
      if (data.token) {
        localStorage.setItem('jwt', data.token);
        console.log('Token stored successfully');
      } else {
        console.warn('No token received from server');
      }
      
      selectRole(selectedRole); // Update context with role
      
      // Navigate to the appropriate dashboard
      router.push(`/${selectedRole}`);
      
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed. Please try again.');
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      bgcolor: '#bbdefb', // light blue background
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ 
          p: { xs: 2, md: 4 }, 
          borderRadius: 2, 
          bgcolor: 'background.paper',
          maxWidth: 600,
          mx: 'auto'
        }}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            mb: 3
          }}>
            <Avatar sx={{ bgcolor: 'primary.main', mb: 1 }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              Inventory Management System
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
              Login to access your System
            </Typography>
          </Box>
          
          <Box component="form" onSubmit={handleLogin} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              sx={{ mb: 2 }}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 2 }}
            />
            
            <FormControl fullWidth required sx={{ mb: 3 }}>
              <InputLabel id="role-select-label">Role</InputLabel>
              <Select
                labelId="role-select-label"
                id="role-select"
                value={selectedRole}
                label="Role"
                onChange={(e) => setSelectedRole(e.target.value)}
              >
                {roles.map(role => (
                  <MenuItem key={role.id} value={role.id}>
                    {role.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{ 
                py: 1.5,
                mt: 2, 
                mb: 3,
                fontWeight: 'bold',
                position: 'relative'
              }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" sx={{ position: 'absolute' }} /> : 'Login'}
            </Button>
            
            <Grid container>
              <Grid item>
                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                  * MidLane LLC
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Paper>
        
        {/* Error message */}
        <Snackbar 
          open={showError} 
          autoHideDuration={6000} 
          onClose={() => setShowError(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            onClose={() => setShowError(false)} 
            severity="error" 
            sx={{ width: '100%' }}
          >
            {error}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
}