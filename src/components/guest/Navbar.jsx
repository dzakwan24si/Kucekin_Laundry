import { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [mobileMenu, setMobileMenu] = useState(false);

  return (
    <nav className="fixed top-4 left-4 right-4 max-w-6xl mx-auto z-50 bg-white/90 backdrop-blur-md shadow-md border border-slate-100 rounded-full px-6 md:px-8 h-16 flex items-center justify-between">
      
      {/* KIRI: Logo yang sudah menyatu dengan teks nama */}
      <Link to="/" className="flex items-center">
        <img 
          src="/public/img/LogoKucekinVertical.png"
          alt="Logo Kucekin" 
          className="h-10 w-auto object-contain" 
        />
      </Link>

      {/* TENGAH: Desktop Menu */}
      <div className="hidden md:flex items-center gap-8">
        {['Beranda', 'Layanan', 'Harga', 'Lokasi', 'Blog'].map((item) => (
          <a
            key={item}
            href={`#${item.toLowerCase()}`}
            className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
          >
            {item}
          </a>
        ))}
      </div>

      {/* KANAN: Tombol Masuk ke Halaman Login */}
      <Link 
        to="/login" 
        className="hidden md:block bg-slate-900 hover:bg-slate-800 text-white rounded-full px-6 py-2 text-sm font-semibold transition-all text-center shadow-sm"
      >
        Masuk
      </Link>

      {/* Mobile Menu Toggle */}
      <button
        className="md:hidden p-2 text-slate-900"
        onClick={() => setMobileMenu(!mobileMenu)}
      >
        {mobileMenu ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
        )}
      </button>

      {/* Mobile Nav Dropdown */}
      {mobileMenu && (
        <div className="absolute top-20 left-0 right-0 bg-white/95 backdrop-blur-md shadow-lg p-6 flex flex-col gap-4 md:hidden border border-slate-100 rounded-3xl mx-2">
          {['Beranda', 'Layanan', 'Harga', 'Lokasi', 'Blog'].map((item) => (
            <a 
              key={item} 
              href={`#${item.toLowerCase()}`} 
              onClick={() => setMobileMenu(false)}
              className="text-slate-700 font-medium py-1 px-3 hover:bg-slate-50 rounded-xl transition-colors"
            >
              {item}
            </a>
          ))}
          <Link 
            to="/login"
            onClick={() => setMobileMenu(false)}
            className="bg-slate-900 text-white rounded-full px-6 py-2.5 text-sm font-semibold mt-2 text-center shadow-sm"
          >
            Masuk
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;