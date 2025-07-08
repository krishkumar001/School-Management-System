import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import {
    Paper, Box, IconButton, Typography, Grid, TextField, InputAdornment, Alert, Snackbar, Button
} from '@mui/material';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from '@mui/icons-material/Search';
import { getAllNotices } from '../../../redux/noticeRelated/noticeHandle';
import { deleteUser } from '../../../redux/userRelated/userHandle';
import TableTemplate from '../../../components/TableTemplate.jsx';
import { GreenButton } from '../../../components/buttonStyles';
import SpeedDialTemplate from '../../../components/SpeedDialTemplate';

const ShowNotices = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch();
    const { noticesList, loading, error, response } = useSelector((state) => state.notice);
    const { currentUser } = useSelector(state => state.user)

    useEffect(() => {
        dispatch(getAllNotices(currentUser._id, "Notice"));
    }, [currentUser._id, dispatch]);

    if (error) {
        console.log(error);
    }

    const deleteHandler = (deleteID, address) => {
        dispatch(deleteUser(deleteID, address))
            .then(() => {
                dispatch(getAllNotices(currentUser._id, "Notice"));
            })
    }

    const noticeColumns = [
        { id: 'title', label: 'Title', minWidth: 170 },
        { id: 'details', label: 'Details', minWidth: 100 },
        { id: 'date', label: 'Date', minWidth: 170 },
    ];

    const noticeRows = noticesList && noticesList.length > 0 && noticesList.map((notice) => {
        const date = new Date(notice.date);
        const dateString = date.toString() !== "Invalid Date" ? date.toISOString().substring(0, 10) : "Invalid Date";
        return {
            title: notice.title,
            details: notice.details,
            date: dateString,
            id: notice._id,
        };
    });

    const NoticeButtonHaver = ({ row }) => {
        return (
            <>
                <IconButton onClick={() => deleteHandler(row.id, "Notice")}>
                    <DeleteIcon color="error" />
                </IconButton>
            </>
        );
    };

    const actions = [
        {
            icon: <NoteAddIcon color="primary" />, name: 'Add New Notice',
            action: () => navigate("/Admin/addnotice")
        },
        {
            icon: <DeleteIcon color="error" />, name: 'Delete All Notices',
            action: () => deleteHandler(currentUser._id, "Notices")
        }
    ];

    const [search, setSearch] = React.useState('');
    const [snackbar, setSnackbar] = React.useState({ open: false, message: '', severity: 'success' });
    const filteredRows = Array.isArray(noticesList) ? noticesList.filter(notice =>
        notice.title.toLowerCase().includes(search.toLowerCase()) ||
        notice.details.toLowerCase().includes(search.toLowerCase())
    ) : [];
    const numberOfNotices = Array.isArray(noticesList) ? noticesList.length : 0;
    return (
        <Box sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                <Button variant="contained" color="primary" startIcon={<NoteAddIcon />} onClick={() => navigate('/Admin/addnotice')}>
                    Add Notice
                </Button>
            </Box>
            <Grid container columns={12} spacing={3} sx={{ mb: 2 }}>
                <Grid sx={{ gridColumn: 'span 4' }}>
                    <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, background: 'linear-gradient(135deg, #7f56da 0%, #5e60ce 100%)', color: '#fff' }}>
                        <NoteAddIcon sx={{ fontSize: 40 }} />
                        <Box>
                            <Typography variant="h6">Total Notices</Typography>
                            <Typography variant="h4">{numberOfNotices}</Typography>
                        </Box>
                    </Paper>
                </Grid>
                <Grid sx={{ gridColumn: 'span 8' }}>
                    <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                        <TextField
                            fullWidth
                            placeholder="Search by title or details"
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
            ) : numberOfNotices === 0 ? (
                <Paper sx={{ p: 4, textAlign: 'center', color: 'text.secondary', minHeight: 200 }}>
                    <Typography variant="h6">No notices found.</Typography>
                </Paper>
            ) : (
                <Grid container columns={12} spacing={3}>
                    {filteredRows.map((notice, idx) => (
                        <Grid key={notice.id || idx} sx={{ gridColumn: 'span 4' }}>
                            <Paper sx={{ p: 3, minHeight: 180, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderRadius: 3, boxShadow: 3 }}>
                                <Typography variant="h6" sx={{ mb: 1 }}>{notice.title}</Typography>
                                <Typography variant="body2" sx={{ mb: 2 }}>{notice.details}</Typography>
                                <Typography variant="caption" color="text.secondary">{new Date(notice.date).toLocaleDateString()}</Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                                    <IconButton onClick={() => deleteHandler(notice.id, "Notice")}> <DeleteIcon color="error" /> </IconButton>
                                </Box>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            )}
            <SpeedDialTemplate actions={actions} />
            <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
                <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default ShowNotices;