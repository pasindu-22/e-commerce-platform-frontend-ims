'use client'

import {createContext, useContext, useState, useEffect} from 'react';
import axios from 'axios';

const SecurityContext = createContext();

export function SecurityProvider({children}) {
    // Security settings states
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: false,
    emailNotifications: true,
    loginAlerts: true,
    autoLogout: 30, // minutes
    lastPasswordChange: '2025-02-15'
  });
  
  // Dialog state
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState(''); // 'password', '2fa'

  const handleSecuritySettingChange = (e) => {
    const { name, checked, value, type } = e.target;
    setSecuritySettings({
      ...securitySettings,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handleOpenDialog = (type) => {
    setDialogType(type);
    setOpenDialog(true);
  };
  
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  
  const handle2FASetup = async () => {
    try {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setSecuritySettings({
        ...securitySettings,
        twoFactorEnabled: true
      });
      
      handleCloseDialog();
      setLoading(false);
      showNotification('Two-factor authentication enabled successfully', 'success');
    } catch (error) {
      console.error('Error setting up 2FA:', error);
      showNotification('Failed to set up two-factor authentication', 'error');
      setLoading(false);
    }
  };

  return (
    <SecurityContext.Provider value ={{
        securitySettings,
        handleSecuritySettingChange,
        handleOpenDialog,
        handleCloseDialog,
        handle2FASetup,
        openDialog,
        dialogType
        }}>
        {children}
    </SecurityContext.Provider>
  );

}

export function useSecurity() {
  const context = useContext(SecurityContext);
  if (context === undefined) {
    throw new Error('useSecurity must be used within a SecurityProvider');
  }
  return context;
}