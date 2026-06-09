import React from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from '@mui/material';
import { Receipt as GRNIcon, Add as AddIcon } from '@mui/icons-material';

const initialGRNs = [
  { id: 'GRN-2023-001', poId: 'PO-2023-002', supplier: 'Global Logistics', date: '2023-11-30', items: 5, remarks: 'All items in good condition' },
];

export default function GRN() {
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b' }}>
          Goods Receipt Notes
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} sx={{ py: 1, px: 3, borderRadius: 2, fontWeight: 700, textTransform: 'none', bgcolor: '#10b981', '&:hover': { bgcolor: '#059669' } }}>
          Register GRN
        </Button>
      </Box>

      <Paper sx={{ mb: 4, borderRadius: 4, overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: '#f8fafc' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>GRN ID</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Linked PO</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Supplier</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Date Received</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Total Items</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Remarks</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {initialGRNs.map((grn) => (
                <TableRow key={grn.id} hover>
                  <TableCell><Typography variant="body2" sx={{ fontWeight: 700, color: '#059669' }}>{grn.id}</Typography></TableCell>
                  <TableCell><Typography variant="body2" sx={{ fontWeight: 700, color: 'secondary.main' }}>{grn.poId}</Typography></TableCell>
                  <TableCell><Typography variant="body2" sx={{ fontWeight: 600 }}>{grn.supplier}</Typography></TableCell>
                  <TableCell>{grn.date}</TableCell>
                  <TableCell>{grn.items}</TableCell>
                  <TableCell><Typography variant="caption" sx={{ color: 'text.secondary' }}>{grn.remarks}</Typography></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
