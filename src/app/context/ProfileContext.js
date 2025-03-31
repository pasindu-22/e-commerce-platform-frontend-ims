'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const ProfileContext = createContext();

export function ProfileProvider({ children }) {
  // Personal info states
  const [personalInfo, setPersonalInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    position: '',
    department: '',
    joinDate: '',
    bio: ''
  });
  const [editPersonalInfo, setEditPersonalInfo] = useState(false);
  const [tempPersonalInfo, setTempPersonalInfo] = useState({...personalInfo});
  
  // Personal info handlers
  const handlePersonalInfoEdit = () => {
    setTempPersonalInfo({...personalInfo});
    setEditPersonalInfo(true);
  };

  //Load the personal info from the API
  const loadPersonalInfo = async () => {
    try {
      const token = localStorage.getItem('jwt');
      if (!token) {
        console.error('Authentication token not found');
        return;
      }

      const response = await axios.get('http://localhost:8080/api/employees/EMP-001', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        withCredentials: true // Allow credentials
      });
      
      
      console.log('API response:', response);
      setPersonalInfo(response.data);
      console.log(response)
    } catch (error) {
      console.error('Error fetching personal info:', error);
    }
  }

  useEffect(() => {
    loadPersonalInfo();
  }, []);
  
  const handlePersonalInfoCancel = () => {
    setEditPersonalInfo(false);
  };
  
  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;
    setTempPersonalInfo({
      ...tempPersonalInfo,
      [name]: value
    });
  };
  
  const handlePersonalInfoSave = async (showNotification, setLoading) => {
    try {
      setLoading(true);
      
      const token = localStorage.getItem('jwt');
      if (!token) {
        console.error('Authentication token not found');
        return;
      }
      console.log('Found token:', token);

      const response = await axios.put('http://localhost:8080/api/employees/update/EMP-001',tempPersonalInfo,
        {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        withCredentials: true 
      });
      
      setPersonalInfo(response.data);
      setEditPersonalInfo(false);
      setLoading(false);
      showNotification('Personal information updated successfully', 'success');
    } catch (error) {
      console.error('Error updating personal info:', error);
      showNotification('Failed to update personal information', 'error');
      setLoading(false);
    }
  };

  return (
    <ProfileContext.Provider value={{
      personalInfo,
      editPersonalInfo,
      tempPersonalInfo,
      handlePersonalInfoEdit,
      handlePersonalInfoCancel,
      handlePersonalInfoChange,
      handlePersonalInfoSave,
      loadPersonalInfo
    }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}