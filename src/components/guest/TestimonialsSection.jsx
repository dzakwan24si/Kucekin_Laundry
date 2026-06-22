import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, MessageSquareQuote, Loader2 } from "lucide-react";

// Import API
import { transactionAPI } from "@/services/transactionAPI";

const TestimonialsSection = () => {
  const [featuredReviews, setFeaturedReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(2);

  // 1. Tarik Data Dinamis dari Supabase
  useEffect(() => {
    const fetchTestimoni = async () => {
      try {
        const data = await transactionAPI.getFeaturedReviews();
        setFeaturedReviews(data);
      } catch (error) {
        console.error("Gagal menarik testimoni:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTestimoni();
  }, []);

  // 2. Deteksi Ukuran Layar untuk Slider (1 Kartu di HP, 2 Kartu di Desktop)
  useEffect(() => {
    const handleResize = () => {
      setItemsPerPage(window.innerWidth < 768 ? 1 : 2);
    };
    handleResize(); 
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isLoading) {
    return (
      <div className="w-full py-24 flex justify-center bg-slate-900">
        <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
      </div>
    );
  }

  if (featuredReviews.length === 0) return null;

  // 3. Logika Pemecahan Halaman (Pagination)
  const totalPages = Math.ceil(featuredReviews.length / itemsPerPage);
  const pages = [];
  for (let i = 0; i < featuredReviews.length; i += itemsPerPage) {
    pages.push(featuredReviews.slice(i, i + itemsPerPage));
  }

  const handlePrev = () => setCurrentPage((prev) => (prev === 0 ? totalPages - 1 : prev - 1));
  const handleNext = () => setCurrentPage((prev) => (prev === totalPages - 1 ? 0 : prev + 1));

  return (
    <section id="testimoni" className="py-20 px-6 bg-slate-900 text-center relative overflow-hidden font-poppins">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between mb-12 gap-6 relative z-10">
        
        {/* TEKS JUDUL KIRI */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center md:text-left"
        >
          <h2 className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tight">
            Feedback <span className="text-orange-500">Pelanggan Kami</span>
          </h2>
          <p className="text-slate-400 text-sm font-medium">Apa kata mereka tentang layanan Kucekin?</p>
        </motion.div>

        {/* TOMBOL NAVIGASI KANAN */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          className="flex gap-3"
        >
          <button onClick={handlePrev} className="w-12 h-12 rounded-full border border-slate-700 bg-slate-800 hover:bg-orange-500 hover:border-orange-500 text-slate-300 hover:text-white flex items-center justify-center transition-all shadow-md">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button onClick={handleNext} className="w-12 h-12 rounded-full border border-slate-700 bg-slate-800 hover:bg-orange-500 hover:border-orange-500 text-slate-300 hover:text-white flex items-center justify-center transition-all shadow-md">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
        </motion.div>
      </div>
      
      {/* CONTAINER CAROUSEL */}
      <div className="relative max-w-5xl mx-auto overflow-hidden rounded-3xl pb-4 z-10">
        <motion.div 
          className="flex"
          initial={false}
          animate={{ x: `-${currentPage * 100}%` }}
          transition={{ type: "spring", stiffness: 250, damping: 30 }}
        >
          {pages.map((pageData, pageIdx) => (
            <div key={pageIdx} className="w-full shrink-0 grid grid-cols-1 md:grid-cols-2 gap-6 px-1">
              
              {/* DESAIN KARTU PUTIH SESUAI GAMBAR ANDA */}
              {pageData.map((item, idx) => {
                // LOGIKA PEMBACAAN TIER YANG SUDAH DISEMPURNAKAN
                const profiles = item.users?.member_profiles;
                const tierPelanggan = (Array.isArray(profiles) ? profiles[0]?.tier : profiles?.tier) || "KUCEKIN"; 

                return (
                  <motion.div 
                    key={item.id} 
                    whileHover={{ scale: 1.02, y: -5 }}
                    transition={{ duration: 0.2 }}
                    className="bg-white rounded-[2rem] p-8 text-left relative flex flex-col justify-between shadow-xl cursor-pointer border border-slate-100 min-h-[260px]"
                  >
                    <div>
                      {/* Bintang & Icon Kutipan */}
                      <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-1 text-amber-400">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={20} className={i < item.rating ? "fill-amber-400" : "text-slate-200 fill-slate-100"} />
                          ))}
                        </div>
                        <MessageSquareQuote size={32} strokeWidth={1.5} className="text-blue-100" />
                      </div>
                      
                      {/* Teks Komentar */}
                      <p className="text-slate-600 font-medium leading-relaxed italic mb-8">
                        "{item.komentar}"
                      </p>
                    </div>

                    {/* Identitas Member + Tier */}
                    <div className="flex items-center gap-4 pt-6 border-t border-slate-100 mt-auto">
                      <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center text-white font-bold text-lg shadow-inner">
                        {item.users?.fullname?.charAt(0).toUpperCase() || "M"}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 leading-tight mb-0.5">
                          {item.users?.fullname || "Pelanggan Setia"}
                        </h4>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                          MEMBER {tierPelanggan}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}

            </div>
          ))}
        </motion.div>
      </div>

      {/* INDIKATOR DOTS BAWAH */}
      <div className="flex justify-center gap-2 mt-8 relative z-10">
        {pages.map((_, idx) => (
          <button 
            key={idx} 
            onClick={() => setCurrentPage(idx)}
            className={`h-2 rounded-full transition-all duration-300 ${currentPage === idx ? 'w-8 bg-orange-500' : 'w-2 bg-white/20 hover:bg-white/40'}`}
          />
        ))}
      </div>
    </section>
  );
};

export default TestimonialsSection;