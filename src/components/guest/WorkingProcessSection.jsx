import { motion } from 'framer-motion';

const workingProcess = [
  { icon: 'img/Jadwal.png', title: 'Jadwalkan', desc: 'Pesan online atau via telepon, pilih waktu penjemputan.' },
  { icon: 'img/delivery.png', title: 'Penjemputan', desc: 'Tim Kucekin menjemput cucian kotor langsung di depan pintu Anda.' },
  { icon: 'img/ahli.png', title: 'Pencucian Ahli', desc: 'Kami mencuci dengan deterjen premium dan teknik terbaik.' },
  { icon: 'img/packing.png', title: 'Pengantaran', desc: 'Pakaian diantar kembali dalam keadaan bersih, rapi, dan wangi.' },
];

// Variasi Animasi Framer Motion
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 } // Efek memunculkan kartu bergantian
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const WorkingProcessSection = () => {
  return (
    <section className="py-24 px-6 bg-slate-50/70 text-center relative overflow-hidden">
      {/* Dekorasi lingkaran cahaya samar di latar belakang */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 rounded-full bg-orange-500/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 rounded-full bg-slate-900/5 blur-3xl pointer-events-none" />

      {/* Judul Section */}
      <motion.h2 
        className="text-3xl md:text-4xl font-bold text-slate-900 mb-16 relative z-10 tracking-tight"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        Cara Kerja <span className="text-orange-500">Kucekin</span>
      </motion.h2>
      
      {/* Grid Konten */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto relative z-10"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
      >
        {workingProcess.map((step, idx) => (
          <motion.div 
            key={idx} 
            variants={cardVariants}
            whileHover={{ y: -8, scale: 1.02 }}
            className="bg-white rounded-2xl p-8 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)] transition-all duration-300 relative flex flex-col items-center group cursor-pointer"
          >
            {/* Lingkaran Angka Step (Floating Badge) */}
            <div className="absolute top-4 left-4 w-7 h-7 bg-orange-50 text-orange-600 rounded-full text-xs font-bold flex items-center justify-center border border-orange-100">
              {idx + 1}
            </div>

            {/* Lingkaran Wadah Ikon - Diperbarui menjadi pekat agar lebih premium */}
            <div className="w-20 h-20 rounded-full bg-slate-900 flex items-center justify-center mb-6 relative border-4 border-slate-50 shadow-inner group-hover:bg-slate-800 group-hover:scale-105 transition-all duration-300">
              <img 
                src={step.icon} 
                className="w-9 h-9 invert opacity-95 transition-transform duration-300 group-hover:rotate-6" 
                alt={step.title} 
              />
            </div>
            
            {/* Teks Deskripsi */}
            <h3 className="text-lg font-bold text-slate-900 mb-2.5 group-hover:text-orange-500 transition-colors">
              {step.title}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed text-center max-w-[210px]">
              {step.desc}
            </p>

            {/* Garis Panah Penghubung Antar Kartu (Hanya muncul di Layar Desktop) */}
            {idx < workingProcess.length - 1 && (
              <div className="hidden lg:block absolute top-1/3 -right-[18%] w-[30%] z-0 pointer-events-none opacity-40 group-hover:opacity-80 transition-opacity duration-300">
                <svg className="w-full h-2" preserveAspectRatio="none" viewBox="0 0 100 2">
                  <line x1="0" y1="1" x2="100" y2="1" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="5,5" />
                  <polygon points="96,0 100,1 96,2" fill="#94a3b8" />
                </svg>
              </div>
            )}
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default WorkingProcessSection;