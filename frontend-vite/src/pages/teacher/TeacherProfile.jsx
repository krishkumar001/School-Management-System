import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { Card, CardContent, Typography, Avatar, Button, CircularProgress } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from '../../redux/userRelated/userHandle';

const TeacherProfile = () => {
  const { currentUser, response, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [avatarPreview, setAvatarPreview] = useState(currentUser.avatar || '');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef();

  if (response) { console.log(response) }
  else if (error) { console.log(error) }

  const teachSclass = currentUser.teachSclass
  const teachSubject = currentUser.teachSubject
  const teachSchool = currentUser.school

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = async () => {
      setAvatarPreview(reader.result);
      setLoading(true);
      await dispatch(updateUser({ avatar: reader.result }, currentUser._id, 'Teacher'));
      setLoading(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
      <ProfileCard>
        <ProfileCardContent>
          <Avatar
            src={avatarPreview}
            sx={{ width: 100, height: 100, mb: 1, bgcolor: 'primary.main', fontSize: 36 }}
          >
            {!avatarPreview && (currentUser.name?.[0] || 'T')}
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
          <ProfileText>Name: {currentUser.name}</ProfileText>
          <ProfileText>Email: {currentUser.email}</ProfileText>
          <ProfileText>Class: {teachSclass.sclassName}</ProfileText>
          <ProfileText>Subject: {teachSubject.subName}</ProfileText>
          <ProfileText>School: {teachSchool.schoolName}</ProfileText>
        </ProfileCardContent>
      </ProfileCard>
    </>
  )
}

export default TeacherProfile

const ProfileCard = styled(Card)`
  margin: 20px;
  width: 400px;
  border-radius: 10px;
`;

const ProfileCardContent = styled(CardContent)`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ProfileText = styled(Typography)`
  margin: 10px;
`;