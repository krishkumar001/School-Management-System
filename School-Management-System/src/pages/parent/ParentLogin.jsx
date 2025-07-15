import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper, CircularProgress, Alert } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ParentLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/ParentLogin`, { email, password });
      localStorage.setItem('parent', JSON.stringify(res.data.parent));
      localStorage.setItem('parentToken', res.data.token);
      navigate('/Parent/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)' }}>
      <Paper sx={{ p: 4, minWidth: 350, borderRadius: 3, boxShadow: 3 }}>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>Parent Login</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            fullWidth
            required
            sx={{ mb: 2 }}
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            fullWidth
            required
            sx={{ mb: 2 }}
          />
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading} sx={{ fontWeight: 600 }}>
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
          </Button>
        </form>
        <Button color="secondary" sx={{ mt: 2 }} onClick={() => navigate('/Parent/register')}>Don't have an account? Register</Button>
      </Paper>
    </Box>
  );
};

export default ParentLogin; 