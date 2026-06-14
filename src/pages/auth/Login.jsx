import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { authAPI } from "@/services/authAPI";

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Ubah username menjadi email untuk Supabase
  const [dataForm, setDataForm] = useState({ email: "", password: "" });

  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setDataForm({ ...dataForm, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Cek ke Supabase menggunakan authAPI
      const user = await authAPI.loginUser(dataForm.email, dataForm.password);

      // Simpan sesi
      localStorage.setItem("user", JSON.stringify(user));
      navigate("/admin");
    } catch (err) {
      setError(err.message || "Email atau password salah!");
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

      <h2 className="text-2xl font-bold text-white mt-8 mb-2 tracking-wide">
        LOGIN
      </h2>
      <p className="text-sm text-gray-300 mb-8 text-center">
        Semua urusan cucianmu, beres di satu tempat..!
      </p>

      {/* Pesan Error */}
      {error && (
        <div className="w-full bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded-xl text-xs mb-5 flex items-center font-medium backdrop-blur-sm">
          <span className="mr-2">⚠️</span> {error}
        </div>
      )}

      {/* Form Login */}
      <form onSubmit={handleSubmit} className="w-full space-y-5">
        {/* Input Email (Pengganti Username) */}
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-gray-200 pl-1">
            Email
          </label>
          <div className="relative">
            <Mail
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
              size={16}
              strokeWidth={2.5}
            />
            <input
              type="email"
              name="email"
              onChange={handleChange}
              required
              className="w-full pl-11 pr-4 py-3.5 bg-[#e2e2e2] text-gray-900 placeholder-gray-500 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-blue-500/30 transition-all font-medium"
              placeholder="Enter your Email"
            />
          </div>
        </div>

        {/* Input Password */}
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-gray-200 pl-1">
            Password
          </label>
          <div className="relative">
            <Lock
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
              size={16}
              strokeWidth={2.5}
            />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              onChange={handleChange}
              required
              className="w-full pl-11 pr-12 py-3.5 bg-[#e2e2e2] text-gray-900 placeholder-gray-500 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-blue-500/30 transition-all font-medium"
              placeholder="Enter your Password"
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

        {/* Remember Me & Forget Password */}
        <div className="flex items-center justify-between pt-2 px-1">
          <label className="flex items-center text-xs text-gray-300 hover:text-white cursor-pointer transition-colors">
            <input
              type="checkbox"
              className="mr-2 rounded-sm border-gray-400 bg-transparent"
            />
            Remember me
          </label>
          <a
            href="#"
            className="text-xs text-gray-300 hover:text-white transition-colors"
          >
            Forget Password?
          </a>
        </div>

        {/* Tombol Login */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-4 mt-2 rounded-2xl text-sm font-bold tracking-wide transition-all ${
            loading
              ? "bg-slate-700 text-slate-400 cursor-not-allowed"
              : "bg-blue-800 text-white shadow-lg shadow-blue-800/30 hover:-translate-y-0.5"
          }`}
        >
          {loading ? "Sedang Memproses..." : "Login"}
        </button>

        {/* Link Pendaftaran Karyawan Baru */}
        <p className="text-center text-xs text-gray-300 mt-6">
          Belum punya akun staf?{" "}
          <Link
            to="/register"
            className="text-blue-400 font-bold hover:text-blue-300 transition-colors"
          >
            Daftar di sini
          </Link>
        </p>
      </form>
    </div>
  );
}
