import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, IconButton, Chip } from '@mui/material';
import { Download as DownloadIcon, Visibility as ViewIcon, FileDownload as FileDownloadIcon, CheckCircle as PaidIcon } from '@mui/icons-material';
import api from '../services/api';
import authService from '../services/auth.service';

export default function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const currentUser = authService.getCurrentUser();

  const fetchInvoices = async () => {
    try {
      const response = await api.get('/api/invoices');
      setInvoices(response.data);
    } catch (err) {
      console.error("Error fetching invoices", err);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleDownloadPdf = async (invoiceId) => {
    try {
      const response = await api.get(`/api/invoices/${invoiceId}/pdf`, { responseType: 'blob' });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `invoice_${invoiceId}.pdf`;
      link.click();
    } catch (err) {
      console.error("Failed to download invoice PDF", err);
      alert("Failed to download PDF invoice");
    }
  };

  const handleViewPdf = async (invoiceId) => {
    try {
      const response = await api.get(`/api/invoices/${invoiceId}/pdf`, { responseType: 'blob' });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
    } catch (err) {
      console.error("Failed to view invoice PDF", err);
      alert("Failed to view PDF invoice");
    }
  };

  const handleMarkAsPaid = async (invoiceId) => {
    try {
      await api.put(`/api/invoices/${invoiceId}/status`, { status: 'PAID' });
      fetchInvoices();
    } catch (err) {
      alert(err.response?.data || "Failed to update payment status");
    }
  };

  const isFinanceUser = currentUser && ['ROLE_ADMIN', 'ROLE_ACCOUNTANT'].includes(currentUser.role);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b' }}>
          Invoices
        </Typography>
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
                <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {invoices.map((inv) => (
                <TableRow key={inv.id} hover>
                  <TableCell><Typography variant="body2" sx={{ fontWeight: 700, color: 'primary.main' }}>INV-{inv.id}</Typography></TableCell>
                  <TableCell><Typography variant="body2" sx={{ fontWeight: 600 }}>SO-{inv.salesOrder.id}</Typography></TableCell>
                  <TableCell><Typography variant="body2" sx={{ fontWeight: 600 }}>{inv.salesOrder.customer.name}</Typography></TableCell>
                  <TableCell>{inv.invoiceDate ? inv.invoiceDate.substring(0, 16).replace('T', ' ') : 'N/A'}</TableCell>
                  <TableCell><Box>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>${inv.totalPayable.toFixed(2)}</Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>Tax (18% GST): ${inv.taxAmount.toFixed(2)}</Typography>
                  </Box></TableCell>
                  <TableCell>
                    <Chip label={inv.status} size="small" color={inv.status === 'PAID' ? 'success' : 'warning'} sx={{ fontWeight: 700 }} />
                  </TableCell>
                  <TableCell align="right">
                    {inv.status === 'UNPAID' && isFinanceUser && (
                      <IconButton size="small" color="success" title="Mark as Paid" onClick={() => handleMarkAsPaid(inv.id)}>
                        <PaidIcon fontSize="small" />
                      </IconButton>
                    )}
                    <IconButton size="small" color="primary" title="View PDF" onClick={() => handleViewPdf(inv.id)}>
                      <ViewIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="primary" title="Download PDF" onClick={() => handleDownloadPdf(inv.id)}>
                      <DownloadIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {invoices.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography variant="body2" sx={{ color: 'text.secondary', py: 3 }}>No invoices found</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
