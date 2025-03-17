// app/page.js
'use client';

import { useRole } from './context/RoleContext';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RoleSelection() {
  const { role, selectRole } = useRole();
  const router = useRouter();

  useEffect(() => {
    if (role) {
      router.push(`/${role}`);
    }
  }, [role, router]);

  const roles = [
    { id: 'employee', title: 'Employee', description: 'View and manage stock items' },
    { id: 'manager', title: 'Warehouse Manager', description: 'Manage warehouses and inventory' },
    { id: 'admin', title: 'IMS Admin', description: 'System administration and reporting' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-4xl w-full px-4">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-2">Inventory Management System</h1>
          <p className="text-gray-600">Select your role to continue</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {roles.map(roleOption => (
            <div 
              key={roleOption.id}
              onClick={() => selectRole(roleOption.id)}
              className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-bold mb-2">{roleOption.title}</h2>
              <p className="text-gray-600">{roleOption.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}