import React from 'react';
import { IconButton, Badge, Menu, MenuItem, ListItemText, Typography, Button, Box, Avatar, Stack } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CampaignIcon from '@mui/icons-material/Campaign'; // for notice
import ReportProblemIcon from '@mui/icons-material/ReportProblem'; // for complaint

const getNotifIcon = (notif) => {
  if (notif.message?.toLowerCase().includes('notice')) return <CampaignIcon color="primary" />;
  if (notif.message?.toLowerCase().includes('complaint')) return <ReportProblemIcon color="warning" />;
  return <NotificationsIcon color="action" />;
};

const NotificationBell = ({ notifications, unreadCount, onClick, anchorEl, onClose, markAllAsRead, notificationClick }) => {
  return (
    <>
      <IconButton color="inherit" onClick={onClick} size="large" aria-label="Show notifications">
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={onClose}
        PaperProps={{ style: { minWidth: 340, borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.10)' } }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, py: 1 }}>
          <Typography sx={{ fontWeight: 600, fontSize: 18 }}>Notifications</Typography>
          <Button size="small" onClick={markAllAsRead} disabled={unreadCount === 0}>Mark all as read</Button>
        </Box>
        {notifications.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center', color: 'text.secondary' }}>
            <NotificationsIcon sx={{ fontSize: 40, mb: 1, color: 'grey.400' }} />
            <Typography variant="body2">You're all caught up!</Typography>
          </Box>
        ) : (
          notifications.slice(0, 8).map((notif, idx) => (
            <MenuItem
              key={idx}
              onClick={() => {
                onClose();
                if (notificationClick) notificationClick(notif);
              }}
              divider={idx !== notifications.length - 1}
              sx={{
                fontWeight: notif.unread ? 700 : 400,
                cursor: notif.link ? 'pointer' : 'default',
                transition: 'background 0.2s',
                '&:hover': { background: notif.link ? 'rgba(94,96,206,0.08)' : undefined }
              }}
              aria-label={notif.message}
            >
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar sx={{ width: 32, height: 32, bgcolor: notif.unread ? 'primary.light' : 'grey.200' }}>
                  {getNotifIcon(notif)}
                </Avatar>
                <ListItemText
                  primary={<span style={{ fontWeight: notif.unread ? 700 : 400 }}>{notif.message}</span>}
                  secondary={notif.time ? new Date(notif.time).toLocaleString() : ''}
                />
              </Stack>
            </MenuItem>
          ))
        )}
      </Menu>
    </>
  );
};

export default NotificationBell; 