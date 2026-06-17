import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingCart } from 'lucide-react'; // Tambahan icon

// Import fungsi API
import { transactionAPI } from '@/services/transactionAPI';
import { authAPI } from '@/services/authAPI';

// Fungsi bantuan untuk mencocokkan nama layanan dari DB dengan ikon lokal
const getIconForLayanan = (nama) => {
  const namaLower = nama.toLowerCase();
  if (namaLower.includes('lipat')) return '/img/LogoCuciLipat.png';
  if (namaLower.includes('setrika')) return '/img/LogoSetrika.png';
  if (namaLower.includes('karpet')) return '/img/LogoKarpet.png';
  if (namaLower.includes('sepatu')) return '/img/LogoCuciSepatu.png';
  if (namaLower.includes('sprei') || namaLower.includes('selimut')) return '/img/LogoCuciSprei.png';
  return '/img/LogoDryCleaning.png'; 
};

const Pemesanan = () => {
  const navigate = useNavigate();
  
  // State Data dari Database
  const [layananData, setLayananData] = useState([]);
  const [userId, setUserId] = useState(null);
  
  // ==========================================
  // STATE BARU: KERANJANG BELANJA (ARRAY)
  // ==========================================
  const [keranjang, setKeranjang] = useState([]);
  
  // State Status Loading
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State Form Dinamis
  const [formDetail, setFormDetail] = useState({
    nama: '',
    whatsapp: '',
    alamat: '',
    catatan: ''
  });

  // 1. Tarik Data Layanan & Profil Member
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const services = await transactionAPI.getServices();
        setLayananData(services);

        const userStr = localStorage.getItem('user');
        if (userStr) {
          const user = JSON.parse(userStr);
          setUserId(user.id);
          
          const profile = await authAPI.getMemberProfile(user.id);
          setFormDetail({
            nama: user.fullname,
            whatsapp: profile.whatsapp || '',
            alamat: profile.alamat || '',
            catatan: ''
          });
        }
      } catch (error) {
        console.error("Gagal memuat data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // ==========================================
  // FUNGSI LOGIKA KERANJANG BELANJA
  // ==========================================
  const toggleLayanan = (item) => {
    const isExist = keranjang.find(k => k.id === item.id);
    if (isExist) {
      // Jika sudah ada, hapus dari keranjang (Toggle Off)
      setKeranjang(keranjang.filter(k => k.id !== item.id));
    } else {
      // Jika belum ada, masukkan ke keranjang dengan qty awal 1
      setKeranjang([...keranjang, { ...item, qty: 1, subtotal: item.harga }]);
    }
  };

  const updateQty = (id, delta) => {
    setKeranjang(keranjang.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.qty + delta); // Minimal qty adalah 1
        return { ...item, qty: newQty, subtotal: newQty * item.harga };
      }
      return item;
    }));
  };

  const removeItem = (id) => {
    setKeranjang(keranjang.filter(item => item.id !== id));
  };

  // ==========================================
  // KALKULASI HARGA TOTAL
  // ==========================================
  const totalSubtotal = keranjang.reduce((sum, item) => sum + item.subtotal, 0);
  const ongkir = 10000;
  // Ongkir hanya ditambahkan jika ada item di keranjang
  const totalAkhir = keranjang.length > 0 ? totalSubtotal + ongkir : 0;

  // 2. Eksekusi Simpan Pesanan (Multi-Item)
  const handlePesan = async (e) => {
    e.preventDefault();
    if (keranjang.length === 0 || !userId) return;
    
    setIsSubmitting(true);

    try {
      // Bikin Nomor Resi Otomatis
      const date = new Date();
      const tglStr = `${date.getDate()}${date.getMonth()+1}${date.getFullYear().toString().slice(-2)}`;
      const randomNum = Math.floor(Math.random() * 90) + 10;
      const resiId = `KUC-${tglStr}-${randomNum}`;

      // Siapkan Data Induk
      const orderData = {
        id: resiId,
        user_id: userId,
        alamat_jemput: `${formDetail.alamat} (Catatan: ${formDetail.catatan || '-'})`,
        total_harga: totalAkhir,
        status_pesanan: 'Diterima',
        status_bayar: 'Belum Lunas'
      };

      // Siapkan Data Rincian Keranjang (Bisa banyak item)
      const cartItems = keranjang.map(item => ({
        layanan_id: item.id,
        qty: item.qty,
        harga_satuan: item.harga,
        subtotal: item.subtotal
      }));

      // Kirim ke API Transaksi
      await transactionAPI.createTransaction(orderData, cartItems);

      alert(`Pesanan atas nama ${formDetail.nama} berhasil dibuat! Resi Anda: ${resiId}`);
      navigate('/member/pesanan');

    } catch (error) {
      console.error("Gagal membuat pesanan:", error);
      alert("Terjadi kesalahan saat memproses pesanan Anda.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="min-h-[50vh] flex items-center justify-center text-slate-400 font-bold animate-pulse">Menyiapkan Form Pemesanan...</div>;
  }

  return (
    <div className="bg-transparent space-y-8 animate-fade-in pb-10 w-full">
      
      {/* Header Halaman */}
      <div className="mb-8">
        <Link to="/member" className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-orange-500 mb-4 transition-colors">
          <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Kembali ke Dasbor Member
        </Link>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-2">Formulir Pemesanan</h1>
        <p className="text-slate-500">Pilih layanan dan atur detail penjemputan cucian Anda.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* BAGIAN KIRI: Form Input */}
        <div className="flex-1 space-y-6">
          
          {/* 1. Pilih Layanan (Multi-Select) */}
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-5">
               <h2 className="text-xl font-bold text-slate-900">1. Pilih Layanan</h2>
               <span className="text-xs font-bold text-orange-500 bg-orange-50 px-3 py-1 rounded-full">Bisa pilih lebih dari satu</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {layananData.map((item) => {
                // Cek apakah item ini ada di dalam keranjang
                const isSelected = keranjang.some(k => k.id === item.id);
                const satuanTeks = item.jenis === 'Kiloan' ? 'kg' : 'pcs';

                return (
                  <div 
                    key={item.id}
                    onClick={() => toggleLayanan(item)}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between gap-4 ${isSelected ? 'border-orange-500 bg-orange-50' : 'border-slate-100 hover:border-slate-300 bg-white'}`}
                  >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 shrink-0 overflow-hidden p-2">
                        <img src={getIconForLayanan(item.nama_layanan)} alt={item.nama_layanan} className="w-full h-full object-contain" />
                        </div>
                        <div>
                        <div className="font-bold text-slate-900 text-sm">{item.nama_layanan}</div>
                        <div className="text-xs text-slate-500 mt-0.5">Rp {item.harga.toLocaleString('id-ID')} / {satuanTeks}</div>
                        </div>
                    </div>
                    
                    {/* Indikator Checkmark jika dipilih */}
                    {isSelected && (
                        <div className="w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center shrink-0 shadow-md">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                        </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. Detail Penjemputan */}
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
              <h2 className="text-xl font-bold text-slate-900">2. Detail Penjemputan</h2>
              <span className="text-xs font-bold text-green-600 bg-green-50 px-3 py-1.5 rounded-full border border-green-100 flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                Data Profil Terhubung
              </span>
            </div>
            
            <form className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Nama Lengkap</label>
                  <input type="text" value={formDetail.nama} onChange={(e) => setFormDetail({...formDetail, nama: e.target.value})} className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-slate-900 text-sm font-medium transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">No. WhatsApp</label>
                  <input type="tel" value={formDetail.whatsapp} onChange={(e) => setFormDetail({...formDetail, whatsapp: e.target.value})} className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-slate-900 text-sm font-medium transition-colors" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Alamat Penjemputan</label>
                <textarea rows="3" required placeholder="Contoh: Perumahan Indah Blok B2..." value={formDetail.alamat} onChange={(e) => setFormDetail({...formDetail, alamat: e.target.value})} className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-slate-900 text-sm resize-y font-medium transition-colors"></textarea>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Catatan Khusus (Opsional)</label>
                <input type="text" placeholder="Contoh: Tolong pisahkan baju putih dan tas..." value={formDetail.catatan} onChange={(e) => setFormDetail({...formDetail, catatan: e.target.value})} className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-slate-900 text-sm transition-colors" />
              </div>
            </form>
          </div>
        </div>

        {/* BAGIAN KANAN: Ringkasan Keranjang Pesanan */}
        <div className="w-full lg:w-[380px]">
          <div className="bg-slate-900 text-white p-7 md:p-8 rounded-3xl shadow-xl sticky top-24 border border-slate-800">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
              <ShoppingCart size={20} className="text-orange-400" />
              Keranjang Pesanan
            </h2>
            
            <div className="min-h-[150px]">
              <AnimatePresence>
                {keranjang.length === 0 ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-full text-slate-500 mt-10 mb-10">
                        <ShoppingCart size={40} className="mb-3 opacity-20" />
                        <p className="text-sm font-medium">Belum ada layanan dipilih</p>
                    </motion.div>
                ) : (
                    <div className="space-y-4 mb-6 pb-6 border-b border-slate-700/50">
                        {keranjang.map((item) => (
                            <motion.div 
                                key={item.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50"
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <div className="font-semibold text-sm pr-4">{item.nama_layanan}</div>
                                    <button onClick={() => removeItem(item.id)} className="text-slate-500 hover:text-red-400 transition-colors bg-slate-800 p-1.5 rounded-lg"><Trash2 size={14}/></button>
                                </div>
                                <div className="flex justify-between items-center">
                                    {/* Kontrol Kuantitas (Plus Minus) */}
                                    <div className="flex items-center gap-3 bg-slate-900 rounded-xl p-1 border border-slate-700">
                                        <button type="button" onClick={() => updateQty(item.id, -1)} className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-slate-700 hover:text-orange-400 transition-colors">-</button>
                                        <span className="text-xs font-bold w-10 text-center">{item.qty} {item.jenis === 'Kiloan' ? 'kg' : 'pcs'}</span>
                                        <button type="button" onClick={() => updateQty(item.id, 1)} className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-slate-700 hover:text-orange-400 transition-colors">+</button>
                                    </div>
                                    <div className="font-bold text-sm text-orange-400">Rp {item.subtotal.toLocaleString('id-ID')}</div>
                                </div>
                            </motion.div>
                        ))}
                        
                        <div className="flex justify-between items-center pt-4 px-2">
                            <div className="font-semibold text-sm text-slate-400">Biaya Antar-Jemput</div>
                            <div className="font-semibold text-sm text-slate-300">Rp {ongkir.toLocaleString('id-ID')}</div>
                        </div>
                    </div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex justify-between items-center mb-8 px-2">
              <div className="text-sm font-bold text-orange-400">Total Estimasi</div>
              <div className="text-2xl font-black text-orange-500">Rp {totalAkhir.toLocaleString('id-ID')}</div>
            </div>

            <button 
              onClick={handlePesan}
              disabled={isSubmitting || keranjang.length === 0 || !formDetail.alamat}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-bold rounded-2xl py-4 transition-all shadow-[0_0_20px_rgba(249,115,22,0.2)] hover:shadow-[0_0_25px_rgba(249,115,22,0.4)] transform hover:-translate-y-0.5 disabled:transform-none flex justify-center"
            >
              {isSubmitting ? 'Memproses Pesanan...' : 'Konfirmasi Pesanan'}
            </button>
            <p className="text-[10px] text-center text-slate-400 mt-4 px-2">
              Dengan mengkonfirmasi pesanan, Anda menyetujui syarat & ketentuan layanan Kucekin.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Pemesanan;