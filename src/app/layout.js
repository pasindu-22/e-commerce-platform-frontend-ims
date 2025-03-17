// app/layout.js
import './globals.css';
import { RoleProvider } from './context/RoleContext';

export const metadata = {
  title: 'E-Commerce Inventory Management System',
  description: 'Inventory management for e-commerce platform',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <RoleProvider>
          {children}
        </RoleProvider>
      </body>
    </html>
  );
}