import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-100 font-poppins relative overflow-hidden p-4">
      {/* Efek Cahaya Blur di Background */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-blue-200/50 rounded-full blur-3xl mix-blend-multiply animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-200/50 rounded-full blur-3xl mix-blend-multiply animate-pulse delay-1000"></div>

      {/* Dekorasi Tetesan Air & Bintang Melayang */}
      <div className="absolute top-1/4 right-1/4 w-8 h-12 bg-gradient-to-b from-blue-300 to-cyan-300 rounded-t-full rounded-b-full opacity-60 rotate-12 drop-shadow-lg blur-[1px]"></div>
      <div className="absolute bottom-1/3 left-1/4 w-6 h-10 bg-gradient-to-b from-purple-200 to-blue-300 rounded-t-full rounded-b-full opacity-60 -rotate-12 drop-shadow-lg blur-[1px]"></div>
      <div className="absolute bottom-1/4 right-1/3 text-amber-300 text-2xl animate-bounce">✨</div>
      <div className="absolute top-1/3 left-1/3 text-amber-300 text-xl animate-pulse">✨</div>

      {/* Card Utama */}
      <div className="bg-white/95 backdrop-blur-xl p-8 sm:p-10 rounded-[2.5rem] shadow-2xl shadow-blue-900/10 w-full max-w-[420px] relative z-10 border border-white">
        <Outlet />
      </div>
    </div>
  );
}