import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getSubjectList } from '../../redux/sclassRelated/sclassHandle';
import { BottomNavigation, BottomNavigationAction, Container, Paper, Table, TableBody, TableHead, Typography, Card, CardContent, Avatar, Grid, TextField, Chip, LinearProgress } from '@mui/material';
import { getUserDetails } from '../../redux/userRelated/userHandle';
import CustomBarChart from '../../components/CustomBarChart'

import InsertChartIcon from '@mui/icons-material/InsertChart';
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined';
import TableChartIcon from '@mui/icons-material/TableChart';
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';
import { StyledTableCell, StyledTableRow } from '../../components/styles';
import SchoolIcon from '@mui/icons-material/School';
import PersonIcon from '@mui/icons-material/Person';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import styled from 'styled-components';

const StudentSubjects = () => {

    const dispatch = useDispatch();
    const { subjectsList, sclassDetails } = useSelector((state) => state.sclass);
    const { userDetails, currentUser, loading, response, error } = useSelector((state) => state.user);

    useEffect(() => {
        dispatch(getUserDetails(currentUser._id, "Student"));
    }, [dispatch, currentUser._id])

    if (response) { console.log(response) }
    else if (error) { console.log(error) }

    const [subjectMarks, setSubjectMarks] = useState([]);
    const [selectedSection, setSelectedSection] = useState('table');
    const [search, setSearch] = useState('');

    useEffect(() => {
        if (userDetails) {
            setSubjectMarks(userDetails.examResult || []);
        }
    }, [userDetails])

    useEffect(() => {
        if (Array.isArray(subjectMarks) && subjectMarks.length === 0) {
            dispatch(getSubjectList(currentUser.sclassName._id, "ClassSubjects"));
        }
    }, [subjectMarks, dispatch, currentUser.sclassName._id]);

    const handleSectionChange = (event, newSection) => {
        setSelectedSection(newSection);
    };

    const renderTableSection = () => {
        return (
            <>
                <Typography variant="h4" align="center" gutterBottom>
                    Subject Marks
                </Typography>
                <Table>
                    <TableHead>
                        <StyledTableRow>
                            <StyledTableCell>Subject</StyledTableCell>
                            <StyledTableCell>Marks</StyledTableCell>
                        </StyledTableRow>
                    </TableHead>
                    <TableBody>
                        {subjectMarks.map((result, index) => {
                            if (!result.subName || !result.marksObtained) {
                                return null;
                            }
                            return (
                                <StyledTableRow key={index}>
                                    <StyledTableCell>{result.subName.subName}</StyledTableCell>
                                    <StyledTableCell>{result.marksObtained}</StyledTableCell>
                                </StyledTableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </>
        );
    };

    const renderChartSection = () => {
        return <CustomBarChart chartData={subjectMarks} dataKey="marksObtained" />;
    };

    const renderClassDetailsSection = () => {
        return (
            <Container>
                <Typography variant="h4" align="center" gutterBottom>
                    Class Details
                </Typography>
                <Typography variant="h5" gutterBottom>
                    You are currently in Class {sclassDetails && sclassDetails.sclassName}
                </Typography>
                <Typography variant="h6" gutterBottom>
                    And these are the subjects:
                </Typography>
                {subjectsList &&
                    subjectsList.map((subject, index) => (
                        <div key={index}>
                            <Typography variant="subtitle1">
                                {subject.subName} ({subject.subCode})
                            </Typography>
                        </div>
                    ))}
            </Container>
        );
    };

    const filteredSubjects = subjectsList?.filter(subject =>
        subject.subName.toLowerCase().includes(search.toLowerCase())
    ) || [];

    return (
        <BgWrapper>
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Typography variant="h3" align="center" sx={{ fontWeight: 700, color: '#a85d3c', mb: 3 }}>
                    Your Subjects
                </Typography>
                <TextField
                    label="Search Subjects"
                    variant="outlined"
                    fullWidth
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    sx={{ mb: 4, bgcolor: 'white', borderRadius: 2 }}
                />
                <Grid container spacing={3}>
                    {filteredSubjects.length > 0 ? filteredSubjects.map((subject, idx) => (
                        <Grid item xs={12} sm={6} md={4} key={idx}>
                            <SubjectCard>
                                <CardContent>
                                    <Grid container alignItems="center" spacing={1}>
                                        <Grid item>
                                            <Avatar sx={{ bgcolor: '#ffbfae' }}>
                                                <SchoolIcon sx={{ color: '#a85d3c' }} />
                                            </Avatar>
                                        </Grid>
                                        <Grid item xs>
                                            <Typography variant="h6" sx={{ color: '#a85d3c', fontWeight: 700 }}>
                                                {subject.subName}
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: '#ff8c42' }}>
                                                Code: {subject.subCode}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                    <Grid container alignItems="center" spacing={1} sx={{ mt: 1 }}>
                                        <Grid item>
                                            <PersonIcon sx={{ color: '#a85d3c' }} />
                                        </Grid>
                                        <Grid item xs>
                                            <Typography variant="body2" sx={{ color: '#a85d3c' }}>
                                                Teacher: {subject.teacherName || 'N/A'}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                    <Grid container alignItems="center" spacing={1} sx={{ mt: 1 }}>
                                        <Grid item>
                                            <AccessTimeIcon sx={{ color: '#a85d3c' }} />
                                        </Grid>
                                        <Grid item xs>
                                            <Typography variant="body2" sx={{ color: '#a85d3c' }}>
                                                Next Class: {subject.nextClassTime || 'N/A'}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                    {/* Show marks if available */}
                                    {Array.isArray(subjectMarks) && subjectMarks.length > 0 && (
                                        subjectMarks.filter(m => m.subName?._id === subject._id).map((m, i) => (
                                            <div key={i} style={{ marginTop: 12 }}>
                                                <Chip label={`Marks: ${m.marksObtained}`} sx={{ bgcolor: '#fbc2eb', color: '#a85d3c', fontWeight: 600, mb: 1 }} />
                                                <LinearProgress variant="determinate" value={Math.min(100, m.marksObtained)} sx={{ height: 8, borderRadius: 5, bgcolor: '#ffe0c3', '& .MuiLinearProgress-bar': { bgcolor: '#ff8c42' } }} />
                                            </div>
                                        ))
                                    )}
                                </CardContent>
                            </SubjectCard>
                        </Grid>
                    )) : (
                        <Grid item xs={12}>
                            <Typography variant="h6" align="center" sx={{ color: '#a85d3c' }}>
                                No subjects found.
                            </Typography>
                        </Grid>
                    )}
                </Grid>
            </Container>
        </BgWrapper>
    );
};

export default StudentSubjects;

// Styled components
const BgWrapper = styled.div`
  min-height: 100vh;
  width: 100vw;
  background: linear-gradient(120deg, #fbc2eb 0%, #fcd6a1 100%);
  position: relative;
  overflow: auto;
`;
const SubjectCard = styled(Card)`
  background: rgba(255,255,255,0.85) !important;
  border-radius: 18px !important;
  box-shadow: 0 4px 16px 0 rgba(255,183,94,0.10) !important;
  transition: transform 0.2s;
  &:hover {
    transform: translateY(-6px) scale(1.03);
    box-shadow: 0 8px 32px 0 rgba(255,183,94,0.18) !important;
  }
`;