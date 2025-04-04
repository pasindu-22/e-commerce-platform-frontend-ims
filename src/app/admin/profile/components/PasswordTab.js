'use client';

import { usePassword } from "@/app/context/PasswordContext";

import {
    Typography,
    Box,
    TextField,
    Grid,
    Button,
    Card,
    CardContent,
    FormControl, 
    InputLabel,   
    OutlinedInput, 
    InputAdornment, 
    FormHelperText, 
    IconButton
  } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

export default function PasswordTab({ showNotification, setLoading}) {
    const {
        passwords,
        showPasswords,
        passwordErrors,
        handlePasswordChange,
        togglePasswordVisibility,
        validatePasswords,
        handlePasswordSubmit
    } = usePassword();

    return (
        <Card elevation={2}>
            <CardContent>
            <Typography variant="h6" component="h2" sx={{ fontWeight: 'medium', mb: 3 }}>
                Change Password
            </Typography>
            
            <Grid container spacing={3}>
                <Grid item xs={12}>
                <FormControl 
                    fullWidth 
                    variant="outlined" 
                    size="small"
                    error={!!passwordErrors.current}
                >
                    <InputLabel htmlFor="current-password">Current Password</InputLabel>
                    <OutlinedInput
                    id="current-password"
                    name="current"
                    type={showPasswords.current ? 'text' : 'password'}
                    value={passwords.current}
                    onChange={handlePasswordChange}
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
                    {passwordErrors.current && (
                    <FormHelperText error>{passwordErrors.current}</FormHelperText>
                    )}
                </FormControl>
                </Grid>
                
                <Grid item xs={12}>
                <FormControl 
                    fullWidth 
                    variant="outlined" 
                    size="small"
                    error={!!passwordErrors.new}
                >
                    <InputLabel htmlFor="new-password">New Password</InputLabel>
                    <OutlinedInput
                    id="new-password"
                    name="new"
                    type={showPasswords.new ? 'text' : 'password'}
                    value={passwords.new}
                    onChange={handlePasswordChange}
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
                    {passwordErrors.new && (
                    <FormHelperText error>{passwordErrors.new}</FormHelperText>
                    )}
                </FormControl>
                </Grid>
                
                <Grid item xs={12}>
                <FormControl 
                    fullWidth 
                    variant="outlined" 
                    size="small"
                    error={!!passwordErrors.confirm}
                >
                    <InputLabel htmlFor="confirm-password">Confirm New Password</InputLabel>
                    <OutlinedInput
                    id="confirm-password"
                    name="confirm"
                    type={showPasswords.confirm ? 'text' : 'password'}
                    value={passwords.confirm}
                    onChange={handlePasswordChange}
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
                    {passwordErrors.confirm && (
                    <FormHelperText error>{passwordErrors.confirm}</FormHelperText>
                    )}
                </FormControl>
                </Grid>
            </Grid>
            
            <Box sx={{ mt: 3 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Password must:
                </Typography>
                <ul style={{ color: 'text.secondary', fontSize: '0.875rem', paddingLeft: '1.5rem', margin: 0 }}>
                <li>Be at least 8 characters long</li>
                <li>Include at least one uppercase letter</li>
                <li>Include at least one lowercase letter</li>
                <li>Include at least one number</li>
                <li>Include at least one special character</li>
                </ul>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                <Button 
                variant="contained" 
                color="primary"
                onClick={() => handlePasswordSubmit(showNotification, setLoading)}
                >
                Update Password
                </Button>
            </Box>
            </CardContent>
        </Card>
    );
}