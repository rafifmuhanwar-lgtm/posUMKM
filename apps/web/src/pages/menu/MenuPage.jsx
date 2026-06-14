import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useToastStore } from '../../components/ui/Toast';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Plus, Edit2, Trash2, Search, ToggleLeft, ToggleRight } from 'lucide-react';

export const MenuPage = () => {
  const [menus, setMenus] = useState([]);
  const [kategoris, setKategoris] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { addToast } = useToastStore();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMenu, setEditingMenu] = useState(null);

  const [formData, setFormData] = useState({
    nama: '',
    harga: '',
    kategoriId: '',
    tersedia: true,
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resKat, resMenu] = await Promise.all([
        api.get('/kategori'),
        api.get('/menu'),
      ]);
      setKategoris(resKat.data.data);
      setMenus(resMenu.data.data);
    } catch (error) {
      addToast('Gagal memuat data menu', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (menu) => {
    setEditingMenu(menu);
    setFormData({
      nama: menu.nama,
      harga: menu.harga,
      kategoriId: menu.kategoriId,
      tersedia: menu.tersedia,
    });
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setEditingMenu(null);
    setFormData({
      nama: '',
      harga: '',
      kategoriId: kategoris[0]?.id || '',
      tersedia: true,
    });
    setIsFormOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData, harga: parseInt(formData.harga, 10) };
      if (editingMenu) {
        await api.put(`/menu/${editingMenu.id}`, payload);
        addToast('Menu berhasil diupdate ✅', 'success');
      } else {
        await api.post('/menu', payload);
        addToast('Menu berhasil ditambah ✅', 'success');
      }
      setIsFormOpen(false);
      fetchData();
    } catch (error) {
      addToast(error.response?.data?.message || 'Gagal menyimpan menu', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus menu ini?')) return;
    try {
      await api.delete(`/menu/${id}`);
      addToast('Menu dihapus', 'success');
      fetchData();
    } catch (error) {
      addToast('Gagal menghapus', 'error');
    }
  };

  const toggleTersedia = async (id) => {
    try {
      await api.patch(`/menu/${id}/toggle`);
      fetchData();
    } catch (error) {
      addToast('Gagal update status', 'error');
    }
  };

  const filteredMenus = menus.filter(m => 
    m.nama.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Kelola Menu</h1>
        <Button onClick={handleAddNew} variant="primary">
          <Plus size={18} /> Tambah Menu
        </Button>
      </div>

      {/* Search bar */}
      <div className="relative mb-6">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Cari menu..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
        />
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => (
            <div key={i} className="bg-white rounded-xl p-4 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-600">
                  <th className="p-4 font-medium">Nama Menu</th>
                  <th className="p-4 font-medium">Kategori</th>
                  <th className="p-4 font-medium">Harga</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredMenus.map((menu) => (
                  <tr key={menu.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-medium text-gray-800">{menu.nama}</td>
                    <td className="p-4 text-gray-600">{menu.kategori?.nama}</td>
                    <td className="p-4 font-medium text-indigo-600">Rp {menu.harga.toLocaleString('id-ID')}</td>
                    <td className="p-4">
                      <button
                        onClick={() => toggleTersedia(menu.id)}
                        className={`flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full transition-colors ${
                          menu.tersedia ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {menu.tersedia ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
                        {menu.tersedia ? 'Tersedia' : 'Habis'}
                      </button>
                    </td>
                    <td className="p-4 flex gap-2">
                      <button onClick={() => handleEdit(menu)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDelete(menu.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredMenus.length === 0 && (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-gray-500">Tidak ada menu ditemukan</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List */}
          <div className="md:hidden space-y-3">
            {filteredMenus.map((menu) => (
              <div key={menu.id} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-800">{menu.nama}</h3>
                    <p className="text-xs text-gray-500">{menu.kategori?.nama}</p>
                  </div>
                  <button
                    onClick={() => toggleTersedia(menu.id)}
                    className={`flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold rounded-full ${
                      menu.tersedia ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {menu.tersedia ? 'Tersedia' : 'Habis'}
                  </button>
                </div>
                <div className="flex justify-between items-center mt-3">
                  <p className="font-bold text-indigo-600">Rp {menu.harga.toLocaleString('id-ID')}</p>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(menu)} className="p-2 text-blue-600 bg-blue-50 rounded-lg">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(menu.id)} className="p-2 text-red-600 bg-red-50 rounded-lg">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {filteredMenus.length === 0 && (
              <p className="text-center text-gray-500 py-8">Tidak ada menu ditemukan</p>
            )}
          </div>
        </>
      )}

      {/* Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-t-3xl md:rounded-2xl shadow-2xl w-full max-w-md md:mx-4 animate-in slide-in-from-bottom duration-300">
            <div className="md:hidden w-12 h-1.5 bg-gray-300 rounded-full mx-auto my-3"></div>
            <div className="p-6">
              <h2 className="text-xl font-bold mb-5 text-gray-800">{editingMenu ? 'Edit Menu' : 'Tambah Menu Baru'}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Nama Menu"
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  required
                  placeholder="Nasi Goreng Spesial"
                />
                <Input
                  label="Harga (Rp)"
                  type="number"
                  value={formData.harga}
                  onChange={(e) => setFormData({ ...formData, harga: e.target.value })}
                  required
                  placeholder="15000"
                />
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-700">Kategori</label>
                  <select
                    value={formData.kategoriId}
                    onChange={(e) => setFormData({ ...formData, kategoriId: e.target.value })}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  >
                    <option value="">Pilih Kategori</option>
                    {kategoris.map((k) => (
                      <option key={k.id} value={k.id}>{k.nama}</option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-3 mt-6">
                  <Button variant="secondary" type="button" onClick={() => setIsFormOpen(false)} className="flex-1 py-3">Batal</Button>
                  <Button type="submit" variant="primary" className="flex-1 py-3">Simpan</Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
