import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useTokoStore } from '../../stores/useTokoStore';
import { useToastStore } from '../../components/ui/Toast';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Store, Phone, MapPin, Save, Palette } from 'lucide-react';

export const PengaturanPage = () => {
  const { toko, updateProfil } = useTokoStore();
  const { addToast } = useToastStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nama: '',
    alamat: '',
    telepon: '',
    pajak: 0,
    footerStruk: '',
    warnaTema: '#4F46E5',
  });

  useEffect(() => {
    if (toko) {
      setFormData({
        nama: toko.nama || '',
        alamat: toko.alamat || '',
        telepon: toko.telepon || '',
        pajak: toko.pajak || 0,
        footerStruk: toko.footerStruk || '',
        warnaTema: toko.warnaTema || '#4F46E5',
      });
    }
  }, [toko]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...formData, pajak: parseFloat(formData.pajak) };
      const res = await api.put('/toko', payload);
      updateProfil(res.data.data);
      addToast('Pengaturan berhasil disimpan ✅', 'success');
    } catch (error) {
      addToast('Gagal menyimpan pengaturan', 'error');
    } finally {
      setLoading(false);
    }
  };

  const themeColors = [
    { name: 'Indigo', value: '#4F46E5' },
    { name: 'Emerald', value: '#059669' },
    { name: 'Rose', value: '#E11D48' },
    { name: 'Amber', value: '#D97706' },
    { name: 'Sky', value: '#0284C7' },
    { name: 'Violet', value: '#7C3AED' },
  ];

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Pengaturan Toko</h1>
        <p className="text-sm text-gray-500 mt-1">Kelola informasi dan tampilan toko Anda</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Info Toko */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            <Store size={18} className="text-indigo-600" /> Informasi Toko
          </h3>
          
          <Input
            label="Nama Toko"
            value={formData.nama}
            onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
            required
            placeholder="Warteg Sederhana"
          />

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
              <MapPin size={14} /> Alamat
            </label>
            <textarea
              value={formData.alamat}
              onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              rows="3"
              placeholder="Jl. Merdeka No. 45, Jakarta"
            ></textarea>
          </div>

          <Input
            label={<span className="flex items-center gap-1"><Phone size={14} /> Nomor Telepon</span>}
            value={formData.telepon}
            onChange={(e) => setFormData({ ...formData, telepon: e.target.value })}
            placeholder="0812-xxxx-xxxx"
          />
        </div>

        {/* Pengaturan Struk */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
          <h3 className="font-semibold text-gray-800">🧾 Pengaturan Struk</h3>

          <Input
            label="Persentase Pajak (%)"
            type="number"
            value={formData.pajak}
            onChange={(e) => setFormData({ ...formData, pajak: e.target.value })}
            placeholder="0"
            min="0"
            max="100"
            step="0.5"
          />

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Footer Struk</label>
            <textarea
              value={formData.footerStruk}
              onChange={(e) => setFormData({ ...formData, footerStruk: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              rows="2"
              placeholder="Terima kasih telah berkunjung!"
            ></textarea>
          </div>
        </div>

        {/* Tema Warna */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            <Palette size={18} className="text-indigo-600" /> Warna Tema
          </h3>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {themeColors.map((color) => (
              <button
                key={color.value}
                type="button"
                onClick={() => setFormData({ ...formData, warnaTema: color.value })}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all active:scale-95 ${
                  formData.warnaTema === color.value
                    ? 'border-gray-800 shadow-md'
                    : 'border-transparent hover:border-gray-200'
                }`}
              >
                <div 
                  className="w-10 h-10 rounded-full shadow-inner"
                  style={{ backgroundColor: color.value }}
                ></div>
                <span className="text-xs text-gray-600">{color.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="sticky bottom-4 md:static">
          <Button type="submit" variant="primary" className="w-full py-3.5 text-base shadow-lg" disabled={loading}>
            <Save size={18} />
            {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
          </Button>
        </div>
      </form>
    </div>
  );
};
