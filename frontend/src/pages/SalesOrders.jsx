import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Button, Chip,
  TextField, InputAdornment, IconButton, Dialog, DialogTitle,
  DialogContent, DialogActions, Alert, MenuItem, Select, FormControl, InputLabel,
  Table as SubTable, TableHead as SubTableHead, TableRow as SubTableRow, TableCell as SubTableCell, TableBody as SubTableBody
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Visibility as ViewIcon,
  LocalShipping as ShippingIcon,
  CheckCircle as ApprovedIcon,
  Pending as PendingIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import api from '../services/api';

const getStatusColor = (status) => {
  switch (status) {
    case 'PENDING': return 'warning';
    case 'APPROVED': return 'success';
    case 'DISPATCHED': return 'info';
    default: return 'default';
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case 'PENDING': return <PendingIcon sx={{ fontSize: 16 }} />;
    case 'APPROVED': return <ApprovedIcon sx={{ fontSize: 16 }} />;
    case 'DISPATCHED': return <ShippingIcon sx={{ fontSize: 16 }} />;
    default: return null;
  }
};

export default function SalesOrders() {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Dialog states
  const [openCreate, setOpenCreate] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Form states
  const [customerId, setCustomerId] = useState('');
  const [orderItems, setOrderItems] = useState([{ productId: '', quantity: 1 }]);

  const fetchData = async () => {
    try {
      const [ordersRes, custRes, prodRes] = await Promise.all([
        api.get('/api/sales-orders'),
        api.get('/api/customers'),
        api.get('/api/products')
      ]);
      setOrders(ordersRes.data);
      setCustomers(custRes.data);
      setProducts(prodRes.data);
    } catch (err) {
      console.error("Error loading data", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenCreate = () => {
    setError('');
    setCustomerId('');
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
    
    // Validate items
    if (orderItems.some(i => !i.productId || i.quantity <= 0)) {
      setError('Please select valid products and positive quantities');
      return;
    }

    setLoading(true);
    const payload = {
      customerId,
      items: orderItems.map(i => ({ productId: i.productId, quantity: parseInt(i.quantity) }))
    };

    try {
      await api.post('/api/sales-orders', payload);
      fetchData();
      setOpenCreate(false);
    } catch (err) {
      setError(err.response?.data || "An error occurred creating order");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, nextStatus) => {
    try {
      await api.put(`/api/sales-orders/${orderId}/status`, { status: nextStatus });
      fetchData();
      setOpenView(false);
    } catch (err) {
      alert(err.response?.data || "Failed to update order status");
    }
  };

  const handleGenerateInvoice = async (orderId) => {
    try {
      await api.post(`/api/invoices`, { salesOrderId: orderId });
      alert("Invoice generated successfully!");
      fetchData();
    } catch (err) {
      alert(err.response?.data || "Failed to generate invoice");
    }
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setOpenView(true);
  };

  const filteredOrders = orders.filter(o =>
    o.id.toString().includes(searchTerm) ||
    o.customer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b' }}>
          Sales Orders
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenCreate}
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
            placeholder="Search by order ID or customer name..."
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
              {filteredOrders.map((order) => (
                <TableRow key={order.id} hover>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: 'primary.main' }}>SO-{order.id}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{order.customer.name}</Typography>
                  </TableCell>
                  <TableCell>{order.orderDate ? order.orderDate.substring(0, 10) : 'N/A'}</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>${order.totalAmount.toFixed(2)}</TableCell>
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
                    <IconButton size="small" color="primary" onClick={() => handleViewOrder(order)}><ViewIcon fontSize="small" /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {filteredOrders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography variant="body2" sx={{ color: 'text.secondary', py: 3 }}>No sales orders found</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Create Order Dialog */}
      <Dialog open={openCreate} onClose={() => setOpenCreate(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Create Sales Order</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <FormControl fullWidth sx={{ mb: 3 }} required>
              <InputLabel>Customer</InputLabel>
              <Select
                value={customerId}
                label="Customer"
                onChange={(e) => setCustomerId(e.target.value)}
              >
                {customers.map(c => (
                  <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                ))}
              </Select>
            </FormControl>

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
                      <MenuItem key={p.id} value={p.id}>{p.name} (${p.unitPrice.toFixed(2)}) [Stock: {p.currentStock}]</MenuItem>
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
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? "Creating..." : "Submit Order"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* View Order Dialog */}
      <Dialog open={openView} onClose={() => setOpenView(false)} maxWidth="md" fullWidth>
        {selectedOrder && (
          <>
            <DialogTitle sx={{ fontWeight: 700, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Sales Order SO-{selectedOrder.id}</span>
              <Chip label={selectedOrder.status} color={getStatusColor(selectedOrder.status)} />
            </DialogTitle>
            <DialogContent dividers>
              <Typography variant="body2" sx={{ mb: 1 }}><strong>Customer:</strong> {selectedOrder.customer.name}</Typography>
              <Typography variant="body2" sx={{ mb: 1 }}><strong>Email:</strong> {selectedOrder.customer.email}</Typography>
              <Typography variant="body2" sx={{ mb: 1 }}><strong>Phone:</strong> {selectedOrder.customer.phone}</Typography>
              <Typography variant="body2" sx={{ mb: 3 }}><strong>Address:</strong> {selectedOrder.customer.address}</Typography>

              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>Order Details</Typography>
              <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
                <SubTable size="small">
                  <SubTableHead sx={{ bgcolor: '#f8fafc' }}>
                    <SubTableRow>
                      <SubTableCell sx={{ fontWeight: 700 }}>Item Name</SubTableCell>
                      <SubTableCell sx={{ fontWeight: 700 }}>SKU</SubTableCell>
                      <SubTableCell align="right" sx={{ fontWeight: 700 }}>Quantity</SubTableCell>
                      <SubTableCell align="right" sx={{ fontWeight: 700 }}>Unit Price</SubTableCell>
                      <SubTableCell align="right" sx={{ fontWeight: 700 }}>Subtotal</SubTableCell>
                    </SubTableRow>
                  </SubTableHead>
                  <SubTableBody>
                    {selectedOrder.items.map((item) => (
                      <SubTableRow key={item.id}>
                        <SubTableCell>{item.product.name}</SubTableCell>
                        <SubTableCell>{item.product.sku}</SubTableCell>
                        <SubTableCell align="right">{item.quantity}</SubTableCell>
                        <SubTableCell align="right">${item.unitPrice.toFixed(2)}</SubTableCell>
                        <SubTableCell align="right">${(item.unitPrice * item.quantity).toFixed(2)}</SubTableCell>
                      </SubTableRow>
                    ))}
                    <SubTableRow>
                      <SubTableCell colSpan={4} align="right" sx={{ fontWeight: 700 }}>Grand Total:</SubTableCell>
                      <SubTableCell align="right" sx={{ fontWeight: 700, color: 'primary.main' }}>${selectedOrder.totalAmount.toFixed(2)}</SubTableCell>
                    </SubTableRow>
                  </SubTableBody>
                </SubTable>
              </TableContainer>

              {/* Status Update & Invoice Actions */}
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2 }}>
                {selectedOrder.status === 'PENDING' && (
                  <Button variant="contained" color="success" onClick={() => handleUpdateStatus(selectedOrder.id, 'APPROVED')}>
                    Approve Order
                  </Button>
                )}
                {selectedOrder.status === 'APPROVED' && (
                  <>
                    <Button variant="contained" color="info" startIcon={<ShippingIcon />} onClick={() => handleUpdateStatus(selectedOrder.id, 'DISPATCHED')}>
                      Dispatch Order
                    </Button>
                    <Button variant="contained" color="secondary" onClick={() => handleGenerateInvoice(selectedOrder.id)}>
                      Generate Invoice
                    </Button>
                  </>
                )}
              </Box>
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
