import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  // Menangani efek transparan berubah jadi putih padat saat scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fungsi pintar untuk Scroll ke Bagian Tertentu (Support antar-halaman)
  const scrollToSection = (sectionId) => {
    setIsMobileMenuOpen(false); // Tutup menu mobile jika terbuka

    // Jika tidak di beranda, pindah ke beranda dulu, lalu scroll
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) element.scrollIntoView({ behavior: "smooth" });
      }, 100); // Beri waktu halaman beranda render
    } else {
      // Jika sudah di beranda, langsung scroll
      const element = document.getElementById(sectionId);
      if (element) element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    // Wadah terluar fixed yang merentang penuh
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "py-2.5" : "py-6" // Beri sedikit margin atas agar desain melayang terlihat
      }`}
    >
      <div className="max-w-6xl px-6 mx-auto">
        {/* === DESAIN LENGKUNG INTI (KAPSUL NAVIGASI) === */}
        {/* Mengembalikan total desain dari uploaded:Navbar.jsx */}
        <div
          className={`transition-all duration-300 w-full rounded-full border flex items-center justify-between px-6 py-3.5 shadow-lg ${
            isScrolled
              ? "bg-white shadow-slate-200"
              : "bg-white/80 backdrop-blur-md border-slate-100 shadow-slate-100"
          }`}
        >
          {/* === KIRI: LOGO (Kembali menggunakan GAMBAR) === */}
          <Link
            to="/"
            className="flex items-center group cursor-pointer shrink-0"
          >
            {/* Wadah gambar dengan transisi interaktif asli */}
            <div className="group-hover:scale-105 group-hover:rotate-3 transition-transform duration-300">
              <img
                src="/img/LogoKucekinVertical.png"
                alt="Logo Kucekin"
                className="h-10 w-auto object-contain"
              />
            </div>
          </Link>

          {/* === TENGAH: DESKTOP MENU (Menyesuaikan rute dan scroll fungsi) === */}
          <div className="hidden lg:flex items-center gap-7">
            {/* Teks Beranda (Link Halaman Utama) */}
            <Link
              to="/"
              className={`text-[13px] font-semibold transition-colors hover:text-orange-500 ${
                location.pathname === "/" ? "text-slate-900" : "text-slate-500"
              }`}
            >
              Beranda
            </Link>

            {/* Tombol yang memicu fungsi smooth scroll pintar */}
            <button
              onClick={() => scrollToSection("layanan")}
              className="text-[13px] font-semibold text-slate-500 hover:text-orange-500 transition-colors"
            >
              Layanan
            </button>

            <button
              onClick={() => scrollToSection("testimoni")} // Asumsi ID testimoni di landing page adalah #testimoni
              className="text-[13px] font-semibold text-slate-500 hover:text-orange-500 transition-colors"
            >
              Testimonial
            </button>

            <button
              onClick={() => scrollToSection("kontak")} // Asumsi ID kontak di landing page adalah #kontak
              className="text-[13px] font-semibold text-slate-500 hover:text-orange-500 transition-colors"
            >
              Kontak
            </button>

            {/* Teks Cek Status (Link Halaman /status) */}
            <Link
              to="/status"
              className={`text-[13px] font-semibold transition-colors hover:text-orange-500 ${
                location.pathname === "/status"
                  ? "text-slate-900"
                  : "text-slate-500"
              }`}
            >
              Cek Status
            </Link>
          </div>

          {/* === KANAN: ACTION BUTTONS === */}
          <div className="hidden lg:flex items-center gap-4 shrink-0">
            <Link
              to="/login"
              className="text-[13px] font-semibold text-slate-600 hover:text-orange-500 transition-colors"
            >
              Masuk
            </Link>
            <Link
              to="/pesan"
              className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-full text-xs font-bold transition-all shadow-md flex items-center gap-2 group"
            >
              Pesan Sekarang
              <svg
                className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                ></path>
              </svg>
            </Link>
          </div>

          {/* === TOMBOL HAMBURGER (MOBILE) === */}
          <button
            className="lg:hidden text-slate-900 p-2 focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* === DROPDOWN MOBILE MENU === */}
      {/* Kode menu mobile disesuaikan agar interaksi scroll tetap berjalan */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="lg:hidden bg-white/95 backdrop-blur-xl border-b border-slate-100 overflow-hidden shadow-xl absolute w-[90%] left-[5%] right-[5%] mt-4 rounded-3xl"
          >
            <div className="px-7 py-6 flex flex-col gap-5">
              <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-slate-700 font-semibold hover:text-orange-500"
              >
                Beranda
              </Link>
              <button
                onClick={() => scrollToSection("layanan")}
                className="text-left text-slate-700 font-semibold hover:text-orange-500"
              >
                Layanan
              </button>
              <button
                onClick={() => scrollToSection("testimoni")}
                className="text-left text-slate-700 font-semibold hover:text-orange-500"
              >
                Testimonial
              </button>
              <button
                onClick={() => scrollToSection("kontak")}
                className="text-left text-slate-700 font-semibold hover:text-orange-500"
              >
                Kontak
              </button>
              <Link
                to="/status"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-slate-700 font-semibold hover:text-orange-500"
              >
                Cek Status
              </Link>
              <hr className="border-slate-100 my-1" />
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-slate-500 font-medium hover:text-slate-900 text-sm"
              >
                Masuk / Admin
              </Link>
              <Link
                to="/pesan"
                onClick={() => setIsMobileMenuOpen(false)}
                className="bg-orange-500 hover:bg-orange-600 text-white text-center py-3.5 rounded-xl font-bold shadow-md transition-colors"
              >
                Pesan Sekarang
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
