import React, { useState } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import {
  Box, Drawer, AppBar as MuiAppBar, Toolbar, List,
  Typography, Divider, IconButton, ListItem,
  ListItemButton, ListItemIcon, ListItemText, Avatar,
  Menu, MenuItem, Tooltip
} from '@mui/material';
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  Dashboard as DashboardIcon,
  Inventory as InventoryIcon,
  People as PeopleIcon,
  LocalShipping as LocalShippingIcon,
  ShoppingCart as ShoppingCartIcon,
  Receipt as ReceiptIcon,
  ReceiptLong as ReceiptLongIcon,
  Assessment as AssessmentIcon,
  Logout as LogoutIcon,
  Store as StoreIcon
} from '@mui/icons-material';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import authService from '../services/auth.service';

const drawerWidth = 260;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  }),
);

const AppBar = styled(MuiAppBar, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: `${drawerWidth}px`,
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
    backgroundColor: '#fff',
    color: '#333',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  }),
);

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

export default function Layout() {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const user = authService.getCurrentUser();
  const [open, setOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);
  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard', roles: ['ROLE_ADMIN', 'ROLE_SALES_EXECUTIVE', 'ROLE_PURCHASE_MANAGER', 'ROLE_INVENTORY_MANAGER', 'ROLE_ACCOUNTANT'] },
    { text: 'Products', icon: <InventoryIcon />, path: '/products', roles: ['ROLE_ADMIN', 'ROLE_INVENTORY_MANAGER', 'ROLE_PURCHASE_MANAGER'] },
    { text: 'Customers', icon: <PeopleIcon />, path: '/customers', roles: ['ROLE_ADMIN', 'ROLE_SALES_EXECUTIVE'] },
    { text: 'Suppliers', icon: <StoreIcon />, path: '/suppliers', roles: ['ROLE_ADMIN', 'ROLE_PURCHASE_MANAGER'] },
    { text: 'Sales Orders', icon: <ShoppingCartIcon />, path: '/sales', roles: ['ROLE_ADMIN', 'ROLE_SALES_EXECUTIVE'] },
    { text: 'Purchase Orders', icon: <LocalShippingIcon />, path: '/purchase', roles: ['ROLE_ADMIN', 'ROLE_PURCHASE_MANAGER'] },
    { text: 'GRN', icon: <ReceiptIcon />, path: '/grn', roles: ['ROLE_ADMIN', 'ROLE_PURCHASE_MANAGER', 'ROLE_INVENTORY_MANAGER'] },
    { text: 'Invoices', icon: <ReceiptLongIcon />, path: '/invoices', roles: ['ROLE_ADMIN', 'ROLE_SALES_EXECUTIVE', 'ROLE_ACCOUNTANT'] },
    { text: 'Reports', icon: <AssessmentIcon />, path: '/reports', roles: ['ROLE_ADMIN', 'ROLE_ACCOUNTANT'] },
  ];

  const filteredMenuItems = menuItems.filter(item => item.roles.includes(user?.role));

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 700 }}>
            {menuItems.find(item => item.path === location.pathname)?.text || 'ERP System'}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body2" sx={{ mr: 2, display: { xs: 'none', sm: 'block' } }}>
              {user?.username} ({user?.role?.replace('ROLE_', '')})
            </Typography>
            <Tooltip title="Account settings">
              <IconButton onClick={handleMenu} sx={{ p: 0 }}>
                <Avatar sx={{ bgcolor: theme.palette.primary.main }}>{user?.username?.[0].toUpperCase()}</Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem onClick={handleLogout}>
                <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: '#1e293b',
            color: '#fff',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <Typography variant="h6" sx={{ color: '#fff', flexGrow: 1, ml: 2, fontWeight: 700 }}>
            ERP MASTER
          </Typography>
          <IconButton onClick={handleDrawerClose} sx={{ color: '#fff' }}>
            <ChevronLeftIcon />
          </IconButton>
        </DrawerHeader>
        <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
        <List sx={{ px: 1, py: 2 }}>
          {filteredMenuItems.map((item) => (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => navigate(item.path)}
                selected={location.pathname === item.path}
                sx={{
                  borderRadius: '8px',
                  '&.Mui-selected': {
                    backgroundColor: theme.palette.primary.main,
                    color: '#fff',
                    '& .MuiListItemIcon-root': { color: '#fff' },
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.08)',
                  },
                }}
              >
                <ListItemIcon sx={{ color: 'rgba(255,255,255,0.7)', minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 500 }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        <Outlet />
      </Main>
    </Box>
  );
}
