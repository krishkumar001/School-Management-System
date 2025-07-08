import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Grid, Box, Button } from '@mui/material';
import styled, { keyframes } from 'styled-components';
import Students from "../assets/students.svg";
import { LightPurpleButton } from '../components/buttonStyles';

const Homepage = () => {
    return (
        <BgWrapper>
            <AnimatedCircle1 />
            <AnimatedCircle2 />
            <StyledContainer maxWidth="lg" role="main" aria-label="Homepage main content">
                <Grid container columns={12} spacing={2} alignItems="center" justifyContent="center">
                    <Grid sx={{ gridColumn: 'span 6', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <img src={Students} alt="students illustration" style={{ width: '100%', maxWidth: 420, height: 'auto', filter: 'drop-shadow(0 8px 32px rgba(60,72,88,0.10))' }} />
                    </Grid>
                    <Grid sx={{ gridColumn: 'span 6', zIndex: 2 }}>
                        <GlassCard elevation={3}>
                            <StyledTitle>
                                Welcome to<br />
                                <span>School Management</span><br />
                                System
                            </StyledTitle>
                            <StyledText>
                                Streamline school management, class organization, and add students and faculty.<br />
                                Seamlessly track attendance, assess performance, and provide feedback.<br />
                                Access records, view marks, and communicate effortlessly.
                            </StyledText>
                            <StyledBox>
                                <StyledLink to="/choose">
                                    <LightPurpleButton variant="contained" fullWidth aria-label="Login" sx={{ fontSize: '1.15rem', py: 1.3, borderRadius: 3, boxShadow: '0 4px 24px 0 rgba(127,86,218,0.10)' }}>
                                        Login
                                    </LightPurpleButton>
                                </StyledLink>
                                <StyledLink to="/chooseasguest">
                                    <Button variant="outlined" fullWidth
                                        sx={{ mt: 2, mb: 3, color: "#7f56da", borderColor: "#7f56da", fontSize: '1.1rem', py: 1.2, borderRadius: 3, fontWeight: 600, background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(2px)' }}
                                        aria-label="Login as Guest"
                                    >
                                        Login as Guest
                                    </Button>
                                </StyledLink>
                                <StyledText style={{ marginTop: 10, marginBottom: 0, fontSize: '1.05rem', color: '#6c47b6' }}>
                                    Don't have an account?{' '}
                                    <Link to="/Adminregister" style={{color:"#550080", fontWeight:600}} aria-label="Sign up">
                                        Sign up
                                    </Link>
                                </StyledText>
                            </StyledBox>
                        </GlassCard>
                    </Grid>
                </Grid>
            </StyledContainer>
        </BgWrapper>
    );
};

export default Homepage;

// Animated background shapes
const float1 = keyframes`
  0% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-30px) scale(1.08); }
  100% { transform: translateY(0) scale(1); }
`;
const float2 = keyframes`
  0% { transform: translateY(0) scale(1); }
  50% { transform: translateY(20px) scale(1.04); }
  100% { transform: translateY(0) scale(1); }
`;

const BgWrapper = styled.div`
  min-height: 100vh;
  width: 100vw;
  background: linear-gradient(120deg, #fbc2eb 0%, #fcd6a1 100%);
  position: relative;
  overflow: hidden;
`;

const AnimatedCircle1 = styled.div`
  position: absolute;
  top: 8%;
  left: 5%;
  width: 220px;
  height: 220px;
  background: radial-gradient(circle, #ffe0c3 60%, #fbc2eb 100%);
  opacity: 0.32;
  border-radius: 50%;
  filter: blur(12px);
  z-index: 0;
  animation: ${float1} 7s ease-in-out infinite;
`;
const AnimatedCircle2 = styled.div`
  position: absolute;
  bottom: 6%;
  right: 7%;
  width: 180px;
  height: 180px;
  background: radial-gradient(circle, #fcd6a1 60%, #fbc2eb 100%);
  opacity: 0.28;
  border-radius: 50%;
  filter: blur(14px);
  z-index: 0;
  animation: ${float2} 9s ease-in-out infinite;
`;

const StyledContainer = styled(Container)`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding-top: 32px;
  padding-bottom: 32px;
  z-index: 2;
`;

const GlassCard = styled.div`
  padding: 40px 32px 32px 32px;
  width: 100%;
  max-width: 440px;
  margin: 0 auto;
  border-radius: 28px;
  background: rgba(255,245,235,0.82);
  box-shadow: 0 8px 32px 0 rgba(255, 183, 94, 0.13);
  backdrop-filter: blur(16px);
  border: 1.5px solid rgba(255, 183, 94, 0.18);
  z-index: 2;
`;

const StyledBox = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content:center;
  gap: 18px;
  padding: 24px 0 0 0;
`;

const StyledTitle = styled.h1`
  font-size: 2.7rem;
  color: #a85d3c;
  font-weight: 800;
  padding-top: 0;
  letter-spacing: 0.5px;
  line-height: 1.15;
  margin-bottom: 10px;
  span {
    color: #ff8c42;
    font-size: 3.1rem;
    font-weight: 900;
    letter-spacing: 1.5px;
    text-shadow: 0 2px 12px rgba(255,183,94,0.08);
  }
`;

const StyledText = styled.p`
  margin-top: 24px;
  margin-bottom: 24px; 
  letter-spacing: 0.01em;
  line-height: 1.6;
  font-size: 1.08rem;
  color: #a85d3c;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
`;
