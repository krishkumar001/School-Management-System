import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { getAllStudents } from '../../../redux/studentRelated/studentHandle';
import { deleteUser } from '../../../redux/userRelated/userHandle';
import {
    Paper, Box, IconButton
} from '@mui/material';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import { BlackButton, BlueButton, GreenButton } from '../../../components/buttonStyles';
import TableTemplate from '../../../components/TableTemplate.jsx';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import SpeedDialTemplate from '../../../components/SpeedDialTemplate';

import * as React from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
// import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { KeyboardArrowUp, KeyboardArrowDown } from '@mui/icons-material';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Popup from '../../../components/Popup';
import { Typography, Grid, Avatar, TextField, InputAdornment, Drawer, Divider, CircularProgress, Snackbar, Alert } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SchoolIcon from '@mui/icons-material/School';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import BarChartIcon from '@mui/icons-material/BarChart';
import CustomBarChart from '../../../components/CustomBarChart';
import { useState } from 'react';

const mockClassDistribution = [
  { subject: 'Class 10', attendancePercentage: 30 },
  { subject: 'Class 9', attendancePercentage: 25 },
  { subject: 'Class 8', attendancePercentage: 20 },
  { subject: 'Class 7', attendancePercentage: 15 },
  { subject: 'Class 6', attendancePercentage: 10 },
];

const mockTopStudent = {
  name: 'Aarav Sharma',
  rollNum: '10A-01',
  sclassName: 'Class 10',
  avatar: '',
  attendance: 98,
  marks: 95,
};

const ShowStudents = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch();
    const { studentsList, loading, error, response } = useSelector((state) => state.student);
    const { currentUser } = useSelector(state => state.user)

    useEffect(() => {
        dispatch(getAllStudents(currentUser._id));
    }, [currentUser._id, dispatch]);

    if (error) {
        console.log(error);
    }

    const [showPopup, setShowPopup] = React.useState(false);
    const [message, setMessage] = React.useState("");
    const [search, setSearch] = useState('');
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const deleteHandler = (deleteID, address) => {
        console.log(deleteID);
        console.log(address);
        setMessage("Sorry the delete function has been disabled for now.")
        setShowPopup(true)

        // dispatch(deleteUser(deleteID, address))
        //     .then(() => {
        //         dispatch(getAllStudents(currentUser._id));
        //     })
    }

    const studentColumns = [
        { id: 'name', label: 'Name', minWidth: 170 },
        { id: 'rollNum', label: 'Roll Number', minWidth: 100 },
        { id: 'sclassName', label: 'Class', minWidth: 170 },
    ]

    // Defensive: ensure studentsList is always an array
    const safeStudentsList = Array.isArray(studentsList) ? studentsList : [];

    const studentRows = safeStudentsList.map((student) => {
        return {
            name: student.name || '',
            rollNum: student.rollNum || '',
            sclassName: student.sclassName?.sclassName || '',
            id: student._id || '',
        };
    });

    const filteredRows = studentRows.filter(row =>
        row.name?.toLowerCase().includes(search.toLowerCase()) ||
        String(row.rollNum).toLowerCase().includes(search.toLowerCase()) ||
        row.sclassName.toLowerCase().includes(search.toLowerCase())
    );

    const handleView = (row) => {
        setSelectedStudent(row);
        setDrawerOpen(true);
    };
    const handleDrawerClose = () => setDrawerOpen(false);
    const handleSnackbarClose = () => setSnackbar({ ...snackbar, open: false });

    const StudentButtonHaver = ({ row }) => {
        const options = ['Take Attendance', 'Provide Marks'];

        const [open, setOpen] = React.useState(false);
        const anchorRef = React.useRef(null);
        const [selectedIndex, setSelectedIndex] = React.useState(0);

        const handleClick = () => {
            console.info(`You clicked ${options[selectedIndex]}`);
            if (selectedIndex === 0) {
                handleAttendance();
            } else if (selectedIndex === 1) {
                handleMarks();
            }
        };

        const handleAttendance = () => {
            navigate("/Admin/students/student/attendance/" + row.id)
        }
        const handleMarks = () => {
            navigate("/Admin/students/student/marks/" + row.id)
        };

        const handleMenuItemClick = (event, index) => {
            setSelectedIndex(index);
            setOpen(false);
        };

        const handleToggle = () => {
            setOpen((prevOpen) => !prevOpen);
        };

        const handleClose = (event) => {
            if (anchorRef.current && anchorRef.current.contains(event.target)) {
                return;
            }

            setOpen(false);
        };
        return (
            <>
                <IconButton onClick={() => deleteHandler(row.id, "Student")}>
                    <PersonRemoveIcon color="error" />
                </IconButton>
                <BlueButton variant="contained"
                    onClick={() => handleView(row)}>
                    View
                </BlueButton>
                <React.Fragment>
                    <ButtonGroup variant="contained" ref={anchorRef} aria-label="split button">
                        <Button onClick={handleClick}>{options[selectedIndex]}</Button>
                        <BlackButton
                            size="small"
                            aria-controls={open ? 'split-button-menu' : undefined}
                            aria-expanded={open ? 'true' : undefined}
                            aria-label="select merge strategy"
                            aria-haspopup="menu"
                            onClick={handleToggle}
                        >
                            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                        </BlackButton>
                    </ButtonGroup>
                    <Popper
                        sx={{
                            zIndex: 1,
                        }}
                        open={open}
                        anchorEl={anchorRef.current}
                        role={undefined}
                        transition
                        disablePortal
                    >
                        {({ TransitionProps, placement }) => (
                            <Grow
                                {...TransitionProps}
                                style={{
                                    transformOrigin:
                                        placement === 'bottom' ? 'center top' : 'center bottom',
                                }}
                            >
                                <Paper>
                                    <ClickAwayListener onClickAway={handleClose}>
                                        <MenuList id="split-button-menu" autoFocusItem>
                                            {options.map((option, index) => (
                                                <MenuItem
                                                    key={option}
                                                    disabled={index === 2}
                                                    selected={index === selectedIndex}
                                                    onClick={(event) => handleMenuItemClick(event, index)}
                                                >
                                                    {option}
                                                </MenuItem>
                                            ))}
                                        </MenuList>
                                    </ClickAwayListener>
                                </Paper>
                            </Grow>
                        )}
                    </Popper>
                </React.Fragment>
            </>
        );
    };

    const actions = [
        {
            icon: <PersonAddAlt1Icon color="primary" />, name: 'Add New Student',
            action: () => navigate("/Admin/addstudents")
        },
        {
            icon: <PersonRemoveIcon color="error" />, name: 'Delete All Students',
            action: () => deleteHandler(currentUser._id, "Students")
        },
    ];

    const numberOfStudents = safeStudentsList.length;

    return (
        <Box sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                <Button variant="contained" color="primary" startIcon={<PersonAddAlt1Icon />} onClick={() => navigate('/Admin/addstudents')}>
                    Add Student
                </Button>
            </Box>
            {/* Summary Cards */}
            <Grid container columns={12} spacing={3} sx={{ mb: 2 }}>
                <Grid sx={{ gridColumn: 'span 4' }}>
                    <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, background: 'linear-gradient(135deg, #7f56da 0%, #5e60ce 100%)', color: '#fff' }}>
                        <SchoolIcon sx={{ fontSize: 40 }} />
                        <Box>
                            <Typography variant="h6">Total Students</Typography>
                            <Typography variant="h4">{numberOfStudents}</Typography>
                        </Box>
                    </Paper>
                </Grid>
                <Grid sx={{ gridColumn: 'span 4' }}>
                    <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, background: 'linear-gradient(135deg, #00b894 0%, #00cec9 100%)', color: '#fff' }}>
                        <BarChartIcon sx={{ fontSize: 40 }} />
                        <Box>
                            <Typography variant="h6">Avg. Attendance</Typography>
                            <Typography variant="h4">92%</Typography>
                        </Box>
                    </Paper>
                </Grid>
                <Grid sx={{ gridColumn: 'span 4' }}>
                    <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, background: 'linear-gradient(135deg, #ffb300 0%, #ffd600 100%)', color: '#fff' }}>
                        <EmojiEventsIcon sx={{ fontSize: 40 }} />
                        <Box>
                            <Typography variant="h6">Top Performer</Typography>
                            <Typography variant="h5">{mockTopStudent.name}</Typography>
                            <Typography variant="body2">{mockTopStudent.sclassName} | {mockTopStudent.rollNum}</Typography>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
            {/* Chart */}
            <Grid container columns={12} spacing={3} sx={{ mb: 2 }}>
                <Grid sx={{ gridColumn: 'span 6' }}>
                    <Paper sx={{ p: 2, height: 300, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>Class Distribution</Typography>
                        <CustomBarChart chartData={mockClassDistribution} dataKey="attendancePercentage" height={220} />
                    </Paper>
                </Grid>
                <Grid sx={{ gridColumn: 'span 6' }}>
                    <Paper sx={{ p: 2, height: 300, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>Search Students</Typography>
                        <TextField
                            fullWidth
                            placeholder="Search by name, roll number, or class"
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
                {studentRows.length === 0 ? (
                    <Box sx={{ p: 4, textAlign: 'center' }}>
                        <Typography variant="h6" color="text.secondary">No students found.</Typography>
                    </Box>
                ) : (
                    <TableTemplate
                        columns={studentColumns}
                        rows={filteredRows}
                        buttonHaver={({ row }) => (
                            <>
                                <IconButton onClick={() => deleteHandler(row.id, "Student")}> <PersonRemoveIcon color="error" /> </IconButton>
                                <BlueButton variant="contained" onClick={() => handleView(row)}>View</BlueButton>
                            </>
                        )}
                    />
                )}
            </Paper>
            {/* Student Profile Drawer */}
            <Drawer anchor="right" open={drawerOpen} onClose={handleDrawerClose}>
                <Box sx={{ width: 350, p: 3 }}>
                    {selectedStudent ? (
                        <>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
                                <Avatar sx={{ width: 80, height: 80, mb: 1 }} />
                                <Typography variant="h6">{selectedStudent.name}</Typography>
                                <Typography variant="body2">Roll: {selectedStudent.rollNum}</Typography>
                                <Typography variant="body2">Class: {selectedStudent.sclassName}</Typography>
                            </Box>
                            <Divider sx={{ mb: 2 }} />
                            <Typography variant="subtitle1">Attendance: 92%</Typography>
                            <Typography variant="subtitle1">Marks: 85%</Typography>
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

export default ShowStudents;