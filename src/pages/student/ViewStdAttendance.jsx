import React, { useEffect, useState } from 'react'
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { BottomNavigation, BottomNavigationAction, Box, Button, Collapse, Paper, Table, TableBody, TableHead, Typography, Card, CardContent, Avatar, Grid, Chip } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { getUserDetails } from '../../redux/userRelated/userHandle';
import { calculateOverallAttendancePercentage, calculateSubjectAttendancePercentage, groupAttendanceBySubject } from '../../components/attendanceCalculator';

import CustomBarChart from '../../components/CustomBarChart'

import InsertChartIcon from '@mui/icons-material/InsertChart';
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined';
import TableChartIcon from '@mui/icons-material/TableChart';
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';
import { StyledTableCell, StyledTableRow } from '../../components/styles';
import PieChartIcon from '@mui/icons-material/PieChart';
import styled from 'styled-components';

const ViewStdAttendance = () => {
    const dispatch = useDispatch();

    const [openStates, setOpenStates] = useState({});

    const handleOpen = (subId) => {
        setOpenStates((prevState) => ({
            ...prevState,
            [subId]: !prevState[subId],
        }));
    };

    const { userDetails, currentUser, loading, response, error } = useSelector((state) => state.user);

    useEffect(() => {
        dispatch(getUserDetails(currentUser._id, "Student"));
    }, [dispatch, currentUser._id]);

    if (response) { console.log(response) }
    else if (error) { console.log(error) }

    const [subjectAttendance, setSubjectAttendance] = useState([]);
    const [selectedSection, setSelectedSection] = useState('table');

    useEffect(() => {
        if (userDetails) {
            setSubjectAttendance(userDetails.attendance || []);
        }
    }, [userDetails])

    const attendanceBySubject = groupAttendanceBySubject(subjectAttendance)

    const overallAttendancePercentage = calculateOverallAttendancePercentage(subjectAttendance);

    const subjectData = Object.entries(attendanceBySubject).map(([subName, { subCode, present, sessions }]) => {
        const subjectAttendancePercentage = calculateSubjectAttendancePercentage(present, sessions);
        return {
            subject: subName,
            attendancePercentage: subjectAttendancePercentage,
            totalClasses: sessions,
            attendedClasses: present
        };
    });

    const handleSectionChange = (event, newSection) => {
        setSelectedSection(newSection);
    };

    const renderTableSection = () => {
        return (
            <>
                <Typography variant="h4" align="center" gutterBottom>
                    Attendance
                </Typography>
                <Table>
                    <TableHead>
                        <StyledTableRow>
                            <StyledTableCell>Subject</StyledTableCell>
                            <StyledTableCell>Present</StyledTableCell>
                            <StyledTableCell>Total Sessions</StyledTableCell>
                            <StyledTableCell>Attendance Percentage</StyledTableCell>
                            <StyledTableCell align="center">Actions</StyledTableCell>
                        </StyledTableRow>
                    </TableHead>
                    {Object.entries(attendanceBySubject).map(([subName, { present, allData, subId, sessions }], index) => {
                        const subjectAttendancePercentage = calculateSubjectAttendancePercentage(present, sessions);

                        return (
                            <TableBody key={index}>
                                <StyledTableRow>
                                    <StyledTableCell>{subName}</StyledTableCell>
                                    <StyledTableCell>{present}</StyledTableCell>
                                    <StyledTableCell>{sessions}</StyledTableCell>
                                    <StyledTableCell>{subjectAttendancePercentage}%</StyledTableCell>
                                    <StyledTableCell align="center">
                                        <Button variant="contained"
                                            onClick={() => handleOpen(subId)}>
                                            {openStates[subId] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}Details
                                        </Button>
                                    </StyledTableCell>
                                </StyledTableRow>
                                <StyledTableRow>
                                    <StyledTableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                                        <Collapse in={openStates[subId]} timeout="auto" unmountOnExit>
                                            <Box sx={{ margin: 1 }}>
                                                <Typography variant="h6" gutterBottom component="div">
                                                    Attendance Details
                                                </Typography>
                                                <Table size="small" aria-label="purchases">
                                                    <TableHead>
                                                        <StyledTableRow>
                                                            <StyledTableCell>Date</StyledTableCell>
                                                            <StyledTableCell align="right">Status</StyledTableCell>
                                                        </StyledTableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {allData.map((data, index) => {
                                                            const date = new Date(data.date);
                                                            const dateString = date.toString() !== "Invalid Date" ? date.toISOString().substring(0, 10) : "Invalid Date";
                                                            return (
                                                                <StyledTableRow key={index}>
                                                                    <StyledTableCell component="th" scope="row">
                                                                        {dateString}
                                                                    </StyledTableCell>
                                                                    <StyledTableCell align="right">{data.status}</StyledTableCell>
                                                                </StyledTableRow>
                                                            )
                                                        })}
                                                    </TableBody>
                                                </Table>
                                            </Box>
                                        </Collapse>
                                    </StyledTableCell>
                                </StyledTableRow>
                            </TableBody>
                        )
                    }
                    )}
                </Table>
                <div>
                    Overall Attendance Percentage: {overallAttendancePercentage.toFixed(2)}%
                </div>
            </>
        )
    }

    const renderChartSection = () => {
        return (
            <>
                <CustomBarChart chartData={subjectData} dataKey="attendancePercentage" />
            </>
        )
    };

    return (
        <BgWrapper>
            <Grid container justifyContent="center" sx={{ py: 4 }}>
                <Grid item xs={12} md={8}>
                    <SummaryCard>
                        <Grid container alignItems="center" spacing={2}>
                            <Grid item>
                                <Avatar sx={{ bgcolor: '#ffbfae', width: 56, height: 56 }}>
                                    <PieChartIcon sx={{ color: '#a85d3c', fontSize: 32 }} />
                                </Avatar>
                            </Grid>
                            <Grid item xs>
                                <Typography variant="h5" sx={{ color: '#a85d3c', fontWeight: 700 }}>
                                    Your Attendance
                                </Typography>
                                <Typography variant="h6" sx={{ color: '#ff8c42', fontWeight: 600 }}>
                                    {overallAttendancePercentage.toFixed(2)}%
                                </Typography>
                            </Grid>
                        </Grid>
                    </SummaryCard>
                </Grid>
            </Grid>
            <Grid container justifyContent="center">
                <Grid item xs={12} md={8}>
                    <Card sx={{ mb: 3, p: 2, borderRadius: 3, background: 'rgba(255,255,255,0.85)' }}>
                        <CustomBarChart chartData={subjectData} dataKey="attendancePercentage" />
                    </Card>
                </Grid>
            </Grid>
            <Grid container justifyContent="center">
                <Grid item xs={12} md={10}>
                    <Card sx={{ p: 2, borderRadius: 3, background: 'rgba(255,255,255,0.85)' }}>
                        <Typography variant="h6" sx={{ color: '#a85d3c', fontWeight: 700, mb: 2 }}>
                            Attendance Records
                        </Typography>
                        {subjectAttendance && Array.isArray(subjectAttendance) && subjectAttendance.length > 0 ? (
                            <Table>
                                <TableHead>
                                    <StyledTableRow>
                                        <StyledTableCell>Subject</StyledTableCell>
                                        <StyledTableCell>Present</StyledTableCell>
                                        <StyledTableCell>Total Sessions</StyledTableCell>
                                        <StyledTableCell>Attendance %</StyledTableCell>
                                        <StyledTableCell align="center">Actions</StyledTableCell>
                                    </StyledTableRow>
                                </TableHead>
                                {Object.entries(attendanceBySubject).map(([subName, { present, allData, subId, sessions }], index) => {
                                    const subjectAttendancePercentage = calculateSubjectAttendancePercentage(present, sessions);
                                    return (
                                        <TableBody key={index}>
                                            <StyledTableRow>
                                                <StyledTableCell>{subName}</StyledTableCell>
                                                <StyledTableCell>{present}</StyledTableCell>
                                                <StyledTableCell>{sessions}</StyledTableCell>
                                                <StyledTableCell>{subjectAttendancePercentage}%</StyledTableCell>
                                                <StyledTableCell align="center">
                                                    <Chip label={subjectAttendancePercentage >= 75 ? 'Good' : 'Low'} sx={{ bgcolor: subjectAttendancePercentage >= 75 ? '#c8e6c9' : '#ffcdd2', color: subjectAttendancePercentage >= 75 ? '#388e3c' : '#c62828', fontWeight: 600 }} />
                                                </StyledTableCell>
                                            </StyledTableRow>
                                            <StyledTableRow>
                                                <StyledTableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                                                    <Collapse in={openStates[subId]} timeout="auto" unmountOnExit>
                                                        <Box sx={{ margin: 1 }}>
                                                            <Typography variant="h6" gutterBottom component="div">
                                                                Attendance Details
                                                            </Typography>
                                                            <Table size="small" aria-label="purchases">
                                                                <TableHead>
                                                                    <StyledTableRow>
                                                                        <StyledTableCell>Date</StyledTableCell>
                                                                        <StyledTableCell align="right">Status</StyledTableCell>
                                                                    </StyledTableRow>
                                                                </TableHead>
                                                                <TableBody>
                                                                    {allData.map((data, index) => {
                                                                        const date = new Date(data.date);
                                                                        const dateString = date.toString() !== "Invalid Date" ? date.toISOString().substring(0, 10) : "Invalid Date";
                                                                        return (
                                                                            <StyledTableRow key={index}>
                                                                                <StyledTableCell component="th" scope="row">
                                                                                    {dateString}
                                                                                </StyledTableCell>
                                                                                <StyledTableCell align="right">
                                                                                    <Chip label={data.status} sx={{ bgcolor: data.status === 'Present' ? '#c8e6c9' : '#ffcdd2', color: data.status === 'Present' ? '#388e3c' : '#c62828', fontWeight: 600 }} />
                                                                                </StyledTableCell>
                                                                            </StyledTableRow>
                                                                        )
                                                                    })}
                                                                </TableBody>
                                                            </Table>
                                                        </Box>
                                                    </Collapse>
                                                </StyledTableCell>
                                            </StyledTableRow>
                                        </TableBody>
                                    )
                                })}
                            </Table>
                        ) : (
                            <Typography variant="body1" sx={{ color: '#a85d3c' }}>
                                Currently You Have No Attendance Details
                            </Typography>
                        )}
                    </Card>
                </Grid>
            </Grid>
            <LegendContainer>
                <Chip label="Present" sx={{ bgcolor: '#c8e6c9', color: '#388e3c', fontWeight: 600, mr: 2 }} />
                <Chip label="Absent" sx={{ bgcolor: '#ffcdd2', color: '#c62828', fontWeight: 600 }} />
            </LegendContainer>
        </BgWrapper>
    )
}

export default ViewStdAttendance

// Styled components
const BgWrapper = styled.div`
  min-height: 100vh;
  width: 100vw;
  background: linear-gradient(120deg, #fbc2eb 0%, #fcd6a1 100%);
  position: relative;
  overflow: auto;
`;
const SummaryCard = styled(Card)`
  background: rgba(255,245,235,0.82) !important;
  box-shadow: 0 8px 32px 0 rgba(255, 183, 94, 0.13) !important;
  border-radius: 28px !important;
  margin-bottom: 32px;
  padding: 18px 10px 10px 18px;
`;
const LegendContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
  margin: 24px 0 0 0;
`;