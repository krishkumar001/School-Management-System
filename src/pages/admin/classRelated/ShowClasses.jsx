import { useEffect, useState } from 'react';
import { IconButton, Box, Menu, MenuItem, ListItemIcon, Tooltip } from '@mui/material';
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { deleteUser } from '../../../redux/userRelated/userHandle';
import { getAllSclasses } from '../../../redux/sclassRelated/sclassHandle';
import { BlueButton, GreenButton } from '../../../components/buttonStyles';
import TableTemplate from '../../../components/TableTemplate.jsx';

import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import PostAddIcon from '@mui/icons-material/PostAdd';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import AddCardIcon from '@mui/icons-material/AddCard';
import styled from 'styled-components';
import SpeedDialTemplate from '../../../components/SpeedDialTemplate';
import Popup from '../../../components/Popup';
import { Typography, Grid, Avatar, TextField, InputAdornment, Drawer, Divider, CircularProgress, Snackbar, Alert, Paper } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SchoolIcon from '@mui/icons-material/School';
import GroupIcon from '@mui/icons-material/Group';
import BookIcon from '@mui/icons-material/Book';
import BarChartIcon from '@mui/icons-material/BarChart';
import CustomBarChart from '../../../components/CustomBarChart';

const mockClassDistribution = [
  { subject: 'Class 10', attendancePercentage: 30 },
  { subject: 'Class 9', attendancePercentage: 25 },
  { subject: 'Class 8', attendancePercentage: 20 },
  { subject: 'Class 7', attendancePercentage: 15 },
  { subject: 'Class 6', attendancePercentage: 10 },
];

const ShowClasses = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch();

  const { sclassesList, loading, error, getresponse } = useSelector((state) => state.sclass);
  const { currentUser } = useSelector(state => state.user)

  const adminID = currentUser._id

  useEffect(() => {
    dispatch(getAllSclasses(adminID, "Sclass"));
  }, [adminID, dispatch]);

  if (error) {
    console.log(error)
  }

  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState('');
  const [selectedClass, setSelectedClass] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const deleteHandler = (deleteID, address) => {
    console.log(deleteID);
    console.log(address);
    setMessage("Sorry the delete function has been disabled for now.")
    setShowPopup(true)
    // dispatch(deleteUser(deleteID, address))
    //   .then(() => {
    //     dispatch(getAllSclasses(adminID, "Sclass"));
    //   })
  }

  const sclassColumns = [
    { id: 'name', label: 'Class Name', minWidth: 170 },
  ]

  // Defensive: ensure sclassesList is always an array
  const safeSclassesList = Array.isArray(sclassesList) ? sclassesList : [];

  const sclassRows = safeSclassesList.map((sclass) => {
    return {
      name: sclass.sclassName || '',
      id: sclass._id || '',
    };
  });

  const filteredRows = sclassRows.filter(row =>
    String(row.name).toLowerCase().includes(search.toLowerCase())
  );

  const handleView = (row) => {
    setSelectedClass(row);
    setDrawerOpen(true);
  };
  const handleDrawerClose = () => setDrawerOpen(false);
  const handleSnackbarClose = () => setSnackbar({ ...snackbar, open: false });

  const numberOfClasses = safeSclassesList.length;
  // For demo, use mock numbers
  const numberOfStudents = 250;
  const numberOfSubjects = 18;

  const SclassButtonHaver = ({ row }) => {
    const actions = [
      { icon: <PostAddIcon />, name: 'Add Subjects', action: () => navigate("/Admin/addsubject/" + row.id) },
      { icon: <PersonAddAlt1Icon />, name: 'Add Student', action: () => navigate("/Admin/class/addstudents/" + row.id) },
    ];
    return (
      <ButtonContainer>
        <IconButton onClick={() => deleteHandler(row.id, "Sclass")} color="secondary">
          <DeleteIcon color="error" />
        </IconButton>
        <BlueButton variant="contained" onClick={() => handleView(row)}>View</BlueButton>
        <ActionMenu actions={actions} />
      </ButtonContainer>
    );
  };

  const ActionMenu = ({ actions }) => {
    const [anchorEl, setAnchorEl] = useState(null);

    const open = Boolean(anchorEl);

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };
    return (
      <>
        <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
          <Tooltip title="Add Students & Subjects">
            <IconButton
              onClick={handleClick}
              size="small"
              sx={{ ml: 2 }}
              aria-controls={open ? 'account-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
            >
              <h5>Add</h5>
              <SpeedDialIcon />
            </IconButton>
          </Tooltip>
        </Box>
        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          PaperProps={{
            elevation: 0,
            sx: styles.styledPaper,
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          {actions.map((action) => (
            <MenuItem onClick={action.action}>
              <ListItemIcon fontSize="small">
                {action.icon}
              </ListItemIcon>
              {action.name}
            </MenuItem>
          ))}
        </Menu>
      </>
    );
  }

  const actions = [
    {
      icon: <AddCardIcon color="primary" />, name: 'Add New Class',
      action: () => navigate("/Admin/addclass")
    },
    {
      icon: <DeleteIcon color="error" />, name: 'Delete All Classes',
      action: () => deleteHandler(adminID, "Sclasses")
    },
  ];

  return (
    <Box sx={{ p: 2 }}>
      {/* Summary Cards */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, background: 'linear-gradient(135deg, #7f56da 0%, #5e60ce 100%)', color: '#fff' }}>
            <SchoolIcon sx={{ fontSize: 40 }} />
            <Box>
              <Typography variant="h6">Total Classes</Typography>
              <Typography variant="h4">{numberOfClasses}</Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, background: 'linear-gradient(135deg, #00b894 0%, #00cec9 100%)', color: '#fff' }}>
            <GroupIcon sx={{ fontSize: 40 }} />
            <Box>
              <Typography variant="h6">Total Students</Typography>
              <Typography variant="h4">{numberOfStudents}</Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, background: 'linear-gradient(135deg, #ffb300 0%, #ffd600 100%)', color: '#fff' }}>
            <BookIcon sx={{ fontSize: 40 }} />
            <Box>
              <Typography variant="h6">Total Subjects</Typography>
              <Typography variant="h4">{numberOfSubjects}</Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      {/* Chart and Search */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: 300, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Class Distribution</Typography>
            <CustomBarChart chartData={mockClassDistribution} dataKey="attendancePercentage" height={220} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: 300, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Search Classes</Typography>
            <TextField
              fullWidth
              placeholder="Search by class name"
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
      {/* Table */}
      <Paper sx={{ width: '100%', overflow: 'auto', mb: 2, minHeight: 200 }}>
        {sclassRows.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">No classes found.</Typography>
          </Box>
        ) : (
          <TableTemplate
            columns={sclassColumns}
            rows={filteredRows}
            buttonHaver={({ row }) => (
              <ButtonContainer>
                <IconButton onClick={() => deleteHandler(row.id, "Sclass")} color="secondary">
                  <DeleteIcon color="error" />
                </IconButton>
                <BlueButton variant="contained" onClick={() => handleView(row)}>View</BlueButton>
                <ActionMenu actions={[
                  { icon: <PostAddIcon />, name: 'Add Subjects', action: () => navigate("/Admin/addsubject/" + row.id) },
                  { icon: <PersonAddAlt1Icon />, name: 'Add Student', action: () => navigate("/Admin/class/addstudents/" + row.id) },
                ]} />
              </ButtonContainer>
            )}
            loading={loading}
          />
        )}
      </Paper>
      {/* Class Profile Drawer */}
      <Drawer anchor="right" open={drawerOpen} onClose={handleDrawerClose}>
        <Box sx={{ width: 350, p: 3 }}>
          {selectedClass ? (
            <>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ width: 80, height: 80, mb: 1 }} />
                <Typography variant="h6">{selectedClass.name}</Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="subtitle1">Students: 50</Typography>
              <Typography variant="subtitle1">Subjects: 5</Typography>
              <Typography variant="subtitle1">Class Teacher: Mr. Sharma</Typography>
            </>
          ) : <CircularProgress />}
        </Box>
      </Drawer>
      {/* Snackbar for feedback */}
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
      {/* Speed Dial */}
      <SpeedDialTemplate actions={actions} />
      {/* Popup for delete disabled */}
      <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
    </Box>
  );
};

export default ShowClasses;

const styles = {
  styledPaper: {
    overflow: 'visible',
    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
    mt: 1.5,
    '& .MuiAvatar-root': {
      width: 32,
      height: 32,
      ml: -0.5,
      mr: 1,
    },
    '&:before': {
      content: '""',
      display: 'block',
      position: 'absolute',
      top: 0,
      right: 14,
      width: 10,
      height: 10,
      bgcolor: 'background.paper',
      transform: 'translateY(-50%) rotate(45deg)',
      zIndex: 0,
    },
  }
}

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
`;