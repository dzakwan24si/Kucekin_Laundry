import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-gray-50 to-white pt-28 pb-16 px-6 overflow-hidden">
      {/* Kontainer Flex Utama: Membungkus bagian Kiri dan Kanan */}
      <div className="max-w-6xl w-full flex flex-col md:flex-row items-center gap-10 relative z-10">
        {/* === BAGIAN KIRI (Teks, Tombol, dan Rating) === */}
        <motion.div
          className="flex-1 text-center md:text-left"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight mb-4">
            Sederhanakan Hidup Anda
            <br />
            bersama <span className="text-blue-500">Kucek.in</span>
            <br />
            <span className="text-orange-500">Laundry Service</span>
          </h1>
          <p className="text-slate-500 text-sm md:text-base leading-relaxed mb-8 max-w-md mx-auto md:mx-0">
            Selama lebih dari 5 tahun, kami berdedikasi untuk memberikan layanan
            pelanggan yang luar biasa serta kualitas laundry dan cuci kering
            terbaik.
          </p>

          {/* Tombol Aksi */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-8">
            <Link
              to="/login"
              className="bg-slate-900 hover:bg-slate-800 text-white rounded-full px-7 py-3.5 text-sm font-semibold flex items-center gap-2 transition-all shadow-md"
            >
              Mulai Sekarang
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle
                  cx="8"
                  cy="8"
                  r="7"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M7 12l4-4-4-4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
            <Link 
              to="https://youtu.be/-mBhxutgUlM?si=eE3xlTjW8Nn0qaYW"
              className="bg-transparent text-slate-700 border-2 border-slate-200 hover:border-orange-500 rounded-full px-7 py-3 text-sm font-semibold flex items-center gap-2 transition-all"
              target="_blank"
              >
                Lihat Cara Kerja
                <svg width="16" height="16" viewBox="0 0 16 16" fill="#FF9500">
                <polygon points="4,2 14,8 4,14" />
              </svg>
            </Link>
          </div>

          {/* Rating Section (Sekarang berada di DALAM blok animasi kiri) */}
          <div className="flex items-center justify-center md:justify-start gap-4">
            <div className="flex -space-x-2">
              {["A", "B", "C", "D"].map((letter, i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full border-2 border-white bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-xs text-white font-bold shadow-sm"
                >
                  {letter}
                </div>
              ))}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base text-slate-900">4.8</span>
                <div className="flex gap-0.5 text-orange-500">
                  {"★★★★★".split("").map((star, i) => (
                    <span key={i}>{star}</span>
                  ))}
                </div>
              </div>
              <span className="text-xs text-slate-500 font-medium">
                150k+ Total Review
              </span>
            </div>
          </div>
        </motion.div>

        {/* === BAGIAN KANAN (Gambar) === */}
        {/* Sekarang berada di DALAM flex container utama */}
        <motion.div
          className="flex-1 flex justify-center relative mt-10 md:mt-0"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
        >
          <img
            src="https://image.qwenlm.ai/public_source/ccc69bcd-f31d-4286-9fe8-970f55530d23/112b8097e-32e7-4fe1-b504-232c14b22197.png"
            alt="Kucekin Laundry Service"
            className="max-w-full h-auto max-h-[450px] object-contain rounded-2xl"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
