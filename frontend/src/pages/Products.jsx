import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Button, IconButton,
  TextField, InputAdornment, Chip, Card, CardContent, Grid,
  Dialog, DialogTitle, DialogContent, DialogActions, Alert
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Inventory as InventoryIcon,
  FilterList as FilterListIcon
} from '@mui/icons-material';
import api from '../services/api';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Form state
  const [editId, setEditId] = useState(null);
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState('');
  const [unitPrice, setUnitPrice] = useState('');
  const [currentStock, setCurrentStock] = useState('');
  const [reorderLevel, setReorderLevel] = useState('');

  const fetchProducts = async () => {
    try {
      const response = await api.get('/api/products');
      setProducts(response.data);
    } catch (err) {
      console.error("Error fetching products", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpen = (product = null) => {
    setError('');
    if (product) {
      setEditId(product.id);
      setName(product.name);
      setSku(product.sku);
      setCategory(product.category || '');
      setUnitPrice(product.unitPrice);
      setCurrentStock(product.currentStock);
      setReorderLevel(product.reorderLevel);
    } else {
      setEditId(null);
      setName('');
      setSku('');
      setCategory('');
      setUnitPrice('');
      setCurrentStock('');
      setReorderLevel('');
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const payload = {
      name,
      sku,
      category,
      unitPrice: parseFloat(unitPrice),
      currentStock: parseInt(currentStock),
      reorderLevel: parseInt(reorderLevel)
    };

    try {
      if (editId) {
        await api.put(`/api/products/${editId}`, payload);
      } else {
        await api.post('/api/products', payload);
      }
      fetchProducts();
      handleClose();
    } catch (err) {
      setError(err.response?.data || "An error occurred saving the product");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await api.delete(`/api/products/${id}`);
        fetchProducts();
      } catch (err) {
        alert(err.response?.data || "Failed to delete product");
      }
    }
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const lowStockCount = products.filter(p => p.currentStock <= p.reorderLevel).length;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b' }}>
          Products
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
          sx={{ py: 1, px: 3, borderRadius: 2, fontWeight: 700, textTransform: 'none' }}
        >
          Add Product
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
           <Card sx={{ borderRadius: 3, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', bgcolor: '#fff' }}>
             <CardContent sx={{ p: 2 }}>
                <Typography variant="subtitle2" sx={{ color: 'text.secondary', fontWeight: 600 }}>Total Items</Typography>
                <Typography variant="h4" sx={{ fontWeight: 800 }}>{products.length}</Typography>
             </CardContent>
           </Card>
        </Grid>
        <Grid item xs={12} md={3}>
           <Card sx={{ borderRadius: 3, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', bgcolor: '#fff' }}>
             <CardContent sx={{ p: 2 }}>
                <Typography variant="subtitle2" sx={{ color: 'text.secondary', fontWeight: 600 }}>Low Stock</Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, color: 'error.main' }}>{lowStockCount}</Typography>
             </CardContent>
           </Card>
        </Grid>
      </Grid>

      <Paper sx={{ mb: 4, borderRadius: 4, overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
        <Box sx={{ p: 3, display: 'flex', gap: 2 }}>
          <TextField
            size="small"
            placeholder="Search by name or SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" color="action" />
                </InputAdornment>
              ),
            }}
            sx={{ flexGrow: 1 }}
          />
        </Box>

        <TableContainer>
          <Table sx={{ minWidth: 650 }}>
            <TableHead sx={{ bgcolor: '#f8fafc' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>SKU</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Product Name</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Category</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Price</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Stock</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell component="th" scope="row">
                    <Typography variant="body2" sx={{ fontWeight: 700, color: 'primary.main' }}>{product.sku}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{product.name}</Typography>
                  </TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>${product.unitPrice.toFixed(2)}</TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: product.currentStock <= product.reorderLevel ? 'error.main' : 'text.primary' }}>
                      {product.currentStock}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={product.currentStock <= product.reorderLevel ? 'Low Stock' : 'In Stock'}
                      size="small"
                      color={product.currentStock <= product.reorderLevel ? 'error' : 'success'}
                      sx={{ fontWeight: 700, px: 1 }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" color="primary" onClick={() => handleOpen(product)}><EditIcon fontSize="small" /></IconButton>
                    <IconButton size="small" color="error" onClick={() => handleDelete(product.id)}><DeleteIcon fontSize="small" /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {filteredProducts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography variant="body2" sx={{ color: 'text.secondary', py: 3 }}>No products found</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Add / Edit Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>{editId ? "Edit Product" : "Add Product"}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Product Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="SKU"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  disabled={!!editId}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Unit Price ($)"
                  type="number"
                  inputProps={{ step: "0.01", min: "0" }}
                  value={unitPrice}
                  onChange={(e) => setUnitPrice(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Current Stock"
                  type="number"
                  inputProps={{ min: "0" }}
                  value={currentStock}
                  onChange={(e) => setCurrentStock(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Reorder Level"
                  type="number"
                  inputProps={{ min: "0" }}
                  value={reorderLevel}
                  onChange={(e) => setReorderLevel(e.target.value)}
                  required
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={handleClose} disabled={loading}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? "Saving..." : "Save Product"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}
