import React from 'react';

export const Button = ({ children, onClick, variant = 'primary', className = '', type = 'button', disabled = false }) => {
  const baseStyle = 'px-4 py-2 rounded-lg font-semibold transition-all duration-200 shadow-sm flex items-center justify-center gap-2 active:scale-95';
  
  const variants = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-md disabled:bg-indigo-300',
    secondary: 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:shadow-md disabled:bg-gray-100',
    danger: 'bg-red-500 text-white hover:bg-red-600 hover:shadow-md disabled:bg-red-300',
    ghost: 'bg-transparent text-gray-600 hover:bg-gray-100 shadow-none hover:shadow-none',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};
