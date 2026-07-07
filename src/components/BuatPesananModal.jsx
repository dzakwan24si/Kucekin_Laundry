import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, ShoppingCart, Loader2, CheckCircle2, Package, X } from 'lucide-react';

import { transactionAPI } from '@/services/transactionAPI';
import { authAPI } from '@/services/authAPI';

const getIconForLayanan = (nama) => {
  const namaLower = nama.toLowerCase();
  if (namaLower.includes('lipat')) return '/img/LogoCuciLipat.png';
  if (namaLower.includes('setrika')) return '/img/LogoSetrika.png';
  if (namaLower.includes('karpet')) return '/img/LogoKarpet.png';
  if (namaLower.includes('sepatu')) return '/img/LogoCuciSepatu.png';
  if (namaLower.includes('sprei') || namaLower.includes('selimut')) return '/img/LogoCuciSprei.png';
  return '/img/LogoDryCleaning.png'; 
};

export default function BuatPesananModal({ isOpen, onClose, onSuccess }) {
  const [users, setUsers] = useState([]);
  const [layananData, setLayananData] = useState([]);
  const [keranjang, setKeranjang] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formDetail, setFormDetail] = useState({ userId: '', nama: '', alamat: '', catatan: '' });

  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          const [resLayanan, resUsers] = await Promise.all([
            transactionAPI.getServices(),
            authAPI.getUsers()
          ]);
          setLayananData(resLayanan);
          setUsers(resUsers.filter(u => u.role?.toLowerCase() === 'member'));
        } catch (error) {
          console.error("Gagal tarik data:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSelectUser = (e) => {
    const uid = e.target.value;
    if (!uid) {
      setFormDetail({ userId: '', nama: '', alamat: '', catatan: formDetail.catatan });
      return;
    }
    const user = users.find(u => u.id.toString() === uid);
    if (user) {
      setFormDetail({ ...formDetail, userId: user.id, nama: user.fullname, alamat: '' });
    }
  };

  const handleAddToCart = (layanan) => {
    const existing = keranjang.find(item => item.id === layanan.id);
    if (existing) {
      setKeranjang(keranjang.map(item => 
        item.id === layanan.id ? { ...item, qty: item.qty + 1, subtotal: (item.qty + 1) * item.harga } : item
      ));
    } else {
      setKeranjang([...keranjang, { id: layanan.id, nama: layanan.nama_layanan, jenis: layanan.jenis, harga: layanan.harga, qty: 1, subtotal: layanan.harga }]);
    }
  };

  const ubahQty = (id, delta) => {
    setKeranjang(keranjang.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.qty + delta);
        return { ...item, qty: newQty, subtotal: newQty * item.harga };
      }
      return item;
    }));
  };

  const hapusItem = (id) => {
    setKeranjang(keranjang.filter(item => item.id !== id));
  };

  const totalSubtotal = keranjang.reduce((sum, item) => sum + item.subtotal, 0);
  const ongkir = keranjang.length > 0 ? 10000 : 0;
  const totalAkhir = totalSubtotal + ongkir;

  const handlePesan = async (e) => {
    e.preventDefault();
    if (keranjang.length === 0 || !formDetail.userId) {
      alert("Pastikan pelanggan sudah dipilih dan keranjang tidak kosong.");
      return;
    }
    setIsSubmitting(true);

    try {
      const date = new Date();
      const tglStr = `${date.getDate()}${date.getMonth()+1}${date.getFullYear().toString().slice(-2)}`;
      const randomNum = Math.floor(Math.random() * 90) + 10;
      const resiId = `KUC-${tglStr}-${randomNum}`;

      const orderData = {
        id: resiId,
        user_id: formDetail.userId,
        alamat_jemput: `${formDetail.alamat} (Catatan: ${formDetail.catatan || '-'})`,
        total_harga: totalAkhir,
        diskon_voucher: 0,
        status_pesanan: 'Diterima',
        status_bayar: 'Belum Lunas'
      };

      const cartItems = keranjang.map(item => ({
        layanan_id: item.id,
        qty: item.qty,
        harga_satuan: item.harga,
        subtotal: item.subtotal
      }));

      await transactionAPI.createTransaction(orderData, cartItems);

      alert(`Pesanan atas nama ${formDetail.nama} berhasil dibuat!`);
      // Reset form
      setKeranjang([]);
      setFormDetail({ userId: '', nama: '', alamat: '', catatan: '' });
      onSuccess(); // panggil ini untuk me-refresh data di tabel pesanan
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat memproses pesanan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white w-full max-w-6xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden border border-gray-100 transform transition-all flex flex-col">
        
        {/* HEADER MODAL */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50 shrink-0">
          <div>
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Package className="text-blue-600" /> Buat Pesanan Baru
            </h2>
            <p className="text-gray-500 text-sm mt-1">Kasir Admin: Input pesanan cucian untuk pelanggan.</p>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-red-500 transition-colors p-1 bg-white rounded-full hover:bg-red-50"
          >
            <X size={20} />
          </button>
        </div>

        {/* BODY MODAL */}
        <div className="p-6 overflow-y-auto flex-1 bg-white">
          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="animate-spin text-blue-500 w-10 h-10" />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* KOLOM KIRI: Form & Layanan */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* SECTION 1: Pilih Pelanggan */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                  <h2 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
                    <span className="bg-blue-100 text-blue-600 p-1.5 rounded-xl"><CheckCircle2 size={18} /></span>
                    1. Pilih Pelanggan (Member)
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <select 
                        className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-300 font-medium text-gray-700 transition-all cursor-pointer"
                        value={formDetail.userId}
                        onChange={handleSelectUser}
                      >
                        <option value="">-- Pilih Member --</option>
                        {users.map(u => (
                          <option key={u.id} value={u.id}>{u.fullname} ({u.email})</option>
                        ))}
                      </select>
                      <p className="text-xs text-gray-400 mt-2">*Jika pelanggan belum ada, daftarkan dulu di menu Pelanggan.</p>
                    </div>

                    {formDetail.userId && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 pt-4 border-t border-gray-100">
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">Alamat Penjemputan / Pengiriman</label>
                          <textarea 
                            required
                            rows="2"
                            placeholder="Contoh: Jl. Sudirman No. 123, RT 01/RW 02"
                            className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-300 transition-all resize-none text-sm"
                            value={formDetail.alamat}
                            onChange={(e) => setFormDetail({...formDetail, alamat: e.target.value})}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">Catatan (Opsional)</label>
                          <input 
                            type="text"
                            placeholder="Contoh: Tolong pisahkan baju putih"
                            className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-300 transition-all text-sm"
                            value={formDetail.catatan}
                            onChange={(e) => setFormDetail({...formDetail, catatan: e.target.value})}
                          />
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* SECTION 2: Pilih Layanan */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                  <h2 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
                    <span className="bg-blue-100 text-blue-600 p-1.5 rounded-xl"><Package size={18} /></span>
                    2. Pilih Layanan
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {layananData.map(layanan => (
                      <div key={layanan.id} className="group border border-gray-100 rounded-2xl p-4 hover:border-blue-200 hover:shadow-md transition-all duration-300 bg-white flex flex-col justify-between">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center p-2 group-hover:scale-110 transition-transform shrink-0">
                            <img src={getIconForLayanan(layanan.nama_layanan)} alt={layanan.nama_layanan} className="w-full h-full object-contain" />
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900 text-sm leading-tight">{layanan.nama_layanan}</h3>
                            <p className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md inline-block mt-1">{layanan.jenis}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-auto">
                          <p className="font-black text-gray-900">Rp {layanan.harga.toLocaleString('id-ID')}</p>
                          <button onClick={() => handleAddToCart(layanan)} className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors shadow-sm">
                            <ShoppingCart size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* KOLOM KANAN: Keranjang & Checkout */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-3xl p-6 text-gray-900 border border-gray-200 sticky top-0 shadow-sm">
                  <h2 className="text-lg font-black mb-4 flex items-center gap-2 border-b border-gray-100 pb-3">
                    <ShoppingCart size={20} className="text-blue-600" /> Keranjang
                  </h2>
                  
                  <div className="min-h-[180px] max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    <AnimatePresence>
                      {keranjang.length === 0 ? (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center h-40 text-gray-400">
                          <ShoppingCart size={36} className="mb-3 opacity-20" />
                          <p className="text-sm font-medium">Keranjang masih kosong</p>
                        </motion.div>
                      ) : (
                        <div className="space-y-3">
                          {keranjang.map(item => (
                            <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-gray-50 rounded-xl p-3 flex gap-3 border border-gray-100">
                              <div className="flex-1">
                                <p className="text-sm font-bold leading-tight mb-1 text-gray-800">{item.nama}</p>
                                <p className="text-xs text-blue-600 font-bold mb-2">Rp {item.harga.toLocaleString('id-ID')} / {item.jenis === 'Kiloan' ? 'kg' : 'pcs'}</p>
                                <div className="flex items-center gap-2 bg-white w-fit p-1 rounded-md border border-gray-200">
                                  <button onClick={() => ubahQty(item.id, -1)} className="w-5 h-5 flex items-center justify-center rounded bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold transition-colors text-xs">-</button>
                                  <span className="text-xs font-black w-4 text-center">{item.qty}</span>
                                  <button onClick={() => ubahQty(item.id, 1)} className="w-5 h-5 flex items-center justify-center rounded bg-blue-600 hover:bg-blue-500 text-white font-bold transition-colors text-xs">+</button>
                                </div>
                              </div>
                              <div className="flex flex-col justify-between items-end">
                                <button onClick={() => hapusItem(item.id)} className="text-gray-400 hover:text-red-500 transition-colors p-1">
                                  <Trash2 size={14} />
                                </button>
                                <p className="text-sm font-black text-gray-900">Rp {item.subtotal.toLocaleString('id-ID')}</p>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </AnimatePresence>
                  </div>

                  {keranjang.length > 0 && (
                    <div className="mt-6 pt-4 border-t border-gray-100 space-y-2">
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Subtotal</span>
                        <span className="font-bold text-gray-700">Rp {totalSubtotal.toLocaleString('id-ID')}</span>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Biaya Antar-Jemput</span>
                        <span className="font-bold text-gray-700">Rp {ongkir.toLocaleString('id-ID')}</span>
                      </div>
                      <div className="flex justify-between items-end pt-2 pb-2">
                        <span className="text-gray-500 text-sm">Total Bayar</span>
                        <span className="text-2xl font-black text-blue-600">Rp {totalAkhir.toLocaleString('id-ID')}</span>
                      </div>
                      
                      <button 
                        onClick={handlePesan}
                        disabled={isSubmitting || !formDetail.userId || !formDetail.alamat}
                        className="w-full mt-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-500 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm disabled:shadow-none text-sm"
                      >
                        {isSubmitting ? <><Loader2 size={16} className="animate-spin" /> Memproses...</> : "Buat Pesanan"}
                      </button>
                      {(!formDetail.userId || !formDetail.alamat) && (
                         <p className="text-[10px] text-red-500 text-center mt-2 font-medium">Pilih pelanggan & isi alamat terlebih dahulu.</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
