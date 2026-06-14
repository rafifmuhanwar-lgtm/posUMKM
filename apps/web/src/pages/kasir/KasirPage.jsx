import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useCartStore } from '../../stores/useCartStore';
import { useToastStore } from '../../components/ui/Toast';
import { PaymentModal } from './PaymentModal';
import { ReceiptModal } from './ReceiptModal';
import { ShoppingCart, Plus, Minus, Trash2, X, ChevronUp, Search } from 'lucide-react';
import playSound from '../../utils/sound';

export const KasirPage = () => {
  const [menus, setMenus] = useState([]);
  const [kategoris, setKategoris] = useState([]);
  const [selectedKategori, setSelectedKategori] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  
  const [isPaymentOpen, setPaymentOpen] = useState(false);
  const [isReceiptOpen, setReceiptOpen] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);

  const items = useCartStore((s) => s.items);
  const addItem = useCartStore((s) => s.addItem);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQty = useCartStore((s) => s.updateQty);
  const getSubtotal = useCartStore((s) => s.getSubtotal);
  const getTotal = useCartStore((s) => s.getTotal);
  const clearCart = useCartStore((s) => s.clearCart);

  const { addToast } = useToastStore();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [resKategori, resMenu] = await Promise.all([
        api.get('/kategori'),
        api.get('/menu?tersedia=true')
      ]);
      setKategoris(resKategori.data.data);
      setMenus(resMenu.data.data);
    } catch (error) {
      addToast('Gagal memuat menu', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filteredMenus = menus.filter((m) => {
    const matchKategori = selectedKategori ? m.kategoriId === selectedKategori : true;
    const matchSearch = searchQuery
      ? m.nama.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchKategori && matchSearch;
  });

  const handleCheckout = async (paymentData) => {
    try {
      const payload = {
        subtotal: getSubtotal(),
        total: getTotal(),
        metodeBayar: paymentData.metodeBayar,
        nominalBayar: paymentData.nominalBayar,
        kembalian: paymentData.kembalian,
        items: items,
      };

      const res = await api.post('/transaksi', payload);
      setPaymentOpen(false);
      setIsMobileCartOpen(false);
      clearCart();
      setReceiptData(res.data.data);
      setReceiptOpen(true);
      playSound('success');
      addToast('Transaksi berhasil!', 'success');
    } catch (error) {
      addToast('Gagal memproses transaksi', 'error');
    }
  };

  const onAddItem = (menu) => {
    addItem(menu);
    playSound('beep');
  };

  const totalItemsCount = items.reduce((sum, i) => sum + i.qty, 0);
  const total = getTotal();

  // ── Skeleton loader ──
  const MenuSkeleton = () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      {[1,2,3,4,5,6].map((i) => (
        <div key={i} className="bg-white rounded-2xl p-4 animate-pulse">
          <div className="w-full h-24 bg-gray-200 rounded-xl mb-3"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col md:flex-row h-full overflow-hidden">
      
      {/* ═══════════ KIRI: Daftar Menu ═══════════ */}
      <div className="flex-1 flex flex-col min-h-0 bg-gray-50">
        
        {/* Header: Search + Kategori */}
        <div className="p-4 pb-0 flex-shrink-0">
          {/* Search bar */}
          <div className="relative mb-4">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cari menu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Kategori pills */}
          <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide -mx-1 px-1">
            <button
              onClick={() => setSelectedKategori('')}
              className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all flex-shrink-0 ${
                selectedKategori === ''
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              Semua
            </button>
            {kategoris.map((k) => (
              <button
                key={k.id}
                onClick={() => setSelectedKategori(k.id)}
                className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all flex-shrink-0 ${
                  selectedKategori === k.id
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {k.nama}
              </button>
            ))}
          </div>
        </div>

        {/* Menu grid — scrollable area */}
        <div className="flex-1 overflow-y-auto p-4 pt-2">
          {loading ? (
            <MenuSkeleton />
          ) : filteredMenus.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <Search size={48} className="mb-3 opacity-50" />
              <p className="font-medium">Menu tidak ditemukan</p>
              <p className="text-sm">Coba cari dengan kata kunci lain</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 pb-24 md:pb-4">
              {filteredMenus.map((menu) => (
                <button 
                  key={menu.id} 
                  onClick={() => onAddItem(menu)}
                  className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer active:scale-[0.96] flex flex-col text-left"
                >
                  <div className="w-full aspect-square max-h-28 bg-gradient-to-br from-gray-100 to-gray-50 rounded-xl mb-3 flex items-center justify-center overflow-hidden">
                    {menu.fotoUrl ? (
                      <img src={menu.fotoUrl} alt={menu.nama} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-3xl">🍽️</span>
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-800 line-clamp-2 leading-tight flex-1 text-sm">{menu.nama}</h3>
                  <p className="text-indigo-600 font-bold mt-1.5 text-sm">Rp {menu.harga.toLocaleString('id-ID')}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ═══════════ Floating Mobile Cart Button ═══════════ */}
      {!isMobileCartOpen && totalItemsCount > 0 && (
        <div className="md:hidden fixed bottom-20 left-4 right-4 z-30">
          <button 
            onClick={() => setIsMobileCartOpen(true)}
            className="w-full bg-indigo-600 text-white rounded-2xl px-5 py-4 shadow-xl shadow-indigo-300/40 flex items-center justify-between active:scale-[0.98] transition-transform"
          >
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-xl relative">
                <ShoppingCart size={20} />
                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {totalItemsCount}
                </span>
              </div>
              <span className="font-semibold">{totalItemsCount} Item</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg">Rp {total.toLocaleString('id-ID')}</span>
              <ChevronUp size={18} className="text-white/70" />
            </div>
          </button>
        </div>
      )}

      {/* ═══════════ Mobile Cart Bottom Sheet ═══════════ */}
      {isMobileCartOpen && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsMobileCartOpen(false)}
        >
          <div 
            className="absolute bottom-0 left-0 right-0 h-[85dvh] bg-white rounded-t-3xl shadow-2xl flex flex-col animate-in slide-in-from-bottom-full duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
              <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
            </div>
            
            {/* Cart Header */}
            <div className="px-5 py-3 flex justify-between items-center border-b border-gray-100 flex-shrink-0">
              <div className="flex items-center gap-2">
                <ShoppingCart className="text-indigo-600" size={20} />
                <h2 className="text-lg font-bold text-gray-800">Keranjang</h2>
                <span className="bg-indigo-100 text-indigo-800 text-xs font-bold px-2 py-0.5 rounded-full">
                  {totalItemsCount}
                </span>
              </div>
              <button className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors" onClick={() => setIsMobileCartOpen(false)}>
                <X size={20} />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto px-5 py-3 space-y-3 min-h-0">
              {items.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-2 py-16">
                  <ShoppingCart size={48} className="opacity-30" />
                  <p>Keranjang masih kosong</p>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.menuId} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-800 text-sm truncate">{item.namaMenu}</p>
                      <p className="text-indigo-600 font-bold text-sm mt-0.5">Rp {item.subtotal.toLocaleString('id-ID')}</p>
                    </div>
                    <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-200 p-1 flex-shrink-0">
                      <button onClick={() => updateQty(item.menuId, item.qty - 1)} className="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-md active:scale-90 transition-transform">
                        <Minus size={14} />
                      </button>
                      <span className="font-bold text-sm w-5 text-center">{item.qty}</span>
                      <button onClick={() => updateQty(item.menuId, item.qty + 1)} className="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-md active:scale-90 transition-transform">
                        <Plus size={14} />
                      </button>
                    </div>
                    <button onClick={() => removeItem(item.menuId)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg flex-shrink-0">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Cart Footer */}
            {items.length > 0 && (
              <div className="px-5 py-4 bg-white border-t border-gray-200 flex-shrink-0">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-gray-500 font-medium">Total</span>
                  <span className="text-2xl font-extrabold text-indigo-700">Rp {total.toLocaleString('id-ID')}</span>
                </div>
                <button
                  onClick={() => setPaymentOpen(true)}
                  className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200/50 active:scale-[0.98]"
                >
                  PROSES BAYAR
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══════════ KANAN: Keranjang Desktop ═══════════ */}
      <div className="w-96 bg-white border-l border-gray-200 flex-col h-full shadow-lg hidden md:flex">
        {/* Cart Header */}
        <div className="p-4 border-b border-gray-100 flex justify-between items-center flex-shrink-0">
          <div className="flex items-center gap-2">
            <ShoppingCart className="text-indigo-600" size={20} />
            <h2 className="text-lg font-bold text-gray-800">Keranjang</h2>
          </div>
          <span className="bg-indigo-100 text-indigo-800 text-xs font-bold px-2 py-1 rounded-full">
            {totalItemsCount} Item
          </span>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2">
              <ShoppingCart size={48} className="opacity-30" />
              <p>Keranjang masih kosong</p>
              <p className="text-sm">Klik menu untuk menambahkan</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.menuId} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 text-sm truncate">{item.namaMenu}</p>
                  <p className="text-indigo-600 font-bold text-sm mt-0.5">Rp {item.subtotal.toLocaleString('id-ID')}</p>
                </div>
                <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-200 p-1 flex-shrink-0">
                  <button onClick={() => updateQty(item.menuId, item.qty - 1)} className="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-md active:scale-90 transition-transform">
                    <Minus size={14} />
                  </button>
                  <span className="font-bold text-sm w-5 text-center">{item.qty}</span>
                  <button onClick={() => updateQty(item.menuId, item.qty + 1)} className="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-md active:scale-90 transition-transform">
                    <Plus size={14} />
                  </button>
                </div>
                <button onClick={() => removeItem(item.menuId)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg flex-shrink-0">
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Cart Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex-shrink-0">
          <div className="flex justify-between items-center mb-3">
            <span className="text-gray-500 font-medium">Total</span>
            <span className="text-2xl font-extrabold text-indigo-700">Rp {total.toLocaleString('id-ID')}</span>
          </div>
          <button
            onClick={() => setPaymentOpen(true)}
            disabled={items.length === 0}
            className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl hover:bg-indigo-700 disabled:bg-gray-300 disabled:shadow-none transition-colors shadow-lg shadow-indigo-200/50 active:scale-[0.98]"
          >
            PROSES BAYAR
          </button>
        </div>
      </div>

      {/* ═══════════ Modals ═══════════ */}
      <PaymentModal 
        isOpen={isPaymentOpen} 
        onClose={() => setPaymentOpen(false)} 
        onSuccess={handleCheckout} 
      />
      <ReceiptModal
        isOpen={isReceiptOpen}
        onClose={() => setReceiptOpen(false)}
        data={receiptData}
      />
    </div>
  );
};
