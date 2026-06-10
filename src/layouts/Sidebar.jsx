import { NavLink } from "react-router-dom";
import { LayoutDashboard, ShoppingCart, ListOrdered, Users, Package, Settings, LogOut, FileUser} from "lucide-react";

export default function Sidebar() {
  // Disesuaikan dengan kebutuhan fitur manajemen laundry
  const sidebarItems = [
    { icon: LayoutDashboard, label: "Beranda", path: "/" },
    { icon: ShoppingCart, label: "Pesanan", path: "/pesanan" },
    { icon: ListOrdered, label: "Layanan", path: "/layanan" },
    { icon: Users, label: "Pelanggan", path: "/pelanggan" },
    { icon: Package, label: "Inventori", path: "/inventori" },
    { icon: FileUser, label: "Data Karyawan", path: "/karyawan" },
    { icon: Settings, label: "Pengaturan", path: "/pengaturan" },
  ];

  return (
    <aside className="w-20 bg-white flex flex-col items-center py-6 border-r border-gray-100 shrink-0">
      {/* Logo */}
      <div className="w-12 h-12 bg-blue-800 rounded-full flex items-center justify-center mb-8 shadow-md">
        <span className="text-white font-bold text-xl">Ki</span>
      </div>

      {/* Nav Items */}
      <nav className="flex flex-col gap-1 w-full px-3">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.label}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 py-3 px-2 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-blue-800 text-white shadow-lg shadow-blue-800/30"
                    : "text-gray-400 hover:text-blue-600 hover:bg-blue-50"
                }`
              }
            >
              <Icon size={20} strokeWidth={1.8} />
              <span className="text-[9px] font-bold leading-tight text-center mt-1">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Logout */}
      <button className="flex flex-col items-center gap-1 py-3 px-2 rounded-xl text-red-400 hover:text-red-600 hover:bg-red-50 transition-all w-full">
        <LogOut size={20} strokeWidth={1.8} />
        <span className="text-[10px] font-bold mt-1">Keluar</span>
      </button>
    </aside>
  );
}