import { Search, Bell, ChevronDown } from "lucide-react";

export default function Header() {
  return (
    <header className="flex items-center justify-between px-8 py-5 bg-white">
      {/* Search */}
      <div className="relative w-72">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
        <input
          type="text"
          placeholder="Search"
          className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 transition-all"
        />
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        <button className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-xl transition-all">
          <Bell size={20} />
        </button>
        <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all cursor-pointer">
          <div className="w-9 h-9 rounded-full overflow-hidden bg-blue-200">
            <img
              src="https://avatar.iran.liara.run/public/boy?username=MaxBrown"
              alt="profile"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-sm font-semibold text-gray-700">Max Brown</span>
          <ChevronDown size={16} className="text-gray-400" />
        </div>
      </div>
    </header>
  );
}