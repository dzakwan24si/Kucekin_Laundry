import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import axios from 'axios';

const CekStatus = () => {
  const [resi, setResi] = useState('');
  const [statusData, setStatusData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Simulasi langkah-langkah proses laundry
  const steps = [
    { id: 1, title: 'Pesanan Diterima', desc: 'Sistem telah mencatat pesanan Anda.' },
    { id: 2, title: 'Penjemputan', desc: 'Kurir sedang menjemput / sudah mengambil cucian.' },
    { id: 3, title: 'Sedang Diproses', desc: 'Pakaian Anda sedang dicuci & disetrika.' },
    { id: 4, title: 'Siap Diantar', desc: 'Cucian selesai dan siap dikirim kembali.' },
  ];

  const handleCekStatus = async (e) => {
    e.preventDefault();
    if (!resi.trim()) return;
    
    setIsLoading(true);
    setError('');
    setStatusData(null);

    try {
      const BASE_URL = "https://impjljpcvddyhfzeuafn.supabase.co/rest/v1";
      const API_KEY = "sb_publishable_RqqwWKzw8YLmUv6qPPtUyQ_Ma85wMbJ";
      const headers = {
        apikey: API_KEY,
        Authorization: `Bearer ${API_KEY}`,
      };

      const query = 'select=*,users(fullname),transaction_details(qty,services(nama_layanan,jenis))';
      const response = await axios.get(`${BASE_URL}/transactions?id=eq.${resi}&${query}`, { headers });
      
      if (response.data && response.data.length > 0) {
        const trx = response.data[0];
        
        let currentStep = 1;
        const statusLow = trx.status_pesanan?.toLowerCase() || '';
        if (statusLow.includes('diterima') || statusLow.includes('pending')) currentStep = 1;
        else if (statusLow.includes('jemput')) currentStep = 2;
        else if (statusLow.includes('proses')) currentStep = 3;
        else if (statusLow.includes('selesai') || statusLow.includes('antar')) currentStep = 4;
        
        const layananName = trx.transaction_details && trx.transaction_details.length > 0
          ? trx.transaction_details.map(d => d.services?.nama_layanan).filter(Boolean).join(', ')
          : 'Layanan Standar';

        setStatusData({
          id: trx.id,
          nama: trx.users?.fullname || 'Pelanggan',
          layanan: layananName || 'Layanan Standar',
          tanggalPesan: new Date(trx.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' }),
          estimasiSelesai: 'Estimasi menyusul',
          currentStep: currentStep,
          statusText: trx.status_pesanan || 'Menunggu'
        });
      } else {
        setError('Nomor Resi tidak ditemukan. Pastikan Anda memasukkan nomor yang benar.');
      }
    } catch (err) {
      console.error(err);
      setError('Terjadi kesalahan koneksi. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-20 px-6 flex flex-col items-center">
      
      {/* Header Halaman */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl text-center mb-10"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-4">
          Lacak <span className="text-orange-500">Pesanan Anda</span>
        </h1>
        <p className="text-slate-500 text-sm md:text-base">
          Masukkan nomor resi atau ID Pesanan untuk mengetahui status cucian Anda saat ini secara real-time.
        </p>
      </motion.div>

      {/* Box Pencarian */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="w-full max-w-2xl bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-slate-100 mb-8 relative z-20"
      >
        <form onSubmit={handleCekStatus} className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400">
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
            <input 
              type="text" 
              value={resi}
              onChange={(e) => setResi(e.target.value)}
              placeholder="Masukkan Nomor Resi (Cth: KUC-12345)" 
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all font-medium text-slate-700 uppercase"
            />
          </div>
          <button 
            type="submit" 
            disabled={isLoading}
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl px-8 py-4 transition-all shadow-md flex items-center justify-center min-w-[140px] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              "Lacak Cucian"
            )}
          </button>
        </form>

        {/* Pesan Error */}
        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 p-4 bg-red-50 text-red-500 text-sm font-medium rounded-xl border border-red-100 flex items-start gap-2">
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            {error}
          </motion.div>
        )}
      </motion.div>

      {/* Hasil Pencarian (Timeline Status) */}
      {statusData && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-2xl bg-white rounded-[2.5rem] shadow-lg border border-slate-100 overflow-hidden relative"
        >
          {/* Aksen Header Kartu */}
          <div className="bg-slate-900 p-6 md:px-10 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <p className="text-sm text-slate-400 font-medium mb-1">ID Pesanan</p>
              <h2 className="text-xl md:text-2xl font-bold tracking-wider text-orange-400">{statusData.id}</h2>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-sm text-slate-400 font-medium mb-1">Estimasi Selesai</p>
              <p className="text-base font-semibold">{statusData.estimasiSelesai}</p>
            </div>
          </div>

          <div className="p-6 md:p-10">
            {/* Detail Pemesan */}
            <div className="flex flex-wrap gap-x-12 gap-y-4 mb-10 pb-6 border-b border-slate-100">
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">Nama Pelanggan</p>
                <p className="font-bold text-slate-900">{statusData.nama}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">Layanan</p>
                <p className="font-bold text-slate-900">{statusData.layanan}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">Tanggal Pesan</p>
                <p className="font-bold text-slate-900">{statusData.tanggalPesan}</p>
              </div>
            </div>

            {/* Timeline Stepper Vertical */}
            <div className="relative pl-4 md:pl-6">
              {/* Garis Latar Vertikal */}
              <div className="absolute top-2 bottom-6 left-[23px] md:left-[31px] w-0.5 bg-slate-100 z-0"></div>

              <div className="space-y-8 relative z-10">
                {steps.map((step, idx) => {
                  const isCompleted = step.id < statusData.currentStep;
                  const isCurrent = step.id === statusData.currentStep;
                  
                  return (
                    <div key={step.id} className="flex gap-6 items-start group">
                      {/* Ikon Bulat */}
                      <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shrink-0 border-4 border-white transition-all duration-300 shadow-sm
                        ${isCompleted ? 'bg-orange-500 text-white' : 
                          isCurrent ? 'bg-slate-900 text-white scale-110 shadow-md ring-2 ring-orange-200' : 
                          'bg-slate-100 text-slate-400'}
                      `}>
                        {isCompleted ? (
                          <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                        ) : (
                          <span className="font-bold text-sm">{step.id}</span>
                        )}
                      </div>

                      {/* Konten Teks */}
                      <div className="pt-1.5 md:pt-2.5">
                        <h4 className={`text-base font-bold mb-1 transition-colors ${isCurrent ? 'text-orange-500' : isCompleted ? 'text-slate-900' : 'text-slate-400'}`}>
                          {step.title}
                        </h4>
                        <p className={`text-sm leading-relaxed ${isCurrent ? 'text-slate-600' : 'text-slate-400'}`}>
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
          </div>
        </motion.div>
      )}

      {/* Tombol Bantuan */}
      <div className="mt-12 text-center">
        <p className="text-sm text-slate-500 mb-3">Butuh bantuan atau resi tidak ditemukan?</p>
        <button className="text-orange-500 font-semibold hover:text-orange-600 transition-colors flex items-center justify-center gap-2 mx-auto">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
          Hubungi Customer Service
        </button>
      </div>

    </div>
  );
};

export default CekStatus;