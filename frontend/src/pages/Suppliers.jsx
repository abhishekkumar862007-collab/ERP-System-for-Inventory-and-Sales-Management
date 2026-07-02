import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Button, IconButton,
  TextField, InputAdornment, Avatar, Dialog, DialogTitle,
  DialogContent, DialogActions, Alert, Grid
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Email as EmailIcon,
  Phone as PhoneIcon
} from '@mui/icons-material';
import api from '../services/api';

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [gstin, setGstin] = useState('');

  const fetchSuppliers = async () => {
    try {
      const response = await api.get('/api/suppliers');
      setSuppliers(response.data);
    } catch (err) {
      console.error("Error fetching suppliers", err);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleOpen = () => {
    setError('');
    setName('');
    setEmail('');
    setPhone('');
    setAddress('');
    setGstin('');
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const payload = { name, email, phone, address, gstin };

    try {
      await api.post('/api/suppliers', payload);
      fetchSuppliers();
      handleClose();
    } catch (err) {
      setError(err.response?.data || "An error occurred saving supplier");
    } finally {
      setLoading(false);
    }
  };

  const filteredSuppliers = suppliers.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.email && s.email.toLowerCase().includes(searchTerm.toLowerCase()))
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
          onClick={handleOpen}
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
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredSuppliers.map((supplier) => (
                <TableRow key={supplier.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{ bgcolor: 'secondary.light', color: 'secondary.main', mr: 2, fontWeight: 700 }}>
                        {supplier.name[0].toUpperCase()}
                      </Avatar>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>{supplier.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                        <EmailIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2">{supplier.email || 'N/A'}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <PhoneIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2">{supplier.phone || 'N/A'}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>{supplier.address || 'N/A'}</Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>GSTIN: {supplier.gstin || 'N/A'}</Typography>
                  </TableCell>
                </TableRow>
              ))}
              {filteredSuppliers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    <Typography variant="body2" sx={{ color: 'text.secondary', py: 3 }}>No suppliers found</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Add Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Add Supplier</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Supplier Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  multiline
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="GSTIN"
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value)}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={handleClose} disabled={loading}>Cancel</Button>
            <Button type="submit" variant="contained" color="secondary" disabled={loading}>
              {loading ? "Saving..." : "Add Supplier"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}
