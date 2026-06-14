import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';

import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { KasirPage } from './pages/kasir/KasirPage';
import { MenuPage } from './pages/menu/MenuPage';
import { LaporanPage } from './pages/laporan/LaporanPage';
import { PengaturanPage } from './pages/pengaturan/PengaturanPage';
import { DepositPage } from './pages/deposit/DepositPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        <Route element={<AppShell />}>
          <Route path="/" element={<KasirPage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/laporan" element={<LaporanPage />} />
          <Route path="/pengaturan" element={<PengaturanPage />} />
          <Route path="/deposit" element={<DepositPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
