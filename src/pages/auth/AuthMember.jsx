import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { User, Phone, Lock, Sparkles, ArrowRight, CheckCircle2, Mail, Loader2, ArrowLeft } from "lucide-react";

import { authAPI } from "@/services/authAPI";

export default function AuthMember() {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const navigate = useNavigate();

  // State untuk form input
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    whatsapp: '',
    password: ''
  });

  // State untuk status loading dan error
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMsg(''); // Hilangkan error saat user mengetik
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
        if (isLoginMode) {
          // Eksekusi Login menggunakan authAPI
          const user = await authAPI.loginMember(formData.email, formData.password);
          
          // Simpan sesi login ke localStorage
          localStorage.setItem('user', JSON.stringify(user));
          
          // Arahkan ke dasbor member
          navigate('/member');
  
        } else {
          // Eksekusi Register menggunakan authAPI
          const user = await authAPI.registerMember({
            fullname: formData.fullname,
            email: formData.email,
            password: formData.password,
            whatsapp: formData.whatsapp
          });
          
          // Auto-login setelah register sukses
          localStorage.setItem('user', JSON.stringify(user));
          navigate('/member');
        }
      } catch (error) {
        // Tangkap pesan error dari throw new Error() di authAPI.js
        setErrorMsg(error.message);
      } finally {
        setIsLoading(false);
      }
    };  

  const formVariants = {
    hidden: { opacity: 0, x: isLoginMode ? -30 : 30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } },
    exit: { opacity: 0, x: isLoginMode ? 30 : -30, transition: { duration: 0.3 } }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans selection:bg-orange-500 selection:text-white">
      
      {/* SISI KIRI: VISUAL & MARKETING */}
      <div 
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-16"
        style={{
          backgroundImage: 'url("https://i.ibb.co.com/h1YKRM6L/laundry.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Overlay Gelap */}
        <div className="absolute inset-0 bg-slate-900/85"></div>
        
        {/* Tombol Kembali (Desktop) */}
        <Link to="/" className="absolute top-8 left-8 z-20 flex items-center gap-2 text-slate-400 hover:text-white font-medium transition-colors">
          <ArrowLeft size={20} />
          Kembali ke Beranda
        </Link>

        <div className="relative z-10 flex items-center gap-3 mt-8">
          <div className="bg-white p-3 md:p-4 rounded-2xl shadow-xl shadow-black/20 border border-white/20 inline-block">
            <img
              src="/img/LogoKucekinVertical.png"
              alt="Logo Kucekin"
              className="h-14 md:h-16 w-auto object-contain"
            />
          </div>
        </div>

        <div className="relative z-10">
          <motion.div
            key={isLoginMode ? "login-text" : "register-text"}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-orange-400 font-bold tracking-widest uppercase text-sm mb-4 flex items-center gap-2">
              <Sparkles size={16} /> Customer Portal
            </p>
            <h1 className="text-6xl xl:text-7xl font-black text-white leading-[1.1] tracking-tighter mb-6">
              {isLoginMode ? <><span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">Cucian Beres.</span><br/>Poin Ngalir.</> : <><span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">Gabung Sekarang.</span><br/>Nikmati Bebasnya.</>}
            </h1>
            <p className="text-slate-400 text-lg font-medium max-w-md leading-relaxed">
              {isLoginMode ? "Masuk ke akun Anda untuk melacak cucian, menukar poin loyalitas, dan menikmati promo eksklusif." : "Daftar dalam 30 detik. Dapatkan 50 Poin Kucekin pertama Anda sebagai hadiah selamat datang!"}
            </p>
          </motion.div>

          {!isLoginMode && (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-10 space-y-4">
               {['Gratis antar-jemput untuk pesanan pertama', 'Kumpulkan poin di setiap transaksi', 'Prioritas layanan cuci kilat'].map((benefit, i) => (
                 <div key={i} className="flex items-center gap-3 text-slate-300 font-medium">
                   <div className="w-6 h-6 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0">
                     <CheckCircle2 size={14} />
                   </div>
                   {benefit}
                 </div>
               ))}
             </motion.div>
          )}
        </div>
      </div>

      {/* SISI KANAN: FORMULIR OTENTIKASI */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 md:p-16 relative">
        <Link to="/" className="absolute top-6 left-6 lg:hidden flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors">
          <ArrowLeft size={18} />
          Kembali ke Beranda
        </Link>

        <div className="w-full max-w-md">
          <AnimatePresence mode="wait">
            <motion.div
              key={isLoginMode ? "login-form" : "register-form"}
              variants={formVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 relative overflow-hidden"
            >
              
              {/* Indikator Loading */}
              {isLoading && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center rounded-[2.5rem]">
                  <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
                </div>
              )}

              <div className="mb-8">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
                  {isLoginMode ? "Selamat Datang! 👋" : "Buat Akun Baru ✨"}
                </h2>
                <p className="text-slate-500 font-medium text-sm">
                  {isLoginMode ? "Silakan masukkan detail akun Anda." : "Hanya butuh beberapa detik untuk bergabung."}
                </p>
              </div>

              {/* Tampilkan Pesan Error jika ada */}
              {errorMsg && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm font-bold rounded-2xl flex items-center gap-2">
                   <div className="w-1.5 h-1.5 bg-red-600 rounded-full"></div> {errorMsg}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                
                {!isLoginMode && (
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Nama Lengkap</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <User size={18} className="text-slate-400" />
                      </div>
                      <input 
                        type="text" 
                        name="fullname"
                        value={formData.fullname}
                        onChange={handleInputChange}
                        required={!isLoginMode}
                        placeholder="Dzakwan Syafiq"
                        className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 focus:bg-white focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none transition-colors"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Alamat Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail size={18} className="text-slate-400" />
                    </div>
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required 
                      placeholder="email@anda.com"
                      className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 focus:bg-white focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none transition-colors"
                    />
                  </div>
                </div>

                {!isLoginMode && (
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Nomor WhatsApp</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Phone size={18} className="text-slate-400" />
                      </div>
                      <input 
                        type="tel" 
                        name="whatsapp"
                        value={formData.whatsapp}
                        onChange={handleInputChange}
                        required={!isLoginMode}
                        placeholder="081234567890"
                        className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 focus:bg-white focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none transition-colors"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">Kata Sandi</label>
                    {isLoginMode && (
                      <a href="#" className="text-xs font-bold text-orange-500 hover:text-orange-600">Lupa sandi?</a>
                    )}
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock size={18} className="text-slate-400" />
                    </div>
                    <input 
                      type="password" 
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required 
                      placeholder="••••••••"
                      className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 focus:bg-white focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none transition-colors"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-slate-900 hover:bg-orange-500 text-white font-black rounded-2xl py-4 mt-4 flex items-center justify-center gap-2 transition-all transform active:scale-95 group shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoginMode ? "Masuk ke Dasbor" : "Daftar & Klaim Poin"}
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </form>

              <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                <p className="text-sm font-medium text-slate-500">
                  {isLoginMode ? "Belum punya akun?" : "Sudah menjadi member?"}{" "}
                  <button 
                    onClick={() => {
                      setIsLoginMode(!isLoginMode);
                      setErrorMsg(''); // Bersihkan error saat ganti mode
                    }}
                    className="font-black text-slate-900 hover:text-orange-500 transition-colors"
                  >
                    {isLoginMode ? "Daftar sekarang" : "Masuk di sini"}
                  </button>
                </p>
              </div>

            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}