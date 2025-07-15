import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Paper, Box, Checkbox, Typography, Grid, TextField, InputAdornment, Alert, Snackbar, Button, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import { getAllComplains } from '../../../redux/complainRelated/complainHandle';
import TableTemplate from '../../../components/TableTemplate.jsx';
import SearchIcon from '@mui/icons-material/Search';
import StudentComplain from '../../student/StudentComplain.jsx';

const SeeComplains = () => {

  const label = { inputProps: { 'aria-label': 'Checkbox demo' } };  const dispatch = useDispatch();
  const { complainsList, loading, error, response } = useSelector((state) => state.complain);
  const { currentUser } = useSelector(state => state.user)
  const userRole = currentUser?.role;

  useEffect(() => {
    dispatch(getAllComplains(currentUser._id, "Complain"));
  }, [currentUser._id, dispatch]);

  if (error) {
    console.log(error);
  }

  const complainColumns = [
    { id: 'user', label: 'User', minWidth: 170 },
    { id: 'complaint', label: 'Complaint', minWidth: 100 },
    { id: 'date', label: 'Date', minWidth: 170 },
  ];

  const complainRows = complainsList && complainsList.length > 0 && complainsList.map((complain) => {
    const date = new Date(complain.date);
    const dateString = date.toString() !== "Invalid Date" ? date.toISOString().substring(0, 10) : "Invalid Date";
    return {
      user: complain.user.name,
      complaint: complain.complaint,
      date: dateString,
      id: complain._id,
    };
  });

  const ComplainButtonHaver = ({ row }) => {
    return (
      <>
        <Checkbox {...label} />
      </>
    );
  };

  const [search, setSearch] = React.useState('');
  const [snackbar, setSnackbar] = React.useState({ open: false, message: '', severity: 'success' });
  const filteredRows = Array.isArray(complainsList) ? complainsList.filter(complain =>
      complain.user.name.toLowerCase().includes(search.toLowerCase()) ||
      complain.complaint.toLowerCase().includes(search.toLowerCase())
  ) : [];
  const numberOfComplains = Array.isArray(complainsList) ? complainsList.length : 0;

  const [openDialog, setOpenDialog] = React.useState(false);
  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        {(userRole === 'student' || userRole === 'teacher') && (
          <Button variant="contained" color="primary" onClick={handleOpenDialog}>
            Add Complaint
          </Button>
        )}
      </Box>
      {(userRole === 'student' || userRole === 'teacher') && (
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>Add Complaint</DialogTitle>
          <DialogContent>
            <StudentComplain onClose={handleCloseDialog} />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Close</Button>
          </DialogActions>
        </Dialog>
      )}
      <Grid container columns={12} spacing={3} sx={{ mb: 2 }}>
        <Grid sx={{ gridColumn: 'span 4' }}>
          <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, background: 'linear-gradient(135deg, #ff7675 0%, #fd79a8 100%)', color: '#fff' }}>
            <Typography variant="h6">Total Complaints</Typography>
            <Typography variant="h4">{numberOfComplains}</Typography>
          </Paper>
        </Grid>
        <Grid sx={{ gridColumn: 'span 8' }}>
          <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
            <TextField
              fullWidth
              placeholder="Search by user or complaint"
              value={search}
              onChange={e => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Paper>
        </Grid>
      </Grid>
      {loading ? (
        <div>Loading...</div>
      ) : numberOfComplains === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center', color: 'text.secondary', minHeight: 200 }}>
          <Typography variant="h6">No complaints found.</Typography>
        </Paper>
      ) : (
        <Paper sx={{ width: '100%', overflow: 'auto', mb: 2, minHeight: 200 }}>
          <TableTemplate buttonHaver={ComplainButtonHaver} columns={complainColumns} rows={filteredRows} />
        </Paper>
      )}
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SeeComplains;