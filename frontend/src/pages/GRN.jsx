import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Button, Dialog, DialogTitle,
  DialogContent, DialogActions, Alert, MenuItem, Select, FormControl, InputLabel, TextField, Grid
} from '@mui/material';
import { Receipt as GRNIcon, Add as AddIcon } from '@mui/icons-material';
import api from '../services/api';

export default function GRN() {
  const [grns, setGrns] = useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Form states
  const [selectedPoId, setSelectedPoId] = useState('');
  const [remarks, setRemarks] = useState('');
  const [receivedItems, setReceivedItems] = useState([]); // [{ productId, name, orderedQty, quantityReceived }]

  const fetchData = async () => {
    try {
      const [grnRes, poRes] = await Promise.all([
        api.get('/api/grns'),
        api.get('/api/purchase-orders')
      ]);
      setGrns(grnRes.data);
      // Filter out only ORDERED purchase orders for receiving
      setPurchaseOrders(poRes.data.filter(po => po.status === 'ORDERED'));
    } catch (err) {
      console.error("Error fetching GRN data", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpen = () => {
    setError('');
    setSelectedPoId('');
    setRemarks('');
    setReceivedItems([]);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handlePoChange = (poId) => {
    setSelectedPoId(poId);
    const selectedPo = purchaseOrders.find(po => po.id === poId);
    if (selectedPo) {
      const items = selectedPo.items.map(item => ({
        productId: item.product.id,
        name: item.product.name,
        orderedQty: item.quantity,
        quantityReceived: item.quantity // default to ordered quantity
      }));
      setReceivedItems(items);
    } else {
      setReceivedItems([]);
    }
  };

  const handleQtyChange = (index, val) => {
    const list = [...receivedItems];
    list[index].quantityReceived = val === '' ? '' : parseInt(val);
    setReceivedItems(list);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!selectedPoId) {
      setError('Please select a Purchase Order');
      return;
    }
    if (receivedItems.some(i => i.quantityReceived === '' || i.quantityReceived < 0)) {
      setError('Please enter a valid quantity received for all items');
      return;
    }

    setLoading(true);
    const payload = {
      purchaseOrderId: selectedPoId,
      remarks,
      items: receivedItems.map(i => ({
        productId: i.productId,
        quantityReceived: i.quantityReceived
      }))
    };

    try {
      await api.post('/api/grns', payload);
      fetchData();
      handleClose();
    } catch (err) {
      setError(err.response?.data || "An error occurred saving GRN");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b' }}>
          Goods Receipt Notes
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpen}
          sx={{ py: 1, px: 3, borderRadius: 2, fontWeight: 700, textTransform: 'none', bgcolor: '#10b981', '&:hover': { bgcolor: '#059669' } }}
        >
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
              {grns.map((grn) => (
                <TableRow key={grn.id} hover>
                  <TableCell><Typography variant="body2" sx={{ fontWeight: 700, color: '#059669' }}>GRN-{grn.id}</Typography></TableCell>
                  <TableCell><Typography variant="body2" sx={{ fontWeight: 700, color: 'secondary.main' }}>PO-{grn.purchaseOrder.id}</Typography></TableCell>
                  <TableCell><Typography variant="body2" sx={{ fontWeight: 600 }}>{grn.purchaseOrder.supplier.name}</Typography></TableCell>
                  <TableCell>{grn.receivedDate ? grn.receivedDate.substring(0, 10) : 'N/A'}</TableCell>
                  <TableCell>{grn.items.length}</TableCell>
                  <TableCell><Typography variant="caption" sx={{ color: 'text.secondary' }}>{grn.remarks || 'None'}</Typography></TableCell>
                </TableRow>
              ))}
              {grns.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography variant="body2" sx={{ color: 'text.secondary', py: 3 }}>No Goods Receipt Notes registered</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Register GRN Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Register Goods Receipt Note (GRN)</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Pending Purchase Order</InputLabel>
                  <Select
                    value={selectedPoId}
                    label="Pending Purchase Order"
                    onChange={(e) => handlePoChange(e.target.value)}
                  >
                    {purchaseOrders.map(po => (
                      <MenuItem key={po.id} value={po.id}>PO-{po.id} ({po.supplier.name})</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Remarks"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                />
              </Grid>
            </Grid>

            {receivedItems.length > 0 && (
              <>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>Receive Quantities</Typography>
                {receivedItems.map((item, idx) => (
                  <Box key={item.productId} sx={{ display: 'flex', gap: 3, mb: 2, alignItems: 'center' }}>
                    <Typography sx={{ flexGrow: 1, fontWeight: 600 }}>{item.name}</Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', width: 150 }}>Ordered Qty: {item.orderedQty}</Typography>
                    <TextField
                      label="Qty Received"
                      type="number"
                      inputProps={{ min: 0 }}
                      value={item.quantityReceived}
                      onChange={(e) => handleQtyChange(idx, e.target.value)}
                      sx={{ width: 150 }}
                      required
                    />
                  </Box>
                ))}
              </>
            )}
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={handleClose} disabled={loading}>Cancel</Button>
            <Button type="submit" variant="contained" color="success" disabled={loading || receivedItems.length === 0}>
              {loading ? "Registering..." : "Submit GRN & Update Stock"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}
