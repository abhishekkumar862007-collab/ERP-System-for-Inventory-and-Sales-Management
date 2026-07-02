import React, { useState, useEffect } from 'react';
import {
  Box, Grid, Paper, Typography, Card, CardContent,
  IconButton, List, ListItem, ListItemText, Divider
} from '@mui/material';
import {
  TrendingUp, ShoppingBag, People, LocalShipping,
  Warning as WarningIcon, ArrowCircleRightOutlined
} from '@mui/icons-material';
import {
  XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  Legend, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Dashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/api/dashboard/sales-summary');
      setData(response.data);
    } catch (err) {
      console.error("Error loading dashboard metrics", err);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (!data) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <Typography>Loading Dashboard...</Typography>
      </Box>
    );
  }

  const stats = [
    { title: 'Total Sales', value: `$${data.totalSales.toFixed(2)}`, icon: <TrendingUp color="primary" />, color: '#e3f2fd' },
    { title: 'Total Orders', value: String(data.totalOrders), icon: <ShoppingBag color="secondary" />, color: '#f3e5f5' },
    { title: 'New Customers', value: String(data.newCustomers), icon: <People color="info" />, color: '#e0f7fa' },
    { title: 'Stock Value', value: `$${data.stockValue.toFixed(2)}`, icon: <LocalShipping color="warning" />, color: '#fff3e0' },
  ];

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 4, color: '#1e293b' }}>
        Overview
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat) => (
          <Grid item xs={12} sm={6} md={3} key={stat.title}>
            <Card sx={{ borderRadius: 4, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ p: 1.5, borderRadius: 3, bgcolor: stat.color, display: 'flex', mr: 2 }}>
                    {stat.icon}
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                    {stat.title}
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 800 }}>
                  {stat.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={4}>
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 3, borderRadius: 4, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', mb: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
              Sales vs Purchase Trend
            </Typography>
            <Box sx={{ height: 350, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.salesTrend}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1976d2" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#1976d2" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorPurchase" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#9c27b0" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#9c27b0" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <RechartsTooltip />
                  <Legend verticalAlign="top" align="right" height={36} />
                  <Area type="monotone" dataKey="sales" stroke="#1976d2" fillOpacity={1} fill="url(#colorSales)" />
                  <Area type="monotone" dataKey="purchase" stroke="#9c27b0" fillOpacity={1} fill="url(#colorPurchase)" />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </Paper>

          <Paper sx={{ p: 3, borderRadius: 4, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Recent Invoices
              </Typography>
              <IconButton size="small" onClick={() => navigate('/invoices')}><ArrowCircleRightOutlined /></IconButton>
            </Box>
            <List sx={{ pt: 0 }}>
              {data.recentInvoices.map((invoice, idx) => (
                <React.Fragment key={invoice.id}>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemText
                      primary={invoice.salesOrder.customer.name}
                      secondary={`INV-${invoice.id}`}
                      primaryTypographyProps={{ fontWeight: 600 }}
                    />
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="body1" sx={{ fontWeight: 700 }}>${invoice.totalPayable.toFixed(2)}</Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: invoice.status === 'PAID' ? 'success.main' : 'warning.main',
                          fontWeight: 700,
                          bgcolor: invoice.status === 'PAID' ? '#e8f5e9' : '#fff3e0',
                          px: 1, borderRadius: 1, opacity: 0.8
                        }}
                      >
                        {invoice.status}
                      </Typography>
                    </Box>
                  </ListItem>
                  {idx < data.recentInvoices.length - 1 && <Divider />}
                </React.Fragment>
              ))}
              {data.recentInvoices.length === 0 && (
                <Typography variant="body2" sx={{ color: 'text.secondary', py: 2, textAlign: 'center' }}>No recent invoices</Typography>
              )}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 3, borderRadius: 4, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <WarningIcon color="warning" sx={{ mr: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Low Stock Alerts
              </Typography>
            </Box>
            <List>
              {data.lowStockItems.map((item) => (
                <Card key={item.id} variant="outlined" sx={{ mb: 2, borderRadius: 3, borderStyle: 'dashed' }}>
                  <CardContent sx={{ p: '16px !important' }}>
                    <Typography variant="body2" sx={{ fontWeight: 700, mb: 0.5 }}>{item.name}</Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>{item.sku}</Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                      <Box>
                        <Typography variant="caption" sx={{ display: 'block' }}>Current Stock</Typography>
                        <Typography variant="h6" sx={{ color: 'error.main', lineHeight: 1, fontWeight: 800 }}>{item.currentStock}</Typography>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="caption" sx={{ display: 'block' }}>Reorder Point</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{item.reorderLevel}</Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))}
              {data.lowStockItems.length === 0 && (
                <Typography variant="body2" sx={{ color: 'text.secondary', py: 2, textAlign: 'center' }}>No low stock alerts</Typography>
              )}
            </List>
            <Typography
              variant="body2"
              onClick={() => navigate('/products')}
              sx={{ textAlign: 'center', mt: 2, color: 'primary.main', cursor: 'pointer', fontWeight: 600 }}
            >
              View Full Inventory
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
