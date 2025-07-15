import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { getSubjectList } from '../../../redux/sclassRelated/sclassHandle';
import { deleteUser } from '../../../redux/userRelated/userHandle';
import PostAddIcon from '@mui/icons-material/PostAdd';
import {
    Paper, Box, IconButton,
    Typography, Grid, Avatar, TextField, InputAdornment, Drawer, Divider, CircularProgress, Snackbar, Alert
} from '@mui/material';
import DeleteIcon from "@mui/icons-material/Delete";
import TableTemplate from '../../../components/TableTemplate.jsx';
import { BlueButton, GreenButton } from '../../../components/buttonStyles';
import SpeedDialTemplate from '../../../components/SpeedDialTemplate';
import Popup from '../../../components/Popup';
import SearchIcon from '@mui/icons-material/Search';
import BookIcon from '@mui/icons-material/Book';
import BarChartIcon from '@mui/icons-material/BarChart';
import SchoolIcon from '@mui/icons-material/School';
import CustomBarChart from '../../../components/CustomBarChart';

const ShowSubjects = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const { subjectsList, loading, error, response } = useSelector((state) => state.sclass);
    const { currentUser } = useSelector(state => state.user)

    useEffect(() => {
        dispatch(getSubjectList(currentUser._id, "AllSubjects"));
    }, [currentUser._id, dispatch]);

    if (error) {
        console.log(error);
    }

    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");
    const [search, setSearch] = useState('');
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const deleteHandler = (deleteID, address) => {
        console.log(deleteID);
        console.log(address);
        setMessage("Sorry the delete function has been disabled for now.")
        setShowPopup(true)

        // dispatch(deleteUser(deleteID, address))
        //     .then(() => {
        //         dispatch(getSubjectList(currentUser._id, "AllSubjects"));
        //     })
    }

    const subjectColumns = [
        { id: 'subName', label: 'Sub Name', minWidth: 170 },
        { id: 'sessions', label: 'Sessions', minWidth: 170 },
        { id: 'sclassName', label: 'Class', minWidth: 170 },
    ]

    // Defensive: ensure subjectsList is always an array
    const safeSubjectsList = Array.isArray(subjectsList) ? subjectsList : [];

    const subjectRows = safeSubjectsList.map((subject) => {
        return {
            subName: subject.subName || '',
            sessions: subject.sessions || '',
            sclassName: subject.sclassName?.sclassName || '',
            sclassID: subject.sclassName?._id || '',
            id: subject._id || '',
        };
    });

    const filteredRows = subjectRows.filter(row =>
        row.subName?.toLowerCase().includes(search.toLowerCase()) ||
        String(row.sclassName).toLowerCase().includes(search.toLowerCase())
    );

    const handleView = (row) => {
        setSelectedSubject(row);
        setDrawerOpen(true);
    };
    const handleDrawerClose = () => setDrawerOpen(false);
    const handleSnackbarClose = () => setSnackbar({ ...snackbar, open: false });

    // Dynamic calculations
    const numberOfSubjects = safeSubjectsList.length;
    const numberOfSessions = safeSubjectsList.reduce((acc, s) => acc + (s.sessions || 0), 0);
    const numberOfClasses = new Set(safeSubjectsList.map(s => s.sclassName?.sclassName)).size;
    const subjectDistribution = safeSubjectsList.reduce((acc, s) => {
        const className = s.sclassName?.sclassName || 'Unknown';
        acc[className] = (acc[className] || 0) + 1;
        return acc;
    }, {});
    const chartData = Object.entries(subjectDistribution).map(([subject, count]) => ({ subject, attendancePercentage: count }));

    const SubjectsButtonHaver = ({ row }) => {
        return (
            <>
                <IconButton onClick={() => deleteHandler(row.id, "Subject")}>
                    <DeleteIcon color="error" />
                </IconButton>
                <BlueButton variant="contained"
                    onClick={() => handleView(row)}>
                    View
                </BlueButton>
            </>
        );
    };

    const actions = [
        {
            icon: <PostAddIcon color="primary" />, name: 'Add New Subject',
            action: () => navigate("/Admin/subjects/chooseclass")
        },
        {
            icon: <DeleteIcon color="error" />, name: 'Delete All Subjects',
            action: () => deleteHandler(currentUser._id, "Subjects")
        }
    ];

    return (
        <Box sx={{ p: 2 }}>
            {/* Summary Cards */}
            <Grid container columns={12} spacing={2} sx={{ mb: 2 }}>
                <Grid sx={{ gridColumn: 'span 4' }}>
                    <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, background: 'linear-gradient(135deg, #7f56da 0%, #5e60ce 100%)', color: '#fff' }}>
                        <BookIcon sx={{ fontSize: 40 }} />
                        <Box>
                            <Typography variant="h6">Total Subjects</Typography>
                            <Typography variant="h4">{numberOfSubjects}</Typography>
                        </Box>
                    </Paper>
                </Grid>
                <Grid sx={{ gridColumn: 'span 4' }}>
                    <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, background: 'linear-gradient(135deg, #00b894 0%, #00cec9 100%)', color: '#fff' }}>
                        <BarChartIcon sx={{ fontSize: 40 }} />
                        <Box>
                            <Typography variant="h6">Total Sessions</Typography>
                            <Typography variant="h4">{numberOfSessions}</Typography>
                        </Box>
                    </Paper>
                </Grid>
                <Grid sx={{ gridColumn: 'span 4' }}>
                    <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, background: 'linear-gradient(135deg, #ffb300 0%, #ffd600 100%)', color: '#fff' }}>
                        <SchoolIcon sx={{ fontSize: 40 }} />
                        <Box>
                            <Typography variant="h6">Total Classes</Typography>
                            <Typography variant="h4">{numberOfClasses}</Typography>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
            {/* Chart and Search */}
            <Grid container columns={12} spacing={2} sx={{ mb: 2 }}>
                <Grid sx={{ gridColumn: 'span 6' }}>
                    <Paper sx={{ p: 2, height: 300, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>Subject Distribution</Typography>
                        <CustomBarChart chartData={chartData} dataKey="attendancePercentage" height={220} />
                    </Paper>
                </Grid>
                <Grid sx={{ gridColumn: 'span 6' }}>
                    <Paper sx={{ p: 2, height: 300, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>Search Subjects</Typography>
                        <TextField
                            fullWidth
                            placeholder="Search by subject or class"
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
                {subjectRows.length === 0 ? (
                    <Box sx={{ p: 4, textAlign: 'center' }}>
                        <Typography variant="h6" color="text.secondary">No subjects found.</Typography>
                    </Box>
                ) : (
                    <TableTemplate
                        columns={subjectColumns}
                        rows={filteredRows}
                        buttonHaver={({ row }) => (
                            <>
                                <IconButton onClick={() => deleteHandler(row.id, "Subject")}> <DeleteIcon color="error" /> </IconButton>
                                <BlueButton variant="contained" onClick={() => handleView(row)}>View</BlueButton>
                            </>
                        )}
                    />
                )}
            </Paper>
            {/* Subject Profile Drawer */}
            <Drawer anchor="right" open={drawerOpen} onClose={handleDrawerClose}>
                <Box sx={{ width: 350, p: 3 }}>
                    {selectedSubject ? (
                        <>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
                                <Avatar sx={{ width: 80, height: 80, mb: 1 }} />
                                <Typography variant="h6">{selectedSubject.subName}</Typography>
                                <Typography variant="body2">Class: {selectedSubject.sclassName}</Typography>
                            </Box>
                            <Divider sx={{ mb: 2 }} />
                            <Typography variant="subtitle1">Sessions: {selectedSubject.sessions}</Typography>
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

export default ShowSubjects;