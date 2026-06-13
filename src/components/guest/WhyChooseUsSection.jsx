import { motion } from 'framer-motion';

const whyChooseUsData = [
  { label: 'Keahlian & Pengalaman', icon: '🌟' }, 
  { label: 'Kualitas Terjamin', icon: '✨' },                
  { label: 'Tepat Waktu', icon: '⏱️' },
  { label: 'Kepuasan Pelanggan', icon: '🤝' },
  { label: 'Sangat Praktis', icon: '💡' },
  { label: 'Harga Transparan', icon: '💰' },
  { label: 'Perawatan Personal', icon: '🧼' },
  { label: 'Bebas Ribet', icon: '🚚' },
];

const WhyChooseUsSection = () => {
  const totalItems = whyChooseUsData.length;
  // Jarak seberapa jauh lintasan orbit dari tengah (dalam px)
  const radiusDesktop = 280; 
  const radiusMobile = 160; 

  return (
    <section className="py-28 px-6 bg-slate-50 text-center relative overflow-hidden min-h-[700px] lg:min-h-[850px] flex flex-col items-center justify-center">
      
      {/* CSS Khusus agar posisi orbit 100% akurat dan responsif */}
      <style>{`
        .orbit-item {
          transform: translate(var(--x-mob), var(--y-mob));
        }
        @media (min-width: 1024px) {
          .orbit-item {
            transform: translate(var(--x-desk), var(--y-desk));
          }
        }
      `}</style>

      {/* Teks Judul */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="relative z-20 mb-10 lg:mb-0"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
          Mengapa Memilih <span className="text-orange-500">Kucekin?</span>
        </h2>
        <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
          Kami mendefinisikan ulang standar kebersihan dan kenyamanan untuk pakaian Anda.
        </p>
      </motion.div>

      {/* AREA ORBIT UTAMA */}
      <div className="relative flex items-center justify-center w-full h-[500px] lg:h-[650px] scale-[0.85] sm:scale-100 transition-transform mt-10">
        
        {/* Gambar Pusat (Matahari) */}
        <motion.div
          className="absolute z-10 w-48 h-48 lg:w-64 lg:h-64 rounded-full bg-white shadow-2xl border-4 border-white overflow-hidden p-3 flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <img
            src="https://image.qwenlm.ai/public_source/ccc69bcd-f31d-4286-9fe8-970f55530d23/1d7b8fc88-c630-4d25-9776-7869afedd9e9.png"
            alt="Mengapa memilih Kucekin"
            className="w-full h-full object-cover rounded-full"
          />
        </motion.div>

        {/* Garis Lintasan Dashed di belakang */}
        <div className="absolute w-[320px] h-[320px] lg:w-[560px] lg:h-[560px] rounded-full border-2 border-dashed border-slate-300 z-0" />

        {/* Wadah yang Terus Berputar */}
        <motion.div
          className="absolute w-full h-full flex items-center justify-center z-20"
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }} 
        >
          {whyChooseUsData.map((item, index) => {
            // Rumus Matematika menentukan Titik X dan Y Lingkaran
            const angle = (index / totalItems) * 2 * Math.PI - Math.PI / 2;
            const xDesk = Math.cos(angle) * radiusDesktop;
            const yDesk = Math.sin(angle) * radiusDesktop;
            const xMob = Math.cos(angle) * radiusMobile;
            const yMob = Math.sin(angle) * radiusMobile;

            return (
              <div
                key={index}
                className="absolute flex items-center justify-center"
                style={{
                  '--x-desk': `${xDesk}px`,
                  '--y-desk': `${yDesk}px`,
                  '--x-mob': `${xMob}px`,
                  '--y-mob': `${yMob}px`,
                }}
              >
                {/* Pembungkus yang membaca CSS orbit-item di atas */}
                <div className="absolute orbit-item">
                  
                  {/* Bubble yang diputar kebalikan arah agar teks tetap tegak */}
                  <motion.div
                    className={`
                      relative flex flex-col items-center justify-center text-center p-3 w-28 h-28 lg:w-36 lg:h-36 rounded-full shadow-lg border-4 border-white transition-all
                      ${index % 2 === 0 ? 'bg-white text-slate-700' : 'bg-slate-900 text-white'}
                    `}
                    animate={{ rotate: -360 }}
                    transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                    whileHover={{ scale: 1.15 }}
                  >
                    <div className="text-2xl lg:text-3xl mb-1">{item.icon}</div>
                    <span className="text-[10px] lg:text-xs font-semibold leading-tight px-2">
                      {item.label}
                    </span>
                    
                    {/* Hiasan titik kecil di pinggir bubble */}
                    <div className={`absolute top-0 right-0 w-4 h-4 rounded-full ${index % 2 === 0 ? 'bg-orange-400' : 'bg-slate-500'}`} />
                  </motion.div>

                </div>
              </div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
};

export default WhyChooseUsSection;