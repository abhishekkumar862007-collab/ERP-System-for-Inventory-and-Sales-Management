import React, { useState } from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Button, IconButton,
  TextField, InputAdornment, Chip, Card, CardContent
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Inventory as InventoryIcon,
  FilterList as FilterListIcon
} from '@mui/icons-material';

const initialProducts = [
  { id: 1, name: 'Logitech G502 Mouse', sku: 'MS-LGG-502', category: 'Peripherals', price: 45.00, stock: 2, reorder: 5 },
  { id: 2, name: 'Dell Monitor 24"', sku: 'MN-DL24-IPS', category: 'Monitors', price: 120.00, stock: 5, reorder: 10 },
  { id: 3, name: 'Mechanical Keyboard RED', sku: 'KB-MC-RED-U', category: 'Peripherals', price: 85.00, stock: 1, reorder: 3 },
  { id: 4, name: 'Core i7-13700K', sku: 'CPU-INT-137K', category: 'Processors', price: 380.00, stock: 15, reorder: 5 },
  { id: 5, name: '16GB DDR5 RAM (2x8)', sku: 'RM-CR-D5-16', category: 'Memory', price: 65.00, stock: 25, reorder: 10 },
];

export default function Products() {
  const [products, setProducts] = useState(initialProducts);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b' }}>
          Products
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
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
               <Typography variant="h4" sx={{ fontWeight: 800 }}>842</Typography>
             </CardContent>
           </Card>
        </Grid>
        <Grid item xs={12} md={3}>
           <Card sx={{ borderRadius: 3, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', bgcolor: '#fff' }}>
             <CardContent sx={{ p: 2 }}>
               <Typography variant="subtitle2" sx={{ color: 'text.secondary', fontWeight: 600 }}>Low Stock</Typography>
               <Typography variant="h4" sx={{ fontWeight: 800, color: 'error.main' }}>12</Typography>
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
          <Button variant="outlined" startIcon={<FilterListIcon />} sx={{ color: 'text.secondary', borderColor: '#e2e8f0', textTransform: 'none' }}>
            Filters
          </Button>
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
                  <TableCell>${product.price.toFixed(2)}</TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: product.stock <= product.reorder ? 'error.main' : 'text.primary' }}>
                      {product.stock}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={product.stock <= product.reorder ? 'Low Stock' : 'In Stock'}
                      size="small"
                      color={product.stock <= product.reorder ? 'error' : 'success'}
                      sx={{ fontWeight: 700, px: 1 }}
                    />
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

// Add Grid import since it was missed in previous thought
import { Grid } from '@mui/material';
