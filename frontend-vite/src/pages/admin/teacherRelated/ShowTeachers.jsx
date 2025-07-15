import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import { getAllTeachers } from '../../../redux/teacherRelated/teacherHandle';
import {
    Paper, Table, TableBody, TableContainer,
    TableHead, TablePagination, Button, Box, IconButton,
} from '@mui/material';
import { deleteUser } from '../../../redux/userRelated/userHandle';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import { StyledTableCell, StyledTableRow } from '../../../components/styles';
import { BlueButton, GreenButton } from '../../../components/buttonStyles';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import SpeedDialTemplate from '../../../components/SpeedDialTemplate';
import Popup from '../../../components/Popup';
import { Typography, Grid, Avatar, TextField, InputAdornment, Drawer, Divider, CircularProgress, Snackbar, Alert } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SchoolIcon from '@mui/icons-material/School';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import BarChartIcon from '@mui/icons-material/BarChart';
import CustomBarChart from '../../../components/CustomBarChart';

const mockSubjectDistribution = [
  { subject: 'Math', attendancePercentage: 8 },
  { subject: 'Science', attendancePercentage: 6 },
  { subject: 'English', attendancePercentage: 5 },
  { subject: 'History', attendancePercentage: 4 },
  { subject: 'Geography', attendancePercentage: 3 },
];

const mockTopTeacher = {
  name: 'Priya Verma',
  teachSubject: 'Math',
  teachSclass: 'Class 10',
  avatar: '',
  attendance: 98,
  students: 120,
};

const ShowTeachers = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { teachersList, loading, error, response } = useSelector((state) => state.teacher);
    const { currentUser } = useSelector((state) => state.user);

    useEffect(() => {
        dispatch(getAllTeachers(currentUser._id));
    }, [currentUser._id, dispatch]);

    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");
    const [search, setSearch] = useState('');
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    // Defensive: ensure teachersList is always an array
    const safeTeachersList = Array.isArray(teachersList) ? teachersList : [];

    const filteredRows = safeTeachersList.filter(row =>
        row.name?.toLowerCase().includes(search.toLowerCase()) ||
        (row.teachSubject && String(row.teachSubject).toLowerCase().includes(search.toLowerCase())) ||
        row.teachSclass?.toLowerCase().includes(search.toLowerCase())
    );

    const handleView = (row) => {
        setSelectedTeacher(row);
        setDrawerOpen(true);
    };
    const handleDrawerClose = () => setDrawerOpen(false);
    const handleSnackbarClose = () => setSnackbar({ ...snackbar, open: false });

    if (loading) {
        return <div>Loading...</div>;
    } else if (response) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                <GreenButton variant="contained" onClick={() => navigate("/Admin/teachers/chooseclass")}>
                    Add Teacher
                </GreenButton>
            </Box>
        );
    } else if (error) {
        console.log(error);
    }

    const deleteHandler = (deleteID, address) => {
        console.log(deleteID);
        console.log(address);
        setMessage("Sorry the delete function has been disabled for now.")
        setShowPopup(true)

        // dispatch(deleteUser(deleteID, address)).then(() => {
        //     dispatch(getAllTeachers(currentUser._id));
        // });
    };

    const columns = [
        { id: 'name', label: 'Name', minWidth: 170 },
        { id: 'teachSubject', label: 'Subject', minWidth: 100 },
        { id: 'teachSclass', label: 'Class', minWidth: 170 },
    ];

    const rows = safeTeachersList.map((teacher) => {
        return {
            name: teacher.name || '',
            teachSubject: teacher.teachSubject?.subName || '',
            teachSclass: teacher.teachSclass?.sclassName || '',
            teachSclassID: teacher.teachSclass?._id || '',
            id: teacher._id || '',
        };
    });

    const actions = [
        {
            icon: <PersonAddAlt1Icon color="primary" />, name: 'Add New Teacher',
            action: () => navigate("/Admin/teachers/chooseclass")
        },
        {
            icon: <PersonRemoveIcon color="error" />, name: 'Delete All Teachers',
            action: () => deleteHandler(currentUser._id, "Teachers")
        },
    ];

    const numberOfTeachers = safeTeachersList.length;
    const numberOfSubjects = safeTeachersList ? new Set(safeTeachersList.map(t => t.teachSubject?.subName)).size : 0;

    return (
        <Box sx={{ p: { xs: 1, md: 3 } }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                <Button variant="contained" color="primary" startIcon={<PersonAddAlt1Icon />} onClick={() => navigate('/Admin/teachers/chooseclass')}>
                    Add Teacher
                </Button>
            </Box>
            {/* Summary Cards */}
            <Grid container columns={12} spacing={3} sx={{ mb: 3 }}>
                <Grid sx={{ gridColumn: 'span 4' }}>
                    <Paper sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2, background: 'linear-gradient(135deg, #00b894 0%, #00cec9 100%)', color: '#fff', borderRadius: 3 }}>
                        <SchoolIcon sx={{ fontSize: 40 }} />
                        <Box>
                            <Typography variant="h6">Total Teachers</Typography>
                            <Typography variant="h4">{numberOfTeachers}</Typography>
                        </Box>
                    </Paper>
                </Grid>
                <Grid sx={{ gridColumn: 'span 4' }}>
                    <Paper sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2, background: 'linear-gradient(135deg, #7f56da 0%, #5e60ce 100%)', color: '#fff', borderRadius: 3 }}>
                        <BarChartIcon sx={{ fontSize: 40 }} />
                        <Box>
                            <Typography variant="h6">Subjects Taught</Typography>
                            <Typography variant="h4">{numberOfSubjects}</Typography>
                        </Box>
                    </Paper>
                </Grid>
                <Grid sx={{ gridColumn: 'span 4' }}>
                    <Paper sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2, background: 'linear-gradient(135deg, #ffb300 0%, #ffd600 100%)', color: '#fff', borderRadius: 3 }}>
                        <EmojiEventsIcon sx={{ fontSize: 40 }} />
                        <Box>
                            <Typography variant="h6">Top Teacher</Typography>
                            <Typography variant="h5">{mockTopTeacher.name}</Typography>
                            <Typography variant="body2">{mockTopTeacher.teachSubject} | {mockTopTeacher.teachSclass}</Typography>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
            {/* Chart and Search */}
            <Grid container columns={12} spacing={3} sx={{ mb: 3 }}>
                <Grid sx={{ gridColumn: 'span 6' }}>
                    <Paper sx={{ p: 2, height: 300, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>Subject Distribution</Typography>
                        <CustomBarChart chartData={mockSubjectDistribution} dataKey="attendancePercentage" height={220} />
                    </Paper>
                </Grid>
                <Grid sx={{ gridColumn: 'span 6' }}>
                    <Paper sx={{ p: 3, height: 340, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRadius: 3 }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>Search Teachers</Typography>
                        <TextField
                            fullWidth
                            placeholder="Search by name, subject, or class"
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
            {/* Teachers Table Section */}
            <Box sx={{ mb: 3 }}>
                <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>Teachers List</Typography>
                <Paper sx={{ width: '100%', overflow: 'auto', minHeight: 200, borderRadius: 3 }}>
                    {rows.length === 0 ? (
                        <Box sx={{ p: 4, textAlign: 'center' }}>
                            <Typography variant="h6" color="text.secondary">No teachers found.</Typography>
                        </Box>
                    ) : (
                        <TableContainer>
                            <Table stickyHeader aria-label="sticky table">
                                <TableHead>
                                    <StyledTableRow>
                                        {columns.map((column) => (
                                            <StyledTableCell
                                                key={column.id}
                                                align={column.align}
                                                style={{ minWidth: column.minWidth }}
                                            >
                                                {column.label}
                                            </StyledTableCell>
                                        ))}
                                        <StyledTableCell align="center">
                                            Actions
                                        </StyledTableCell>
                                    </StyledTableRow>
                                </TableHead>
                                <TableBody>
                                    {rows
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row) => {
                                            return (
                                                <StyledTableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                                                    {columns.map((column) => {
                                                        const value = row[column.id];
                                                        if (column.id === 'teachSubject') {
                                                            return (
                                                                <StyledTableCell key={column.id} align={column.align}>
                                                                    {value ? (
                                                                        value
                                                                    ) : (
                                                                        <Button variant="contained"
                                                                            onClick={() => {
                                                                                navigate(`/Admin/teachers/choosesubject/${row.teachSclassID}/${row.id}`)
                                                                            }}>
                                                                            Add Subject
                                                                        </Button>
                                                                    )}
                                                                </StyledTableCell>
                                                            );
                                                        }
                                                        return (
                                                            <StyledTableCell key={column.id} align={column.align}>
                                                                {column.format && typeof value === 'number' ? column.format(value) : value}
                                                            </StyledTableCell>
                                                        );
                                                    })}
                                                    <StyledTableCell align="center">
                                                        <IconButton onClick={() => deleteHandler(row.id, "Teacher")}> <PersonRemoveIcon color="error" /> </IconButton>
                                                        <BlueButton variant="contained" onClick={() => handleView(row)}>View</BlueButton>
                                                    </StyledTableCell>
                                                </StyledTableRow>
                                            );
                                        })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25, 100]}
                        component="div"
                        count={rows.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={(event, newPage) => setPage(newPage)}
                        onRowsPerPageChange={(event) => {
                            setRowsPerPage(parseInt(event.target.value, 5));
                            setPage(0);
                        }}
                    />
                </Paper>
            </Box>
            {/* Teacher Profile Drawer */}
            <Drawer anchor="right" open={drawerOpen} onClose={handleDrawerClose}>
                <Box sx={{ width: 350, p: 3 }}>
                    {selectedTeacher ? (
                        <>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
                                <Avatar sx={{ width: 80, height: 80, mb: 1 }} />
                                <Typography variant="h6">{selectedTeacher.name}</Typography>
                                <Typography variant="body2">Subject: {selectedTeacher.teachSubject}</Typography>
                                <Typography variant="body2">Class: {selectedTeacher.teachSclass}</Typography>
                            </Box>
                            <Divider sx={{ mb: 2 }} />
                            <Typography variant="subtitle1">Attendance: 98%</Typography>
                            <Typography variant="subtitle1">Students: 120</Typography>
                            <Typography variant="subtitle1">Contact: +91-9876543210</Typography>
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

export default ShowTeachers