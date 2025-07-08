import * as React from 'react';
import { Divider, ListItemButton, ListItemIcon, ListItemText, ListSubheader, Box, Typography } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { styled } from '@mui/material/styles';

import HomeIcon from '@mui/icons-material/Home';
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import AnnouncementOutlinedIcon from '@mui/icons-material/AnnouncementOutlined';
import ClassOutlinedIcon from '@mui/icons-material/ClassOutlined';
import AssignmentIcon from '@mui/icons-material/Assignment';
import BarChartIcon from '@mui/icons-material/BarChart';
import MailOutlineIcon from '@mui/icons-material/MailOutline';

// Styled components for enhanced visual appeal
const StyledListItemButton = styled(ListItemButton)(({ theme, active }) => ({
  margin: '4px 8px',
  borderRadius: '12px',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
  
  '&:hover': {
    backgroundColor: active 
      ? 'rgba(127, 86, 218, 0.15)' 
      : 'rgba(127, 86, 218, 0.08)',
    transform: 'translateX(4px)',
    boxShadow: '0 4px 12px rgba(127, 86, 218, 0.15)',
  },
  
  '&::before': {
    content: '""',
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: active ? '4px' : '0px',
    backgroundColor: '#7f56da',
    borderRadius: '0 2px 2px 0',
    transition: 'width 0.3s ease',
  },
  
  '&:hover::before': {
    width: '4px',
  },
}));

const StyledListItemIcon = styled(ListItemIcon)(({ active }) => ({
  minWidth: '40px',
  color: active ? '#7f56da' : '#666',
  transition: 'all 0.3s ease',
  '& .MuiSvgIcon-root': {
    fontSize: '1.4rem',
  },
}));

const StyledListItemText = styled(ListItemText)(({ active }) => ({
  '& .MuiListItemText-primary': {
    fontWeight: active ? 600 : 500,
    color: active ? '#7f56da' : '#333',
    fontSize: '0.95rem',
    transition: 'all 0.3s ease',
  },
}));

const StyledListSubheader = styled(ListSubheader)({
  backgroundColor: 'transparent',
  color: '#666',
  fontWeight: 600,
  fontSize: '0.85rem',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  marginTop: '16px',
  marginBottom: '8px',
  paddingLeft: '16px',
});

const StyledDivider = styled(Divider)({
  margin: '16px 8px',
  backgroundColor: 'rgba(0, 0, 0, 0.08)',
  height: '1px',
});

const StudentSideBar = () => {
    const location = useLocation();
    
    const isActive = (path) => {
        if (path === '/') {
            return location.pathname === '/' || location.pathname === '/Student/dashboard';
        }
        return location.pathname.startsWith(path);
    };

    return (
        <Box sx={{ py: 2 }}>
            <Typography 
                variant="h6" 
                sx={{ 
                    px: 3, 
                    mb: 3, 
                    fontWeight: 700, 
                    color: '#7f56da',
                    fontSize: '1.1rem',
                    letterSpacing: '0.5px'
                }}
            >
                Student Panel
            </Typography>
            
            <React.Fragment>
                <StyledListItemButton 
                    component={Link} 
                    to="/" 
                    active={isActive('/') ? 1 : 0}
                >
                    <StyledListItemIcon active={isActive('/') ? 1 : 0}>
                        <HomeIcon />
                    </StyledListItemIcon>
                    <StyledListItemText primary="Dashboard" active={isActive('/') ? 1 : 0} />
                </StyledListItemButton>
                
                <StyledListItemButton 
                    component={Link} 
                    to="/Student/subjects" 
                    active={isActive('/Student/subjects') ? 1 : 0}
                >
                    <StyledListItemIcon active={isActive('/Student/subjects') ? 1 : 0}>
                        <AssignmentIcon />
                    </StyledListItemIcon>
                    <StyledListItemText primary="Subjects" active={isActive('/Student/subjects') ? 1 : 0} />
                </StyledListItemButton>
                
                <StyledListItemButton 
                    component={Link} 
                    to="/Student/attendance" 
                    active={isActive('/Student/attendance') ? 1 : 0}
                >
                    <StyledListItemIcon active={isActive('/Student/attendance') ? 1 : 0}>
                        <ClassOutlinedIcon />
                    </StyledListItemIcon>
                    <StyledListItemText primary="Attendance" active={isActive('/Student/attendance') ? 1 : 0} />
                </StyledListItemButton>
                
                <StyledListItemButton 
                    component={Link} 
                    to="/Student/complain" 
                    active={isActive('/Student/complain') ? 1 : 0}
                >
                    <StyledListItemIcon active={isActive('/Student/complain') ? 1 : 0}>
                        <AnnouncementOutlinedIcon />
                    </StyledListItemIcon>
                    <StyledListItemText primary="Complaints" active={isActive('/Student/complain') ? 1 : 0} />
                </StyledListItemButton>
                
                <StyledListItemButton 
                    component={Link} 
                    to="/Student/messages" 
                    active={isActive('/Student/messages') ? 1 : 0}
                >
                    <StyledListItemIcon active={isActive('/Student/messages') ? 1 : 0}>
                        <MailOutlineIcon />
                    </StyledListItemIcon>
                    <StyledListItemText primary="Messages" active={isActive('/Student/messages') ? 1 : 0} />
                </StyledListItemButton>
                
                <StyledListItemButton 
                    component={Link} 
                    to="/Student/analytics" 
                    active={isActive('/Student/analytics') ? 1 : 0}
                >
                    <StyledListItemIcon active={isActive('/Student/analytics') ? 1 : 0}>
                        <BarChartIcon />
                    </StyledListItemIcon>
                    <StyledListItemText primary="Analytics" active={isActive('/Student/analytics') ? 1 : 0} />
                </StyledListItemButton>
            </React.Fragment>
            
            <StyledDivider />
            
            <React.Fragment>
                <StyledListSubheader component="div" inset>
                    Account
                </StyledListSubheader>
                
                <StyledListItemButton 
                    component={Link} 
                    to="/Student/profile" 
                    active={isActive('/Student/profile') ? 1 : 0}
                >
                    <StyledListItemIcon active={isActive('/Student/profile') ? 1 : 0}>
                        <AccountCircleOutlinedIcon />
                    </StyledListItemIcon>
                    <StyledListItemText primary="Profile" active={isActive('/Student/profile') ? 1 : 0} />
                </StyledListItemButton>
                
                <StyledListItemButton 
                    component={Link} 
                    to="/logout" 
                    active={isActive('/logout') ? 1 : 0}
                    sx={{
                        '&:hover': {
                            backgroundColor: 'rgba(244, 67, 54, 0.08)',
                            '& .MuiListItemIcon-root': {
                                color: '#f44336',
                            },
                            '& .MuiListItemText-primary': {
                                color: '#f44336',
                            },
                        },
                    }}
                >
                    <StyledListItemIcon active={isActive('/logout') ? 1 : 0}>
                        <ExitToAppIcon />
                    </StyledListItemIcon>
                    <StyledListItemText primary="Logout" active={isActive('/logout') ? 1 : 0} />
                </StyledListItemButton>
            </React.Fragment>
        </Box>
    )
}

export default StudentSideBar