import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Droplet } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [dataForm, setDataForm] = useState({ username: "", password: "" });

  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setDataForm({ ...dataForm, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    axios.post("https://dummyjson.com/user/login", {
        username: dataForm.username,
        password: dataForm.password,
    })
    .then((response) => {
        if (response.status === 200) {
            navigate("/");
        }
    })
    .catch((err) => {
        setError(err.response?.data?.message || "Username atau password salah!");
    })
    .finally(() => {
        setLoading(false);
    });
  };

  return (
    <div className="animate-fade-in flex flex-col items-center">
      {/* Ikon Logo */}
      <div className="relative mb-5">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-400/40">
          <Droplet className="text-white fill-white" size={32} />
        </div>
        {/* Titik Hijau Status */}
        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></div>
      </div>

      {/* Teks Judul */}
      <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-1">
        Fresh<span className="text-blue-500">Laundry.</span>
      </h1>
      <p className="text-gray-500 text-xs mb-5 font-medium">Sistem Manajemen Laundry Modern</p>

      {/* Badge Status */}
      <div className="flex gap-2 mb-8">
        <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide">Admin Panel</span>
        <span className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide">v2.0</span>
      </div>

      {/* Pesan Error */}
      {error && (
        <div className="w-full bg-red-50 text-red-500 p-3 rounded-xl text-xs mb-5 border border-red-100 flex items-center font-semibold animate-fade-in">
          <span className="mr-2">⚠️</span> {error}
        </div>
      )}

      {/* Form Login */}
      <form onSubmit={handleSubmit} className="w-full space-y-5">
        {/* Input Username */}
        <div className="space-y-1.5">
          <label className="flex items-center text-xs font-bold text-blue-800">
            <Mail size={14} className="mr-1.5" /> Username
          </label>
          <input
            type="text"
            name="username"
            onChange={handleChange}
            required
            className="w-full px-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none"
            placeholder="Masukkan username (emilys)"
          />
        </div>

        {/* Input Password */}
        <div className="space-y-1.5">
          <label className="flex items-center text-xs font-bold text-blue-800">
            <Lock size={14} className="mr-1.5" /> Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              onChange={handleChange}
              required
              className="w-full pl-4 pr-12 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none"
              placeholder="•••••••• (emilyspass)"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-blue-600 transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Ceklis & Lupa Password */}
        <div className="flex items-center justify-between mt-2 px-1">
          <label className="flex items-center text-xs font-medium text-gray-500 cursor-pointer">
            <input type="checkbox" className="mr-2 rounded border-gray-300 text-blue-500 focus:ring-blue-500 w-3.5 h-3.5" />
            Ingat saya
          </label>
          <a href="#" className="text-xs font-bold text-blue-600 hover:underline">Lupa password?</a>
        </div>

        {/* Tombol Submit */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full text-white font-bold py-3.5 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 mt-2 ${
            loading ? 'bg-blue-400 cursor-not-allowed shadow-none' : 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 hover:-translate-y-0.5 shadow-blue-500/30'
          }`}
        >
          {loading ? "Memproses..." : <>Masuk Sekarang <ArrowRight size={18} /></>}
        </button>
      </form>

      {/* Link Daftar */}
      <p className="text-xs text-gray-500 mt-6 font-medium">
        Belum punya akun? <a href="#" className="text-blue-600 font-bold hover:underline">Daftar disini</a>
      </p>

      {/* Info Demo Login */}
      <div className="mt-8 w-full bg-blue-50/50 border border-blue-100 rounded-xl p-4">
        <div className="flex items-center gap-2 text-blue-800 text-xs font-bold mb-2">
          <span>📝</span> Demo Login:
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center text-xs text-gray-500">
            <span className="w-16">Username:</span>
            <code className="bg-white px-2 py-0.5 rounded text-blue-600 font-bold border border-blue-50 shadow-sm">emilys</code>
          </div>
          <div className="flex items-center text-xs text-gray-500">
            <span className="w-16">Password:</span>
            <code className="bg-white px-2 py-0.5 rounded text-blue-600 font-bold border border-blue-50 shadow-sm">emilyspass</code>
          </div>
        </div>
      </div>
    </div>
  );
}