import React, { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../stores/useAuthStore';
import { useToastStore } from '../../components/ui/Toast';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Eye, EyeOff, ShoppingCart } from 'lucide-react';
import api from '../../services/api';

export const RegisterPage = () => {
  const [tokoNama, setTokoNama] = useState('');
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { addToast } = useToastStore();

  // Jika sudah login, lempar ke dashboard
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/register', { 
        tokoNama, 
        nama, 
        email, 
        password 
      });
      addToast('Pendaftaran berhasil! Silakan login.', 'success');
      navigate('/login');
    } catch (error) {
      addToast(error.response?.data?.message || 'Gagal mendaftar, silakan periksa data Anda', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-indigo-700 to-blue-800 flex flex-col justify-center items-center p-4">
      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-indigo-500/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>

      <div className="relative z-10 w-full max-w-md my-8">
        {/* Branding */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg border border-white/20">
            <ShoppingCart className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-extrabold text-white">Kasir UMKM</h1>
          <p className="text-indigo-200 mt-2">Daftar sekarang untuk mulai mengelola usaha Anda</p>
        </div>

        {/* Register Card */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-1">Buat Akun Baru 🚀</h2>
          <p className="text-sm text-gray-500 mb-6">Lengkapi data toko dan profil Anda</p>

          <form className="space-y-4" onSubmit={handleRegister}>
            <Input
              label="Nama Toko / Usaha"
              type="text"
              required
              value={tokoNama}
              onChange={(e) => setTokoNama(e.target.value)}
              placeholder="Warung Makan Sedap"
            />

            <Input
              label="Nama Pemilik"
              type="text"
              required
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="Budi Santoso"
            />

            <Input
              label="Email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="budi@example.com"
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[34px] text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <Button type="submit" className="w-full py-3 text-base mt-2" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                  Memproses...
                </span>
              ) : 'Daftar Sekarang'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            Sudah punya akun?{' '}
            <Link to="/login" className="text-indigo-600 hover:text-indigo-800 font-semibold transition-colors">
              Masuk di sini
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
