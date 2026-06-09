import React, { useState } from 'react';
import {
  Box, Card, CardContent, TextField, Button,
  Typography, IconButton, InputAdornment, Alert,
  CircularProgress, Container, MenuItem, Select, FormControl, InputLabel, FormHelperText
} from '@mui/material';
import { Visibility, VisibilityOff, AppRegistration as RegisterIcon, ArrowBack } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/auth.service';

const schema = yup.object().shape({
  username: yup.string().required('Username is required').min(4, 'Username too short'),
  email: yup.string().required('Email is required').email('Invalid email'),
  password: yup.string().required('Password is required').min(6, 'Password too short'),
  role: yup.string().required('Role is required'),
});

const roles = [
  { value: 'ROLE_ADMIN', label: 'Admin' },
  { value: 'ROLE_SALES_EXECUTIVE', label: 'Sales Executive' },
  { value: 'ROLE_PURCHASE_MANAGER', label: 'Purchase Manager' },
  { value: 'ROLE_INVENTORY_MANAGER', label: 'Inventory Manager' },
  { value: 'ROLE_ACCOUNTANT', label: 'Accountant' },
];

export default function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register, handleSubmit, control, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { role: 'ROLE_SALES_EXECUTIVE' }
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    try {
      await authService.register(data.username, data.email, data.password, data.role);
      navigate('/login');
    } catch (err) {
      setError('Registration failed. Username or email may already exist.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: '#f8fafc',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        py: 8,
        backgroundImage: 'radial-gradient(at 0% 0%, hsla(210,100%,98%,1) 0, transparent 50%), radial-gradient(at 50% 0%, hsla(215,100%,94%,1) 0, transparent 50%), radial-gradient(at 100% 0%, hsla(220,100%,90%,1) 0, transparent 50%)',
      }}
    >
      <Container maxWidth="sm">
        <IconButton component={Link} to="/login" sx={{ mb: 2, color: 'text.secondary' }}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h3" sx={{ textAlign: 'center', fontWeight: 800, mb: 4, color: '#1e293b' }}>
          ERP MANAGEMENT
        </Typography>
        <Card sx={{ boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', borderRadius: 4 }}>
          <Box sx={{ height: 8, bgcolor: 'secondary.main' }} />
          <CardContent sx={{ p: { xs: 3, sm: 6 } }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
              New Account
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4 }}>
              Register a new user with appropriate roles
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

            <form onSubmit={handleSubmit(onSubmit)}>
              <TextField
                fullWidth
                label="Username"
                margin="normal"
                variant="outlined"
                {...register('username')}
                error={!!errors.username}
                helperText={errors.username?.message}
                disabled={loading}
              />
              <TextField
                fullWidth
                label="Email Address"
                margin="normal"
                variant="outlined"
                {...register('email')}
                error={!!errors.email}
                helperText={errors.email?.message}
                disabled={loading}
              />
              <TextField
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                margin="normal"
                variant="outlined"
                {...register('password')}
                error={!!errors.password}
                helperText={errors.password?.message}
                disabled={loading}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              
              <FormControl fullWidth margin="normal" error={!!errors.role}>
                <InputLabel>User Role</InputLabel>
                <Controller
                  name="role"
                  control={control}
                  render={({ field }) => (
                    <Select {...field} label="User Role" disabled={loading}>
                      {roles.map((role) => (
                        <MenuItem key={role.value} value={role.value}>
                          {role.label}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                <FormHelperText>{errors.role?.message}</FormHelperText>
              </FormControl>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <RegisterIcon />}
                disabled={loading}
                sx={{ mt: 4, py: 1.5, color: '#fff', fontWeight: 700, textTransform: 'none', fontSize: '1.1rem', bgcolor: 'secondary.main', '&:hover': { bgcolor: 'secondary.dark' } }}
              >
                Create Account
              </Button>
            </form>

            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Already have an account? <Link to="/login" style={{ fontWeight: 700, textDecoration: 'none', color: '#9c27b0' }}>Sign In Instead</Link>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
