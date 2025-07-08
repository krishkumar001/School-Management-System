import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid,
  Paper,
  Box,
  Container,
  CircularProgress,
  Backdrop,
} from '@mui/material';
import { AccountCircle, School, Group } from '@mui/icons-material';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../redux/userRelated/userHandle';
import Popup from '../components/Popup';

const ChooseUser = ({ visitor }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const password = "zxc"

  const { status, currentUser, currentRole } = useSelector(state => state.user);;

  const [loader, setLoader] = useState(false)
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  // Loader fallback: hide loader after 10 seconds if still active
  useEffect(() => {
    if (loader) {
      const timeout = setTimeout(() => {
        setLoader(false);
        setMessage("Request timed out. Please check your connection or try again.");
        setShowPopup(true);
      }, 10000); // 10 seconds

      return () => clearTimeout(timeout);
    }
  }, [loader]);

  const navigateHandler = (user) => {
    if (user === "Admin") {
      if (visitor === "guest") {
        const email = "yogendra@12"
        const fields = { email, password }
        setLoader(true)
        dispatch(loginUser(fields, user))
      }
      else {
        navigate('/Adminlogin');
      }
    }

    else if (user === "Student") {
      if (visitor === "guest") {
        const rollNum = "1"
        const studentName = "Deeepesh Awasthi"
        const fields = { rollNum, studentName, password }
        setLoader(true)
        dispatch(loginUser(fields, user))
      }
      else {
        navigate('/Studentlogin');
      }
    }

    else if (user === "Teacher") {
      if (visitor === "guest") {
        const email = "tony@12"
        const fields = { email, password }
        setLoader(true)
        dispatch(loginUser(fields, user))
      }
      else {
        navigate('/Teacherlogin');
      }
    }
  }

  useEffect(() => {
    if (status === 'success' || currentUser !== null) {
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
      setLoader(false)
      setMessage("Demo login failed. For portfolio review, please use the manual login option with the credentials shown on the login page.")
      setShowPopup(true)
    }
    else if (status === 'error') {
      setLoader(false)
      setMessage("Network Error")
      setShowPopup(true)
    }
  }, [status, currentRole, navigate, currentUser]);

  return (
    <StyledContainer>
      <Container>
        <CardsRow>
          <div onClick={() => navigateHandler("Admin")}>
            <StyledPaper elevation={3}>
              <IconCircle>
                <AccountCircle fontSize="large" style={{ color: '#19118b' }} />
              </IconCircle>
              <StyledTypography>Admin</StyledTypography>
              <CardDesc>Login as an administrator to access the dashboard to manage app data.</CardDesc>
            </StyledPaper>
          </div>
          <div onClick={() => navigateHandler("Student")}>
            <StyledPaper elevation={3}>
              <IconCircle>
                <School fontSize="large" style={{ color: '#19118b' }} />
              </IconCircle>
              <StyledTypography>Student</StyledTypography>
              <CardDesc>Login as a student to explore course materials and assignments.</CardDesc>
            </StyledPaper>
          </div>
          <div onClick={() => navigateHandler("Teacher")}>
            <StyledPaper elevation={3}>
              <IconCircle>
                <Group fontSize="large" style={{ color: '#19118b' }} />
              </IconCircle>
              <StyledTypography>Teacher</StyledTypography>
              <CardDesc>Login as a teacher to create courses, assignments, and track student progress.</CardDesc>
            </StyledPaper>
          </div>
        </CardsRow>
      </Container>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loader}
      >
        <CircularProgress color="inherit" />
        Please Wait
      </Backdrop>
      <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
    </StyledContainer>
  );
};

export default ChooseUser;

const StyledContainer = styled.div`
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -100px;
    left: -100px;
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, #e3eafe 60%, transparent 100%);
    opacity: 0.5;
    z-index: 0;
  }
  &::after {
    content: '';
    position: absolute;
    bottom: -120px;
    right: -120px;
    width: 350px;
    height: 350px;
    background: radial-gradient(circle, #d1e8ff 60%, transparent 100%);
    opacity: 0.4;
    z-index: 0;
  }
`;

const CardsRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 48px;
  width: 100%;
  margin-top: 32px;
  z-index: 1;
`;

const StyledPaper = styled(Paper)`
  padding: 20px 16px 16px 16px;
  text-align: center;
  background: rgba(255, 255, 255, 0.7);
  color: #222;
  border-radius: 22px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.10);
  backdrop-filter: blur(8px);
  border: 1.5px solid rgba(255, 255, 255, 0.25);
  transition: box-shadow 0.3s, transform 0.3s, background 0.3s, color 0.3s, border 0.3s;
  min-width: 160px;
  min-height: 180px;
  max-width: 200px;
  max-height: 220px;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  position: relative;
  overflow: hidden;

  &:hover {
    box-shadow: 0 12px 36px 0 rgba(31, 38, 135, 0.18);
    background: rgba(227, 234, 254, 0.85);
    color: #19118b;
    border: 1.5px solid #b3c6ff;
    transform: translateY(-6px) scale(1.05);
  }
  &:active {
    transform: scale(0.98);
    box-shadow: 0 4px 12px 0 rgba(31, 38, 135, 0.10);
  }
`;

const IconCircle = styled.div`
  background: linear-gradient(135deg, #e3eafe 60%, #b3c6ff 100%);
  border-radius: 50%;
  width: 54px;
  height: 54px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 12px auto;
  box-shadow: 0 2px 8px rgba(60, 72, 88, 0.10);
`;

const StyledTypography = styled.h2`
  margin-bottom: 8px;
  font-size: 1.25rem;
  font-weight: 700;
  color: #19118b;
  letter-spacing: 0.5px;
`;

const CardDesc = styled.p`
  font-size: 0.98rem;
  color: #444;
  margin-top: 4px;
  margin-bottom: 0;
  line-height: 1.5;
`;