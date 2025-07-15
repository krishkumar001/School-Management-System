import { Container, Grid, Paper, Typography, Box } from '@mui/material'
import SeeNotice from '../../components/SeeNotice';
import Students from "../../assets/img1.png";
import Classes from "../../assets/img2.png";
import Teachers from "../../assets/img3.png";
import Fees from "../../assets/img4.png";
import styled from 'styled-components';
import CountUp from 'react-countup';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getAllSclasses } from '../../redux/sclassRelated/sclassHandle';
import { getAllStudents } from '../../redux/studentRelated/studentHandle';
import { getAllTeachers } from '../../redux/teacherRelated/teacherHandle';
import CustomBarChart from '../../components/CustomBarChart';
import CustomPieChart from '../../components/CustomPieChart';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const mockAttendanceData = [
  { subject: 'Math', attendancePercentage: 92, totalClasses: 50, attendedClasses: 46 },
  { subject: 'Science', attendancePercentage: 85, totalClasses: 60, attendedClasses: 51 },
  { subject: 'History', attendancePercentage: 78, totalClasses: 45, attendedClasses: 35 },
];
const mockGradeData = [
  { name: 'A', value: 40 },
  { name: 'B', value: 30 },
  { name: 'C', value: 20 },
  { name: 'D', value: 10 },
];
const mockActivity = [
  { icon: <NotificationsActiveIcon color="primary" />, text: 'Notice: Parent-Teacher meeting on Friday.' },
  { icon: <AssignmentTurnedInIcon color="success" />, text: 'New assignment uploaded for Class 10.' },
  { icon: <ReportProblemIcon color="error" />, text: 'Complaint resolved: Projector not working.' },
  { icon: <TrendingUpIcon color="secondary" />, text: 'Attendance up 5% this month.' },
];

const AdminHomePage = () => {
    const dispatch = useDispatch();
    const { studentsList } = useSelector((state) => state.student);
    const { sclassesList } = useSelector((state) => state.sclass);
    const { teachersList } = useSelector((state) => state.teacher);

    const { currentUser } = useSelector(state => state.user)

    const adminID = currentUser._id

    useEffect(() => {
        dispatch(getAllStudents(adminID));
        dispatch(getAllSclasses(adminID, "Sclass"));
        dispatch(getAllTeachers(adminID));
    }, [adminID, dispatch]);

    const numberOfStudents = studentsList && studentsList.length;
    const numberOfClasses = sclassesList && sclassesList.length;
    const numberOfTeachers = teachersList && teachersList.length;

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }} role="main" aria-label="Admin dashboard main content">
                <Grid container columns={24} spacing={3}>
                {/* Summary Cards */}
                <Grid sx={{ gridColumn: 'span 4' }}>
                    <StyledPaper gradient="linear-gradient(135deg, #7f56da 0%, #5e60ce 100%)" role="region" aria-label="Total Students">
                        <img src={Students} alt="Students" style={{ width: 48, marginBottom: 8 }} />
                        <Title>Total Students</Title>
                            <Data start={0} end={numberOfStudents} duration={2.5} />
                        </StyledPaper>
                    </Grid>
                <Grid sx={{ gridColumn: 'span 4' }}>
                    <StyledPaper gradient="linear-gradient(135deg, #ffb300 0%, #ffd600 100%)" role="region" aria-label="Total Classes">
                        <img src={Classes} alt="Classes" style={{ width: 48, marginBottom: 8 }} />
                        <Title>Total Classes</Title>
                        <Data start={0} end={numberOfClasses} duration={2.5} />
                        </StyledPaper>
                    </Grid>
                <Grid sx={{ gridColumn: 'span 4' }}>
                    <StyledPaper gradient="linear-gradient(135deg, #00b894 0%, #00cec9 100%)" role="region" aria-label="Total Teachers">
                        <img src={Teachers} alt="Teachers" style={{ width: 48, marginBottom: 8 }} />
                        <Title>Total Teachers</Title>
                            <Data start={0} end={numberOfTeachers} duration={2.5} />
                        </StyledPaper>
                    </Grid>
                <Grid sx={{ gridColumn: 'span 4' }}>
                    <StyledPaper gradient="linear-gradient(135deg, #ff7675 0%, #fd79a8 100%)" role="region" aria-label="Fees Collection">
                        <img src={Fees} alt="Fees" style={{ width: 48, marginBottom: 8 }} />
                        <Title>Fees Collection</Title>
                        <Data start={0} end={23000} duration={2.5} prefix="$" />
                    </StyledPaper>
                </Grid>
                <Grid sx={{ gridColumn: 'span 4' }}>
                    <StyledPaper gradient="linear-gradient(135deg, #00b4d8 0%, #48cae4 100%)" role="region" aria-label="Attendance Rate">
                        <AssignmentTurnedInIcon sx={{ fontSize: 48, marginBottom: 1, color: '#fff' }} />
                        <Title>Attendance Rate</Title>
                        <Data start={0} end={88} duration={2.5} suffix="%" />
                    </StyledPaper>
                </Grid>
                <Grid sx={{ gridColumn: 'span 12' }}>
                    <Paper sx={{ p: 2, height: 400, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>Attendance Trends</Typography>
                        <CustomBarChart chartData={mockAttendanceData} dataKey="attendancePercentage" height={220} />
                    </Paper>
                </Grid>
                <Grid sx={{ gridColumn: 'span 12' }}>
                    <Paper sx={{ p: 2, height: 400, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>Grade Distribution</Typography>
                        <CustomPieChart data={mockGradeData} />
                    </Paper>
                </Grid>
                <Grid sx={{ gridColumn: 'span 16' }}>
                    <Paper sx={{ p: 2, minHeight: 200, display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>Recent Activity</Typography>
                        {mockActivity.map((item, idx) => (
                            <Box key={idx} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                {item.icon}
                                <Typography sx={{ ml: 2 }}>{item.text}</Typography>
                            </Box>
                        ))}
                    </Paper>
                    </Grid>
                <Grid sx={{ gridColumn: 'span 8' }}>
                    <Paper sx={{ p: 2, minHeight: 200, display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>Notices</Typography>
                            <SeeNotice />
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
    );
};


const StyledPaper = styled(Paper)`
  padding: 16px;
  display: flex;
  flex-direction: column;
  height: 180px;
  justify-content: space-between;
  align-items: center;
  text-align: center;
  background: ${({ gradient }) => gradient || '#fff'};
  color: #fff;
  box-shadow: 0 4px 24px 0 rgba(34, 34, 34, 0.08);
  border-radius: 18px;
  transition: transform 0.2s, box-shadow 0.2s;
  &:hover {
    transform: translateY(-4px) scale(1.03);
    box-shadow: 0 8px 32px 0 rgba(34, 34, 34, 0.16);
  }
`;

const Title = styled.p`
  font-size: 1.25rem;
`;

const Data = styled(CountUp)`
  font-size: calc(1.3rem + .6vw);
  color: green;
`;

export default AdminHomePage