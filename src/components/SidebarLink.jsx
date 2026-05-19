import { NavLink } from "react-router-dom";
export default function SidebarLink({ to, icon: Icon, label }) {
  return (
    <NavLink to={to} className={({ isActive }) => `flex flex-col items-center gap-1 py-3 px-2 rounded-xl transition-all duration-200 ${isActive ? "bg-blue-800 text-white shadow-lg" : "text-gray-400 hover:text-blue-600 hover:bg-blue-50"}`}>
      <Icon size={20} strokeWidth={1.8} />
      <span className="text-[10px] font-bold leading-tight text-center mt-1">{label}</span>
    </NavLink>
  );
}