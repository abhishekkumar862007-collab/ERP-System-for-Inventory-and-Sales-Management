import React, { useState } from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Button, IconButton,
  TextField, InputAdornment, Avatar
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Business as StoreIcon,
  Email as EmailIcon,
  Phone as PhoneIcon
} from '@mui/icons-material';

const initialSuppliers = [
  { id: 1, name: 'Tech Solutions Inc.', email: 'sales@techsolutions.com', phone: '+1 234 567 8901', address: '123 Tech Park, CA', gstin: '22AAAAA0000A1Z5' },
  { id: 2, name: 'Global Logistics', email: 'support@globallogistics.net', phone: '+1 987 654 3210', address: '456 Port Rd, NJ', gstin: '33BBBBB1111B2Z6' },
  { id: 3, name: 'Hardware Mart', email: 'orders@hardwaremart.io', phone: '+1 555 012 3456', address: '789 Supply Ave, TX', gstin: '44CCCCC2222C3Z7' },
];

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState(initialSuppliers);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSuppliers = suppliers.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b' }}>
          Suppliers
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{ py: 1, px: 3, borderRadius: 2, fontWeight: 700, textTransform: 'none', bgcolor: 'secondary.main', '&:hover': { bgcolor: 'secondary.dark' } }}
        >
          Add Supplier
        </Button>
      </Box>

      <Paper sx={{ mb: 4, borderRadius: 4, overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
        <Box sx={{ p: 3 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search by supplier name or email..."
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
                <TableCell sx={{ fontWeight: 700 }}>Supplier Name</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Contact Details</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Location & GSTIN</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredSuppliers.map((supplier) => (
                <TableRow key={supplier.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{ bgcolor: 'secondary.light', color: 'secondary.main', mr: 2, fontWeight: 700 }}>
                        {supplier.name[0]}
                      </Avatar>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>{supplier.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                        <EmailIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2">{supplier.email}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <PhoneIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2">{supplier.phone}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>{supplier.address}</Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>GSTIN: {supplier.gstin}</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" color="secondary"><EditIcon fontSize="small" /></IconButton>
                    <IconButton size="small" color="error"><DeleteIcon fontSize="small" /></IconButton>
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
