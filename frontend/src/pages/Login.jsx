import React, { useState } from 'react';
import {
  Box, Card, CardContent, TextField, Button,
  Typography, IconButton, InputAdornment, Alert,
  CircularProgress, Container
} from '@mui/material';
import { Visibility, VisibilityOff, Login as LoginIcon } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/auth.service';

const schema = yup.object().shape({
  username: yup.string().required('Username is required'),
  password: yup.string().required('Password is required'),
});

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    try {
      await authService.login(data.username, data.password);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: '#f8fafc',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: 'radial-gradient(at 0% 0%, hsla(210,100%,98%,1) 0, transparent 50%), radial-gradient(at 50% 0%, hsla(215,100%,94%,1) 0, transparent 50%), radial-gradient(at 100% 0%, hsla(220,100%,90%,1) 0, transparent 50%)',
      }}
    >
      <Container maxWidth="sm">
        <Typography variant="h3" sx={{ textAlign: 'center', fontWeight: 800, mb: 4, color: '#1e293b' }}>
          ERP MANAGEMENT
        </Typography>
        <Card sx={{ boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', borderRadius: 4, overflow: 'hidden' }}>
          <Box sx={{ height: 8, bgcolor: 'primary.main' }} />
          <CardContent sx={{ p: 6 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
              Welcome Back
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4 }}>
              Enter your credentials to access the system
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
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <LoginIcon />}
                disabled={loading}
                sx={{ mt: 4, py: 1.5, fontWeight: 700, textTransform: 'none', fontSize: '1.1rem' }}
              >
                Sign In
              </Button>
            </form>

            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Don't have an account? <Link to="/register" style={{ fontWeight: 700, textDecoration: 'none', color: '#1976d2' }}>Contact Admin</Link>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
