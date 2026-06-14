import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useToastStore } from '../../components/ui/Toast';
import { TrendingUp, ShoppingBag, Calendar, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export const LaporanPage = () => {
  const [ringkasan, setRingkasan] = useState(null);
  const [terlaris, setTerlaris] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToastStore();

  useEffect(() => {
    const fetchLaporan = async () => {
      try {
        const [resRingkasan, resTerlaris] = await Promise.all([
          api.get('/laporan/ringkasan'),
          api.get('/laporan/item-terlaris')
        ]);
        setRingkasan(resRingkasan.data.data);
        setTerlaris(resTerlaris.data.data);
      } catch (error) {
        addToast('Gagal memuat laporan', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchLaporan();
  }, []);

  if (loading) {
    return (
      <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-2xl p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-3"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  const maxTerjual = terlaris.length > 0 ? Math.max(...terlaris.map(i => i.terjual)) : 1;
  const rataRata = ringkasan?.jumlahTransaksi > 0 
    ? Math.round(ringkasan.totalPendapatan / ringkasan.jumlahTransaksi)
    : 0;

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Laporan Hari Ini</h1>
          <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
            <Calendar size={14} />
            {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-500 text-sm font-medium">Total Omset</p>
            <div className="p-2 bg-indigo-100 rounded-xl">
              <TrendingUp size={18} className="text-indigo-600" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-gray-800">
            Rp {(ringkasan?.totalPendapatan || 0).toLocaleString('id-ID')}
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-500 text-sm font-medium">Transaksi</p>
            <div className="p-2 bg-emerald-100 rounded-xl">
              <ShoppingBag size={18} className="text-emerald-600" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-gray-800">
            {ringkasan?.jumlahTransaksi || 0}
          </p>
          <p className="text-xs text-gray-400 mt-1">pesanan hari ini</p>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-500 text-sm font-medium">Rata-Rata</p>
            <div className="p-2 bg-amber-100 rounded-xl">
              <ArrowUpRight size={18} className="text-amber-600" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-gray-800">
            Rp {rataRata.toLocaleString('id-ID')}
          </p>
          <p className="text-xs text-gray-400 mt-1">per transaksi</p>
        </div>
      </div>

      {/* Top Items */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-5">🏆 Menu Terlaris</h2>
        <div className="space-y-4">
          {terlaris.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingBag size={48} className="text-gray-200 mx-auto mb-3" />
              <p className="text-gray-400">Belum ada data penjualan hari ini</p>
            </div>
          ) : (
            terlaris.map((item, idx) => {
              const percentage = Math.round((item.terjual / maxTerjual) * 100);
              const colors = ['bg-indigo-500', 'bg-blue-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500'];
              const barColor = colors[idx % colors.length];

              return (
                <div key={idx} className="group">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm text-white ${idx === 0 ? 'bg-amber-500' : idx === 1 ? 'bg-gray-400' : idx === 2 ? 'bg-amber-700' : 'bg-gray-300'}`}>
                        {idx + 1}
                      </div>
                      <span className="font-medium text-gray-800">{item.namaMenu}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-800">{item.terjual} porsi</p>
                      <p className="text-xs text-gray-400">Rp {item.pendapatan.toLocaleString('id-ID')}</p>
                    </div>
                  </div>
                  {/* Progress Bar */}
                  <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${barColor} transition-all duration-700 ease-out`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
