import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutGrid, ShoppingCart, FileText, Settings, LogOut, Coins } from 'lucide-react';
import { useAuthStore } from '../../stores/useAuthStore';
import { useTokoStore } from '../../stores/useTokoStore';

export const Sidebar = () => {
  const { logout, user } = useAuthStore();
  const { toko } = useTokoStore();

  const navItems = [
    { to: '/', icon: <ShoppingCart size={20} />, label: 'Kasir' },
    { to: '/menu', icon: <LayoutGrid size={20} />, label: 'Kelola Menu' },
  ];

  if (user?.peran === 'OWNER') {
    navItems.push({ to: '/laporan', icon: <FileText size={20} />, label: 'Laporan' });
    navItems.push({ to: '/deposit', icon: <Coins size={20} />, label: 'Deposit Poin' });
    navItems.push({ to: '/pengaturan', icon: <Settings size={20} />, label: 'Pengaturan' });
  }

  return (
    <div className="w-64 h-full bg-white border-r border-gray-200 flex flex-col shadow-sm">
      <div className="h-16 flex items-center px-6 border-b border-gray-100">
        <h1 className="text-xl font-bold text-indigo-700 truncate">
          {toko?.nama || 'Kasir UMKM'}
        </h1>
      </div>
      
      <div className="flex-1 overflow-y-auto py-6 flex flex-col gap-2 px-4">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                isActive 
                  ? 'bg-indigo-50 text-indigo-700' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>

      <div className="p-4 border-t border-gray-100">
        <div className="flex flex-col mb-4 px-2">
          <span className="text-sm font-semibold text-gray-800">{user?.nama}</span>
          <span className="text-xs text-gray-500">{user?.peran}</span>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-2 w-full rounded-xl font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut size={20} />
          <span>Keluar</span>
        </button>
      </div>
    </div>
  );
};
