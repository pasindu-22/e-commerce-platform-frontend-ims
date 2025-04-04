'use client';

import {createContext, useContext, useState, useEffect} from 'react';
import axios from 'axios';

const PasswordContext = createContext();

export function PasswordProvider({children}) {
      const [passwords, setPasswords] = useState({
        current: '',
        new: '',
        confirm: ''
      });
      const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
      });
      const [passwordErrors, setPasswordErrors] = useState({
        current: '',
        new: '',
        confirm: ''
      });

      const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswords({
            ...passwords,
            [name]: value
        });
        
        if (passwordErrors[name]) {
            setPasswordErrors({
                ...passwordErrors,
                [name]: ''
            });
        }
    };

    const togglePasswordVisibility = (field) => {
        setShowPasswords({
          ...showPasswords,
          [field]: !showPasswords[field]
        });
    };
          
    const validatePasswords = () => {
        const errors = {
            current: '',
            new: '',
            confirm: ''
        };
        
        
        if (!passwords.current) {
            errors.current = 'Current password is required';
        }
        
        if (!passwords.new) {
            errors.new = 'New password is required';
        } else if (passwords.new.length < 8) {
            errors.new = 'Password must be at least 8 characters long';
        } else if (!/[A-Z]/.test(passwords.new)) {
            errors.new = 'Password must contain at least one uppercase letter';
        } else if (!/[a-z]/.test(passwords.new)) {
            errors.new = 'Password must contain at least one lowercase letter';
        } else if (!/[0-9]/.test(passwords.new)) {
            errors.new = 'Password must contain at least one number';
        } else if (!/[^A-Za-z0-9]/.test(passwords.new)) {
            errors.new = 'Password must contain at least one special character';
        }
        
        if (!passwords.confirm) {
            errors.confirm = 'Please confirm your new password';
        } else if (passwords.confirm !== passwords.new) {
            errors.confirm = 'Passwords do not match';
        }
        
        setPasswordErrors(errors);
        
        // Return true if no errors
        return !Object.values(errors).some(error => error);
    };
    
          
    const handlePasswordSubmit = async (showNotification, setLoading) => {
        if (!validatePasswords()) {
            return;
        }
    
        try {
            setLoading(true);
            
            const token = localStorage.getItem('jwt');
            if (!token) {
            console.error('Authentication token not found');
            showNotification('Authentication failed', 'error');
            setLoading(false);
            return;
            }
            
            // Actual API call to update password
            await axios.put('http://localhost:8080/api/employees/update/password/EMP-001', 
            {
                currentPassword: passwords.current,
                newPassword: passwords.new
            },
            {
                headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
                }
            }
            );
            
            // Reset form
            setPasswords({
            current: '',
            new: '',
            confirm: ''
            });
            
            setLoading(false);
            showNotification('Password updated successfully', 'success');
        } catch (error) {
            console.error('Error updating password:', error);
            showNotification('Failed to update password', 'error');
            setLoading(false);
        }
    }

    return (
    <PasswordContext.Provider value={{
        passwords,
        showPasswords,
        passwordErrors,
        handlePasswordChange,
        togglePasswordVisibility,
        validatePasswords,
        handlePasswordSubmit
        }}>
        {children}
    </PasswordContext.Provider>
    );
}

export function usePassword() {
    const context = useContext(PasswordContext);
    if ((context === undefined)) {
        throw new Error('usePassword must be used within a PasswordProvider');
    }
    return context;
}