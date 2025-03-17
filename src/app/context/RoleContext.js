// app/context/RoleContext.js
'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const RoleContext = createContext();

export function RoleProvider({ children }) {
  const [role, setRole] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const savedRole = localStorage.getItem('userRole');
    if (savedRole) {
      setRole(savedRole);
    }
  }, []);

  const selectRole = (selectedRole) => {
    localStorage.setItem('userRole', selectedRole);
    setRole(selectedRole);
    router.push(`/${selectedRole}`);
  };

  const clearRole = () => {
    localStorage.removeItem('userRole');
    setRole(null);
    router.push('/');
  };

  return (
    <RoleContext.Provider value={{ role, selectRole, clearRole }}>
      {children}
    </RoleContext.Provider>
  );
}

export const useRole = () => useContext(RoleContext);