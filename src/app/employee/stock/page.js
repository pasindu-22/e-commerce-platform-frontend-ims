// app/employee/stock/page.js
'use client';

import { useRole } from '../../context/RoleContext';
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip
} from '@mui/material';

export default function StockPage() {
  const { role } = useRole();
  const router = useRouter();
  const [stocks, setStocks] = useState([]);

  useEffect(() => {
    if (!role || role !== 'employee') {
      router.push('/');
    } else {
      // Mock data - replace with API call when backend is ready
      fetch('http://localhost:8081/api/stock/get/all')
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to fetch stocks');
          }
          return response.json();
        })
        .then((data) => setStocks(data))
        .catch((error) => console.error('Error fetching stocks:', error));
      
      
    }
  }, [role, router]);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#bbdefb' }}>
      <AppBar position="static" sx={{ bgcolor: '#1976d2' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            IMS - Stock Management
          </Typography>
          <Button 
            component={Link} 
            href="/employee" 
            color="inherit"
            sx={{ 
              bgcolor: '#1565c0', 
              '&:hover': { 
                bgcolor: '#0d47a1' 
              }
            }}
          >
            Dashboard
          </Button>
        </Toolbar>
      </AppBar>
      
      <Container sx={{ py: 4 }}>
        <Typography 
          variant="h4" 
          component="h1" 
          sx={{ 
            mb: 3, 
            fontWeight: 'bold'
          }}
        >
          Stock Inventory
        </Typography>
        
        <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
          <Table>
            <TableHead sx={{ bgcolor: '#f5f5f5' }}>
              <TableRow>
                <TableCell>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
                    Product SKU
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
                    Quantity
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
                    Warehouse
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
                    Status
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {stocks.map((stock) => (
                <TableRow key={stock.productSku} hover>
                  <TableCell>{stock.productSku}</TableCell>
                  <TableCell>{stock.quantity}</TableCell>
                  <TableCell>{stock.warehouseCode}</TableCell>
                  <TableCell>
                    {stock.quantity <= stock.lowStockThreshold ? (
                      <Chip 
                        label="Low Stock" 
                        color="error" 
                        size="small" 
                      />
                    ) : (
                      <Chip 
                        label="In Stock" 
                        color="success" 
                        size="small" 
                      />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </Box>
  );
}