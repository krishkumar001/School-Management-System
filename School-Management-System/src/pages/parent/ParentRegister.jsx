import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, Paper, CircularProgress, Alert, MenuItem, Select, InputLabel, FormControl, OutlinedInput, Checkbox, ListItemText } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ParentRegister = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [school, setSchool] = useState('');
  const [children, setChildren] = useState([]);
  const [allSchools, setAllSchools] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch all schools (admins)
    axios.get(`${import.meta.env.VITE_BASE_URL}/AdminList`)
      .then(res => setAllSchools(res.data))
      .catch(() => setAllSchools([]));
  }, []);

  useEffect(() => {
    // Fetch all students for the selected school
    if (school) {
      axios.get(`${import.meta.env.VITE_BASE_URL}/Students/${school}`)
        .then(res => setAllStudents(Array.isArray(res.data) ? res.data : []))
        .catch(() => setAllStudents([]));
    } else {
      setAllStudents([]);
    }
  }, [school]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.post(`${import.meta.env.VITE_BASE_URL}/ParentReg`, { name, email, password, children, school });
      setSuccess('Registration successful! Please login.');
      setTimeout(() => navigate('/Parent/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)' }}>
      <Paper sx={{ p: 4, minWidth: 350, borderRadius: 3, boxShadow: 3 }}>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>Parent Registration</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Name"
            value={name}
            onChange={e => setName(e.target.value)}
            fullWidth
            required
            sx={{ mb: 2 }}
          />
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
          <FormControl fullWidth sx={{ mb: 2 }} required>
            <InputLabel id="school-label">School</InputLabel>
            <Select
              labelId="school-label"
              value={school}
              onChange={e => setSchool(e.target.value)}
              input={<OutlinedInput label="School" />}
            >
              {allSchools.map(sch => (
                <MenuItem key={sch._id} value={sch._id}>{sch.name || sch.email}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ mb: 2 }} required>
            <InputLabel id="children-label">Children</InputLabel>
            <Select
              labelId="children-label"
              multiple
              value={children}
              onChange={e => setChildren(e.target.value)}
              input={<OutlinedInput label="Children" />}
              renderValue={selected => selected.map(id => {
                const stu = allStudents.find(s => s._id === id);
                return stu ? stu.name : id;
              }).join(', ')}
            >
              {allStudents.map(stu => (
                <MenuItem key={stu._id} value={stu._id}>
                  <Checkbox checked={children.indexOf(stu._id) > -1} />
                  <ListItemText primary={stu.name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
          <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading} sx={{ fontWeight: 600 }}>
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Register'}
          </Button>
        </form>
        <Button color="secondary" sx={{ mt: 2 }} onClick={() => navigate('/Parent/login')}>Already have an account? Login</Button>
      </Paper>
    </Box>
  );
};

export default ParentRegister; 