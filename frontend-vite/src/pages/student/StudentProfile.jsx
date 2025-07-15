import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { Card, CardContent, Typography, Grid, Box, Avatar, Container, Paper, Button, CircularProgress } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from '../../redux/userRelated/userHandle';

const StudentProfile = () => {
  const { currentUser, response, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [avatarPreview, setAvatarPreview] = useState(currentUser.avatar || '');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef();

  if (response) { console.log(response) }
  else if (error) { console.log(error) }

  const sclassName = currentUser.sclassName
  const studentSchool = currentUser.school

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = async () => {
      setAvatarPreview(reader.result);
      setLoading(true);
      await dispatch(updateUser({ avatar: reader.result }, currentUser._id, 'Student'));
      setLoading(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
      <Container maxWidth="md">
        <StyledPaper elevation={3}>
          <Grid container columns={12} spacing={3}>
            <Grid sx={{ gridColumn: 'span 12' }}>
              <Box display="flex" flexDirection="column" alignItems="center">
                <Avatar alt="Student Avatar" src={avatarPreview} sx={{ width: 150, height: 150, mb: 1 }}>
                  {!avatarPreview && String(currentUser.name).charAt(0)}
                </Avatar>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{ mb: 1 }}
                  onClick={() => fileInputRef.current.click()}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={20} /> : 'Change Avatar'}
                </Button>
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  ref={fileInputRef}
                  onChange={handleAvatarChange}
                />
              </Box>
            </Grid>
            <Grid sx={{ gridColumn: 'span 12' }}>
              <Box display="flex" justifyContent="center">
                <Typography variant="h5" component="h2" textAlign="center">
                  {currentUser.name}
                </Typography>
              </Box>
            </Grid>
            <Grid sx={{ gridColumn: 'span 12' }}>
              <Box display="flex" justifyContent="center">
                <Typography variant="subtitle1" component="p" textAlign="center">
                  Student Roll No: {currentUser.rollNum}
                </Typography>
              </Box>
            </Grid>
            <Grid sx={{ gridColumn: 'span 12' }}>
              <Box display="flex" justifyContent="center">
                <Typography variant="subtitle1" component="p" textAlign="center">
                  Class: {sclassName.sclassName}
                </Typography>
              </Box>
            </Grid>
            <Grid sx={{ gridColumn: 'span 12' }}>
              <Box display="flex" justifyContent="center">
                <Typography variant="subtitle1" component="p" textAlign="center">
                  School: {studentSchool.schoolName}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </StyledPaper>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Personal Information
            </Typography>
            <Grid container columns={12} spacing={2}>
              <Grid sx={{ gridColumn: 'span 6' }}>
                <Typography variant="subtitle1" component="p">
                  <strong>Date of Birth:</strong> January 1, 2000
                </Typography>
              </Grid>
              <Grid sx={{ gridColumn: 'span 6' }}>
                <Typography variant="subtitle1" component="p">
                  <strong>Gender:</strong> Male
                </Typography>
              </Grid>
              <Grid sx={{ gridColumn: 'span 6' }}>
                <Typography variant="subtitle1" component="p">
                  <strong>Email:</strong> john.doe@example.com
                </Typography>
              </Grid>
              <Grid sx={{ gridColumn: 'span 6' }}>
                <Typography variant="subtitle1" component="p">
                  <strong>Phone:</strong> (123) 456-7890
                </Typography>
              </Grid>
              <Grid sx={{ gridColumn: 'span 6' }}>
                <Typography variant="subtitle1" component="p">
                  <strong>Address:</strong> 123 Main Street, City, Country
                </Typography>
              </Grid>
              <Grid sx={{ gridColumn: 'span 6' }}>
                <Typography variant="subtitle1" component="p">
                  <strong>Emergency Contact:</strong> (987) 654-3210
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>
    </>
  )
}

export default StudentProfile

const StyledPaper = styled(Paper)`
  padding: 20px;
  margin-bottom: 20px;
`;