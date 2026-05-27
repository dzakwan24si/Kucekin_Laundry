import { Search, Bell, ChevronDown, User, Settings, LogOut } from "lucide-react";
import Avatar from "../components/Avatar"; 

// Import komponen Shadcn yang baru saja di-install
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
              <span className="font-semibold">Keluar Aplikasi</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

      </div>
    </header>
  );
}