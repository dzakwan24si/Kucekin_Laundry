import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { authAPI } from "@/services/authAPI"; 

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const [dataForm, setDataForm] = useState({ fullname: "", email: "", password: "" });

  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setDataForm({ ...dataForm, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
        await authAPI.registerUser(dataForm);
        setSuccess("Pendaftaran berhasil! Mengalihkan ke halaman login...");
        
        setTimeout(() => {
            navigate("/login");
        }, 2000);
    } catch (err) {
        setError(err.message || "Terjadi kesalahan saat mendaftar.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center animate-fade-in">
      {/* Logo Area */}
      <div className="mb-2 text-center">
      <img
          src="/img/LogoKucekinVertical.png"
          alt="Logo Kucekin"
          className="h-14 w-auto object-contain"
        />
        <p className="text-[9px] tracking-[0.2em] text-gray-300 uppercase mt-1">
          Management System
        </p>
      </div>

      <h2 className="text-2xl font-bold text-white mt-8 mb-2 tracking-wide">REGISTER</h2>
      <p className="text-sm text-gray-300 mb-8 text-center">
        Daftarkan akun staf / kasir baru
      </p>

      {/* Pesan Error & Success */}
      {error && (
        <div className="w-full bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded-xl text-xs mb-5 flex items-center font-medium backdrop-blur-sm">
          <span className="mr-2">⚠️</span> {error}
        </div>
      )}
      {success && (
        <div className="w-full bg-green-500/20 border border-green-500/50 text-green-200 p-3 rounded-xl text-xs mb-5 flex items-center font-medium backdrop-blur-sm">
          <span className="mr-2">✅</span> {success}
        </div>
      )}

      {/* Form Register */}
      <form onSubmit={handleSubmit} className="w-full space-y-4">
        
        {/* Input Nama Lengkap */}
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-gray-200 pl-1">Nama Lengkap</label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} strokeWidth={2.5} />
            <input
              type="text"
              name="fullname"
              onChange={handleChange}
              required
              className="w-full pl-11 pr-4 py-3.5 bg-[#e2e2e2] text-gray-900 placeholder-gray-500 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-blue-500/30 transition-all font-medium"
              placeholder="Contoh: Budi Santoso"
            />
          </div>
        </div>

        {/* Input Email */}
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-gray-200 pl-1">Email</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} strokeWidth={2.5} />
            <input
              type="email"
              name="email"
              onChange={handleChange}
              required
              className="w-full pl-11 pr-4 py-3.5 bg-[#e2e2e2] text-gray-900 placeholder-gray-500 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-blue-500/30 transition-all font-medium"
              placeholder="budi@laundry.com"
            />
          </div>
        </div>

        {/* Input Password */}
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-gray-200 pl-1">Password</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} strokeWidth={2.5} />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              onChange={handleChange}
              required
              className="w-full pl-11 pr-12 py-3.5 bg-[#e2e2e2] text-gray-900 placeholder-gray-500 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-blue-500/30 transition-all font-medium"
              placeholder="Minimal 6 karakter"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800 transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Tombol Register */}
        <button
          type="submit"
          disabled={loading || success !== ""}
          className={`w-full py-4 mt-4 rounded-2xl text-sm font-bold tracking-wide transition-all ${
            loading 
              ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
              : "bg-blue-800 text-white shadow-lg shadow-blue-800/30 hover:-translate-y-0.5"
          }`}
        >
          {loading ? "Menyimpan Data..." : "Daftar Akun"}
        </button>

        {/* Link Kembali ke Login */}
        <p className="text-center text-xs text-gray-300 mt-6">
          Sudah punya akun? <Link to="/login" className="text-blue-400 font-bold hover:text-blue-300 transition-colors">Login di sini</Link>
        </p>
      </form>
    </div>
  );
}