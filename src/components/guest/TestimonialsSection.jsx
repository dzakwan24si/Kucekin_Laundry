import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Data Testimonial (4 Data untuk 2 Halaman di Desktop)
const testimonials = [
  {
    name: 'Budi Santoso', role: 'Karyawan Swasta', rating: 5,
    text: '"Saya sangat berterima kasih kepada Kucekin atas layanannya yang tanpa cela. Pakaian kantor saya selalu disetrika rapi, dan kenyamanan antar-jemputnya sangat membantu!"',
    img: 'https://image.qwenlm.ai/public_source/ccc69bcd-f31d-4286-9fe8-970f55530d23/1b1d9932b-0437-99a1-8712-75de81c5aedb.png',
  },
  {
    name: 'Siti Aminah', role: 'Ibu Rumah Tangga', rating: 5,
    text: '"Awalnya ragu untuk cuci sprei dan selimut tebal di sini, tapi ternyata hasilnya luar biasa bersih, bebas noda, dan wangi tahan lama. Kurirnya juga sopan."',
    img: 'https://image.qwenlm.ai/public_source/ccc69bcd-f31d-4286-9fe8-970f55530d23/19fe7b6fa-0f95-9985-b29f-9d4eb7f28d3a.png',
  },
  {
    name: 'Andi Wijaya', role: 'Mahasiswa', rating: 5,
    text: '"Sebagai mahasiswa yang sibuk nugas, Kucekin adalah penyelamat hidup. Harganya transparan dan pas di kantong, jasanya cepat selesai. Sangat direkomendasikan!"',
    img: 'https://image.qwenlm.ai/public_source/ccc69bcd-f31d-4286-9fe8-970f55530d23/1b1d9932b-0437-99a1-8712-75de81c5aedb.png',
  },
  {
    name: 'Rina Marlina', role: 'Pemilik Butik', rating: 5,
    text: '"Layanan Dry Cleaning-nya juara! Gaun dan pakaian berbahan sensitif dari butik saya selalu ditangani dengan hati-hati. Kualitas terjamin dan tidak pernah mengecewakan."',
    img: 'https://image.qwenlm.ai/public_source/ccc69bcd-f31d-4286-9fe8-970f55530d23/19fe7b6fa-0f95-9985-b29f-9d4eb7f28d3a.png',
  },
];

const TestimonialsSection = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(2);

  // Deteksi ukuran layar
  useEffect(() => {
    const handleResize = () => {
      setItemsPerPage(window.innerWidth < 768 ? 1 : 2);
    };
    handleResize(); 
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalPages = Math.ceil(testimonials.length / itemsPerPage);

  const pages = [];
  for (let i = 0; i < testimonials.length; i += itemsPerPage) {
    pages.push(testimonials.slice(i, i + itemsPerPage));
  }

  const handlePrev = () => setCurrentPage((prev) => (prev === 0 ? totalPages - 1 : prev - 1));
  const handleNext = () => setCurrentPage((prev) => (prev === totalPages - 1 ? 0 : prev + 1));

  return (
    <section id="testimoni" className="py-20 px-6 bg-slate-900 text-center relative overflow-hidden">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
        
        {/* Teks Judul dengan Animasi Masuk dari Kiri */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center md:text-left"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Feedback <span className="text-orange-500">Pelanggan Kami</span>
          </h2>
          <p className="text-slate-400 text-sm">Apa kata mereka tentang layanan Kucekin?</p>
        </motion.div>

        {/* Tombol Navigasi dengan Animasi Masuk dari Kanan */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          className="flex gap-3"
        >
          <button 
            onClick={handlePrev}
            className="w-12 h-12 rounded-full border border-slate-700 bg-slate-800 hover:bg-orange-500 hover:border-orange-500 hover:text-white text-slate-300 flex items-center justify-center transition-all shadow-md"
          >
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button 
            onClick={handleNext}
            className="w-12 h-12 rounded-full border border-slate-700 bg-slate-800 hover:bg-orange-500 hover:border-orange-500 hover:text-white text-slate-300 flex items-center justify-center transition-all shadow-md"
          >
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </motion.div>
      </div>
      
      {/* Container Carousel */}
      <div className="relative max-w-5xl mx-auto overflow-hidden rounded-2xl pb-4">
        
        {/* Track Bergeser Menggunakan Framer Motion (Lebih halus dengan efek Spring) */}
        <motion.div 
          className="flex"
          initial={false}
          animate={{ x: `-${currentPage * 100}%` }}
          transition={{ type: "spring", stiffness: 250, damping: 30 }}
        >
          {pages.map((pageData, pageIdx) => (
            <div key={pageIdx} className="w-full shrink-0 grid grid-cols-1 md:grid-cols-2 gap-6 px-1">
              
              {/* Loop Kartu di dalam Halaman */}
              {pageData.map((t, idx) => (
                <motion.div 
                  key={idx} 
                  // Animasi interaktif saat diarahkan kursor (hover)
                  whileHover={{ scale: 1.02, y: -5 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-8 text-left relative group h-full flex flex-col justify-between cursor-pointer shadow-sm hover:shadow-xl hover:border-white/20"
                >
                  <div>
                    <div className="text-xs text-orange-400 font-bold mb-3 uppercase tracking-wider">{t.role}</div>
                    <p className="text-sm text-white/90 leading-relaxed mb-6 italic">
                      {t.text}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 mt-auto">
                    <img src={t.img} alt={t.name} className="w-12 h-12 rounded-full object-cover border-2 border-slate-700" />
                    <div>
                      <div className="text-white font-semibold text-sm">{t.name}</div>
                      <div className="flex gap-0.5 mt-1 text-orange-500 text-xs">
                        {'★★★★★'.split('').map((star, i) => <span key={i}>{star}</span>)}
                      </div>
                    </div>
                  </div>
                  
                  {/* Quote Icon */}
                  <div className="absolute bottom-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity">
                    <svg width="40" height="40" viewBox="0 0 32 32" fill="currentColor" className="text-orange-500">
                      <path d="M8 16c0-4 3-7 7-7v3c-2.5 0-4 1.5-4 4h3v6H8v-6zM18 16c0-4 3-7 7-7v3c-2.5 0-4 1.5-4 4h3v6h-6v-6z" />
                    </svg>
                  </div>
                </motion.div>
              ))}

            </div>
          ))}
        </motion.div>
      </div>

      {/* Titik Indikator Bawah (Dots) dengan animasi scale */}
      <div className="flex justify-center gap-2 mt-6">
        {pages.map((_, idx) => (
          <motion.button 
            key={idx} 
            onClick={() => setCurrentPage(idx)}
            whileHover={{ scale: 1.2 }}
            className={`h-2 rounded-full transition-all duration-300 ${currentPage === idx ? 'w-8 bg-orange-500' : 'w-2 bg-white/30 hover:bg-white/50'}`}
          />
        ))}
      </div>
    </section>
  );
};

export default TestimonialsSection;