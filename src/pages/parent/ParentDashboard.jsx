import React, { useEffect, useState, useRef } from 'react';
import { Box, Typography, Paper, Card, CardContent, Grid, CircularProgress, Alert, Divider, Table, TableHead, TableRow, TableCell, TableBody, Button, Avatar, Skeleton } from '@mui/material';
import axios from 'axios';
import CustomBarChart from '../../components/CustomBarChart.jsx';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import { Routes, Route, Navigate } from 'react-router-dom';
import Messages from '../../pages/Messages.jsx';
import AnalyticsDashboard from '../../pages/AnalyticsDashboard.jsx';

const ParentDashboard = () => {
  const [parent, setParent] = useState(null);
  const [children, setChildren] = useState([]);
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedChild, setSelectedChild] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [avatarLoading, setAvatarLoading] = useState(false);
  const fileInputRef = useRef();

  useEffect(() => {
    const stored = localStorage.getItem('parent');
    if (stored) {
      const parsed = JSON.parse(stored);
      setParent(parsed);
      setAvatarPreview(parsed.avatar || '');
    } else setError('Not logged in as parent');
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!parent) return;
      setLoading(true);
      setError('');
      try {
        const [childrenRes, noticesRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_BASE_URL}/ParentChildren/${parent._id}`),
          axios.get(`${import.meta.env.VITE_BASE_URL}/ParentNotices/${parent._id}`)
        ]);
        setChildren(childrenRes.data);
        setNotices(Array.isArray(noticesRes.data) ? noticesRes.data : []);
        setSelectedChild(childrenRes.data[0] || null);
      } catch (err) {
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };
    if (parent) fetchData();
  }, [parent]);

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !parent) return;
    const reader = new FileReader();
    reader.onloadend = async () => {
      setAvatarPreview(reader.result);
      setAvatarLoading(true);
      try {
        const res = await axios.put(`${import.meta.env.VITE_BASE_URL}/Parent/${parent._id}`, { avatar: reader.result });
        setParent(res.data);
        localStorage.setItem('parent', JSON.stringify(res.data));
      } catch (err) {
        setError('Failed to update avatar');
      } finally {
        setAvatarLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  if (loading) return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Skeleton variant="circular" width={64} height={64} />
          <Skeleton variant="rectangular" width={120} height={36} sx={{ borderRadius: 2 }} />
        </Box>
        <Skeleton variant="rectangular" width={120} height={36} sx={{ borderRadius: 2 }} />
      </Box>
      <Skeleton variant="rectangular" height={60} sx={{ mb: 3, borderRadius: 3 }} />
      <Card sx={{ mb: 3, borderRadius: 3, boxShadow: 2 }}>
        <CardContent>
          <Skeleton variant="text" width={180} height={32} sx={{ mb: 1 }} />
          <Divider sx={{ mb: 2 }} />
          <Skeleton variant="rectangular" height={40} sx={{ mb: 2, borderRadius: 2 }} />
          <Divider sx={{ my: 2 }} />
          <Skeleton variant="text" width={120} height={28} sx={{ mb: 1 }} />
          <Skeleton variant="rectangular" height={40} sx={{ borderRadius: 2 }} />
        </CardContent>
      </Card>
      <Paper sx={{ p: 2, borderRadius: 3, boxShadow: 1 }}>
        <Skeleton variant="text" width={160} height={32} sx={{ mb: 2 }} />
        {[1,2,3].map(i => (
          <Skeleton key={i} variant="rectangular" height={48} sx={{ mb: 2, borderRadius: 2 }} />
        ))}
      </Paper>
    </Box>
  );
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      {/* Top Bar and Avatar */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            src={avatarPreview}
            sx={{ width: 64, height: 64, bgcolor: 'primary.main', fontSize: 32 }}
          >
            {!avatarPreview && (parent?.name?.[0] || 'P')}
          </Avatar>
          <Button
            variant="outlined"
            size="small"
            onClick={() => fileInputRef.current.click()}
            disabled={avatarLoading}
          >
            {avatarLoading ? <CircularProgress size={20} /> : 'Change Avatar'}
          </Button>
          <input
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            ref={fileInputRef}
            onChange={handleAvatarChange}
          />
          <Typography variant="h4" sx={{ fontWeight: 700 }}>{parent?.name}</Typography>
        </Box>
        <Button variant="contained" color="primary" startIcon={<MailOutlineIcon />} href="/Parent/messages">Messages</Button>
      </Box>
      {/* Main Content Routing */}
      <Routes>
        <Route path="/Parent/messages" element={<Messages />} />
        <Route path="/Parent/analytics" element={<AnalyticsDashboard />} />
        <Route path="*" element={
          <>
            {/* Children Selector */}
            {children.length > 1 && (
              <Paper sx={{ p: 2, mb: 3, borderRadius: 3, boxShadow: 1 }}>
                <Typography variant="h6">Select Child</Typography>
                <Grid container spacing={2}>
                  {children.map(child => (
                    <Grid item key={child._id}>
                      <Button variant={selectedChild && selectedChild._id === child._id ? 'contained' : 'outlined'} onClick={() => setSelectedChild(child)}>
                        {child.name}
                      </Button>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            )}
            {/* Child Details */}
            {selectedChild ? (
              <Card sx={{ mb: 3, borderRadius: 3, boxShadow: 2 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 1 }}>{selectedChild.name} ({selectedChild.sclassName?.sclassName || 'Class'})</Typography>
                  <Divider sx={{ mb: 2 }} />
                  {/* Attendance Analytics */}
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>Attendance Analytics</Typography>
                  {selectedChild.attendance && selectedChild.attendance.length > 0 ? (
                    <CustomBarChart chartData={Object.values(selectedChild.attendance.reduce((acc, att) => {
                      const sub = att.subName?.subName || 'Subject';
                      if (!acc[sub]) acc[sub] = { subject: sub, present: 0, total: 0 };
                      acc[sub].total++;
                      if (att.status === 'Present') acc[sub].present++;
                      return acc;
                    }, {})).map(d => ({ ...d, attendancePercentage: d.total ? (d.present / d.total) * 100 : 0 }))} dataKey="attendancePercentage" height={180} />
                  ) : <Typography color="text.secondary">No attendance data.</Typography>}
                  <Divider sx={{ my: 2 }} />
                  {/* Marks Table */}
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>Exam Results</Typography>
                  {selectedChild.examResult && selectedChild.examResult.length > 0 ? (
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Subject</TableCell>
                          <TableCell>Marks Obtained</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {selectedChild.examResult.map((res, idx) => (
                          <TableRow key={idx}>
                            <TableCell>{res.subName?.subName || 'Subject'}</TableCell>
                            <TableCell>{res.marksObtained}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : <Typography color="text.secondary">No exam results.</Typography>}
                </CardContent>
              </Card>
            ) : <Alert severity="info">No children found.</Alert>}
            {/* Notices */}
            <Paper sx={{ p: 2, borderRadius: 3, boxShadow: 1 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>School Notices</Typography>
              {notices.length > 0 ? (
                notices.map(notice => (
                  <Box key={notice._id} sx={{ mb: 2, p: 2, background: '#f5f5f5', borderRadius: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{notice.title || 'Notice'}</Typography>
                    <Typography variant="body2" color="text.secondary">{notice.date ? new Date(notice.date).toLocaleDateString() : ''}</Typography>
                    <Typography sx={{ mt: 1 }}>{notice.content || notice.notice}</Typography>
                  </Box>
                ))
              ) : <Typography color="text.secondary">No notices found.</Typography>}
            </Paper>
          </>
        } />
      </Routes>
    </Box>
  );
};

export default ParentDashboard; 