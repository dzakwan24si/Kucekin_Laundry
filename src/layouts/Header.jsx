import { Search, Bell, ChevronDown } from "lucide-react";
// 1️⃣ Import komponen Avatar yang sudah dibuat
import Avatar from "../components/Avatar"; 

export default function Header() {
  return (
    <header className="flex items-center justify-between px-8 py-5 bg-white border-b border-gray-100">
      {/* Search */}
      <div className="relative w-72">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
        <input
          type="text"
          placeholder="Cari..."
          className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 transition-all"
        />
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        <button className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-xl transition-all">
          <Bell size={20} />
        </button>
        <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all cursor-pointer">
          
          {/* 2️⃣ Gunakan komponen Avatar di sini 👇 */}
          <Avatar name="M. Dzakwan Syafiq" />
          
          <span className="text-sm font-semibold text-gray-700">M. Dzakwan Syafiq</span>
          <ChevronDown size={16} className="text-gray-400" />
        </div>
      </div>
    </header>
  );
}