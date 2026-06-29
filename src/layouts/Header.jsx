import { Search, Bell, ChevronDown, User, Settings, LogOut, Check } from "lucide-react";
import Avatar from "../components/Avatar"; 
import { useNotifications } from "../hooks/useNotifications"; 

// Import komponen Shadcn yang baru saja di-install
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";

export default function Header() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications(null, 'admin');

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
        {/* NOTIFICATION DROPDOWN */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-xl transition-all outline-none cursor-pointer">
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                </span>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 font-poppins rounded-xl p-0 overflow-hidden border border-gray-100 shadow-xl">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <span className="font-bold text-gray-800 text-sm">Notifikasi</span>
              {unreadCount > 0 && (
                <button onClick={markAllAsRead} className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
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
                    className={`p-4 border-b border-gray-50 cursor-pointer transition-colors hover:bg-gray-50 ${!notif.is_read ? 'bg-blue-50/20' : ''}`}
                  >
                    <div className="flex justify-between items-start mb-1 gap-2">
                      <span className={`text-sm font-bold leading-tight ${!notif.is_read ? 'text-gray-900' : 'text-gray-700'}`}>{notif.title}</span>
                      {!notif.is_read && <span className="w-2 h-2 rounded-full bg-blue-500 mt-1 shrink-0 shadow-sm"></span>}
                    </div>
                    <p className={`text-xs mb-2 leading-relaxed ${!notif.is_read ? 'text-gray-600' : 'text-gray-500'}`}>{notif.message}</p>
                    <span className="text-[10px] font-medium text-gray-400">{new Date(notif.created_at).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })}</span>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center flex flex-col items-center justify-center">
                  <Bell size={24} className="text-gray-300 mb-2" />
                  <span className="text-gray-400 text-sm font-medium">Belum ada notifikasi</span>
                </div>
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* IMPLEMENTASI SHADCN DROPDOWN MENU */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            {/* asChild membuat Trigger mengambil alih elemen div di bawahnya agar rapi */}
            <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all cursor-pointer outline-none">
                <Avatar name="M. Dzakwan Syafiq" />
              <span className="text-sm font-semibold text-gray-700">M. Dzakwan Syafiq</span>
              <ChevronDown size={16} className="text-gray-400" />
            </div>
          </DropdownMenuTrigger>
          
          <DropdownMenuContent align="end" className="w-56 font-poppins rounded-xl p-2">
            <DropdownMenuLabel className="font-bold text-gray-800">Akun Saya</DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            <DropdownMenuItem className="cursor-pointer rounded-lg py-2.5 hover:bg-gray-50">
              <User className="mr-2 h-4 w-4 text-gray-500" />
              <span>Profil Web</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem className="cursor-pointer rounded-lg py-2.5 hover:bg-gray-50">
              <Settings className="mr-2 h-4 w-4 text-gray-500" />
              <span>Pengaturan</span>
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem className="cursor-pointer rounded-lg py-2.5 text-red-600 focus:bg-red-50 focus:text-red-700">
              <LogOut className="mr-2 h-4 w-4" />
              <Link to="/">
              <span className="font-semibold">Keluar Aplikasi</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

      </div>
    </header>
  );
}