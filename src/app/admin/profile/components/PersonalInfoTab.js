'use client';

import { useProfile } from '../../../context/ProfileContext';
import {
  Typography,
  Box,
  TextField,
  Grid,
  Button,
  Card,
  CardContent
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';

export default function PersonalInfoTab({ showNotification, setLoading }) {
  const {
    personalInfo,
    editPersonalInfo,
    tempPersonalInfo,
    handlePersonalInfoEdit,
    handlePersonalInfoCancel,
    handlePersonalInfoChange,
    handlePersonalInfoSave
  } = useProfile();

  return (
    <Card elevation={2}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" component="h2" sx={{ fontWeight: 'medium' }}>
            Personal Information
          </Typography>
          
          {!editPersonalInfo ? (
            <Button 
              startIcon={<EditIcon />}
              onClick={handlePersonalInfoEdit}
            >
              Edit
            </Button>
          ) : (
            <Button 
              startIcon={<SaveIcon />}
              variant="contained"
              color="primary"
              onClick={() => handlePersonalInfoSave(showNotification, setLoading)}
            >
              Save
            </Button>
          )}
        </Box>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              label="First Name"
              name="firstName"
              value={editPersonalInfo ? tempPersonalInfo.firstName : personalInfo.firstName}
              onChange={handlePersonalInfoChange}
              disabled={!editPersonalInfo}
              fullWidth
              margin="normal"
              variant="outlined"
              size="small"
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              label="Last Name"
              name="lastName"
              value={editPersonalInfo ? tempPersonalInfo.lastName : personalInfo.lastName}
              onChange={handlePersonalInfoChange}
              disabled={!editPersonalInfo}
              fullWidth
              margin="normal"
              variant="outlined"
              size="small"
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              label="Email Address"
              name="email"
              type="email"
              value={editPersonalInfo ? tempPersonalInfo.email : personalInfo.email}
              onChange={handlePersonalInfoChange}
              disabled={!editPersonalInfo}
              fullWidth
              margin="normal"
              variant="outlined"
              size="small"
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              label="Phone Number"
              name="phoneNumber"
              value={editPersonalInfo ? tempPersonalInfo.phoneNumber : personalInfo.phoneNumber}
              onChange={handlePersonalInfoChange}
              disabled={!editPersonalInfo}
              fullWidth
              margin="normal"
              variant="outlined"
              size="small"
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              label="Position/Title"
              name="position"
              value={personalInfo.position}
              disabled={true}
              fullWidth
              margin="normal"
              variant="outlined"
              size="small"
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              label="Department"
              name="department"
              value={personalInfo.department}
              disabled={true}
              fullWidth
              margin="normal"
              variant="outlined"
              size="small"
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              label="Bio/About"
              name="about"
              value={editPersonalInfo ? tempPersonalInfo.about : personalInfo.about}
              onChange={handlePersonalInfoChange}
              disabled={!editPersonalInfo}
              fullWidth
              multiline
              rows={4}
              margin="normal"
              variant="outlined"
              size="small"
            />
          </Grid>
        </Grid>
        
        {editPersonalInfo && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            <Button 
              onClick={handlePersonalInfoCancel}
              sx={{ mr: 2 }}
            >
              Cancel
            </Button>
            <Button 
              variant="contained" 
              color="primary"
              onClick={() => handlePersonalInfoSave(showNotification, setLoading)}
            >
              Save Changes
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}