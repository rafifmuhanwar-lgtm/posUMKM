import React from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/useAuthStore';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';
import { ToastContainer } from '../ui/Toast';

export const AppShell = () => {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // KasirPage needs special layout (no scroll on main, it manages its own)
  const isKasirPage = location.pathname === '/';

  return (
    <div className="flex h-[100dvh] bg-gray-50 overflow-hidden text-gray-900">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full w-full overflow-hidden">
        <main className={`flex-1 w-full ${isKasirPage ? 'overflow-hidden' : 'overflow-y-auto pb-20 md:pb-0'}`}>
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden">
        <BottomNav />
      </div>
      
      <ToastContainer />
    </div>
  );
};
