import { useState } from 'react';
import {
    CssBaseline,
    Box,
    Toolbar,
    List,
    Typography,
    Divider,
    IconButton,
    Skeleton,
    Card,
    CardContent,
    Avatar,
    Grid,
    Chip,
    Button,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import StudentSideBar from './StudentSideBar';
import { Navigate, Route, Routes, useNavigate, Link } from 'react-router-dom';
import StudentHomePage from './StudentHomePage';
import StudentProfile from './StudentProfile';
import StudentSubjects from './StudentSubjects';
import ViewStdAttendance from './ViewStdAttendance';
import StudentComplain from './StudentComplain';
import Logout from '../Logout'
import AccountMenu from '../../components/AccountMenu';
import { AppBar, Drawer } from '../../components/styles';
import Messages from '../../pages/Messages.jsx';
import AnalyticsDashboard from '../../pages/AnalyticsDashboard.jsx';
import { useSelector } from 'react-redux';
import SchoolIcon from '@mui/icons-material/School';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import GradeIcon from '@mui/icons-material/Grade';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import styled from 'styled-components';
import CustomBarChart from '../../components/CustomBarChart';

const StudentDashboard = () => {
    const [open, setOpen] = useState(true);
    const toggleDrawer = () => {
        setOpen(!open);
    };
    const loading = false;
    const { currentUser, userDetails } = useSelector(state => state.user);
    const navigate = useNavigate();
    
    // Fallbacks for demo
    const studentName = currentUser?.name || 'Student';
    const avatar = currentUser?.avatar || '';
    const attendance = userDetails?.attendance || [];
    const marks = userDetails?.examResult || [];
    const notices = [
        { title: 'Welcome to the new semester!', date: '2024-07-01' },
        { title: 'Exam schedule released', date: '2024-07-10' },
    ];
    // Attendance summary
    const presentCount = attendance.filter(a => a.status === 'Present').length;
    const totalCount = attendance.length;
    const attendancePercent = totalCount ? Math.round((presentCount / totalCount) * 100) : 0;
    // Marks summary (last 3 subjects)
    const recentMarks = marks.slice(-3);

    return (
        <BgWrapper>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <AppBar open={open} position='absolute'>
                    <Toolbar sx={{ pr: '24px' }}>
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="open drawer"
                            onClick={toggleDrawer}
                            sx={{
                                marginRight: '36px',
                                ...(open && { display: 'none' }),
                            }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography
                            component="h1"
                            variant="h6"
                            color="inherit"
                            noWrap
                            sx={{ flexGrow: 1 }}
                        >
                            Student Dashboard
                        </Typography>
                        <AccountMenu />
                    </Toolbar>
                </AppBar>
                <Drawer variant="permanent" open={open} sx={open ? styles.drawerStyled : styles.hideDrawer}>
                    <Toolbar sx={styles.toolBarStyled}>
                        <IconButton onClick={toggleDrawer}>
                            <ChevronLeftIcon />
                        </IconButton>
                    </Toolbar>
                    <Divider />
                    <List component="nav">
                        <StudentSideBar />
                    </List>
                </Drawer>
                <Box component="main" sx={styles.boxStyled}>
                    <Toolbar />
                    <MainContainer>
                        <GlassCard>
                            <Grid container spacing={3} alignItems="center">
                                <Grid item xs={12} md={3} sx={{ display: 'flex', justifyContent: 'center' }}>
                                    <Avatar src={avatar} sx={{ width: 90, height: 90, boxShadow: 2, bgcolor: '#ffbfae', fontSize: 40 }}>
                                        {studentName[0]}
                                    </Avatar>
                                </Grid>
                                <Grid item xs={12} md={9}>
                                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#a85d3c' }}>
                                        Welcome, {studentName}!
                                    </Typography>
                                    <Typography variant="subtitle1" sx={{ color: '#ff8c42', mb: 1 }}>
                                        Ready for a great day of learning?
                                    </Typography>
                                    <Grid container spacing={2}>
                                        <Grid item>
                                            <Chip icon={<SchoolIcon />} label="Class 12" color="primary" sx={{ bgcolor: '#ffe0c3', color: '#a85d3c', fontWeight: 600 }} />
                                        </Grid>
                                        <Grid item>
                                            <Chip icon={<EventAvailableIcon />} label={`Attendance: ${attendancePercent}%`} sx={{ bgcolor: '#fbc2eb', color: '#a85d3c', fontWeight: 600 }} />
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </GlassCard>
                        <Grid container spacing={3} sx={{ mt: 2 }}>
                            <Grid item xs={12} md={4}>
                                <InfoCard>
                                    <Typography variant="h6" sx={{ color: '#a85d3c', fontWeight: 700 }}>
                                        Recent Attendance
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#a85d3c', mb: 1 }}>
                                        Present: {presentCount} / {totalCount}
                                    </Typography>
                                    <CustomBarChart chartData={[{ name: 'Attendance', attendance: attendancePercent }]} dataKey="attendance" />
                                    <Button 
                                        onClick={() => navigate('/Student/attendance')} 
                                        endIcon={<ArrowForwardIosIcon />} 
                                        sx={{ mt: 1, color: '#ff8c42', fontWeight: 600 }}
                                    >
                                        View Attendance
                                    </Button>
                                </InfoCard>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <InfoCard>
                                    <Typography variant="h6" sx={{ color: '#a85d3c', fontWeight: 700 }}>
                                        Recent Marks
                                    </Typography>
                                    {recentMarks.length > 0 ? recentMarks.map((m, i) => (
                                        <Typography key={i} variant="body2" sx={{ color: '#a85d3c' }}>
                                            {m.subName?.subName || 'Subject'}: <b>{m.marksObtained}</b>
                                        </Typography>
                                    )) : <Typography variant="body2" sx={{ color: '#a85d3c' }}>No marks yet.</Typography>}
                                    <Button 
                                        onClick={() => navigate('/Student/subjects')} 
                                        endIcon={<ArrowForwardIosIcon />} 
                                        sx={{ mt: 1, color: '#ff8c42', fontWeight: 600 }}
                                    >
                                        View Subjects
                                    </Button>
                                </InfoCard>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <InfoCard>
                                    <Typography variant="h6" sx={{ color: '#a85d3c', fontWeight: 700 }}>
                                        Notices
                                    </Typography>
                                    {notices.map((n, i) => (
                                        <Typography key={i} variant="body2" sx={{ color: '#a85d3c' }}>
                                            <AnnouncementIcon sx={{ fontSize: 18, color: '#ff8c42', mr: 0.5 }} /> {n.title}
                                        </Typography>
                                    ))}
                                    <Button 
                                        onClick={() => navigate('/Student/messages')} 
                                        endIcon={<ArrowForwardIosIcon />} 
                                        sx={{ mt: 1, color: '#ff8c42', fontWeight: 600 }}
                                    >
                                        View Messages
                                    </Button>
                                </InfoCard>
                            </Grid>
                        </Grid>
                        <QuickLinksContainer>
                            <Button variant="contained" onClick={() => navigate('/Student/profile')} sx={quickLinkBtn}>Profile</Button>
                            <Button variant="contained" onClick={() => navigate('/Student/subjects')} sx={quickLinkBtn}>Subjects</Button>
                            <Button variant="contained" onClick={() => navigate('/Student/attendance')} sx={quickLinkBtn}>Attendance</Button>
                            <Button variant="contained" onClick={() => navigate('/Student/complain')} sx={quickLinkBtn}>Complaints</Button>
                            <Button variant="contained" onClick={() => navigate('/Student/messages')} sx={quickLinkBtn}>Messages</Button>
                        </QuickLinksContainer>
                    </MainContainer>
                </Box>
            </Box>
        </BgWrapper>
    );
}

export default StudentDashboard

const styles = {
    boxStyled: {
        backgroundColor: (theme) =>
            theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
    },
    toolBarStyled: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        px: [1],
    },
    drawerStyled: {
        display: "flex"
    },
    hideDrawer: {
        display: 'flex',
        '@media (max-width: 600px)': {
            display: 'none',
        },
    },
}

// Styled components
const BgWrapper = styled.div`
  min-height: 100vh;
  width: 100vw;
  background: linear-gradient(120deg, #fbc2eb 0%, #fcd6a1 100%);
  position: relative;
  overflow: auto;
`;
const MainContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 12px 32px 12px;
`;
const GlassCard = styled(Card)`
  background: rgba(255,245,235,0.82) !important;
  box-shadow: 0 8px 32px 0 rgba(255, 183, 94, 0.13) !important;
  border-radius: 28px !important;
  margin-bottom: 32px;
`;
const InfoCard = styled(Card)`
  background: rgba(255,255,255,0.85) !important;
  border-radius: 18px !important;
  box-shadow: 0 4px 16px 0 rgba(255,183,94,0.10) !important;
  padding: 18px 10px 10px 18px;
`;
const QuickLinksContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 32px;
  justify-content: center;
`;
const quickLinkBtn = {
  bgcolor: '#ff8c42',
  color: '#fff',
  fontWeight: 700,
  borderRadius: 3,
  px: 3,
  py: 1.2,
  fontSize: '1.1rem',
  boxShadow: '0 2px 8px 0 rgba(255,183,94,0.10)',
  '&:hover': { bgcolor: '#a85d3c' }
};