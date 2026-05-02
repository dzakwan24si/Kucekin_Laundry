import { useState } from "react";
import { Search, Filter, Plus, Edit, Trash2, Eye } from "lucide-react";

// Dummy Data Pesanan Laundry
const ordersData = [
  { id: "FL-0015", date: "1 Mei 2026", customer: "Budi Santoso", service: "Cuci Komplit (Kilat)", weight: "3.5 kg", status: "Diproses", total: "Rp 35.000" },
  { id: "FL-0014", date: "1 Mei 2026", customer: "Siti Aminah", service: "Setrika Saja", weight: "2.0 kg", status: "Selesai", total: "Rp 15.000" },
  { id: "FL-0013", date: "30 Apr 2026", customer: "Andi Pratama", service: "Cuci Karpet", weight: "8.0 m", status: "Menunggu", total: "Rp 120.000" },
  { id: "FL-0012", date: "29 Apr 2026", customer: "Rina Melati", service: "Cuci Komplit (Reguler)", weight: "5.0 kg", status: "Diambil", total: "Rp 30.000" },
  { id: "FL-0011", date: "28 Apr 2026", customer: "Faqih Hidayah", service: "Cuci Sepatu", weight: "2 pasang", status: "Diambil", total: "Rp 50.000" },
];

export default function Pesanan() {
  const [searchTerm, setSearchTerm] = useState("");

  // Fungsi penentu warna badge status
  const getStatusColor = (status) => {
    switch (status) {
      case "Menunggu": return "bg-red-100 text-red-600 border-red-200";
      case "Diproses": return "bg-amber-100 text-amber-600 border-amber-200";
      case "Selesai": return "bg-green-100 text-green-600 border-green-200";
      case "Diambil": return "bg-blue-100 text-blue-600 border-blue-200";
      default: return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  return (
    <div className="animate-fade-in font-poppins px-8 pb-8">
      {/* Header Halaman */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Manajemen Pesanan</h1>
          <p className="text-sm text-gray-400 mt-1">Kelola semua transaksi dan status cucian pelanggan.</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-blue-600/30">
          <Plus size={20} /> Buat Pesanan Baru
        </button>
      </div>

      {/* Toolbar (Search & Filter) */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Cari no. resi atau nama pelanggan..." 
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-600 px-4 py-2 rounded-xl text-sm font-medium transition-all">
          <Filter size={16} /> Filter Status
        </button>
      </div>

      {/* Tabel Pesanan */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50/80 text-gray-500 text-sm uppercase tracking-wider border-b border-gray-100">
              <tr>
                <th className="p-5 font-semibold">No. Resi</th>
                <th className="p-5 font-semibold">Tanggal</th>
                <th className="p-5 font-semibold">Pelanggan</th>
                <th className="p-5 font-semibold">Layanan & Berat</th>
                <th className="p-5 font-semibold">Status</th>
                <th className="p-5 font-semibold">Total Tagihan</th>
                <th className="p-5 font-semibold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 text-sm">
              {ordersData.map((order, index) => (
                <tr key={index} className="border-b border-gray-50 hover:bg-blue-50/30 transition-colors">
                  <td className="p-5 font-bold text-blue-600">{order.id}</td>
                  <td className="p-5 text-gray-500">{order.date}</td>
                  <td className="p-5 font-semibold text-gray-800">{order.customer}</td>
                  <td className="p-5">
                    <p className="font-medium text-gray-800">{order.service}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{order.weight}</p>
                  </td>
                  <td className="p-5">
                    <span className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-5 font-bold text-gray-800">{order.total}</td>
                  <td className="p-5">
                    <div className="flex items-center justify-center gap-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Detail">
                        <Eye size={18} />
                      </button>
                      <button className="p-2 text-orange-500 hover:bg-orange-50 rounded-lg transition-colors" title="Edit">
                        <Edit size={18} />
                      </button>
                      <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Hapus">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Dummy */}
        <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
          <span>Menampilkan 1 hingga 5 dari 42 pesanan</span>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50">Sebelumnnya</button>
            <button className="px-3 py-1 bg-blue-600 text-white rounded-lg font-medium">1</button>
            <button className="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-50">2</button>
            <button className="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-50">Selanjutnya</button>
          </div>
        </div>
      </div>
    </div>
  );
}