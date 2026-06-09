import React from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, IconButton, Chip } from '@mui/material';
import { Download as DownloadIcon, Visibility as ViewIcon, FileDownload as FileDownloadIcon } from '@mui/icons-material';

const initialInvoices = [
  { id: 'INV-2023-001', orderId: 'SO-2023-002', customer: 'Alice Smith', date: '2023-11-21', total: 1260.00, tax: 60.00, status: 'Paid' },
  { id: 'INV-2023-002', orderId: 'SO-2023-003', customer: 'Robert Johnson', date: '2023-11-22', total: 893.02, tax: 42.52, status: 'Pending' },
];

export default function Invoices() {
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b' }}>
          Invoices
        </Typography>
        <Button variant="contained" startIcon={<FileDownloadIcon />} sx={{ py: 1, px: 3, borderRadius: 2, fontWeight: 700, textTransform: 'none' }}>
          Bulk Download
        </Button>
      </Box>

      <Paper sx={{ mb: 4, borderRadius: 4, overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: '#f8fafc' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Invoice ID</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Related Order</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Customer Name</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Date Issued</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Total Payable</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>PDF Ops</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {initialInvoices.map((inv) => (
                <TableRow key={inv.id} hover>
                  <TableCell><Typography variant="body2" sx={{ fontWeight: 700, color: 'primary.main' }}>{inv.id}</Typography></TableCell>
                  <TableCell><Typography variant="body2" sx={{ fontWeight: 600 }}>{inv.orderId}</Typography></TableCell>
                  <TableCell><Typography variant="body2" sx={{ fontWeight: 600 }}>{inv.customer}</Typography></TableCell>
                  <TableCell>{inv.date}</TableCell>
                  <TableCell><Box>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>${inv.total.toFixed(2)}</Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>Tax: ${inv.tax.toFixed(2)}</Typography>
                  </Box></TableCell>
                  <TableCell>
                    <Chip label={inv.status} size="small" color={inv.status === 'Paid' ? 'success' : 'warning'} sx={{ fontWeight: 700 }} />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" color="primary"><ViewIcon fontSize="small" /></IconButton>
                    <IconButton size="small" color="primary"><DownloadIcon fontSize="small" /></IconButton>
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
