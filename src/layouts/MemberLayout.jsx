import { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Bell, Menu, X, Star, User, LogOut, ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Import komponen Shadcn yang baru saja di-install
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useNotifications } from "../hooks/useNotifications";

// Import API
import { authAPI } from "../services/authAPI";

export default function MemberLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // State untuk menyimpan data Navbar dinamis
  const [memberData, setMemberData] = useState({
    id: null,
    nama: "Loading...",
    poin: 0,
    tier: "Bronze"
  });

  // State notifikasi
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications(memberData.id, "member");

  // Tarik data saat komponen dimuat
  useEffect(() => {
    const fetchNavbarData = async () => {
      try {
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const user = JSON.parse(userStr);
          const profile = await authAPI.getMemberProfile(user.id);

          setMemberData({
            id: user.id,
            nama: user.fullname,
            poin: profile.poin || 0,
            tier: profile.tier || "Bronze"
          });
        }
      } catch (error) {
        console.error("Gagal mengambil data navbar:", error);
      }
    };

    fetchNavbarData();
  }, []);

  // Fungsi Pembuat Inisial Otomatis (Maksimal 2 huruf)
  const getInitials = (name) => {
    if (!name || name === "Loading...") return "⏳";
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  // Fungsi Logout Eksekusi
  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const navLinks = [
    { name: "Dasbor", path: "/member" },
    { name: "Pesanan", path: "/member/pesanan" },
    { name: "Promo", path: "/member/promo" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-orange-500 selection:text-white">
      
      {/* KAPSUL NAVIGASI MENGAMBANG (FLOATING PILL NAVBAR) */}
      <div className="pt-6 px-4 md:px-8 max-w-6xl mx-auto sticky top-0 z-50">
        <nav className="bg-white/70 backdrop-blur-xl border border-white rounded-full px-3 py-2.5 flex items-center justify-between shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          
          {/* KIRI: Logo Minimalis */}
          <Link to="/member" className="flex items-center gap-2 pl-2">
          <img
                src="/img/LogoKucekinVertical.png"
                alt="Logo Kucekin"
                className="h-10 w-auto object-contain"
              />
          </Link>

          {/* TENGAH: Menu Desktop dengan Animasi Kapsul */}
          <div className="hidden md:flex items-center gap-1 bg-slate-100/50 p-1 rounded-full border border-slate-200/50">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`relative px-6 py-2 rounded-full text-sm font-bold transition-colors z-10 ${
                    isActive ? "text-white" : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  {isActive && (
                    <motion.div 
                      layoutId="navPill" 
                      className="absolute inset-0 bg-slate-900 rounded-full -z-10 shadow-sm"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* KANAN: Poin & Profil */}
          <div className="flex items-center gap-3 pr-1 shrink-0">
            
            {/* Indikator Poin (Dinamis dari Supabase) */}
            <Link to="/member/promo" className="hidden sm:flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 hover:border-orange-200 rounded-full transition-colors group">
              <Star size={16} className="text-orange-400 fill-orange-400 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-bold text-slate-900">{memberData.poin} pt</span>
            </Link>

            {/* Tombol Notifikasi */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="w-10 h-10 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors relative outline-none">
                  <Bell size={18} />
                  {unreadCount > 0 && (
                    <span className="absolute top-2 right-2.5 flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-500 border border-white"></span>
                    </span>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 font-poppins rounded-xl p-0 overflow-hidden border border-gray-100 shadow-xl z-50">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-slate-50/50">
                  <span className="font-bold text-slate-800 text-sm">Notifikasi</span>
                  {unreadCount > 0 && (
                    <button onClick={markAllAsRead} className="text-xs font-semibold text-orange-500 hover:text-orange-600 flex items-center gap-1 transition-colors">
                      <Check size={14} /> Tandai dibaca
                    </button>
                  )}
                </div>
                <div className="max-h-[350px] overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((notif) => (
                      <div 
                        key={notif.id} 
                        onClick={() => markAsRead(notif.id)}
                        className={`p-4 border-b border-slate-50 cursor-pointer transition-colors hover:bg-slate-50 ${!notif.is_read ? 'bg-orange-50/30' : ''}`}
                      >
                        <div className="flex justify-between items-start mb-1 gap-2">
                          <span className={`text-sm font-bold leading-tight ${!notif.is_read ? 'text-slate-900' : 'text-slate-700'}`}>{notif.title}</span>
                          {!notif.is_read && <span className="w-2 h-2 rounded-full bg-orange-500 mt-1 shrink-0 shadow-sm"></span>}
                        </div>
                        <p className={`text-xs mb-2 leading-relaxed ${!notif.is_read ? 'text-slate-600' : 'text-slate-500'}`}>{notif.message}</p>
                        <span className="text-[10px] font-medium text-slate-400">{new Date(notif.created_at).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })}</span>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center flex flex-col items-center justify-center">
                      <Bell size={24} className="text-slate-300 mb-2" />
                      <span className="text-slate-400 text-sm font-medium">Belum ada notifikasi</span>
                    </div>
                  )}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Dropdown Profil Minimalis */}
            <div className="relative">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 p-1 pr-3 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors border border-transparent"
              >
                {/* Inisial Profil Dinamis */}
                <div className="w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center text-white font-bold text-xs tracking-wider">
                  {getInitials(memberData.nama)}
                </div>
                <ChevronDown size={14} className="text-slate-500" />
              </button>

              {/* Isi Dropdown Extreme Rounded */}
              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-3 w-56 bg-white/90 backdrop-blur-xl rounded-[2rem] shadow-2xl border border-white p-3"
                  >
                    <div className="px-4 py-3 bg-slate-50 rounded-2xl mb-2 border border-slate-100">
                      {/* Nama dan Tier Dinamis */}
                      <p className="text-sm font-black text-slate-900 truncate">{memberData.nama}</p>
                      <p className="text-xs font-bold text-slate-400 mt-0.5">Member {memberData.tier}</p>
                    </div>
                    <Link 
                      to="/member/profil" 
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                    >
                      <User size={16} /> Kelola Profil
                    </Link>
                    
                    {/* Tombol Logout Berfungsi */}
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-colors mt-1"
                    >
                      <LogOut size={16} /> Keluar Akses
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Hamburger Mobile */}
            <button 
              className="md:hidden w-10 h-10 flex items-center justify-center text-slate-900 bg-slate-100 rounded-full" 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

        </nav>

        {/* MENU MOBILE EKSKLUSIF */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="md:hidden absolute top-20 left-4 right-4 bg-white/90 backdrop-blur-2xl rounded-[2rem] p-5 shadow-2xl border border-white"
            >
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center bg-orange-50 p-4 rounded-2xl mb-2">
                  <span className="font-bold text-slate-900 text-sm">Saldo Poin</span>
                  <div className="flex items-center gap-1.5 font-black text-orange-500">
                    <Star size={16} className="fill-orange-500" /> {memberData.poin} pt
                  </div>
                </div>
                {navLinks.map((link) => {
                   const isActive = location.pathname === link.path;
                   return (
                    <Link
                      key={link.name}
                      to={link.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`font-bold p-4 rounded-2xl transition-colors ${isActive ? "bg-slate-900 text-white" : "bg-slate-50 text-slate-500"}`}
                    >
                      {link.name}
                    </Link>
                   )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* KONTEN HALAMAN UTAMA */}
      <main className="max-w-6xl mx-auto px-4 md:px-8 py-6">
        <Outlet />
      </main>

    </div>
  );
}