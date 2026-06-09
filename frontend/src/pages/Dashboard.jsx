import React from 'react';
import {
  Box, Grid, Paper, Typography, Card, CardContent,
  IconButton, List, ListItem, ListItemText, ListItemIcon, Divider
} from '@mui/material';
import {
  TrendingUp, ShoppingBag, People, LocalShipping,
  Warning as WarningIcon, ArrowCircleRightOutlined
} from '@mui/icons-material';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  Legend, ResponsiveContainer, LineChart, Line, AreaChart, Area
} from 'recharts';

const dashboardData = {
  stats: [
    { title: 'Total Sales', value: '$45,230', icon: <TrendingUp color="primary" />, color: '#e3f2fd' },
    { title: 'Total Orders', value: '124', icon: <ShoppingBag color="secondary" />, color: '#f3e5f5' },
    { title: 'New Customers', value: '12', icon: <People color="info" />, color: '#e0f7fa' },
    { title: 'Stock Value', value: '$12,450', icon: <LocalShipping color="warning" />, color: '#fff3e0' },
  ],
  salesTrend: [
    { name: 'Jan', sales: 4000, purchase: 2400 },
    { name: 'Feb', sales: 3000, purchase: 1398 },
    { name: 'Mar', sales: 2000, purchase: 9800 },
    { name: 'Apr', sales: 2780, purchase: 3908 },
    { name: 'May', sales: 1890, purchase: 4800 },
    { name: 'Jun', sales: 2390, purchase: 3800 },
  ],
  lowStockItems: [
    { id: 1, name: 'Logitech G502', sku: 'MS-LGG-502', stock: 2, reorder: 5 },
    { id: 2, name: 'Dell Monitor 24"', sku: 'MN-DL24-IPS', stock: 5, reorder: 10 },
    { id: 3, name: 'Mechanical Keyboard RED', sku: 'KB-MC-RED-U', stock: 1, reorder: 3 },
  ],
  recentInvoices: [
    { id: 'INV-001', customer: 'John Doe', amount: '$450.00', status: 'Paid' },
    { id: 'INV-002', customer: 'Alice Smith', amount: '$1,200.00', status: 'Pending' },
    { id: 'INV-003', customer: 'Robert Johnson', amount: '$850.50', status: 'Paid' },
  ]
};

export default function Dashboard() {
  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 4, color: '#1e293b' }}>
        Overview
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {dashboardData.stats.map((stat) => (
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
                <AreaChart data={dashboardData.salesTrend}>
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
              <IconButton size="small"><ArrowCircleRightOutlined /></IconButton>
            </Box>
            <List sx={{ pt: 0 }}>
              {dashboardData.recentInvoices.map((invoice, idx) => (
                <React.Fragment key={invoice.id}>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemText
                      primary={invoice.customer}
                      secondary={invoice.id}
                      primaryTypographyProps={{ fontWeight: 600 }}
                    />
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="body1" sx={{ fontWeight: 700 }}>{invoice.amount}</Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: invoice.status === 'Paid' ? 'success.main' : 'warning.main',
                          fontWeight: 700,
                          bgcolor: invoice.status === 'Paid' ? 'success.light' : 'warning.light',
                          px: 1, borderRadius: 1, opacity: 0.8
                        }}
                      >
                        {invoice.status}
                      </Typography>
                    </Box>
                  </ListItem>
                  {idx < dashboardData.recentInvoices.length - 1 && <Divider />}
                </React.Fragment>
              ))}
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
              {dashboardData.lowStockItems.map((item) => (
                <Card key={item.id} variant="outlined" sx={{ mb: 2, borderRadius: 3, borderStyle: 'dashed' }}>
                  <CardContent sx={{ p: '16px !important' }}>
                    <Typography variant="body2" sx={{ fontWeight: 700, mb: 0.5 }}>{item.name}</Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>{item.sku}</Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                      <Box>
                        <Typography variant="caption" sx={{ display: 'block' }}>Current Stock</Typography>
                        <Typography variant="h6" sx={{ color: 'error.main', lineHeight: 1, fontWeight: 800 }}>{item.stock}</Typography>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="caption" sx={{ display: 'block' }}>Reorder Point</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{item.reorder}</Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </List>
            <Typography
              variant="body2"
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
