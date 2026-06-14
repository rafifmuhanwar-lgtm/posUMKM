import React, { useEffect } from 'react';
import { Button } from '../../components/ui/Button';
import { Printer, Share2, CheckCircle, XCircle } from 'lucide-react';
import { useTokoStore } from '../../stores/useTokoStore';

export const ReceiptModal = ({ isOpen, onClose, data }) => {
  const { toko } = useTokoStore();

  useEffect(() => {
    // Confetti removed per request
  }, [isOpen, data]);

  if (!isOpen || !data) return null;

  const handleCetak = () => {
    window.print();
  };

  const handleShareWA = () => {
    const items = data.items.map(i => `${i.namaMenu} x${i.qty} = Rp ${i.subtotal.toLocaleString('id-ID')}`).join('\n');
    const text = `🧾 *Struk Pembelian - ${toko?.nama}*\n${data.nomorStruk}\n${new Date(data.createdAt).toLocaleString('id-ID')}\n\n${items}\n\n*Total: Rp ${data.total.toLocaleString('id-ID')}*\nBayar (${data.metodeBayar}): Rp ${data.nominalBayar.toLocaleString('id-ID')}\nKembali: Rp ${data.kembalian.toLocaleString('id-ID')}\n\nTerima kasih! 🙏`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const isSuccess = data.poinDibayar !== false;

  return (
    <>
      {/* 
        Print specific styles for 58mm thermal printer 
        Usually 58mm printer has about ~32-48 characters width.
        We'll use monospace font and hide everything else on the page.
      */}
      <style>
        {`
          @media print {
            @page {
              margin: 0;
              size: 58mm auto; /* Adjust to 80mm if needed */
            }
            body {
              margin: 0;
              padding: 0;
            }
            #root > *:not(.print-container) {
              display: none !important;
            }
            .print-container {
              display: block !important;
              position: absolute;
              left: 0;
              top: 0;
              width: 58mm;
              font-family: 'Courier New', Courier, monospace;
              font-size: 12px;
              color: black;
              background: white;
              padding: 4mm;
            }
            .no-print {
              display: none !important;
            }
          }
        `}
      </style>

      <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center bg-black/50 backdrop-blur-sm no-print">
        <div className="bg-white rounded-t-3xl md:rounded-2xl shadow-2xl w-full max-w-sm md:mx-4 flex flex-col max-h-[90vh] animate-in slide-in-from-bottom duration-300">
          {/* Handle bar for mobile */}
          <div className="md:hidden w-12 h-1.5 bg-gray-300 rounded-full mx-auto my-3"></div>

          {/* Status Header */}
          <div className="text-center pt-4 pb-2 px-6">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 ${isSuccess ? 'bg-emerald-100' : 'bg-red-100'}`}>
              {isSuccess ? <CheckCircle className="text-emerald-600" size={36} /> : <XCircle className="text-red-600" size={36} />}
            </div>
            <h2 className={`text-xl font-bold ${isSuccess ? 'text-gray-800' : 'text-red-600'}`}>
              {isSuccess ? 'Transaksi Berhasil!' : 'TRX Gagal (Poin Habis)'}
            </h2>
            {!isSuccess && <p className="text-sm text-red-500 mt-1">Harap isi saldo poin untuk menampilkan transaksi ini.</p>}
          </div>

          {/* Receipt Preview UI (Screen only) */}
          <div className="flex-1 overflow-y-auto px-6 pb-4">
            <div className="bg-gray-50 rounded-2xl p-5 mt-3 border border-gray-100 font-mono text-sm">
              <div className="text-center mb-4">
                <h3 className="font-bold text-base">{toko?.nama || 'Toko UMKM'}</h3>
                {toko?.alamat && <p className="text-xs text-gray-500 whitespace-pre-wrap">{toko.alamat}</p>}
                {toko?.telepon && <p className="text-xs text-gray-500">{toko.telepon}</p>}
              </div>

              <div className="text-center mb-3">
                <p className="text-xs text-gray-500">{data.nomorStruk}</p>
                <p className="text-xs text-gray-400">{new Date(data.createdAt).toLocaleString('id-ID')}</p>
              </div>

              <div className="border-t border-dashed border-gray-400 my-3"></div>

              <div className="space-y-2 mb-3">
                {data.items.map((item, idx) => (
                  <div key={idx}>
                    <p className="text-gray-800">{item.namaMenu}</p>
                    <div className="flex justify-between text-xs text-gray-600">
                      <p>{item.qty} x {item.hargaSatuan.toLocaleString('id-ID')}</p>
                      <p className="font-medium text-gray-800">{item.subtotal.toLocaleString('id-ID')}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-dashed border-gray-400 my-3"></div>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-800">{data.subtotal.toLocaleString('id-ID')}</span>
                </div>
                {data.pajak > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pajak</span>
                    <span className="text-gray-800">{data.pajak.toLocaleString('id-ID')}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-base mt-2 pt-2 border-t border-gray-300">
                  <span className="text-gray-800">Total</span>
                  <span className="text-gray-900">{data.total.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between pt-1 mt-2">
                  <span className="text-gray-600">Bayar ({data.metodeBayar})</span>
                  <span className="text-gray-800">{data.nominalBayar.toLocaleString('id-ID')}</span>
                </div>
                {data.kembalian > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Kembali</span>
                    <span className="text-gray-800">{data.kembalian.toLocaleString('id-ID')}</span>
                  </div>
                )}
              </div>
              
              <div className="border-t border-dashed border-gray-400 my-3"></div>
              
              <div className="text-center mt-4">
                <p className="text-xs text-gray-500">{toko?.footerStruk || 'Terima Kasih Atas Kunjungan Anda'}</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 p-4 border-t border-gray-100">
            <Button variant="secondary" onClick={onClose} className="flex-1 py-3">
              Tutup
            </Button>
            <Button variant="secondary" onClick={handleShareWA} className="py-3">
              <Share2 size={18} />
            </Button>
            <Button variant="primary" onClick={handleCetak} className="flex-1 py-3">
              <Printer size={18} />
              Cetak
            </Button>
          </div>
        </div>
      </div>

      {/* Actual Print Container (Hidden on screen, visible on print) */}
      <div className="print-container hidden">
        <div style={{ textAlign: 'center', marginBottom: '8px' }}>
          <h3 style={{ margin: '0', fontSize: '14px', fontWeight: 'bold' }}>{toko?.nama || 'Toko UMKM'}</h3>
          {toko?.alamat && <div style={{ fontSize: '11px' }}>{toko.alamat}</div>}
          {toko?.telepon && <div style={{ fontSize: '11px' }}>{toko.telepon}</div>}
        </div>

        <div style={{ textAlign: 'center', marginBottom: '8px', fontSize: '11px' }}>
          <div>{data.nomorStruk}</div>
          <div>{new Date(data.createdAt).toLocaleString('id-ID')}</div>
        </div>

        <div style={{ borderTop: '1px dashed black', margin: '4px 0' }}></div>

        <div style={{ marginBottom: '8px' }}>
          {data.items.map((item, idx) => (
            <div key={idx} style={{ marginBottom: '4px' }}>
              <div>{item.namaMenu}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>{item.qty} x {item.hargaSatuan.toLocaleString('id-ID')}</span>
                <span>{item.subtotal.toLocaleString('id-ID')}</span>
              </div>
            </div>
          ))}
        </div>

        <div style={{ borderTop: '1px dashed black', margin: '4px 0' }}></div>

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Subtotal</span>
          <span>{data.subtotal.toLocaleString('id-ID')}</span>
        </div>
        
        {data.pajak > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Pajak</span>
            <span>{data.pajak.toLocaleString('id-ID')}</span>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '14px', margin: '4px 0' }}>
          <span>Total</span>
          <span>{data.total.toLocaleString('id-ID')}</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Bayar ({data.metodeBayar})</span>
          <span>{data.nominalBayar.toLocaleString('id-ID')}</span>
        </div>

        {data.kembalian > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Kembali</span>
            <span>{data.kembalian.toLocaleString('id-ID')}</span>
          </div>
        )}

        <div style={{ borderTop: '1px dashed black', margin: '8px 0' }}></div>

        <div style={{ textAlign: 'center', fontSize: '11px' }}>
          {toko?.footerStruk || 'Terima Kasih'}
        </div>
      </div>
    </>
  );
};
