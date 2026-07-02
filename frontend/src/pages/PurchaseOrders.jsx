import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Button, Chip,
  TextField, InputAdornment, IconButton, Dialog, DialogTitle,
  DialogContent, DialogActions, Alert, MenuItem, Select, FormControl, InputLabel, Grid,
  Table as SubTable, TableHead as SubTableHead, TableRow as SubTableRow, TableCell as SubTableCell, TableBody as SubTableBody
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Visibility as ViewIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import api from '../services/api';

export default function PurchaseOrders() {
  const [orders, setOrders] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Dialog states
  const [openCreate, setOpenCreate] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Form states
  const [supplierId, setSupplierId] = useState('');
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState('');
  const [orderItems, setOrderItems] = useState([{ productId: '', quantity: 1 }]);

  const fetchData = async () => {
    try {
      const [ordersRes, supRes, prodRes] = await Promise.all([
        api.get('/api/purchase-orders'),
        api.get('/api/suppliers'),
        api.get('/api/products')
      ]);
      setOrders(ordersRes.data);
      setSuppliers(supRes.data);
      setProducts(prodRes.data);
    } catch (err) {
      console.error("Error loading purchase orders data", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenCreate = () => {
    setError('');
    setSupplierId('');
    setExpectedDeliveryDate('');
    setOrderItems([{ productId: '', quantity: 1 }]);
    setOpenCreate(true);
  };

  const handleAddItem = () => {
    setOrderItems([...orderItems, { productId: '', quantity: 1 }]);
  };

  const handleRemoveItem = (index) => {
    const list = [...orderItems];
    list.splice(index, 1);
    setOrderItems(list);
  };

  const handleItemChange = (index, field, value) => {
    const list = [...orderItems];
    list[index][field] = value;
    setOrderItems(list);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!expectedDeliveryDate) {
      setError('Please choose expected delivery date');
      return;
    }
    if (orderItems.some(i => !i.productId || i.quantity <= 0)) {
      setError('Please select valid products and positive quantities');
      return;
    }

    setLoading(true);
    const payload = {
      supplierId,
      expectedDeliveryDate,
      items: orderItems.map(i => ({ productId: i.productId, quantity: parseInt(i.quantity) }))
    };

    try {
      await api.post('/api/purchase-orders', payload);
      fetchData();
      setOpenCreate(false);
    } catch (err) {
      setError(err.response?.data || "An error occurred creating purchase order");
    } finally {
      setLoading(false);
    }
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setOpenView(true);
  };

  const filteredOrders = orders.filter(o =>
    o.id.toString().includes(searchTerm) ||
    o.supplier.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b' }}>
          Purchase Orders
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          startIcon={<AddIcon />}
          onClick={handleOpenCreate}
          sx={{ py: 1, px: 3, borderRadius: 2, fontWeight: 700, textTransform: 'none' }}
        >
          New PO
        </Button>
      </Box>

      <Paper sx={{ mb: 4, borderRadius: 4, overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
        <Box sx={{ p: 3 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search by PO ID or supplier name..."
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
                <TableCell sx={{ fontWeight: 700 }}>PO ID</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Supplier</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Order Date</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Expected Date</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrders.map((po) => (
                <TableRow key={po.id} hover>
                  <TableCell><Typography variant="body2" sx={{ fontWeight: 700, color: 'secondary.main' }}>PO-{po.id}</Typography></TableCell>
                  <TableCell><Typography variant="body2" sx={{ fontWeight: 600 }}>{po.supplier.name}</Typography></TableCell>
                  <TableCell>{po.orderDate ? po.orderDate.substring(0, 10) : 'N/A'}</TableCell>
                  <TableCell>{po.expectedDeliveryDate}</TableCell>
                  <TableCell>
                    <Chip label={po.status} size="small" color={po.status === 'RECEIVED' ? 'success' : 'info'} sx={{ fontWeight: 700 }} />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" color="primary" onClick={() => handleViewOrder(po)}><ViewIcon fontSize="small" /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {filteredOrders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography variant="body2" sx={{ color: 'text.secondary', py: 3 }}>No purchase orders found</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Create PO Dialog */}
      <Dialog open={openCreate} onClose={() => setOpenCreate(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Create Purchase Order</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Supplier</InputLabel>
                  <Select
                    value={supplierId}
                    label="Supplier"
                    onChange={(e) => setSupplierId(e.target.value)}
                  >
                    {suppliers.map(s => (
                      <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Expected Delivery Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={expectedDeliveryDate}
                  onChange={(e) => setExpectedDeliveryDate(e.target.value)}
                  required
                />
              </Grid>
            </Grid>

            <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>Order Items</Typography>
            {orderItems.map((item, idx) => (
              <Box key={idx} sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
                <FormControl sx={{ flexGrow: 1 }} required>
                  <InputLabel>Product</InputLabel>
                  <Select
                    value={item.productId}
                    label="Product"
                    onChange={(e) => handleItemChange(idx, 'productId', e.target.value)}
                  >
                    {products.map(p => (
                      <MenuItem key={p.id} value={p.id}>{p.name} [Stock: {p.currentStock}]</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  label="Quantity"
                  type="number"
                  inputProps={{ min: 1 }}
                  value={item.quantity}
                  onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                  sx={{ width: 120 }}
                  required
                />
                <IconButton color="error" disabled={orderItems.length === 1} onClick={() => handleRemoveItem(idx)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}

            <Button startIcon={<AddIcon />} onClick={handleAddItem} variant="outlined" sx={{ mt: 1 }}>
              Add Product Line
            </Button>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={() => setOpenCreate(false)} disabled={loading}>Cancel</Button>
            <Button type="submit" variant="contained" color="secondary" disabled={loading}>
              {loading ? "Creating..." : "Submit PO"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* View PO Dialog */}
      <Dialog open={openView} onClose={() => setOpenView(false)} maxWidth="md" fullWidth>
        {selectedOrder && (
          <>
            <DialogTitle sx={{ fontWeight: 700, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Purchase Order PO-{selectedOrder.id}</span>
              <Chip label={selectedOrder.status} color={selectedOrder.status === 'RECEIVED' ? 'success' : 'info'} />
            </DialogTitle>
            <DialogContent dividers>
              <Typography variant="body2" sx={{ mb: 1 }}><strong>Supplier:</strong> {selectedOrder.supplier.name}</Typography>
              <Typography variant="body2" sx={{ mb: 1 }}><strong>Email:</strong> {selectedOrder.supplier.email}</Typography>
              <Typography variant="body2" sx={{ mb: 1 }}><strong>Phone:</strong> {selectedOrder.supplier.phone}</Typography>
              <Typography variant="body2" sx={{ mb: 3 }}><strong>Address:</strong> {selectedOrder.supplier.address}</Typography>

              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>PO Item Lines</Typography>
              <TableContainer component={Paper} variant="outlined">
                <SubTable size="small">
                  <SubTableHead sx={{ bgcolor: '#f8fafc' }}>
                    <SubTableRow>
                      <SubTableCell sx={{ fontWeight: 700 }}>Item Name</SubTableCell>
                      <SubTableCell sx={{ fontWeight: 700 }}>SKU</SubTableCell>
                      <SubTableCell align="right" sx={{ fontWeight: 700 }}>Ordered Qty</SubTableCell>
                    </SubTableRow>
                  </SubTableHead>
                  <SubTableBody>
                    {selectedOrder.items.map((item) => (
                      <SubTableRow key={item.id}>
                        <SubTableCell>{item.product.name}</SubTableCell>
                        <SubTableCell>{item.product.sku}</SubTableCell>
                        <SubTableCell align="right">{item.quantity}</SubTableCell>
                      </SubTableRow>
                    ))}
                  </SubTableBody>
                </SubTable>
              </TableContainer>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenView(false)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}
