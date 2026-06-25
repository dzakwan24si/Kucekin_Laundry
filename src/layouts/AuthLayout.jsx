import { Outlet, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function AuthLayout() {
  return (
    <div 
      className="min-h-screen flex items-center justify-center relative font-poppins"
      // TODO: Ganti URL di bawah ini dengan gambar background pilihanmu nanti
      style={{
        backgroundImage: 'url("https://img.magnific.com/free-photo/person-inside-laundromat-with-washing-machines_23-2151176219.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {/* Overlay hitam transparan agar tulisan tetap terbaca jika background terlalu terang */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Tombol Kembali ke Beranda */}
      <Link 
        to="/" 
        className="absolute top-6 left-6 md:top-8 md:left-8 z-20 flex items-center gap-2 text-white/70 hover:text-white font-medium transition-colors"
      >
        <ArrowLeft size={20} />
        Kembali ke Beranda
      </Link>

      {/* Glassmorphism Card (Efek Kaca) */}
      <div className="relative z-10 w-full max-w-[420px] p-8 md:p-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-[2rem] shadow-2xl">
        <Outlet />
      </div>
    </div>
  );
}