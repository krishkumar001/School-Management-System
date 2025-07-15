import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Box, Typography, Paper, Tabs, Tab, List, ListItem, ListItemText, Avatar, Divider, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, CircularProgress, Badge, Stack } from '@mui/material';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const getUserInfo = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  console.log('Raw user data from localStorage:', user);
  if (user) {
    const userInfo = { 
      id: user._id, 
      name: user.name || user.email, 
      model: user.role.toLowerCase(),
      school: user.school || user._id // Use school if available, otherwise use user ID
    };
    console.log('Processed userInfo:', userInfo);
    return userInfo;
  }
  return null;
};

const getInitials = (name) => name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '?';

const Messages = () => {
  const [userInfo] = useState(getUserInfo);
  const [messages, setMessages] = useState([]);
  const [conversation, setConversation] = useState(null);
  const [recipients, setRecipients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recipientsLoading, setRecipientsLoading] = useState(false);
  const [convLoading, setConvLoading] = useState(false);
  const [error, setError] = useState('');
  const [tab, setTab] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [recipient, setRecipient] = useState('');
  const [recipientModel, setRecipientModel] = useState('');
  const [content, setContent] = useState('');

  // Memoized fetch messages function
  const fetchMessages = useCallback(async () => {
    if (!userInfo) return;
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/Messages`, {
        params: {
          userId: userInfo.id,
          userModel: userInfo.model,
          box: tab === 1 ? 'sent' : 'inbox'
        }
      });
      setMessages(res.data);
      setUnreadCount(tab === 0 ? res.data.filter(m => !m.read).length : 0);
    } catch (err) {
      setError('Failed to fetch messages');
      console.log('Error fetching messages:', err);
    } finally {
      setLoading(false);
    }
  }, [userInfo, tab]);

  // Memoized fetch recipients function
  const fetchRecipients = useCallback(async () => {
    if (!userInfo) return;
    
    console.log('Fetching recipients for user:', userInfo);
    console.log('VITE_BASE_URL:', import.meta.env.VITE_BASE_URL);
    setRecipientsLoading(true);
    
    try {
      // Extract the school ID properly - handle both string and object formats
      let schoolId;
      if (typeof userInfo.school === 'object' && userInfo.school._id) {
        schoolId = userInfo.school._id;
      } else if (typeof userInfo.school === 'string') {
        schoolId = userInfo.school;
      } else {
        schoolId = userInfo.id;
      }
      console.log('Using schoolId:', schoolId);
      
      const roles = ['Admin', 'Teacher', 'Student'];
      const allRecipients = [];
      
      // Use Promise.all to fetch all roles in parallel instead of sequential
      const promises = roles
        .filter(role => role.toLowerCase() !== userInfo.model)
        .map(async (role) => {
          try {
            // Use correct endpoint format based on backend routes
            const endpoint = role === 'Admin' ? `/Admin/${schoolId}` : `/${role}s/${schoolId}`;
            console.log(`Fetching ${role}s from: ${import.meta.env.VITE_BASE_URL}${endpoint}`);
            const res = await axios.get(`${import.meta.env.VITE_BASE_URL}${endpoint}`);
            console.log(`${role}s response:`, res.data);
            
            // Handle different response formats
            if (res.data.message) {
              // No data found
              console.log(`No ${role}s found:`, res.data.message);
              return [];
            } else if (Array.isArray(res.data)) {
              // Array of users (Teachers, Students)
              return res.data.map(u => ({ 
                id: u._id, 
                name: u.name || u.email || u._id, 
                model: role.toLowerCase() 
              }));
            } else if (res.data._id) {
              // Single user object (Admin)
              return [{
                id: res.data._id,
                name: res.data.name || res.data.email || res.data._id,
                model: role.toLowerCase()
              }];
            }
            return [];
          } catch (err) {
            console.log(`Error fetching recipients for role ${role}:`, err);
            console.log(`Error details:`, err.response?.data || err.message);
            // Don't return fallback data - let it be empty if API fails
            return [];
          }
        });
      
      const results = await Promise.all(promises);
      const all = results.flat();
      console.log('All recipients:', all);
      setRecipients(all);
    } catch (err) {
      console.log('Error fetching recipients:', err);
      console.log('Error details:', err.response?.data || err.message);
      // Don't set fallback data - let it be empty if API fails
      setRecipients([]);
    } finally {
      setRecipientsLoading(false);
    }
  }, [userInfo]);

  // Fetch messages with proper dependencies and debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchMessages();
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [fetchMessages]);

  // Fetch recipients only once when component mounts
  useEffect(() => {
    let isMounted = true;
    
    const loadRecipients = async () => {
      if (!isMounted) return;
      await fetchRecipients();
    };
    
    loadRecipients();
    
    return () => {
      isMounted = false;
    };
  }, [fetchRecipients]);

  // Open conversation
  const handleOpenConversation = useCallback((msg) => {
    setConvLoading(true);
    axios.get(`${import.meta.env.VITE_BASE_URL}/Conversation/${msg.conversationId || msg._id}`)
      .then(res => setConversation(res.data))
      .catch(() => setConversation([]))
      .finally(() => setConvLoading(false));
  }, []);

  // Send message
  const handleSend = useCallback(async () => {
    if (!recipient || !recipientModel || !content) return;
    
    let conversationId = '';
    if (conversation && conversation.length > 0) {
      conversationId = conversation[0].conversationId || conversation[0]._id;
    } else {
      conversationId = uuidv4();
    }
    
    try {
      await axios.post(`${import.meta.env.VITE_BASE_URL}/MessageSend`, {
        sender: userInfo.id,
        senderModel: userInfo.model,
        receiver: recipient,
        receiverModel: recipientModel,
        content,
        conversationId
      });
      
      setOpenDialog(false);
      setContent('');
      setRecipient('');
      setRecipientModel('');
      
      // Refresh messages after sending
      await fetchMessages();
      
      // Refresh conversation if open
      if (conversation && conversation.length > 0) {
        const lastMsg = conversation[conversation.length - 1];
        handleOpenConversation(lastMsg);
      }
    } catch (err) {
      console.log('Error sending message:', err);
      setError('Failed to send message');
    }
  }, [recipient, recipientModel, content, conversation, userInfo, fetchMessages, handleOpenConversation]);

  return (
    <Box sx={{ p: { xs: 1, sm: 3 }, maxWidth: 900, mx: 'auto' }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 700, textAlign: { xs: 'center', sm: 'left' } }}>Messages</Typography>
      <Paper sx={{ p: { xs: 1, sm: 2 }, mb: 3, borderRadius: 3, boxShadow: 2 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="fullWidth">
          <Tab label={<Badge color="error" badgeContent={unreadCount}>Inbox</Badge>} />
          <Tab label="Sent" />
        </Tabs>
        <Button variant="contained" sx={{ mt: 2, mb: 2, float: 'right' }} onClick={() => setOpenDialog(true)}>New Message</Button>
        <Box sx={{ clear: 'both' }} />
        {loading ? <CircularProgress sx={{ mt: 2 }} /> : error ? <Typography color="error">{error}</Typography> : (
          <List sx={{ maxHeight: 400, overflow: 'auto' }}>
            {messages.map(msg => (
              <React.Fragment key={msg._id}>
                <ListItem button alignItems="flex-start" onClick={() => handleOpenConversation(msg)} selected={conversation && conversation[0]?._id === msg._id} sx={{ borderRadius: 2, mb: 1, bgcolor: !msg.read && tab === 0 ? 'rgba(127,86,218,0.08)' : 'background.paper' }}>
                  <Avatar sx={{ bgcolor: '#7f56da', mr: 2 }}>{getInitials(msg.sender && msg.sender._id === userInfo.id ? userInfo.name : (msg.sender?.name || msg.senderModel))}</Avatar>
                  <ListItemText
                    primary={<span style={{ fontWeight: !msg.read && tab === 0 ? 700 : 400 }}>{msg.content.length > 40 ? msg.content.slice(0, 40) + '...' : msg.content}</span>}
                    secondary={<span style={{ color: '#666' }}>From: {(msg.sender?.name || msg.senderModel)} | To: {(msg.receiver?.name || msg.receiverModel)} | {new Date(msg.timestamp).toLocaleString()}{!msg.read && tab === 0 ? ' (unread)' : ''}</span>}
                  />
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
            {messages.length === 0 && <Typography sx={{ p: 2, textAlign: 'center', color: 'text.secondary' }}>No messages found.</Typography>}
          </List>
        )}
      </Paper>
      {/* Conversation Dialog */}
      <Dialog open={!!conversation} onClose={() => setConversation(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Conversation</DialogTitle>
        <DialogContent dividers sx={{ bgcolor: '#f9f9fb' }}>
          {convLoading ? <CircularProgress /> : (
            <List>
              {conversation && conversation.length > 0 ? conversation.map(msg => (
                <ListItem key={msg._id} alignItems="flex-start" sx={{ mb: 1 }}>
                  <Stack direction="row" spacing={2} alignItems="flex-start" width="100%">
                    <Avatar sx={{ bgcolor: msg.sender && msg.sender._id === userInfo.id ? '#7f56da' : '#00b894' }}>{getInitials(msg.sender?.name || msg.senderModel)}</Avatar>
                    <Box sx={{ flex: 1, bgcolor: msg.sender && msg.sender._id === userInfo.id ? '#ede7f6' : '#e0f7fa', borderRadius: 2, p: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{msg.sender && msg.sender._id === userInfo.id ? 'You' : (msg.sender?.name || msg.senderModel)}</Typography>
                      <Typography variant="body1">{msg.content}</Typography>
                      <Typography variant="caption" color="text.secondary">{new Date(msg.timestamp).toLocaleString()}</Typography>
                    </Box>
                  </Stack>
                </ListItem>
              )) : <Typography sx={{ p: 2, textAlign: 'center', color: 'text.secondary' }}>No conversation found.</Typography>}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConversation(null)}>Close</Button>
        </DialogActions>
      </Dialog>
      {/* New Message Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>New Message</DialogTitle>
        <DialogContent>
          <TextField
            select
            label={recipientsLoading ? "Loading recipients..." : "Recipient"}
            value={recipient}
            onChange={e => {
              setRecipient(e.target.value);
              const rec = recipients.find(r => r.id === e.target.value);
              setRecipientModel(rec?.model || '');
            }}
            fullWidth
            sx={{ mb: 2 }}
            disabled={recipientsLoading}
          >
            {recipientsLoading ? (
              <MenuItem disabled>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                Loading recipients...
              </MenuItem>
            ) : recipients.length > 0 ? (
              recipients.map(r => (
                <MenuItem key={r.id} value={r.id}>{r.name} ({r.model})</MenuItem>
              ))
            ) : (
              <MenuItem disabled>No recipients available</MenuItem>
            )}
          </TextField>
          <TextField
            label="Message"
            value={content}
            onChange={e => setContent(e.target.value)}
            fullWidth
            multiline
            minRows={3}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSend} variant="contained" disabled={!recipient || !content}>Send</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Messages; 