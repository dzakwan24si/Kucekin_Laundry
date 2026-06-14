import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

// Data harga layanan (bisa disesuaikan nanti)
const layananData = [
  { id: 'cuci-lipat', nama: 'Cuci & Lipat', harga: 7000, satuan: 'kg', icon: 'img/LogoCuciLipat.png' },
  { id: 'cuci-setrika', nama: 'Cuci & Setrika', harga: 10000, satuan: 'kg', icon: 'img/LogoSetrika.png' },
  { id: 'dry-cleaning', nama: 'Dry Cleaning', harga: 25000, satuan: 'pcs', icon: 'img/LogoDryCleaning.png' },
  { id: 'cuci-sprei', nama: 'Sprei & Selimut', harga: 30000, satuan: 'pcs', icon: 'img/LogoCuciSprei.png' },
  { id: 'cuci-sepatu', nama: 'Sepatu', harga: 25000, satuan: 'pcs', icon: 'img/LogoCuciSepatu.png' },
  { id: 'cuci-karpet', nama: 'Karpet', harga: 50000, satuan: 'pcs', icon: 'img/LogoKarpet.png' },
];

const Pemesanan = () => {
  // State untuk menyimpan inputan user
  const [layananTerpilih, setLayananTerpilih] = useState(layananData[0]);
  const [jumlah, setJumlah] = useState(1);
  const [formDetail, setFormDetail] = useState({
    nama: '',
    whatsapp: '',
    alamat: '',
    catatan: ''
  });

  // Kalkulasi total
  const subtotal = layananTerpilih.harga * jumlah;
  const ongkir = 10000; // Contoh flat rate antar-jemput
  const total = subtotal + ongkir;

  const handlePesan = (e) => {
    e.preventDefault();
    // Di sinilah nanti Anda menautkan API untuk mengirim data pesanan ke backend admin
    alert(`Pesanan atas nama ${formDetail.nama} sedang diproses! Total: Rp ${total.toLocaleString('id-ID')}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Halaman */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <Link to="/" className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-orange-500 mb-4 transition-colors">
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            Kembali ke Beranda
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">Formulir Pemesanan</h1>
          <p className="text-slate-500 mt-2">Pilih layanan dan atur jadwal penjemputan cucian Anda.</p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* BAGIAN KIRI: Form Input */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="flex-1 space-y-8"
          >
            {/* 1. Pilihan Layanan */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <h2 className="text-xl font-bold text-slate-900 mb-5">1. Pilih Layanan</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {layananData.map((item) => (
                  <div 
                    key={item.id}
                    onClick={() => setLayananTerpilih(item)}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-4 ${layananTerpilih.id === item.id ? 'border-orange-500 bg-orange-50' : 'border-slate-100 hover:border-slate-300 bg-white'}`}
                  >
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 shrink-0">
                      <img src={item.icon} alt={item.nama} className="w-7 h-7 object-contain"/>
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-sm">{item.nama}</div>
                      <div className="text-xs text-slate-500 mt-0.5">Rp {item.harga.toLocaleString('id-ID')} / {item.satuan}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input Estimasi Berat/Jumlah */}
              <div className="mt-6">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Estimasi Jumlah ({layananTerpilih.satuan})
                </label>
                <div className="flex items-center gap-4">
                  <button onClick={() => setJumlah(Math.max(1, jumlah - 1))} className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold flex items-center justify-center transition-colors">-</button>
                  <span className="w-12 text-center font-bold text-lg text-slate-900">{jumlah}</span>
                  <button onClick={() => setJumlah(jumlah + 1)} className="w-10 h-10 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold flex items-center justify-center transition-colors">+</button>
                </div>
                <p className="text-xs text-slate-400 mt-2 italic">*Berat pasti akan ditimbang kembali oleh kurir kami saat penjemputan.</p>
              </div>
            </div>

            {/* 2. Detail Penjemputan */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <h2 className="text-xl font-bold text-slate-900 mb-5">2. Detail Penjemputan</h2>
              <form className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Nama Lengkap</label>
                    <input type="text" placeholder="Budi Santoso" onChange={(e) => setFormDetail({...formDetail, nama: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">No. WhatsApp</label>
                    <input type="tel" placeholder="081234567890" onChange={(e) => setFormDetail({...formDetail, whatsapp: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all text-sm" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Alamat Lengkap (Patokan)</label>
                  <textarea rows="3" placeholder="Jl. Sudirman No. 12, Pagar Hitam..." onChange={(e) => setFormDetail({...formDetail, alamat: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all text-sm resize-y"></textarea>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Catatan Khusus (Opsional)</label>
                  <input type="text" placeholder="Contoh: Tolong pisahkan baju putih" onChange={(e) => setFormDetail({...formDetail, catatan: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all text-sm" />
                </div>
              </form>
            </div>
          </motion.div>

          {/* BAGIAN KANAN: Ringkasan Pesanan (Sticky Layout) */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="w-full lg:w-[400px]"
          >
            <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl sticky top-28 border border-slate-800">
              <h2 className="text-xl font-bold mb-6">Ringkasan Pesanan</h2>
              
              <div className="space-y-4 mb-6 pb-6 border-b border-slate-700/50">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-semibold text-sm">{layananTerpilih.nama}</div>
                    <div className="text-xs text-slate-400 mt-1">{jumlah} {layananTerpilih.satuan} x Rp {layananTerpilih.harga.toLocaleString('id-ID')}</div>
                  </div>
                  <div className="font-semibold text-sm">Rp {subtotal.toLocaleString('id-ID')}</div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="font-semibold text-sm text-slate-300">Biaya Antar-Jemput</div>
                  <div className="font-semibold text-sm text-slate-300">Rp {ongkir.toLocaleString('id-ID')}</div>
                </div>
              </div>

              <div className="flex justify-between items-center mb-8">
                <div className="text-base font-bold text-orange-400">Total Estimasi</div>
                <div className="text-2xl font-black text-orange-500">Rp {total.toLocaleString('id-ID')}</div>
              </div>

              <button 
                onClick={handlePesan}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-full py-4 transition-all shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-[0_0_25px_rgba(249,115,22,0.5)] transform hover:-translate-y-1"
              >
                Konfirmasi Pesanan
              </button>
              
              <p className="text-center text-xs text-slate-400 mt-4 leading-relaxed">
                Dengan menekan tombol di atas, Anda menyetujui syarat & ketentuan Kucekin. Pembayaran dilakukan saat kurir tiba.
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default Pemesanan;