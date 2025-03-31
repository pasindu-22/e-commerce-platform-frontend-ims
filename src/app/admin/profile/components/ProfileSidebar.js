'use client';

import { useProfile } from '../../../context/ProfileContext';
import {
  Typography,
  Avatar,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Card,
  CardContent,
  Box
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LockIcon from '@mui/icons-material/Lock';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';

export default function ProfileSidebar({ securitySettings }) {
  const { personalInfo } = useProfile();

  return (
    <Card elevation={2}>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 3 }}>
        {/* Avatar with Camera Icon overlay */}
        <Box sx={{ position: 'relative', mb: 2 }}>
          <Avatar 
            sx={{ 
              width: 120, 
              height: 120,
              bgcolor: '#1976d2',
              fontSize: '3rem'
            }}
          >
            {personalInfo.firstName?.charAt(0) || ''}{personalInfo.lastName?.charAt(0) || ''}
          </Avatar>
          
          <IconButton 
            sx={{ 
              position: 'absolute',
              bottom: 0,
              right: 0,
              bgcolor: '#e3f2fd',
              '&:hover': { bgcolor: '#bbdefb' },
              border: '2px solid white',
              padding: '5px',
              minWidth: '32px',
              minHeight: '32px'
            }}
            aria-label="change profile picture"
          >
            <PhotoCameraIcon fontSize="small" />
          </IconButton>
        </Box>
        
        <Typography variant="h5" component="h2" sx={{ fontWeight: 'medium', textAlign: 'center' }}>
          {personalInfo.firstName || ''} {personalInfo.lastName || ''}
        </Typography>
        
        <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', mb: 2 }}>
          {personalInfo.position || ''}
        </Typography>
        
        <Divider sx={{ width: '100%', mb: 2 }} />
        
        <List dense sx={{ width: '100%' }}>
          <ListItem>
            <ListItemIcon>
              <PersonIcon color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary="Department" 
              secondary={personalInfo.department || 'Not specified'} 
            />
          </ListItem>
          
          <ListItem>
            <ListItemIcon>
              <NotificationsIcon color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary="Member Since" 
              secondary={personalInfo.dateOfJoining ? new Date(personalInfo.dateOfJoining).toLocaleDateString() : 'Not specified'} 
            />
          </ListItem>
          
          <ListItem>
            <ListItemIcon>
              <LockIcon color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary="Last Password Change" 
              secondary={securitySettings?.lastPasswordChange ? new Date(securitySettings.lastPasswordChange).toLocaleDateString() : 'Not available'} 
            />
          </ListItem>
        </List>
      </CardContent>
    </Card>
  );
}