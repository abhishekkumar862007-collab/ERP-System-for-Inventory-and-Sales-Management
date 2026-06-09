import React, { useState } from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Button, IconButton,
  TextField, InputAdornment, Avatar, Grid
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  PeopleAlt as PeopleIcon,
  Email as EmailIcon,
  Phone as PhoneIcon
} from '@mui/icons-material';

const initialCustomers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', phone: '+1 234 567 8901', address: '123 Business Rd, NY', gstin: '22AAAAA0000A1Z5' },
  { id: 2, name: 'Alice Smith', email: 'alice@corp.com', phone: '+1 987 654 3210', address: '456 Industrial Pkwy, CA', gstin: '33BBBBB1111B2Z6' },
  { id: 3, name: 'Robert Johnson', email: 'robert@tech.io', phone: '+1 555 012 3456', address: '789 Innovation Dr, TX', gstin: '44CCCCC2222C3Z7' },
  { id: 4, name: 'Emily Davis', email: 'emily@davis.net', phone: '+1 444 777 8888', address: '101 Pine St, WA', gstin: '55DDDDD3333D4Z8' },
  { id: 5, name: 'Michael Brown', email: 'mike@brown.com', phone: '+1 222 333 4444', address: '202 Maple Ave, FL', gstin: '66EEEEE4444E5Z9' },
];

export default function Customers() {
  const [customers, setCustomers] = useState(initialCustomers);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b' }}>
          Customers
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{ py: 1, px: 3, borderRadius: 2, fontWeight: 700, textTransform: 'none' }}
        >
          Add Customer
        </Button>
      </Box>

      <Paper sx={{ mb: 4, borderRadius: 4, overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
        <Box sx={{ p: 3 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search by name, email or phone..."
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
                <TableCell sx={{ fontWeight: 700 }}>Customer Name</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Contact Details</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Address & GSTIN</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.main', mr: 2, fontWeight: 700 }}>
                        {customer.name[0]}
                      </Avatar>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>{customer.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                        <EmailIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2">{customer.email}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <PhoneIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2">{customer.phone}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>{customer.address}</Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>GSTIN: {customer.gstin}</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" color="primary"><EditIcon fontSize="small" /></IconButton>
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
