'use client';

import { useState } from "react";
import { useSecurity } from "@/app/context/SecurityContext";
import {
    Typography,
    Box,
    Button,
    Card,
    CardContent,
    Grid,
    Switch,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControl,
    InputLabel,
    OutlinedInput,
    InputAdornment,
    Snackbar,
    Alert,
    CircularProgress,
    IconButton,
    ListItemButton,
    ListItemAvatar,
    Avatar,
} from "@mui/material";
import SecurityIcon from "@mui/icons-material/Security";
import LockIcon from "@mui/icons-material/Lock";
import NotificationsIcon from "@mui/icons-material/Edit";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

export default function SecurityTab({ showNotification, setLoading }) {
    const {
        securitySettings,
        handleSecuritySettingChange,
        handleOpenDialog,
        handleCloseDialog,
        handle2FASetup,
        openDialog,
        dialogType        
    } = useSecurity();

    const [loading, setLocalLoading] = useState(false);
    const handleSetup2FA = async () => {
        setLocalLoading(true);
        setLoading(true);
        try {
            await handle2FASetup();
        } finally {
            setLocalLoading(false);
            setLoading(false);
        }
    };
    
    const handleChangePassword = async () => {
        setLocalLoading(true);
        setLoading(true);
        try {
            await handlePasswordSubmit();
        } finally {
            setLocalLoading(false);
            setLoading(false);
        }
    };

    return (
        <>
        <Card elevation={2}>
                  <CardContent>
                    <Typography variant="h6" component="h2" sx={{ fontWeight:'medium', mb: 3 }}>
                      Security Settings
                    </Typography>

                    <List>
                      <ListItem>
                        <ListItemIcon>
                          <SecurityIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Two-Factor Authentication" 
                          secondary={securitySettings.twoFactorEnabled ? "Enabled" : "Disabled"} 
                        />
                        <Switch
                          checked={securitySettings.twoFactorEnabled}
                          onChange={handleSecuritySettingChange}
                          name="twoFactorEnabled"
                          color="primary"
                        />
                      </ListItem>
                      
                      <Divider component="li" />
                      
                      <ListItem>
                        <ListItemIcon>
                          <NotificationsIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Email Notifications" 
                          secondary="Receive important account notifications via email" 
                        />
                        <Switch
                          checked={securitySettings.emailNotifications}
                          onChange={handleSecuritySettingChange}
                          name="emailNotifications"
                          color="primary"
                        />
                      </ListItem>
                      
                      <Divider component="li" />
                      
                      <ListItem>
                        <ListItemIcon>
                          <NotificationsIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Login Alerts" 
                          secondary="Get notified when someone logs into your account" 
                        />
                        <Switch
                          checked={securitySettings.loginAlerts}
                          onChange={handleSecuritySettingChange}
                          name="loginAlerts"
                          color="primary"
                        />
                      </ListItem>
                      
                      <Divider component="li" />
                      
                      <ListItem>
                        <ListItemIcon>
                          <LockIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Auto Logout" 
                          secondary="Session timeout duration (minutes)" 
                        />
                        <TextField
                          type="number"
                          name="autoLogout"
                          value={securitySettings.autoLogout}
                          onChange={handleSecuritySettingChange}
                          size="small"
                          sx={{ width: 80 }}
                          inputProps={{ min: 1, max: 120 }}
                        />
                      </ListItem>
                    </List>

                    <Box sx={{ mt: 3 }}>
                      <Button 
                        variant="contained" 
                        color="primary"
                        onClick={() => handleOpenDialog('2fa')}
                        disabled={securitySettings.twoFactorEnabled}
                        sx={{ mr: 2 }}
                      >
                        Set Up 2FA
                      </Button>
                      <Button 
                        variant="outlined" 
                        color="primary"
                        onClick={() => handleOpenDialog('password')}
                      >
                        Change Password
                      </Button>
                    </Box>
                  </CardContent>
                </Card>

        {/* 2FA Setup Dialog */}
        <Dialog open={openDialog && dialogType === '2fa'} onClose={handleCloseDialog}>
          <DialogTitle>Set Up Two-Factor Authentication</DialogTitle>
          <DialogContent>
            <Typography variant="body1" sx={{ mb: 2 }}>
              To enable two-factor authentication, follow these steps:
            </Typography>
            <ol>
              <li>Download an authenticator app like Google Authenticator or Authy</li>
              <li>Scan the QR code below with your app</li>
              <li>Enter the 6-digit code generated by the app</li>
            </ol>
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
              {/* Placeholder for QR code - in a real app this would be generated from the backend */}
              <Box sx={{ 
                width: 200, 
                height: 200, 
                bgcolor: '#f5f5f5', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                border: '1px dashed #ccc'
              }}>
                <Typography variant="body2" color="text.secondary">
                  QR Code Placeholder
                </Typography>
              </Box>
            </Box>
            <TextField
              fullWidth
              label="6-digit code"
              variant="outlined"
              size="small"
              sx={{ mt: 2 }}
            />
          </DialogContent>
          <DialogActions>
                <Button onClick={handleCloseDialog}>Cancel</Button>
                <Button 
                    onClick={handleSetup2FA} 
                    variant="contained" 
                    color="primary"
                    disabled={loading || localLoading}
                >
                    {(loading || localLoading) ? <CircularProgress size={24} /> : 'Verify & Enable'}
                </Button>
            </DialogActions>
        </Dialog>

        {/* Password Change Dialog */}
        <Dialog open={openDialog && dialogType === 'password'} onClose={handleCloseDialog}>
          <DialogTitle>Change Password</DialogTitle>
          <DialogContent>
            <Typography variant="body1" sx={{ mb: 2 }}>
              For security reasons, you'll need to enter your current password before setting a new one.
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth variant="outlined" size="small">
                  <InputLabel htmlFor="dialog-current-password">Current Password</InputLabel>
                  <OutlinedInput
                    id="dialog-current-password"
                    type={showPasswords.current ? 'text' : 'password'}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => togglePasswordVisibility('current')}
                          edge="end"
                        >
                          {showPasswords.current ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    }
                    label="Current Password"
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth variant="outlined" size="small">
                  <InputLabel htmlFor="dialog-new-password">New Password</InputLabel>
                  <OutlinedInput
                    id="dialog-new-password"
                    type={showPasswords.new ? 'text' : 'password'}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => togglePasswordVisibility('new')}
                          edge="end"
                        >
                          {showPasswords.new ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    }
                    label="New Password"
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth variant="outlined" size="small">
                  <InputLabel htmlFor="dialog-confirm-password">Confirm New Password</InputLabel>
                  <OutlinedInput
                    id="dialog-confirm-password"
                    type={showPasswords.confirm ? 'text' : 'password'}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => togglePasswordVisibility('confirm')}
                          edge="end"
                        >
                          {showPasswords.confirm ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    }
                    label="Confirm New Password"
                  />
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
                <Button onClick={handleCloseDialog}>Cancel</Button>
                <Button 
                    onClick={handleChangePassword} 
                    variant="contained" 
                    color="primary"
                    disabled={loading || localLoading}
                >
                    {(loading || localLoading) ? <CircularProgress size={24} /> : 'Change Password'}
                </Button>
            </DialogActions>
        </Dialog>
        </>

    );
}