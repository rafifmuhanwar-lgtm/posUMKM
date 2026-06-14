import React, { useState } from 'react';
import { useCartStore } from '../../stores/useCartStore';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Banknote, QrCode, CreditCard, Wallet } from 'lucide-react';

export const PaymentModal = ({ isOpen, onClose, onSuccess }) => {
  const { getTotal, setMetodeBayar, metodeBayar } = useCartStore();
  const total = getTotal();
  const [nominal, setNominal] = useState('');
  
  if (!isOpen) return null;

  const nominalNumber = parseInt(nominal || '0', 10);
  const kembalian = nominalNumber - total;
  const isSufficient = nominalNumber >= total;

  // Generate smart quick cash suggestions
  const getQuickCashOptions = () => {
    const options = [total]; // "Uang Pas"
    const roundups = [1000, 5000, 10000, 20000, 50000, 100000];
    
    for (const r of roundups) {
      const rounded = Math.ceil(total / r) * r;
      if (rounded > total && !options.includes(rounded)) {
        options.push(rounded);
      }
    }

    // Add common bills
    const commonBills = [20000, 50000, 100000, 200000];
    for (const bill of commonBills) {
      if (bill >= total && !options.includes(bill)) {
        options.push(bill);
      }
    }

    return [...new Set(options)].sort((a, b) => a - b).slice(0, 6);
  };

  const quickCashOptions = getQuickCashOptions();

  const handlePay = () => {
    if (metodeBayar === 'TUNAI' && !isSufficient) return;
    onSuccess({
      metodeBayar,
      nominalBayar: metodeBayar === 'TUNAI' ? nominalNumber : total,
      kembalian: metodeBayar === 'TUNAI' ? kembalian : 0,
    });
  };

  const metodeIcons = {
    TUNAI: <Banknote size={18} />,
    QRIS: <QrCode size={18} />,
    TRANSFER: <CreditCard size={18} />,
    HUTANG: <Wallet size={18} />,
  };

  const metodeLabels = {
    TUNAI: 'Tunai',
    QRIS: 'QRIS',
    TRANSFER: 'Transfer',
    HUTANG: 'Hutang',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-t-3xl md:rounded-2xl shadow-2xl w-full max-w-md md:mx-4 max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom duration-300">
        {/* Handle bar for mobile */}
        <div className="md:hidden w-12 h-1.5 bg-gray-300 rounded-full mx-auto my-3"></div>
        
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Pembayaran</h2>
          
          {/* Total */}
          <div className="mb-5 text-center p-5 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl border border-indigo-100">
            <p className="text-sm text-indigo-600 font-medium mb-1">Total Tagihan</p>
            <p className="text-3xl font-extrabold text-indigo-700">Rp {total.toLocaleString('id-ID')}</p>
          </div>

          {/* Payment Method */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">Metode Pembayaran</label>
            <div className="grid grid-cols-4 gap-2">
              {['TUNAI', 'QRIS', 'TRANSFER', 'HUTANG'].map((method) => (
                <button
                  key={method}
                  onClick={() => {
                    setMetodeBayar(method);
                    if (method !== 'TUNAI') setNominal('');
                  }}
                  className={`py-3 px-2 rounded-xl border-2 font-medium flex flex-col items-center gap-1 transition-all active:scale-95 ${
                    metodeBayar === method
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-200'
                      : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {metodeIcons[method]}
                  <span className="text-xs">{metodeLabels[method]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Cash Input */}
          {metodeBayar === 'TUNAI' && (
            <div className="mb-5 space-y-3">
              <Input
                label="Nominal Uang (Rp)"
                type="number"
                value={nominal}
                onChange={(e) => setNominal(e.target.value)}
                placeholder="0"
                autoFocus
                className="text-lg"
              />

              {/* Quick Cash Buttons */}
              <div className="grid grid-cols-3 gap-2">
                {quickCashOptions.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setNominal(String(amount))}
                    className={`py-2.5 px-3 rounded-xl text-sm font-semibold transition-all active:scale-95 ${
                      parseInt(nominal) === amount
                        ? 'bg-indigo-100 text-indigo-700 border-2 border-indigo-300'
                        : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {amount === total ? '💰 Uang Pas' : `Rp ${amount.toLocaleString('id-ID')}`}
                  </button>
                ))}
              </div>

              {/* Change display */}
              {nominalNumber > 0 && (
                <div className={`p-3 rounded-xl text-center ${kembalian >= 0 ? 'bg-emerald-50 border border-emerald-200' : 'bg-red-50 border border-red-200'}`}>
                  <span className="text-sm text-gray-600">Kembalian: </span>
                  <span className={`text-lg font-bold ${kembalian >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    Rp {Math.abs(kembalian).toLocaleString('id-ID')}
                  </span>
                  {kembalian < 0 && <p className="text-xs text-red-500 mt-1">Uang kurang!</p>}
                </div>
              )}
            </div>
          )}

          {/* Non-cash info */}
          {metodeBayar !== 'TUNAI' && (
            <div className="mb-5 p-4 bg-blue-50 rounded-xl border border-blue-100 text-center">
              <p className="text-sm text-blue-700">Pembayaran {metodeLabels[metodeBayar]} akan diproses otomatis senilai total tagihan.</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 mt-6">
            <Button variant="secondary" onClick={onClose} className="flex-1 py-3">Batal</Button>
            <Button 
              variant="primary" 
              onClick={handlePay} 
              className="flex-1 py-3 text-base"
              disabled={metodeBayar === 'TUNAI' && !isSufficient}
            >
              Proses Bayar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
