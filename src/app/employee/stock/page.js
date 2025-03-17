// app/employee/stock/page.js
'use client';

import { useRole } from '../../context/RoleContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function StockPage() {
  const { role } = useRole();
  const router = useRouter();
  const [stocks, setStocks] = useState([]);

  useEffect(() => {
    if (!role || role !== 'employee') {
      router.push('/');
    } else {
      // Mock data - replace with API call when backend is ready
      setStocks([
        { productSku: 'SKU-001', quantity: 50, lowStockThreshold: 10, warehouse: 'Main Warehouse' },
        { productSku: 'SKU-002', quantity: 8, lowStockThreshold: 15, warehouse: 'Main Warehouse' },
        { productSku: 'SKU-003', quantity: 120, lowStockThreshold: 30, warehouse: 'Storage Facility B' },
      ]);
    }
  }, [role, router]);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-blue-600 p-4 text-white">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="font-bold text-xl">IMS - Stock Management</h1>
          <Link href="/employee" className="bg-blue-700 px-3 py-1 rounded hover:bg-blue-800">
            Dashboard
          </Link>
        </div>
      </nav>
      
      <main className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6">Stock Inventory</h1>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product SKU</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Warehouse</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stocks.map((stock) => (
                <tr key={stock.productSku}>
                  <td className="px-6 py-4 whitespace-nowrap">{stock.productSku}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{stock.quantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{stock.warehouse}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {stock.quantity <= stock.lowStockThreshold ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        Low Stock
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        In Stock
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}