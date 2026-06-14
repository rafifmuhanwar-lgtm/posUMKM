import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useToastStore } from '../../components/ui/Toast';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Coins, AlertTriangle, Plus, History, ExternalLink, RefreshCw } from 'lucide-react';

export const DepositPage = () => {
  const [saldo, setSaldo] = useState(0);
  const [riwayat, setRiwayat] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [nominal, setNominal] = useState('');
  const [catatan, setCatatan] = useState('');
  const [checkingStatus, setCheckingStatus] = useState(null);
  
  const { addToast } = useToastStore();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resSaldo, resRiwayat] = await Promise.all([
        api.get('/deposit/saldo'),
        api.get('/deposit')
      ]);
      setSaldo(resSaldo.data.data);
      setRiwayat(resRiwayat.data.data);
    } catch (error) {
      addToast('Gagal memuat data deposit', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeposit = async (e) => {
    e.preventDefault();
    const numNominal = parseInt(nominal, 10);
    
    if (!numNominal || numNominal < 500) {
      return addToast('Minimal deposit Rp 500', 'error');
    }

    try {
      const res = await api.post('/deposit', { nominalRupiah: numNominal, catatan });
      addToast('Deposit dibuat! Mengarahkan ke pembayaran...', 'success');
      setIsDepositOpen(false);
      setNominal('');
      setCatatan('');
      fetchData();
      
      const paymentUrl = res.data.data.paymentUrl;
      if (paymentUrl) {
        window.open(paymentUrl, '_blank');
      }
    } catch (error) {
      addToast(error.response?.data?.message || 'Gagal deposit', 'error');
    }
  };

  const checkStatus = async (id) => {
    setCheckingStatus(id);
    try {
      const res = await api.get(`/deposit/${id}/status`);
      const deposit = res.data.data;
      if (deposit.status === 'SUCCESS') {
        addToast('Pembayaran berhasil dikonfirmasi!', 'success');
        fetchData(); // Refresh all data to update balance
      } else {
        addToast('Pembayaran belum diterima. Silakan cek lagi nanti.', 'info');
      }
    } catch (error) {
      addToast(error.response?.data?.message || 'Gagal mengecek status', 'error');
    } finally {
      setCheckingStatus(null);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Deposit Poin</h1>
        <p className="text-sm text-gray-500 mt-1"></p>
      </div>

      {/* Saldo Card */}
      <div className={`rounded-2xl p-6 text-white shadow-lg ${saldo > 0 ? 'bg-gradient-to-r from-indigo-600 to-blue-600' : 'bg-gradient-to-r from-red-600 to-rose-600'}`}>
        <div className="flex justify-between items-start">
          <div>
            <p className="text-white/80 font-medium mb-1 flex items-center gap-2">
              <Coins size={18} /> Saldo Poin Tersedia
            </p>
            <h2 className="text-5xl font-extrabold">{loading ? '...' : saldo}</h2>
            <p className="mt-2 text-white/90 text-sm">
              Sisa kuota: {saldo} transaksi
            </p>
          </div>
          <Button variant="secondary" className="bg-white/20 text-white border-0 hover:bg-white/30" onClick={() => setIsDepositOpen(true)}>
            <Plus size={18} /> Isi Saldo
          </Button>
        </div>
        
        {saldo <= 0 && !loading && (
          <div className="mt-4 bg-white/20 p-3 rounded-xl flex items-start gap-2 text-sm">
            <AlertTriangle size={18} className="flex-shrink-0 mt-0.5" />
            <p><strong>Poin Habis!</strong> Transaksi kasir tidak bisa di lakukan, transaksi yang sudah di lakukan tetap tersimpan pada halaman laporan.</p>
          </div>
        )}
      </div>

      {/* Riwayat Deposit */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-semibold text-gray-800 flex items-center gap-2 mb-4">
          <History size={18} className="text-indigo-600" /> Riwayat Deposit
        </h3>
        
        {loading ? (
          <div className="animate-pulse space-y-3">
            {[1,2,3].map(i => <div key={i} className="h-12 bg-gray-100 rounded-xl"></div>)}
          </div>
        ) : riwayat.length === 0 ? (
          <p className="text-center text-gray-500 py-8">Belum ada riwayat deposit</p>
        ) : (
          <div className="space-y-3">
            {riwayat.map((dep) => (
              <div key={dep.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors gap-4 sm:gap-0">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-gray-800">+ {dep.jumlahPoin} Poin</p>
                    {dep.status === 'SUCCESS' ? (
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-700 rounded-full">BERHASIL</span>
                    ) : dep.status === 'PENDING' ? (
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-700 rounded-full">PENDING</span>
                    ) : (
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-red-100 text-red-700 rounded-full">{dep.status || 'GAGAL'}</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{new Date(dep.createdAt).toLocaleString('id-ID')}</p>
                  {dep.catatan && <p className="text-xs text-gray-400 mt-1">{dep.catatan}</p>}
                </div>
                <div className="text-left sm:text-right flex flex-col items-start sm:items-end w-full sm:w-auto">
                  <p className="font-semibold text-emerald-600">Rp {dep.nominalRupiah.toLocaleString('id-ID')}</p>
                  {dep.status === 'PENDING' && (
                    <div className="flex items-center gap-2 mt-2 w-full sm:w-auto">
                      {dep.paymentUrl && (
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          className="text-xs py-1 h-7 border-indigo-200 text-indigo-600 flex-1 sm:flex-none justify-center"
                          onClick={() => window.open(dep.paymentUrl, '_blank')}
                        >
                          <ExternalLink size={12} className="mr-1" /> Bayar
                        </Button>
                      )}
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        className="text-xs py-1 h-7 flex-1 sm:flex-none justify-center"
                        onClick={() => checkStatus(dep.id)}
                        disabled={checkingStatus === dep.id}
                      >
                        <RefreshCw size={12} className={`mr-1 ${checkingStatus === dep.id ? 'animate-spin' : ''}`} /> 
                        {checkingStatus === dep.id ? 'Mengecek...' : 'Cek Status'}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Deposit Modal */}
      {isDepositOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-in zoom-in">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-800">Isi Saldo Poin</h2>
              <form onSubmit={handleDeposit} className="space-y-4">
                <Input
                  label="Nominal Pembayaran (Rp)"
                  type="number"
                  value={nominal}
                  onChange={(e) => setNominal(e.target.value)}
                  placeholder="50000"
                  min="500"
                  step="500"
                  required
                />
                
                {nominal && parseInt(nominal) >= 500 && (
                  <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-800 text-sm">
                    Anda akan mendapatkan: <strong>{Math.floor(parseInt(nominal) / 500)} Poin</strong>
                  </div>
                )}

                <Input
                  label="Catatan (Opsional)"
                  value={catatan}
                  onChange={(e) => setCatatan(e.target.value)}
                  placeholder="Deposit bulan ini"
                />

                <div className="flex gap-3 mt-6">
                  <Button variant="secondary" type="button" onClick={() => setIsDepositOpen(false)} className="flex-1 py-3">Batal</Button>
                  <Button variant="primary" type="submit" className="flex-1 py-3">Lanjut Bayar</Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
