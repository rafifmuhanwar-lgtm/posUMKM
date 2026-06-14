import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutGrid, ShoppingCart, FileText, Settings, Coins } from 'lucide-react';
import { useAuthStore } from '../../stores/useAuthStore';

export const BottomNav = () => {
  const { user } = useAuthStore();

  const navItems = [
    { to: '/', icon: <ShoppingCart size={24} />, label: 'Kasir' },
    { to: '/menu', icon: <LayoutGrid size={24} />, label: 'Menu' },
  ];

  if (user?.peran === 'OWNER') {
    navItems.push({ to: '/laporan', icon: <FileText size={24} />, label: 'Laporan' });
    navItems.push({ to: '/deposit', icon: <Coins size={24} />, label: 'Poin' });
    navItems.push({ to: '/pengaturan', icon: <Settings size={24} />, label: 'Setup' });
  }

  return (
    <div className="fixed bottom-0 left-0 w-full h-16 bg-white border-t border-gray-200 flex items-center justify-around z-40 pb-safe">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center w-full h-full gap-1 ${
              isActive ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'
            }`
          }
        >
          {item.icon}
          <span className="text-[10px] font-medium">{item.label}</span>
        </NavLink>
      ))}
    </div>
  );
};
