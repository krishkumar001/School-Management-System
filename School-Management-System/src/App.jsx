import React, { Component, useMemo, useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import Homepage from './pages/Homepage';
import AdminDashboard from './pages/admin/AdminDashboard';
import StudentDashboard from './pages/student/StudentDashboard';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import LoginPage from './pages/LoginPage';
import AdminRegisterPage from './pages/admin/AdminRegisterPage';
import ChooseUser from './pages/ChooseUser';
import AnalyticsDashboard from './pages/AnalyticsDashboard.jsx';
import ParentLogin from './pages/parent/ParentLogin.jsx';
import ParentRegister from './pages/parent/ParentRegister.jsx';
import ParentDashboard from './pages/parent/ParentDashboard.jsx';
import Messages from './pages/Messages.jsx';
import NotificationBell from './components/NotificationBell';
import { ThemeProvider, createTheme, CssBaseline, IconButton, Box, Snackbar, Alert as MuiAlert } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { io } from 'socket.io-client';
import ShowNotices from './pages/admin/noticeRelated/ShowNotices.jsx';
import SeeComplains from './pages/admin/studentRelated/SeeComplains.jsx';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    // You can log error info here
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 40, textAlign: 'center', color: 'red' }}>
          <h2>Something went wrong.</h2>
          <pre>{this.state.error && this.state.error.toString()}</pre>
          <button onClick={() => window.location.reload()}>Reload</button>
        </div>
      );
    }
    return this.props.children;
  }
}

const App = () => {
  const [mode, setMode] = useState(() => localStorage.getItem('themeMode') || 'light');
  const theme = useMemo(() => createTheme({
    palette: {
      mode,
      ...(mode === 'dark'
        ? {
            primary: { main: '#90caf9' },
            secondary: { main: '#f48fb1' },
            background: {
              default: '#121212',
              paper: '#1e1e1e',
            },
            text: {
              primary: '#fff',
              secondary: '#b0b0b0',
            },
          }
        : {
            primary: { main: '#5e60ce' },
            secondary: { main: '#00b894' },
            background: {
              default: '#f9f9fb',
              paper: '#fff',
            },
            text: {
              primary: '#1a1a1a',
              secondary: '#444',
            },
          }),
    },
    shape: { borderRadius: 12 },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
    },
  }), [mode]);

  const handleToggleMode = () => {
    setMode(prev => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('themeMode', next);
      return next;
    });
  };

  const { currentRole } = useSelector(state => state.user);
  const navigate = useNavigate();
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    const socket = io(import.meta.env.VITE_BASE_URL || 'http://localhost:5000');
    socket.on('newNotice', (notice) => {
      setNotification({ open: true, message: `New Notice: ${notice.title || 'Untitled'}`, severity: 'info' });
      setNotifications(prev => [
        { message: `New Notice: ${notice.title || 'Untitled'}`, time: Date.now(), unread: true, link: `/notices/${notice._id}` },
        ...prev
      ]);
      setUnreadCount(c => c + 1);
    });
    socket.on('newComplaint', (complaint) => {
      setNotification({ open: true, message: `New Complaint received`, severity: 'warning' });
      setNotifications(prev => [
        { message: 'New Complaint received', time: Date.now(), unread: true, link: '/complaints' },
        ...prev
      ]);
      setUnreadCount(c => c + 1);
    });
    return () => { socket.disconnect(); };
  }, []);

  const handleBellClick = (event) => {
    setAnchorEl(event.currentTarget);
    setUnreadCount(0);
  };
  const handleBellClose = () => setAnchorEl(null);
  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    setUnreadCount(0);
  };
  const notificationClick = (notif) => {
    setNotifications(prev => prev.map(n => n === notif ? { ...n, unread: false } : n));
    if (notif.link) navigate(notif.link);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ position: 'fixed', top: 16, right: 16, zIndex: 2000, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
        <NotificationBell
          notifications={notifications}
          unreadCount={unreadCount}
          onClick={handleBellClick}
          anchorEl={anchorEl}
          onClose={handleBellClose}
          markAllAsRead={markAllAsRead}
          notificationClick={notificationClick}
        />
        <IconButton onClick={handleToggleMode} color="primary" size="large">
          {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
      </Box>
      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={() => setNotification({ ...notification, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <MuiAlert onClose={() => setNotification({ ...notification, open: false })} severity={notification.severity} sx={{ width: '100%' }}>
          {notification.message}
        </MuiAlert>
      </Snackbar>
      <ErrorBoundary>
        <div>
          <div style={{background: 'var(--primary-color)', color: '#fff', padding: '1em', textAlign: 'center', fontWeight: 'bold', fontSize: '1.5em', letterSpacing: '1px', boxShadow: '0 2px 8px rgba(25,118,210,0.1)'}}>
            Welcome to Schoolstan – Smart School Management by Krish Kumar
          </div>
          {currentRole === null &&
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/choose" element={<ChooseUser visitor="normal" />} />
              <Route path="/chooseasguest" element={<ChooseUser visitor="guest" />} />

              <Route path="/Adminlogin" element={<LoginPage role="Admin" />} />
              <Route path="/Studentlogin" element={<LoginPage role="Student" />} />
              <Route path="/Teacherlogin" element={<LoginPage role="Teacher" />} />
              <Route path="/Parent/login" element={<ParentLogin />} />
              <Route path="/Parent/register" element={<ParentRegister />} />
              <Route path="/Parent/dashboard" element={<ParentDashboard />} />
              <Route path="/Parent/*" element={<ParentLogin />} />

              <Route path="/Adminregister" element={<AdminRegisterPage />} />
              <Route path="/Admin/analytics" element={<AnalyticsDashboard />} />
              <Route path="/Teacher/analytics" element={<AnalyticsDashboard />} />
              <Route path="/Student/analytics" element={<AnalyticsDashboard />} />
              <Route path="/Admin/messages" element={<Messages />} />
              <Route path="/Teacher/messages" element={<Messages />} />
              <Route path="/Student/messages" element={<Messages />} />
              <Route path="/Parent/messages" element={<Messages />} />
              <Route path="/notices" element={<ShowNotices />} />
              <Route path="/notices/:id" element={<NoticeDetail />} />
              <Route path="/complaints" element={<SeeComplains />} />

              <Route path='*' element={<Navigate to="/" />} />
            </Routes>}

          {currentRole === "Admin" &&
            <>
              <AdminDashboard />
            </>
          }

          {currentRole === "Student" &&
            <>
              <StudentDashboard />
            </>
          }

          {currentRole === "Teacher" &&
            <>
              <TeacherDashboard />
            </>
          }
        </div>
      </ErrorBoundary>
    </ThemeProvider>
  )
}

export default App

// Placeholder for NoticeDetail
const NoticeDetail = () => <div style={{padding:40}}><h2>Notice Detail Page (To be implemented)</h2></div>;