import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Box, Typography, Paper, CircularProgress, TextField, MenuItem, Button, Grid, Divider, Card, CardContent, Stack, Tooltip } from '@mui/material';
import axios from 'axios';
import CustomBarChart from '../components/CustomBarChart.jsx';
import { LineChart, Line, XAxis, YAxis, Tooltip as ReTooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import DownloadIcon from '@mui/icons-material/Download';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

function downloadCSV(data, filename = 'analytics.csv') {
  const replacer = (key, value) => (value === null ? '' : value);
  const header = Object.keys(data[0] || {});
  const csv = [
    header.join(','),
    ...data.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','))
  ].join('\r\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function downloadPDF(data, summary, filename = 'analytics.pdf') {
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text('Attendance Analytics', 14, 16);
  doc.setFontSize(12);
  doc.text(`Total Sessions: ${summary.total}    Present: ${summary.present}    Absent: ${summary.absent}    Attendance %: ${summary.percentage}`, 14, 26);
  doc.autoTable({
    startY: 32,
    head: [Object.keys(data[0] || {})],
    body: data.map(row => Object.values(row)),
    styles: { fontSize: 9 },
    headStyles: { fillColor: [41, 128, 185] },
    margin: { left: 14, right: 14 }
  });
  doc.save(filename);
}

const AnalyticsDashboard = () => {
  const { currentUser } = useSelector(state => state.user);
  const role = currentUser?.role;
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ startDate: '', endDate: '', classId: '', subjectId: '' });
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);

  // Fetch class and subject lists for admin/teacher
  useEffect(() => {
    const fetchLists = async () => {
      try {
        if (role === 'admin' || role === 'teacher') {
          // Fetch classes
          const classRes = await axios.get(`${import.meta.env.VITE_BASE_URL}/SclassList/${currentUser.school?._id || currentUser._id}`);
          setClasses(Array.isArray(classRes.data) ? classRes.data : []);
          // Fetch subjects (for first class or all)
          let classId = filters.classId || (classRes.data[0]?._id || '');
          if (classId) {
            const subRes = await axios.get(`${import.meta.env.VITE_BASE_URL}/ClassSubjects/${classId}`);
            setSubjects(Array.isArray(subRes.data) ? subRes.data : []);
          } else {
            setSubjects([]);
          }
        }
      } catch (err) {
        setClasses([]); setSubjects([]);
      }
    };
    fetchLists();
    // eslint-disable-next-line
  }, [role, currentUser, filters.classId]);

  // Fetch analytics data
  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      setError(null);
      try {
        let params = {};
        if (role === 'admin') {
          params.schoolId = currentUser.school?._id || currentUser._id;
        } else if (role === 'teacher') {
          params.schoolId = currentUser.school?._id;
          params.teacherId = currentUser._id;
        } else if (role === 'student') {
          params.studentId = currentUser._id;
        }
        if (filters.classId) params.classId = filters.classId;
        if (filters.subjectId) params.subjectId = filters.subjectId;
        if (filters.startDate) params.startDate = filters.startDate;
        if (filters.endDate) params.endDate = filters.endDate;
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/AttendanceAnalytics`, { params });
        setAnalytics(res.data);
      } catch (err) {
        setError(err.message || 'Failed to fetch analytics');
      } finally {
        setLoading(false);
      }
    };
    if (currentUser) fetchAnalytics();
  }, [currentUser, role, filters]);

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    // If class changes, reset subject
    if (name === 'classId') setFilters(prev => ({ ...prev, subjectId: '' }));
  };

  // Prepare chart data
  const subjectChartData = analytics && analytics.bySubject
    ? Object.entries(analytics.bySubject).map(([subject, stats]) => ({
        subject,
        ...stats
      }))
    : [];
  const trendChartData = analytics && analytics.byDate
    ? Object.entries(analytics.byDate).map(([date, stats]) => ({
        date,
        ...stats
      }))
    : [];

  // Summary stats
  const summary = analytics ? {
    total: analytics.total,
    present: analytics.present,
    absent: analytics.absent,
    percentage: analytics.total ? ((analytics.present / analytics.total) * 100).toFixed(2) : '0.00'
  } : null;

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 700, letterSpacing: 1 }}>
        Analytics Dashboard
      </Typography>
      {/* Filter Controls */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 3, boxShadow: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={3}>
            <TextField
              label="Start Date"
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              label="End Date"
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Grid>
          {(role === 'admin' || role === 'teacher') && (
            <Grid item xs={12} sm={3}>
              <TextField
                select
                label="Class"
                name="classId"
                value={filters.classId}
                onChange={handleFilterChange}
                fullWidth
              >
                <MenuItem value="">All</MenuItem>
                {classes.map(cls => (
                  <MenuItem key={cls._id} value={cls._id}>{cls.sclassName}</MenuItem>
                ))}
              </TextField>
            </Grid>
          )}
          {(role === 'admin' || role === 'teacher') && (
            <Grid item xs={12} sm={3}>
              <TextField
                select
                label="Subject"
                name="subjectId"
                value={filters.subjectId}
                onChange={handleFilterChange}
                fullWidth
                disabled={!filters.classId}
              >
                <MenuItem value="">All</MenuItem>
                {subjects.map(sub => (
                  <MenuItem key={sub._id} value={sub._id}>{sub.subName}</MenuItem>
                ))}
              </TextField>
            </Grid>
          )}
        </Grid>
      </Paper>
      {/* Selected Filters */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Selected Filters:</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {filters.startDate && `Start: ${filters.startDate} | `}
          {filters.endDate && `End: ${filters.endDate} | `}
          {filters.classId && `Class: ${classes.find(c => c._id === filters.classId)?.sclassName} | `}
          {filters.subjectId && `Subject: ${subjects.find(s => s._id === filters.subjectId)?.subName}`}
        </Typography>
      </Box>
      <Divider sx={{ mb: 3 }} />
      {/* Analytics Data */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography color="error">{error}</Typography>
        </Paper>
      ) : analytics ? (
        <>
          {/* Summary Stats */}
          <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #7f56da 0%, #5e60ce 100%)', color: '#fff', borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={4} alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>Summary</Typography>
                  <Typography>Total Sessions: {summary.total}</Typography>
                  <Typography>Present: {summary.present}</Typography>
                  <Typography>Absent: {summary.absent}</Typography>
                  <Typography>Attendance %: {summary.percentage}</Typography>
                </Box>
                <Stack direction="row" spacing={2}>
                  <Tooltip title="Export as CSV">
                    <Button variant="contained" color="secondary" startIcon={<DownloadIcon />} onClick={() => downloadCSV(analytics.records || [])} disabled={!analytics.records || analytics.records.length === 0}>
                      CSV
                    </Button>
                  </Tooltip>
                  <Tooltip title="Export as PDF">
                    <Button variant="contained" color="error" startIcon={<PictureAsPdfIcon />} onClick={() => downloadPDF(analytics.records || [], summary)} disabled={!analytics.records || analytics.records.length === 0}>
                      PDF
                    </Button>
                  </Tooltip>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
          <Divider sx={{ mb: 3 }} />
          {/* Subject-wise Bar Chart */}
          <Paper sx={{ p: 2, mb: 3, borderRadius: 3, boxShadow: 1 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Subject-wise Attendance</Typography>
            {subjectChartData.length > 0 ? (
              <CustomBarChart chartData={subjectChartData.map(d => ({ subject: d.subject, attendancePercentage: d.total ? (d.present / d.total) * 100 : 0, totalClasses: d.total, attendedClasses: d.present }))} dataKey="attendancePercentage" height={220} />
            ) : (
              <Typography>No subject data available.</Typography>
            )}
          </Paper>
          {/* Attendance Trend Line Chart */}
          <Paper sx={{ p: 2, mb: 3, borderRadius: 3, boxShadow: 1 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Attendance Trend (by Date)</Typography>
            {trendChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={trendChartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <ReTooltip />
                  <Legend />
                  <Line type="monotone" dataKey="present" stroke="#4caf50" name="Present" />
                  <Line type="monotone" dataKey="absent" stroke="#f44336" name="Absent" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <Typography>No trend data available.</Typography>
            )}
          </Paper>
        </>
      ) : null}
    </Box>
  );
};

export default AnalyticsDashboard; 