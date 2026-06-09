import React, { useState } from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Button, Chip,
  TextField, InputAdornment, IconButton
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Visibility as ViewIcon,
  LocalShipping as ShippingIcon,
  CheckCircle as ApprovedIcon,
  Pending as PendingIcon
} from '@mui/icons-material';

const initialOrders = [
  { id: 'SO-2023-001', customer: 'John Doe', date: '2023-11-20', amount: 450.00, status: 'Pending' },
  { id: 'SO-2023-002', customer: 'Alice Smith', date: '2023-11-21', amount: 1200.00, status: 'Approved' },
  { id: 'SO-2023-003', customer: 'Robert Johnson', date: '2023-11-22', amount: 850.50, status: 'Dispatched' },
];

const getStatusColor = (status) => {
  switch (status) {
    case 'Pending': return 'warning';
    case 'Approved': return 'success';
    case 'Dispatched': return 'info';
    default: return 'default';
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case 'Pending': return <PendingIcon sx={{ fontSize: 16 }} />;
    case 'Approved': return <ApprovedIcon sx={{ fontSize: 16 }} />;
    case 'Dispatched': return <ShippingIcon sx={{ fontSize: 16 }} />;
    default: return null;
  }
};

export default function SalesOrders() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b' }}>
          Sales Orders
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{ py: 1, px: 3, borderRadius: 2, fontWeight: 700, textTransform: 'none' }}
        >
          Create Order
        </Button>
      </Box>

      <Paper sx={{ mb: 4, borderRadius: 4, overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
        <Box sx={{ p: 3 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search by order ID or customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <TableContainer>
          <Table sx={{ minWidth: 650 }}>
            <TableHead sx={{ bgcolor: '#f8fafc' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Order ID</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Customer</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Order Date</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Total Amount</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {initialOrders.map((order) => (
                <TableRow key={order.id} hover>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: 'primary.main' }}>{order.id}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{order.customer}</Typography>
                  </TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>${order.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <Chip
                      icon={getStatusIcon(order.status)}
                      label={order.status}
                      size="small"
                      color={getStatusColor(order.status)}
                      sx={{ fontWeight: 700, px: 1 }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" color="primary"><ViewIcon fontSize="small" /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
