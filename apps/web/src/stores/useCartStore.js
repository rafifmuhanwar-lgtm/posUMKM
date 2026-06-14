import { create } from 'zustand';

export const useCartStore = create((set, get) => ({
  items: [],
  diskon: 0,
  metodeBayar: 'TUNAI',
  
  addItem: (menu) => {
    const { items } = get();
    const existing = items.find((i) => i.menuId === menu.id);
    if (existing) {
      set({
        items: items.map((i) =>
          i.menuId === menu.id ? { ...i, qty: i.qty + 1, subtotal: (i.qty + 1) * i.hargaSatuan } : i
        ),
      });
    } else {
      set({
        items: [...items, { menuId: menu.id, namaMenu: menu.nama, hargaSatuan: menu.harga, qty: 1, subtotal: menu.harga, catatan: '' }],
      });
    }
  },

  removeItem: (menuId) => {
    set({ items: get().items.filter((i) => i.menuId !== menuId) });
  },

  updateQty: (menuId, qty) => {
    if (qty <= 0) {
      get().removeItem(menuId);
      return;
    }
    set({
      items: get().items.map((i) =>
        i.menuId === menuId ? { ...i, qty, subtotal: qty * i.hargaSatuan } : i
      ),
    });
  },

  setDiskon: (diskon) => set({ diskon }),
  setMetodeBayar: (metodeBayar) => set({ metodeBayar }),
  clearCart: () => set({ items: [], diskon: 0, metodeBayar: 'TUNAI' }),
  
  getSubtotal: () => get().items.reduce((sum, i) => sum + i.subtotal, 0),
  getTotal: () => get().getSubtotal() - get().diskon,
}));
