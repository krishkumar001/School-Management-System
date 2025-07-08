import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardContent, Typography, Avatar, Box, Button, Paper, CircularProgress } from '@mui/material';
import { updateUser } from '../../redux/userRelated/userHandle';

const AdminProfile = () => {
    const { currentUser } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const [avatarPreview, setAvatarPreview] = useState(currentUser.avatar || '');
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef();

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = async () => {
            setAvatarPreview(reader.result);
            setLoading(true);
            await dispatch(updateUser({ avatar: reader.result }, currentUser._id, 'Admin'));
            setLoading(false);
        };
        reader.readAsDataURL(file);
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', p: 2 }}>
            <Card sx={{ maxWidth: 400, width: '100%', borderRadius: 4, boxShadow: 6, p: 2 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
                    <Avatar
                        src={avatarPreview}
                        sx={{ width: 80, height: 80, mb: 1, bgcolor: 'primary.main', fontSize: 36 }}
                    >
                        {!avatarPreview && (currentUser.name?.[0] || 'A')}
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
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>{currentUser.name}</Typography>
                    <Typography variant="body2" color="text.secondary">Admin</Typography>
                </Box>
                <CardContent>
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary">Email</Typography>
                        <Typography variant="body1">{currentUser.email}</Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary">School</Typography>
                        <Typography variant="body1">{currentUser.schoolName}</Typography>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    )
}

export default AdminProfile