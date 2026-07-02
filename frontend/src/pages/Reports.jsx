import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Grid, Divider, Button, Dialog, DialogTitle, DialogContent, DialogActions, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Card, CardContent, Chip } from '@mui/material';
import { DateRange as DateRangeIcon } from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import api from '../services/api';

const COLORS = ['#1976d2', '#9c27b0', '#10b981', '#f59e0b', '#ec4899', '#3b82f6'];

export default function Reports() {
  const [trendData, setTrendData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openLiveSummary, setOpenLiveSummary] = useState(false);
  const [invoices, setInvoices] = useState([]);
  const [products, setProducts] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);

  const fetchReportData = async () => {
    try {
      const [dashRes, prodRes, invRes] = await Promise.all([
        api.get('/api/dashboard/sales-summary'),
        api.get('/api/products'),
        api.get('/api/invoices')
      ]);

      // Set Monthly trend
      // Map 'sales' to 'revenue' and 'purchase' to 'expenses' to match chart structure
      const formattedTrend = dashRes.data.salesTrend.map(item => ({
        month: item.name,
        revenue: item.sales,
        expenses: item.purchase
      }));
      setTrendData(formattedTrend);

      // Group products by category and calculate total stock value for category distribution
      const categories = {};
      prodRes.data.forEach(product => {
        const cat = product.category || 'Uncategorized';
        const val = product.currentStock * product.unitPrice;
        categories[cat] = (categories[cat] || 0) + val;
      });

      const formattedCategory = Object.keys(categories).map(name => ({
        name,
        value: Math.round(categories[name])
      }));
      setCategoryData(formattedCategory);

      // Save additional data for Live Summary Dialog
      setInvoices(invRes.data || []);
      setProducts(prodRes.data || []);
      setLowStock(dashRes.data.lowStockItems || []);
      setDashboardData(dashRes.data);

    } catch (err) {
      console.error("Error loading reports data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <Typography>Loading Reports...</Typography>
      </Box>
    );
  }

  // Find top and lowest category
  let topCategory = 'N/A';
  let lowCategory = 'N/A';
  if (categoryData.length > 0) {
    const sorted = [...categoryData].sort((a, b) => b.value - a.value);
    topCategory = sorted[0].name;
    lowCategory = sorted[sorted.length - 1].name;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b' }}>
          Financial Reports
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" startIcon={<DateRangeIcon />} onClick={() => setOpenLiveSummary(true)} sx={{ textTransform: 'none' }}>Live Summary</Button>
        </Box>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 4, borderRadius: 4, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 4 }}>Revenue vs Expenses Trend</Typography>
            <Box sx={{ height: 400 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                  <Legend verticalAlign="top" align="right" />
                  <Bar dataKey="revenue" fill="#1976d2" name="Sales Revenue" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expenses" fill="#9c27b0" name="Purchase Cost" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 4, borderRadius: 4, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', height: '100%' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 4 }}>Inventory Value Share</Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                  <Legend verticalAlign="bottom" />
                </PieChart>
              </ResponsiveContainer>
            </Box>
            <Divider sx={{ my: 3 }} />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>Top Category (by Value)</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: 'primary.main' }}>{topCategory}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>Lowest Share</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: 'secondary.main' }}>{lowCategory}</Typography>
                </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Live Summary Dialog */}
      <Dialog open={openLiveSummary} onClose={() => setOpenLiveSummary(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 800, bgcolor: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Real-time Financial & Operations Summary</span>
          <Chip label="LIVE" color="error" size="small" sx={{ fontWeight: 800, animation: 'pulse 1.5s infinite' }} />
        </DialogTitle>
        <DialogContent dividers sx={{ bgcolor: '#f4f6f8', p: 3 }}>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {/* Stat 1: Total Sales */}
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ borderRadius: 3, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>Total Revenue</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: '#1976d2', mt: 0.5 }}>
                    ${dashboardData?.totalSales?.toFixed(2) || '0.00'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            {/* Stat 2: Paid Cash Flow */}
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ borderRadius: 3, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>Received Payments</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: '#10b981', mt: 0.5 }}>
                    ${invoices.filter(i => i.status === 'PAID').reduce((sum, i) => sum + i.totalPayable, 0).toFixed(2)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            {/* Stat 3: Unpaid Receivables */}
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ borderRadius: 3, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>Outstanding Invoices</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: '#f59e0b', mt: 0.5 }}>
                    ${invoices.filter(i => i.status === 'UNPAID').reduce((sum, i) => sum + i.totalPayable, 0).toFixed(2)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            {/* Stat 4: Inventory Assets */}
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ borderRadius: 3, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>Inventory Value</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: '#9c27b0', mt: 0.5 }}>
                    ${dashboardData?.stockValue?.toFixed(2) || '0.00'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Low Stock Alerts */}
          <Paper sx={{ p: 3, borderRadius: 3, mb: 4, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', color: '#dc2626' }}>
              Low Stock Warnings ({lowStock.length})
            </Typography>
            {lowStock.length > 0 ? (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>Product Name</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>SKU</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700 }}>Current Stock</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700 }}>Reorder Level</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {lowStock.map((prod) => (
                      <TableRow key={prod.id} hover>
                        <TableCell sx={{ fontWeight: 600 }}>{prod.name}</TableCell>
                        <TableCell>{prod.sku}</TableCell>
                        <TableCell align="right" sx={{ color: '#dc2626', fontWeight: 700 }}>{prod.currentStock}</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600 }}>{prod.reorderLevel}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography variant="body2" sx={{ color: 'text.secondary', py: 2 }}>All product inventory levels are healthy.</Typography>
            )}
          </Paper>

          {/* Invoice Summary */}
          <Paper sx={{ p: 3, borderRadius: 3, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>Invoices Status Breakdown</Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ p: 2, border: '1px solid #e2e8f0', bgcolor: '#fff', borderRadius: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>Paid Invoices</Typography>
                  <Chip label={`${invoices.filter(i => i.status === 'PAID').length} Invoices`} color="success" size="small" sx={{ fontWeight: 700 }} />
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ p: 2, border: '1px solid #e2e8f0', bgcolor: '#fff', borderRadius: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>Outstanding Invoices</Typography>
                  <Chip label={`${invoices.filter(i => i.status === 'UNPAID').length} Invoices`} color="warning" size="small" sx={{ fontWeight: 700 }} />
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </DialogContent>
        <DialogActions sx={{ p: 3, bgcolor: '#f8fafc' }}>
          <Button variant="outlined" sx={{ fontWeight: 600, textTransform: 'none' }} onClick={() => window.print()}>Print Summary</Button>
          <Button variant="contained" sx={{ fontWeight: 700, textTransform: 'none' }} onClick={() => setOpenLiveSummary(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
