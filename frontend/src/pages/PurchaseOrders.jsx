import React from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Chip } from '@mui/material';
import { Add as AddIcon, Label as POIcon } from '@mui/icons-material';

const initialPOs = [
  { id: 'PO-2023-001', supplier: 'Tech Solutions Inc.', date: '2023-11-25', expected: '2023-12-05', status: 'Ordered' },
  { id: 'PO-2023-002', supplier: 'Global Logistics', date: '2023-11-26', expected: '2023-11-30', status: 'Received' },
];

export default function PurchaseOrders() {
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b' }}>
          Purchase Orders
        </Typography>
        <Button variant="contained" color="secondary" startIcon={<AddIcon />} sx={{ py: 1, px: 3, borderRadius: 2, fontWeight: 700, textTransform: 'none' }}>
          New PO
        </Button>
      </Box>

      <Paper sx={{ mb: 4, borderRadius: 4, overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: '#f8fafc' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>PO ID</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Supplier</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Order Date</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Expected Date</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {initialPOs.map((po) => (
                <TableRow key={po.id} hover>
                  <TableCell><Typography variant="body2" sx={{ fontWeight: 700, color: 'secondary.main' }}>{po.id}</Typography></TableCell>
                  <TableCell><Typography variant="body2" sx={{ fontWeight: 600 }}>{po.supplier}</Typography></TableCell>
                  <TableCell>{po.date}</TableCell>
                  <TableCell>{po.expected}</TableCell>
                  <TableCell>
                    <Chip label={po.status} size="small" color={po.status === 'Received' ? 'success' : 'info'} sx={{ fontWeight: 700 }} />
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
