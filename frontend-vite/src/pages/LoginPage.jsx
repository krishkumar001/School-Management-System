import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Grid, Box, Typography, Paper, Checkbox, FormControlLabel, TextField, CssBaseline, IconButton, InputAdornment, CircularProgress, Backdrop, Card, CardContent, Chip } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Visibility, VisibilityOff, Info } from '@mui/icons-material';
import bgpic from "../assets/designlogin.jpg"
import { LightPurpleButton } from '../components/buttonStyles';
import styled from 'styled-components';
import { loginUser } from '../redux/userRelated/userHandle';
import Popup from '../components/Popup';

console.log('VITE_BASE_URL:', import.meta.env.VITE_BASE_URL);
const defaultTheme = createTheme();

const LoginPage = ({ role }) => {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { status, currentUser, response, error, currentRole } = useSelector(state => state.user);;

    const [toggle, setToggle] = useState(false)
    const [guestLoader, setGuestLoader] = useState(false)
    const [loader, setLoader] = useState(false)
    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");

    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [rollNumberError, setRollNumberError] = useState(false);
    const [studentNameError, setStudentNameError] = useState(false);
    console.log("Submitting login form");
    const handleSubmit = (event) => {
        event.preventDefault();
        
        if (role === "Student") {
            const rollNum = event.target.rollNumber.value;
            const studentName = event.target.studentName.value;
            const password = event.target.password.value;

            if (!rollNum || !studentName || !password) {
                if (!rollNum) setRollNumberError(true);
                if (!studentName) setStudentNameError(true);
                if (!password) setPasswordError(true);
                return;
            }
            const fields = { rollNum, studentName, password }
            setLoader(true)
            dispatch(loginUser(fields, role))
        }

        else {
            const email = event.target.email.value;
            const password = event.target.password.value;

            if (!email || !password) {
                if (!email) setEmailError(true);
                if (!password) setPasswordError(true);
                return;
            }

            const fields = { email, password }
            setLoader(true)
            dispatch(loginUser(fields, role))
        }
    };

    const handleInputChange = (event) => {
        const { name } = event.target;
        if (name === 'email') setEmailError(false);
        if (name === 'password') setPasswordError(false);
        if (name === 'rollNumber') setRollNumberError(false);
        if (name === 'studentName') setStudentNameError(false);
    };

    const guestModeHandler = () => {
        const password = "zxc"

        if (role === "Admin") {
            const email = "yogendra@12"
            const fields = { email, password }
            setGuestLoader(true)
            dispatch(loginUser(fields, role))
        }
        else if (role === "Student") {
            const rollNum = "1"
            const studentName = "Deeepesh Awasthi"
            const fields = { rollNum, studentName, password }
            setGuestLoader(true)
            dispatch(loginUser(fields, role))
        }
        else if (role === "Teacher") {
            const email = "tony@12"
            const fields = { email, password }
            setGuestLoader(true)
            dispatch(loginUser(fields, role))
        }
    }

    useEffect(() => {
        console.log('Login status:', status, 'Response:', response, 'Error:', error, 'CurrentRole:', currentRole);
        if (status === 'success' || currentUser !== null) {
            console.log('Login successful, navigating to dashboard');
            if (currentRole === 'Admin') {
                navigate('/Admin/dashboard');
            }
            else if (currentRole === 'Student') {
                navigate('/Student/dashboard');
            } else if (currentRole === 'Teacher') {
                navigate('/Teacher/dashboard');
            }
        }
        else if (status === 'failed') {
            console.log('Login failed:', response);
            setMessage(response)
            setShowPopup(true)
            setLoader(false)
            setGuestLoader(false)
        }
        else if (status === 'error') {
            console.log('Login error:', error);
            setMessage("Network Error")
            setShowPopup(true)
            setLoader(false)
            setGuestLoader(false)
        }
    }, [status, currentRole, navigate, error, response, currentUser]);

    // Loader fallback: hide loader after 10 seconds if still active
    useEffect(() => {
        if (loader) {
            const timeout = setTimeout(() => {
                setLoader(false);
                setGuestLoader(false);
                setMessage("Request timed out. Please check your connection or try again.");
                setShowPopup(true);
            }, 10000); // 10 seconds

            return () => clearTimeout(timeout);
        }
    }, [loader]);

    return (
        <ThemeProvider theme={defaultTheme}>
            <Grid container sx={{ minHeight: '100vh', justifyContent: 'center', alignItems: 'center', gap: 4 }}>
                <CssBaseline />
                <Grid 
                    item 
                    xs={12} 
                    md={5} 
                    component={Paper} 
                    elevation={6} 
                    square
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        minHeight: '100vh',
                        width: '100%',
                        maxWidth: '500px'
                    }}
                >
                    <Box
                        sx={{
                            py: 4,
                            px: 4,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            width: '100%',
                            maxWidth: 400,
                        }}
                    >
                        <Typography 
                            variant="h4" 
                            sx={{ 
                                mb: 0.5, 
                                color: "#2c2143",
                                fontWeight: 700,
                                textAlign: 'center'
                            }}
                        >
                            {role} Login
                        </Typography>
                        <Typography 
                            variant="body1" 
                            sx={{ 
                                color: 'text.secondary', 
                                mb: 2, 
                                textAlign: 'center',
                                fontSize: '0.9rem'
                            }}
                        >
                            Welcome back! Please enter your details
                        </Typography>
                        
                        <Box 
                            component="form" 
                            noValidate 
                            onSubmit={handleSubmit} 
                            sx={{ 
                                width: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 2
                            }}
                        >
                        {role === "Student" ? (
                            <>
                                <TextField
                                    required
                                    fullWidth
                                    id="rollNumber"
                                    label="Roll Number"
                                    name="rollNumber"
                                    autoComplete="off"
                                    type="number"
                                    autoFocus
                                    error={rollNumberError}
                                    helperText={rollNumberError && 'Roll Number is required'}
                                    onChange={handleInputChange}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                        }
                                    }}
                                />
                                <TextField
                                    required
                                    fullWidth
                                    id="studentName"
                                    label="Full Name"
                                    name="studentName"
                                    autoComplete="name"
                                    error={studentNameError}
                                    helperText={studentNameError && 'Name is required'}
                                    onChange={handleInputChange}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                        }
                                    }}
                                />
                            </>
                        ) : (
                            <TextField
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                autoFocus
                                error={emailError}
                                helperText={emailError && 'Email is required'}
                                onChange={handleInputChange}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                    }
                                }}
                            />
                        )}
                        <TextField
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type={toggle ? 'text' : 'password'}
                            id="password"
                            autoComplete="current-password"
                            error={passwordError}
                            helperText={passwordError && 'Password is required'}
                            onChange={handleInputChange}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                }
                            }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton 
                                            onClick={() => setToggle(!toggle)}
                                            sx={{ color: '#7f56da' }}
                                        >
                                            {toggle ? (
                                                <Visibility />
                                            ) : (
                                                <VisibilityOff />
                                            )}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 1 }}>
                            <FormControlLabel
                                control={
                                    <Checkbox 
                                        value="remember" 
                                        sx={{ 
                                            color: '#7f56da',
                                            '&.Mui-checked': {
                                                color: '#7f56da',
                                            }
                                        }} 
                                    />
                                }
                                label={
                                    <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>
                                        Remember me
                                    </Typography>
                                }
                            />
                            <StyledLink href="#" style={{ fontSize: '0.9rem' }}>
                                Forgot password?
                            </StyledLink>
                        </Box>
                        
                        <LightPurpleButton
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ 
                                mt: 2,
                                py: 1.2,
                                borderRadius: 2,
                                fontSize: '1rem',
                                fontWeight: 600,
                                textTransform: 'none'
                            }}
                        >
                            {loader ?
                                <CircularProgress size={24} color="inherit" />
                                : "Sign In"}
                        </LightPurpleButton>
                        
                        <Button
                            fullWidth
                            onClick={guestModeHandler}
                            variant="outlined"
                            sx={{ 
                                mt: 1, 
                                mb: 1, 
                                color: "#7f56da", 
                                borderColor: "#7f56da",
                                py: 1.2,
                                borderRadius: 2,
                                fontSize: '1rem',
                                fontWeight: 600,
                                textTransform: 'none',
                                '&:hover': {
                                    borderColor: '#7f56da',
                                    backgroundColor: 'rgba(127, 86, 218, 0.04)'
                                }
                            }}
                        >
                            Login as Guest
                        </Button>
                        {role === "Admin" && (
                            <Box sx={{ 
                                display: 'flex', 
                                justifyContent: 'center', 
                                alignItems: 'center',
                                mt: 3,
                                pt: 2,
                                borderTop: '1px solid rgba(0,0,0,0.1)'
                            }}>
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                    Don't have an account?{' '}
                                </Typography>
                                <StyledLink to="/Adminregister" style={{ marginLeft: '4px' }}>
                                    Sign up
                                </StyledLink>
                            </Box>
                        )}
                        </Box>
                    </Box>
                </Grid>
                
                {/* Demo Credentials Card - Outside Login Box */}
                <Grid 
                    item 
                    xs={12} 
                    md={3}
                    sx={{
                        display: { xs: 'none', md: 'flex' },
                        justifyContent: 'center',
                        alignItems: 'flex-start',
                        pt: 4
                    }}
                >
                    <Card 
                        sx={{ 
                            width: 320,
                            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                            border: '1px solid rgba(127, 86, 218, 0.2)',
                            borderRadius: 2,
                            boxShadow: 3
                        }}
                    >
                        <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Info sx={{ color: '#7f56da', mr: 1, fontSize: '1.4rem' }} />
                                <Typography variant="h6" sx={{ fontWeight: 600, color: '#7f56da' }}>
                                    Demo Credentials
                                </Typography>
                            </Box>
                            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3, fontSize: '0.9rem' }}>
                                Click "Login as Guest" button below to automatically login with demo credentials:
                            </Typography>
                            
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                    <Chip 
                                        label="Admin" 
                                        size="small" 
                                        sx={{ 
                                            backgroundColor: '#7f56da', 
                                            color: 'white',
                                            fontWeight: 600,
                                            fontSize: '0.8rem'
                                        }} 
                                    />
                                    <Typography variant="body2" sx={{ fontSize: '0.85rem', fontFamily: 'monospace' }}>
                                        yogendra@12 / zxc
                                    </Typography>
                                </Box>
                                
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                    <Chip 
                                        label="Teacher" 
                                        size="small" 
                                        sx={{ 
                                            backgroundColor: '#00b894', 
                                            color: 'white',
                                            fontWeight: 600,
                                            fontSize: '0.8rem'
                                        }} 
                                    />
                                    <Typography variant="body2" sx={{ fontSize: '0.85rem', fontFamily: 'monospace' }}>
                                        tony@12 / zxc
                                    </Typography>
                                </Box>
                                
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                    <Chip 
                                        label="Student" 
                                        size="small" 
                                        sx={{ 
                                            backgroundColor: '#f39c12', 
                                            color: 'white',
                                            fontWeight: 600,
                                            fontSize: '0.8rem'
                                        }} 
                                    />
                                    <Typography variant="body2" sx={{ fontSize: '0.85rem', fontFamily: 'monospace' }}>
                                        Roll: 1 / Name: Deeepesh Awasthi / zxc
                                    </Typography>
                                </Box>
                            </Box>
                            
                            <Typography variant="caption" sx={{ color: 'text.secondary', mt: 2, display: 'block', fontStyle: 'italic' }}>
                                Note: Use the "Login as Guest" button for instant access. These credentials work with the guest login feature.
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                
                <Grid
                    item
                    xs={false}
                    md={4}
                    sx={{
                        backgroundImage: `url(${bgpic})`,
                        backgroundRepeat: 'no-repeat',
                        backgroundColor: (t) =>
                            t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        display: { xs: 'none', md: 'block' }
                    }}
                />
            </Grid>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={guestLoader}
            >
                <CircularProgress color="primary" />
                Please Wait
            </Backdrop>
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </ThemeProvider>
    );
}

export default LoginPage

const StyledLink = styled(Link)`
  margin-top: 9px;
  text-decoration: none;
  color: #7f56da;
`;
