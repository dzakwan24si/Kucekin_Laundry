import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Phone, MapPin, ShieldCheck, Mail, Loader2, CheckCircle2 } from "lucide-react";

// Import API
import { authAPI } from "@/services/authAPI";

export default function ProfilMember() {
  const [userId, setUserId] = useState(null);
  const [email, setEmail] = useState("");
  
  // State untuk form
  const [formData, setFormData] = useState({
    fullname: "",
    whatsapp: "",
    alamat: ""
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // Tarik data profil saat halaman dimuat
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const user = JSON.parse(userStr);
          setUserId(user.id);
          setEmail(user.email); // Email tidak bisa diubah (read-only)
          
          const profile = await authAPI.getMemberProfile(user.id);
          
          setFormData({
            fullname: user.fullname,
            whatsapp: profile.whatsapp || "",
            alamat: profile.alamat || ""
          });
        }
      } catch (error) {
        console.error("Gagal menarik data profil:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Eksekusi Update Profil
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMsg("");

    try {
      // Panggil API untuk update ke Supabase
      await authAPI.updateMemberProfile(userId, formData.fullname, {
        whatsapp: formData.whatsapp,
        alamat: formData.alamat
      });

      // Update sesi localStorage agar Navbar ikut berubah namanya
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        user.fullname = formData.fullname; // Timpa nama lama dengan nama baru
        localStorage.setItem('user', JSON.stringify(user));
      }

      setSuccessMsg("Profil berhasil diperbarui!");
      // Hilangkan pesan sukses setelah 3 detik
      setTimeout(() => setSuccessMsg(""), 3000);

    } catch (error) {
      console.error("Gagal memperbarui profil:", error);
      alert("Terjadi kesalahan saat menyimpan profil.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="min-h-[50vh] flex items-center justify-center text-slate-400 font-bold animate-pulse">Memuat Data Profil...</div>;
  }

  return (
    <div className="space-y-8 animate-fade-in pb-12 w-full pt-4">
      
      {/* HEADER HALAMAN */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-slate-500 font-medium tracking-wide text-sm mb-2 uppercase">Pengaturan Akun</p>
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-none mb-2">
          Profil Saya
        </h1>
        <p className="text-slate-500">Pastikan alamat Anda akurat agar kurir mudah menemukan lokasi penjemputan.</p>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* BAGIAN KIRI: Form Edit Profil */}
        <div className="flex-1">
          <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-slate-100 relative overflow-hidden">
            
            {/* Dekorasi Latar Belakang */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-50 rounded-full blur-3xl -z-10 opacity-60 translate-x-1/2 -translate-y-1/2"></div>

            {successMsg && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 text-sm font-bold rounded-2xl flex items-center gap-2">
                <CheckCircle2 size={18} className="text-green-500" /> {successMsg}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Field Read-Only (Email) */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Alamat Email (Tidak dapat diubah)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Mail size={18} className="text-slate-400" /></div>
                  <input type="email" value={email} disabled className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 text-sm font-semibold cursor-not-allowed" />
                </div>
              </div>

              {/* Field Editable */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Nama Lengkap</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><User size={18} className="text-slate-400" /></div>
                    <input 
                      type="text" required
                      value={formData.fullname}
                      onChange={(e) => setFormData({...formData, fullname: e.target.value})}
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-slate-900 text-sm font-semibold transition-colors" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Nomor WhatsApp</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Phone size={18} className="text-slate-400" /></div>
                    <input 
                      type="tel" required
                      value={formData.whatsapp}
                      onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-slate-900 text-sm font-semibold transition-colors" 
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Alamat Utama (Default Penjemputan)</label>
                <div className="relative">
                  <div className="absolute top-4 left-0 pl-4 flex items-start pointer-events-none"><MapPin size={18} className="text-slate-400" /></div>
                  <textarea 
                    rows="4" required
                    value={formData.alamat}
                    onChange={(e) => setFormData({...formData, alamat: e.target.value})}
                    placeholder="Contoh: Perumahan Indah Permai Blok B No. 12, RT 01/RW 02, Kec. Rumbai..."
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-slate-900 text-sm font-semibold transition-colors resize-y" 
                  ></textarea>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="px-8 py-4 bg-slate-900 hover:bg-orange-500 text-white font-bold rounded-2xl transition-all shadow-lg active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSubmitting ? <><Loader2 className="w-5 h-5 animate-spin" /> Menyimpan...</> : "Simpan Perubahan"}
                </button>
              </div>

            </form>
          </div>
        </div>

        {/* BAGIAN KANAN: Panel Informasi Keamanan */}
        <div className="w-full lg:w-[320px]">
          <div className="bg-slate-900 text-white p-8 rounded-[2rem] shadow-xl sticky top-24">
            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-6">
              <ShieldCheck size={24} className="text-orange-400" />
            </div>
            <h3 className="text-xl font-bold mb-3">Privasi & Keamanan</h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-6">
              Data Anda dienkripsi dan disimpan dengan aman menggunakan infrastruktur Supabase. Kami tidak akan pernah membagikan nomor telepon atau alamat Anda kepada pihak ketiga.
            </p>
            <div className="space-y-4 pt-6 border-t border-slate-700/50">
              <div className="flex items-center gap-3 text-sm font-medium text-slate-300">
                <CheckCircle2 size={16} className="text-green-400" /> Verifikasi Email
              </div>
              <div className="flex items-center gap-3 text-sm font-medium text-slate-300">
                <CheckCircle2 size={16} className="text-green-400" /> Enkripsi Password End-to-End
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}