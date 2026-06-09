import React from 'react';
import { Box, Typography, Paper, Grid, Card, CardContent, Divider, Button } from '@mui/material';
import { FileDownload as DownloadIcon, DateRange as DateRangeIcon, FilterAlt as FilterIcon } from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const reportsData = {
  salesByCategory: [
    { name: 'Peripherals', value: 400 },
    { name: 'Monitors', value: 300 },
    { name: 'CPUs', value: 300 },
    { name: 'Memory', value: 200 },
  ],
  monthlyRevenue: [
    { month: 'Jan', revenue: 4500, expenses: 2400 },
    { month: 'Feb', revenue: 5200, expenses: 1398 },
    { month: 'Mar', revenue: 3800, expenses: 9800 },
    { month: 'Apr', revenue: 4100, expenses: 3908 },
    { month: 'May', revenue: 6300, expenses: 4800 },
    { month: 'Jun', revenue: 5900, expenses: 3800 },
  ]
};

const COLORS = ['#1976d2', '#9c27b0', '#10b981', '#f59e0b'];

export default function Reports() {
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b' }}>
          Financial Reports
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" startIcon={<DateRangeIcon />} sx={{ textTransform: 'none' }}>Last 30 Days</Button>
          <Button variant="contained" startIcon={<DownloadIcon />} sx={{ textTransform: 'none' }}>Export Excel</Button>
        </Box>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 4, borderRadius: 4, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 4 }}>Revenue vs Expenses Trend</Typography>
            <Box sx={{ height: 400 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={reportsData.monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Legend verticalAlign="top" align="right" />
                  <Bar dataKey="revenue" fill="#1976d2" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expenses" fill="#9c27b0" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 4, borderRadius: 4, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', height: '100%' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 4 }}>Sales by Category</Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={reportsData.salesByCategory}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {reportsData.salesByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" />
                </PieChart>
              </ResponsiveContainer>
            </Box>
            <Divider sx={{ my: 3 }} />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>Top Category</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: 'primary.main' }}>Peripherals</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>Lowest Performance</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: 'secondary.main' }}>Memory</Typography>
                </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
