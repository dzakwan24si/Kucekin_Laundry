import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Ticket, CheckCircle2, AlertCircle, MoveRight } from "lucide-react";

// Import API
import { authAPI } from "@/services/authAPI";

export default function PromoMember() {
  const [poinSaya, setPoinSaya] = useState(0);
  const [userId, setUserId] = useState(null);
  const [klaimSukses, setKlaimSukses] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false); // Mencegah double klik

  // Ambil poin saat halaman dimuat
  useEffect(() => {
    const fetchPoints = async () => {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        setUserId(user.id);
        const profile = await authAPI.getMemberProfile(user.id);
        setPoinSaya(profile.poin || 0);
      }
    };
    fetchPoints();
  }, []);

  const [promoTersedia, setPromoTersedia] = useState([
    { id: 1, judul_pendek: "20%", judul: "Diskon Cuci Karpet", deskripsi: "Maksimal potongan Rp 20.000.", hargaPoin: 50, warna: "from-blue-600 to-indigo-800" },
    { id: 2, judul_pendek: "15K", judul: "Potongan Langsung", deskripsi: "Khusus Cuci Komplit (Kilat) min 3 Kg.", hargaPoin: 100, warna: "from-orange-500 to-red-500" },
    { id: 3, judul_pendek: "FREE", judul: "Antar-Jemput", deskripsi: "Bebas biaya kurir untuk radius 10 KM.", hargaPoin: 150, warna: "from-slate-700 to-slate-900" },
  ]);

  const [voucherSaya, setVoucherSaya] = useState([]);

  // Logika Eksekusi Klaim ke Supabase
  const handleKlaim = async (promo) => {
    if (poinSaya >= promo.hargaPoin && !isProcessing) {
      setIsProcessing(true);
      const sisaPoin = poinSaya - promo.hargaPoin;
      
      try {
        // 1. Potong poin di Database Supabase
        await authAPI.updateMemberPoints(userId, sisaPoin);
        
        // 2. Jika berhasil, update UI
        setPoinSaya(sisaPoin);
        setPromoTersedia(promoTersedia.filter(p => p.id !== promo.id));
        setVoucherSaya([{ id: promo.id, judul_pendek: promo.judul_pendek, judul: promo.judul, masaBerlaku: "7 Hari dari sekarang", warna: promo.warna }, ...voucherSaya]);
        
        setKlaimSukses(`Berhasil mengklaim: ${promo.judul}!`);
        setTimeout(() => setKlaimSukses(null), 3000);
      } catch (error) {
        alert("Gagal mengklaim promo. Periksa koneksi Anda.");
      } finally {
        setIsProcessing(false);
      }
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12 w-full pt-4">
      
      {/* 1. TYPOGRAPHY HERO & POIN BALANCE */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-4 md:mb-8"
      >
        <div>
          <p className="text-slate-500 font-medium tracking-wide text-sm mb-2 uppercase">Reward Loyalitas</p>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter leading-none">
            Klaim<br/>Hadiahmu.
          </h1>
        </div>
        
        {/* Box Poin Extreme */}
        <div className="bg-slate-900 rounded-[2rem] px-8 py-6 text-white flex items-center justify-between gap-8 min-w-[280px]">
          <div>
            <p className="text-slate-400 text-sm font-medium mb-1">Saldo Poin Kucekin</p>
            <div className="flex items-baseline gap-1.5">
              <h2 className="text-5xl font-black tracking-tighter">{poinSaya}</h2>
              <span className="text-orange-500 font-bold text-lg">pt</span>
            </div>
          </div>
          <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center shrink-0 backdrop-blur-sm border border-white/10">
            <Star className="text-orange-400 fill-orange-400" size={28} />
          </div>
        </div>
      </motion.div>

      {/* NOTIFIKASI KLAIM (Floating) */}
      <AnimatePresence>
        {klaimSukses && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="bg-slate-900 text-white px-6 py-4 rounded-[1.5rem] flex items-center gap-3 shadow-2xl border border-slate-700 w-fit"
          >
            <CheckCircle2 size={20} className="text-green-400" />
            <span className="font-bold text-sm tracking-wide">{klaimSukses}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10">
        
        {/* =========================================
            KOLOM KIRI: KATALOG PROMO TERSEDIA
            ========================================= */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
              <Ticket size={16} className="text-slate-700" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Katalog Penukaran</h2>
          </div>

          <div className="space-y-4">
            <AnimatePresence>
              {promoTersedia.map((promo) => {
                const poinCukup = poinSaya >= promo.hargaPoin;

                return (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95, x: -20 }}
                    key={promo.id} 
                    className="p-2 border border-slate-200 rounded-[2rem] bg-white flex flex-col sm:flex-row gap-2 group hover:border-slate-300 transition-colors"
                  >
                    {/* Sisi Kiri Tiket (Visual Promo Besar) */}
                    <div className={`sm:w-1/3 rounded-[1.5rem] bg-gradient-to-br ${promo.warna} p-6 text-white flex flex-col justify-between relative overflow-hidden min-h-[160px]`}>
                      <Ticket className="opacity-10 absolute -right-6 -bottom-6 w-32 h-32 rotate-12 transition-transform group-hover:scale-110 group-hover:rotate-45" />
                      <span className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-4 z-10">Voucher</span>
                      <h3 className="text-5xl font-black leading-none tracking-tighter z-10">{promo.judul_pendek}</h3>
                    </div>

                    {/* Sisi Kanan Tiket (Detail & Action) */}
                    <div className="sm:w-2/3 p-4 sm:p-6 flex flex-col justify-between">
                      <div>
                        <h4 className="font-black text-slate-900 text-xl mb-1">{promo.judul}</h4>
                        <p className="text-sm text-slate-500 font-medium leading-relaxed pr-4">{promo.deskripsi}</p>
                      </div>
                      
                      <div className="flex items-center justify-between mt-6 pt-5 border-t border-slate-100">
                        <div className="flex items-center gap-2">
                          <Star size={20} className={poinCukup ? "text-orange-500 fill-orange-500" : "text-slate-300 fill-slate-300"} />
                          <span className={`font-black text-2xl tracking-tight ${poinCukup ? "text-slate-900" : "text-slate-300"}`}>
                            {promo.hargaPoin} <span className="text-sm font-bold text-slate-400 tracking-normal">pt</span>
                          </span>
                        </div>
                        
                        <button 
                          onClick={() => handleKlaim(promo)}
                          disabled={!poinCukup}
                          className={`px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
                            poinCukup 
                              ? "bg-slate-900 text-white hover:bg-orange-500 hover:shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:-translate-y-0.5" 
                              : "bg-slate-100 text-slate-400 cursor-not-allowed"
                          }`}
                        >
                          {poinCukup ? "Klaim" : "Poin Kurang"}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
            
            {promoTersedia.length === 0 && (
              <div className="text-center py-12 bg-slate-50 rounded-[2rem] border border-slate-100 border-dashed">
                <Ticket size={32} className="text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 font-bold">Semua promo telah Anda klaim!</p>
              </div>
            )}
          </div>
        </div>

        {/* =========================================
            KOLOM KANAN: VOUCHER MILIK SAYA
            ========================================= */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
              <Star size={16} className="text-orange-500 fill-orange-500" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Voucher Saya</h2>
          </div>

          <div className="space-y-4">
            {voucherSaya.length === 0 ? (
              <div className="text-center py-10 bg-slate-50 rounded-[2rem] border border-slate-100 border-dashed">
                <AlertCircle size={28} className="text-slate-300 mx-auto mb-3" />
                <p className="text-sm text-slate-500 font-medium px-6">Anda belum memiliki voucher. Tukarkan poin di sebelah kiri.</p>
              </div>
            ) : (
              <AnimatePresence>
                {voucherSaya.map((v) => (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    key={v.id} 
                    className="p-1.5 border border-slate-200 rounded-[1.5rem] bg-white flex items-center gap-2 relative overflow-hidden group hover:border-slate-300 transition-colors cursor-pointer"
                  >
                    {/* Visual Voucher Pendek */}
                    <div className={`w-20 h-20 rounded-[1rem] bg-gradient-to-br ${v.warna} flex flex-col items-center justify-center text-white shrink-0`}>
                      <span className="text-[8px] font-black uppercase tracking-widest opacity-80 mb-0.5">Diskon</span>
                      <span className="text-2xl font-black leading-none">{v.judul_pendek}</span>
                    </div>
                    
                    <div className="py-2 px-3">
                      <h3 className="font-bold text-slate-900 text-sm mb-1 leading-tight">{v.judul}</h3>
                      <p className="text-[10px] font-bold text-slate-400 tracking-wide uppercase">Berlaku s/d {v.masaBerlaku}</p>
                    </div>

                    <div className="absolute right-4 text-slate-300 group-hover:text-orange-500 transition-colors opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all">
                       <MoveRight size={18} />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
          
          <div className="bg-slate-900 p-6 rounded-[2rem] text-center mt-6">
             <p className="text-xs text-slate-400 font-medium leading-relaxed">
               Gunakan voucher Anda pada halaman <strong className="text-white">Pemesanan</strong> untuk mendapatkan potongan harga.
             </p>
          </div>
        </div>

      </div>
    </div>
  );
}