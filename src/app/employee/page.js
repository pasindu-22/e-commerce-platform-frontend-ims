// app/employee/page.js
'use client';

import { useRole } from '../context/RoleContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

export default function EmployeePage() {
  const { role, clearRole } = useRole();
  const router = useRouter();

  useEffect(() => {
    if (!role || role !== 'employee') {
      router.push('/');
    }
  }, [role, router]);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-blue-600 p-4 text-white">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="font-bold text-xl">IMS - Employee Portal</h1>
          <button onClick={clearRole} className="bg-blue-700 px-3 py-1 rounded hover:bg-blue-800">
            Change Role
          </button>
        </div>
      </nav>
      
      <main className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6">Employee Dashboard</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Stock Management</h2>
          <p className="mb-4">Manage inventory stock levels and view product information</p>
          
          <div className="mt-4">
            <Link href="/employee/stock" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              View Stock Items
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}