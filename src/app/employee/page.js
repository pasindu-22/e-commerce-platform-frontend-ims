// app/employee/page.js
'use client';

import { useRole } from '../context/RoleContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  Paper,
  Stack
} from '@mui/material';

export default function EmployeePage() {
  const { role, clearRole } = useRole();
  const router = useRouter();

  useEffect(() => {
    if (!role || role !== 'employee') {
      router.push('/');
    }
  }, [role, router]);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="static" sx={{ bgcolor: '#64b5f6' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            IMS - Employee Portal
          </Typography>
          <Button 
            color="inherit" 
            onClick={clearRole}
            sx={{ 
              bgcolor: '#1976d2', 
              '&:hover': { 
                bgcolor: '#1565c0' 
              }
            }}
          >
            Change Role
          </Button>
        </Toolbar>
      </AppBar>
      
      <Container sx={{ py: 4 }}>
        <Typography 
          variant="h4" 
          component="h1" 
          sx={{ 
            mb: 3, 
            fontWeight: 'bold',
            color: '#64b5f6'
          }}
        >
          Employee Dashboard
        </Typography>
        
        <Paper 
          elevation={3} 
          sx={{ 
            p: 3, 
            mb: 3
          }}
        >
          <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'medium' }}>
            Stock Management
          </Typography>
          <Typography variant="body1" paragraph>
            Manage inventory stock levels and view product information
          </Typography>
          
          <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            <Button
              component={Link}
              href="/employee/stock"
              variant="contained"
              color="primary"
            >
              View Stock Items
            </Button>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}