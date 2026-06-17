import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight, Sparkles, Clock, MoveRight, Star, Ticket, RotateCcw } from "lucide-react";

// Import API
import { authAPI } from "@/services/authAPI";
import { transactionAPI } from "@/services/transactionAPI";

export default function DasborMember() {
  const [memberData, setMemberData] = useState({ nama: "Member", tier: "Bronze", poin: 0, poinNextTier: 200 });
  const [pesananAktif, setPesananAktif] = useState(null);
  const [riwayatTerakhir, setRiwayatTerakhir] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const user = JSON.parse(userStr);
          
          // 1. Tarik Data Profil
          const profile = await authAPI.getMemberProfile(user.id);
          const namaPanggilan = user.fullname.split(' ')[0];

          // PENYESUAIAN TARGET TIER BARU
          let targetPoin = 200;
          if (profile.tier === 'Silver') {
              targetPoin = 500;
          } else if (profile.tier === 'Gold') {
              targetPoin = 1000;
          } else if (profile.tier === 'VIP') {
              targetPoin = 1000; // Sudah level maksimal
          }

          setMemberData({
            nama: namaPanggilan,
            tier: profile.tier || "Bronze",
            poin: profile.poin || 0,
            poinNextTier: targetPoin,
          });

          // 2. Tarik Data Transaksi
          const txData = await transactionAPI.getUserTransactions(user.id);
          
          // Ambil 1 pesanan aktif (yang belum selesai) untuk ditampilkan di Dasbor
          const aktif = txData.find(t => t.status_pesanan !== 'Selesai');
          setPesananAktif(aktif || null);

          // Ambil 2 riwayat terakhir untuk list re-order
          const riwayat = txData.filter(t => t.status_pesanan === 'Selesai').slice(0, 2);
          setRiwayatTerakhir(riwayat);
        }
      } catch (error) {
        console.error("Gagal mengambil data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const progressPersen = (memberData.poin / memberData.poinNextTier) * 100;
  
  // Helper Format Tanggal & Nama
  const formatTanggalPendek = (dateStr) => new Date(dateStr).toLocaleDateString("id-ID", { day: "numeric", month: "short" });
  const getNamaLayanan = (tx) => tx.transaction_details?.[0]?.services?.nama_layanan || "Layanan Kucekin";
  const getItemLayanan = (tx) => `${tx.transaction_details?.[0]?.qty || 1} ${tx.transaction_details?.[0]?.services?.jenis === 'Kiloan' ? 'Kg' : 'Pcs'}`;

  if (isLoading) return <div className="min-h-[50vh] flex items-center justify-center text-slate-400 font-bold animate-pulse">Memuat Dasbor...</div>;

  return (
    <div className="space-y-4 md:space-y-6 animate-fade-in pb-12 w-full pt-4">
      
      {/* 1. TYPOGRAPHY HERO */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-4 md:mb-8">
        <div>
          <p className="text-slate-500 font-medium tracking-wide text-sm mb-2 uppercase">Selamat Datang Kembali</p>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter leading-none">Halo, {memberData.nama}</h1>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/member/profil" className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors underline decoration-slate-300 underline-offset-4">Kelola Profil</Link>
        </div>
      </motion.div>

      {/* BARIS 1: POIN & QUICK ACTION */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="md:col-span-2 bg-slate-900 rounded-[2rem] p-8 md:p-10 text-white relative overflow-hidden flex flex-col justify-between min-h-[240px]">
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-slate-800/50 via-slate-900/0 to-transparent"></div>
          <div className="relative z-10 flex justify-between items-start">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/10 text-xs font-semibold tracking-widest uppercase"><Star size={14} className="text-orange-400" /> Member {memberData.tier}</div>
            <Link to="/member/promo" className="group flex items-center justify-center w-10 h-10 rounded-full bg-white text-slate-900 hover:bg-orange-500 hover:text-white transition-all"><ArrowUpRight size={20} className="group-hover:rotate-45 transition-transform" /></Link>
          </div>
          <div className="relative z-10 mt-12">
            <p className="text-slate-400 text-sm font-medium mb-1">Saldo Poin Kucekin</p>
            <div className="flex items-baseline gap-2 mb-6"><h2 className="text-6xl font-black tracking-tighter">{memberData.poin}</h2><span className="text-slate-500 font-medium">pt</span></div>
            <div className="flex items-center gap-4">
              <div className="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-orange-500 rounded-full" style={{ width: `${progressPersen}%` }}></div></div>
              <span className="text-xs font-mono text-slate-400">{memberData.poinNextTier}</span>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="bg-slate-100 rounded-[2rem] p-8 flex flex-col justify-between min-h-[240px] hover:bg-slate-200 transition-colors group cursor-pointer" onClick={() => window.location.href = '/member/pesan'}>
          <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center text-white group-hover:scale-110 transition-transform"><Sparkles size={20} /></div>
          <div><h3 className="text-2xl font-bold text-slate-900 leading-tight mb-2">Buat<br/>Pesanan Baru</h3><div className="flex items-center gap-2 text-sm font-semibold text-slate-500 group-hover:text-slate-900 transition-colors">Pesan Sekarang <MoveRight size={16} /></div></div>
        </motion.div>
      </div>

      {/* BARIS 2: STATUS AKTIF DINAMIS */}
      {pesananAktif && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="w-full border border-slate-200 rounded-[2rem] p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 bg-white">
          <div className="flex-1">
            <div className="flex items-center gap-2 text-orange-500 font-bold text-sm tracking-wide uppercase mb-3">
              <span className="relative flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span></span>
              {pesananAktif.status_pesanan}
            </div>
            <h3 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-2">{getNamaLayanan(pesananAktif)}</h3>
            <p className="text-slate-500 font-medium">ID: <span className="font-mono text-slate-900">{pesananAktif.id}</span> • {getItemLayanan(pesananAktif)}</p>
          </div>
          <div className="w-full md:w-auto flex flex-col sm:flex-row items-start sm:items-center gap-6 md:pl-8 md:border-l border-slate-200">
            <div>
              <p className="text-sm font-medium text-slate-400 mb-1">Dipesan Pada</p>
              <div className="flex items-center gap-2 text-slate-900 font-bold text-lg"><Clock size={20} className="text-slate-400" /> {formatTanggalPendek(pesananAktif.created_at)}</div>
            </div>
            <Link to="/member/pesanan" className="w-full sm:w-auto px-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm text-center hover:bg-orange-500 transition-colors">Lacak</Link>
          </div>
        </motion.div>
      )}

      {/* BARIS 3: PROMO & RIWAYAT CEPAT */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-orange-500 rounded-[2rem] p-8 text-white flex flex-col justify-between relative overflow-hidden group cursor-pointer" onClick={() => window.location.href = '/member/promo'}>
          <div className="absolute -right-4 -top-4 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-colors"></div>
          <div className="relative z-10"><div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white mb-6"><Ticket size={20} /></div><h3 className="text-2xl font-black leading-tight mb-2">Diskon 20%<br/>Cuci Karpet</h3><p className="text-orange-100 text-sm font-medium">Spesial untuk member Silver.</p></div>
          <div className="relative z-10 mt-8 flex items-center justify-between gap-2 text-sm font-bold bg-white/20 w-fit px-5 py-2.5 rounded-full backdrop-blur-md group-hover:bg-white group-hover:text-orange-500 transition-colors">Klaim Promo <MoveRight size={16} /></div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="md:col-span-2 border border-slate-200 rounded-[2rem] p-8 flex flex-col justify-between bg-white">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-slate-900">Pesanan Terakhir</h3>
            <Link to="/member/pesanan" className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-1">Lihat Semua <ArrowUpRight size={16} /></Link>
          </div>
          <div className="space-y-3">
            {riwayatTerakhir.length === 0 ? (
              <div className="text-center py-6 text-sm font-bold text-slate-400">Belum ada riwayat pesanan selesai.</div>
            ) : (
              riwayatTerakhir.map((item) => (
                <div key={item.id} className="group flex flex-col sm:flex-row justify-between sm:items-center p-4 rounded-2xl bg-slate-50/50 hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-all gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white text-slate-400 rounded-full flex flex-col items-center justify-center font-bold text-sm shadow-sm">
                      <span className="text-slate-900">{formatTanggalPendek(item.created_at).split(' ')[0]}</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{getNamaLayanan(item)}</h4>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">Rp {item.total_harga.toLocaleString('id-ID')} • Selesai</p>
                    </div>
                  </div>
                  <button onClick={() => window.location.href = '/member/pesan'} className="flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-sm">
                    <RotateCcw size={14} /> Pesan Lagi
                  </button>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>

    </div>
  );
}