import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Package, Clock, CheckCircle2, RotateCcw, Receipt, ArrowRight, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Import API
import { transactionAPI } from "@/services/transactionAPI";

export default function PesananMember() {
  const [activeTab, setActiveTab] = useState("aktif"); 
  const navigate = useNavigate();

  // State Dinamis
  const [pesananAktif, setPesananAktif] = useState([]);
  const [riwayatPesanan, setRiwayatPesanan] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPesanan = async () => {
      try {
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const user = JSON.parse(userStr);
          const data = await transactionAPI.getUserTransactions(user.id);
          
          // Pisahkan data berdasarkan status
          const aktif = data.filter(t => t.status_pesanan !== 'Selesai');
          const riwayat = data.filter(t => t.status_pesanan === 'Selesai');
          
          setPesananAktif(aktif);
          setRiwayatPesanan(riwayat);
        }
      } catch (error) {
        console.error("Gagal menarik data pesanan:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPesanan();
  }, []);

  // Format Tanggal (Contoh: 16 Jun 2026)
  const formatTanggal = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
  };

  // Helper untuk Progress Bar
  const getProgressValue = (status) => {
    switch(status) {
      case 'Diterima': return 1;
      case 'Dijemput': return 2;
      case 'Diproses': return 3;
      case 'Diantar': return 4;
      default: return 1;
    }
  };

  // Helper untuk mengambil Nama Layanan dari Relasi JSON Supabase
  const getLayananInfo = (transaksi) => {
    const detail = transaksi.transaction_details?.[0];
    if (!detail) return { nama: "Layanan Kucekin", itemStr: "Detail tidak ditemukan" };
    
    const jenis = detail.services?.jenis === 'Kiloan' ? 'kg' : 'pcs';
    return {
      nama: detail.services?.nama_layanan || "Layanan Kucekin",
      itemStr: `${detail.qty} ${jenis} ${detail.services?.nama_layanan || ''}`
    };
  };

  const handlePesanLagi = () => {
    navigate('/member/pesan');
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in pb-12 w-full pt-4">
      
      {/* 1. TYPOGRAPHY HERO & TAB SWITCHER */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-slate-500 font-medium tracking-wide text-sm mb-2 uppercase">Riwayat & Pelacakan</p>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter leading-none">
            Pesanan<br/>Anda.
          </h1>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex bg-slate-200/50 p-1.5 rounded-full w-fit border border-slate-200/50 backdrop-blur-sm">
          {['aktif', 'riwayat'].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative px-6 py-3 rounded-full text-sm font-bold transition-colors z-10 ${activeTab === tab ? "text-slate-900" : "text-slate-500 hover:text-slate-700"}`}
            >
              {activeTab === tab && (
                <motion.div layoutId="activeTabPesanan" className="absolute inset-0 bg-white rounded-full -z-10 shadow-sm border border-slate-100" transition={{ type: "spring", stiffness: 400, damping: 30 }} />
              )}
              {tab === 'aktif' ? 'Sedang Diproses' : 'Riwayat Selesai'}
            </button>
          ))}
        </motion.div>
      </div>

      {isLoading ? (
        <div className="py-20 flex justify-center"><Loader2 className="w-10 h-10 text-orange-500 animate-spin" /></div>
      ) : (
        <AnimatePresence mode="wait">
          {/* TAB: SEDANG BERJALAN */}
          {activeTab === "aktif" && (
            <motion.div key="aktif" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="space-y-6">
              {pesananAktif.length === 0 ? (
                <div className="text-center py-16 bg-slate-50 rounded-[2rem] border border-slate-100 border-dashed">
                  <Package size={48} className="text-slate-300 mx-auto mb-4" />
                  <h3 className="text-xl font-black text-slate-900 tracking-tight mb-2">Belum ada pesanan aktif</h3>
                  <p className="text-slate-500 text-sm font-medium">Cucian Anda sedang bersih semua. Hebat!</p>
                </div>
              ) : (
                pesananAktif.map((order) => {
                  const info = getLayananInfo(order);
                  const progress = getProgressValue(order.status_pesanan);

                  return (
                    <div key={order.id} className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition-shadow">
                      <div className="p-8 md:p-10 flex flex-col md:flex-row justify-between items-start gap-6 border-b border-slate-100 bg-slate-50/50">
                        <div>
                          <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-xs font-bold tracking-widest uppercase mb-4">
                            <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span></span>
                            {order.status_pesanan}
                          </div>
                          <h3 className="font-black text-3xl md:text-4xl text-slate-900 tracking-tight mb-1">{info.nama}</h3>
                          <p className="text-slate-500 font-medium">ID: <span className="font-mono text-slate-900">{order.id}</span></p>
                        </div>
                        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm w-full md:w-auto shrink-0 flex items-center gap-4">
                           <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-500"><Clock size={24} /></div>
                           <div>
                             <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-0.5">Waktu Order</p>
                             <p className="font-black text-lg text-slate-900">{formatTanggal(order.created_at)}</p>
                           </div>
                        </div>
                      </div>

                      <div className="p-8 md:p-10">
                        <div className="relative mb-12 mt-4 px-2 md:px-8">
                          <div className="absolute left-10 right-10 top-5 h-2 bg-slate-100 rounded-full z-0"></div>
                          <div className="absolute left-10 top-5 h-2 bg-orange-500 rounded-full z-0 transition-all duration-1000 ease-out" style={{ width: `calc(${(progress - 1) * 33.33}%)` }}></div>
                          <div className="flex justify-between relative z-10">
                            {['Diterima', 'Dijemput', 'Diproses', 'Diantar'].map((step, idx) => {
                              const isCompleted = idx + 1 <= progress;
                              const isCurrent = idx + 1 === progress;
                              return (
                                <div key={step} className="flex flex-col items-center gap-3 w-16">
                                  <div className={`w-12 h-12 rounded-full flex items-center justify-center border-[6px] border-white shadow-sm transition-all duration-500 ${isCompleted ? "bg-orange-500 text-white" : "bg-slate-200 text-slate-400"} ${isCurrent && "ring-4 ring-orange-100 scale-110"}`}>
                                    {isCompleted ? <CheckCircle2 size={20} /> : <span className="text-sm font-black">{idx + 1}</span>}
                                  </div>
                                  <span className={`text-[11px] md:text-sm font-bold text-center ${isCurrent ? "text-orange-500" : isCompleted ? "text-slate-800" : "text-slate-400"}`}>{step}</span>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 text-white p-6 rounded-[1.5rem]">
                          <div className="flex items-center gap-3">
                            <Receipt size={24} className="text-orange-400" /> 
                            <div><p className="text-sm font-medium text-slate-400">Rincian Cucian</p><p className="font-bold">{info.itemStr}</p></div>
                          </div>
                          <div className="sm:text-right">
                            <p className="text-sm font-medium text-slate-400">Total Biaya</p>
                            <p className="font-black text-2xl text-orange-400">Rp {order.total_harga.toLocaleString('id-ID')}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </motion.div>
          )}

          {/* TAB: RIWAYAT SELESAI */}
          {activeTab === "riwayat" && (
            <motion.div key="riwayat" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
              {riwayatPesanan.length === 0 ? (
                 <div className="md:col-span-2 text-center py-10 bg-slate-50 rounded-[2rem] border border-slate-100 border-dashed text-slate-500 font-bold">Belum ada riwayat pesanan selesai.</div>
              ) : (
                riwayatPesanan.map((history) => {
                  const info = getLayananInfo(history);
                  return (
                    <div key={history.id} className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-lg transition-all group flex flex-col justify-between min-h-[220px]">
                      <div>
                        <div className="flex justify-between items-start mb-4">
                          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">{history.status_pesanan}</span>
                          <p className="font-black text-lg text-slate-900 tracking-tight">Rp {history.total_harga.toLocaleString('id-ID')}</p>
                        </div>
                        <h3 className="font-black text-2xl text-slate-900 tracking-tight mb-1">{info.nama}</h3>
                        <p className="text-sm font-medium text-slate-500 mb-4">{formatTanggal(history.created_at)} <ArrowRight size={12} className="inline mx-1" /> Selesai</p>
                        <p className="text-xs font-bold text-slate-400 truncate bg-slate-50 w-fit px-3 py-1.5 rounded-lg border border-slate-100">
                          <Receipt size={12} className="inline mr-1 -mt-0.5" /> {info.itemStr}
                        </p>
                      </div>
                      <div className="mt-8 pt-5 border-t border-slate-100">
                        <button onClick={handlePesanLagi} className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-orange-500 text-white px-6 py-4 rounded-xl text-sm font-black transition-all group-hover:scale-[1.02] active:scale-95 shadow-md">
                          <RotateCcw size={18} className="group-hover:-rotate-180 transition-transform duration-500" /> Pesan Lagi
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}