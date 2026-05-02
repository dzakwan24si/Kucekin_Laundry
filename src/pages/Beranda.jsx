import { useState } from "react";
import { Eye, EyeOff, ChevronDown, Plus, AlertTriangle, Clock, CheckCircle2 } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

// Data disesuaikan dengan layanan laundry lokal
const orderData = [
  { id: "#FL-0012", date: "1 Mei 2026", customer: "Budi Santoso", service: "Cuci Komplit (Kilat)", price: "Rp 35.000", status: "Diproses", statusColor: "bg-amber-400" },
  { id: "#FL-0011", date: "1 Mei 2026", customer: "Siti Aminah", service: "Setrika Saja", price: "Rp 15.000", status: "Diproses", statusColor: "bg-amber-400" },
  { id: "#FL-0010", date: "30 Apr 2026", customer: "Andi Pratama", service: "Cuci Karpet", price: "Rp 120.000", status: "Menunggu", statusColor: "bg-red-500" },
];

// Data disesuaikan dengan stok bahan laundry
const suppliesData = [
  { name: "Pewangi (Softener)", amount: 2, unit: "jerigen", color: "bg-orange-400", progress: 15, low: true },
  { name: "Deterjen Cair", amount: 7, unit: "liter", color: "bg-orange-400", progress: 25, low: true },
  { name: "Plastik Kemasan", amount: 24, unit: "roll", color: "bg-orange-400", progress: 40, low: true },
  { name: "Tas Laundry", amount: 34, unit: "pcs", color: "bg-blue-500", progress: 65 },
  { name: "Parfum Pakaian", amount: 19, unit: "botol", color: "bg-blue-500", progress: 55 },
];

const customerData = [
  { name: "Pelanggan Tetap", value: 15, color: "#3b6d8a" },
  { name: "Pelanggan Baru", value: 4, color: "#a8c4d6" },
];

export default function Beranda() {
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [unpaidVisible, setUnpaidVisible] = useState(true);

  // Tanggal dinamis hari ini
  const today = new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <main className="flex-1 overflow-y-auto px-8 pb-8 animate-fade-in">
      {/* Title & Date */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Beranda</h1>
          <p className="text-sm text-gray-400 mt-1">Selamat datang kembali, Admin! Berikut ringkasan outlet hari ini.</p>
        </div>
        <p className="text-sm text-gray-400 font-medium">{today}</p>
      </div>

      {/* Orders Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-800">Pesanan Masuk</h2>
          <button className="text-sm text-blue-800 font-semibold hover:text-blue-600 transition-colors">Lihat Semua</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center min-h-[140px] hover:border-blue-300 hover:bg-blue-50/30 transition-all cursor-pointer group">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex flex-col items-center justify-center group-hover:bg-blue-100 transition-all">
              <Plus size={24} className="text-blue-600" />
            </div>
          </div>
          {orderData.map((order) => (
            <div key={order.id} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-gray-400">{order.id}</span>
                <span className={`px-3 py-1 rounded-full text-[11px] font-bold text-white ${order.statusColor}`}>{order.status}</span>
              </div>
              <p className="text-xs text-gray-400 mb-1">{order.date}</p>
              <p className="text-sm font-bold text-gray-800">{order.customer}</p>
              <p className="text-xs text-gray-400 mb-3">{order.service}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-gray-700">{order.price}</span>
                <button className="text-xs text-blue-800 font-semibold hover:text-blue-600 transition-colors">Perbarui</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Section Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="space-y-4">
          <div className="bg-blue-800 rounded-2xl p-5 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-700 rounded-full -translate-y-1/2 translate-x-1/2 opacity-50" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-600 rounded-full translate-y-1/2 -translate-x-1/2 opacity-30" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-blue-200">Total Pendapatan</span>
                <button className="text-xs text-blue-200 hover:text-white flex items-center gap-1">7 Hari Terakhir <ChevronDown size={12} /></button>
              </div>
              <div className="flex items-center gap-3">
                <p className="text-3xl font-bold">{balanceVisible ? "Rp 1.450.000" : "••••••••"}</p>
                <button onClick={() => setBalanceVisible(!balanceVisible)} className="p-1 hover:bg-blue-700 rounded-lg">
                  {balanceVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-500">Tagihan Belum Lunas</span>
              <button className="text-xs text-blue-800 font-semibold flex items-center gap-1">7 Hari Terakhir <ChevronDown size={12} /></button>
            </div>
            <div className="flex items-center gap-3">
              <p className="text-3xl font-bold text-gray-800">{unpaidVisible ? "Rp 155.000" : "••••••••"}</p>
              <button onClick={() => setUnpaidVisible(!unpaidVisible)} className="p-1 hover:bg-gray-100 rounded-lg text-gray-400">
                {unpaidVisible ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
        </div>

        {/* Middle Column */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center"><AlertTriangle size={22} className="text-red-600" /></div>
            <div><p className="text-sm text-gray-500 font-medium">Antrean Masuk</p><p className="text-2xl font-bold text-gray-800">5</p></div>
          </div>
          <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center"><Clock size={22} className="text-orange-500" /></div>
            <div><p className="text-sm text-gray-500 font-medium">Sedang Dicuci/Setrika</p><p className="text-2xl font-bold text-gray-800">12</p></div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center"><CheckCircle2 size={22} className="text-green-600" /></div>
            <div><p className="text-sm text-gray-500 font-medium">Selesai (Siap Ambil)</p><p className="text-2xl font-bold text-gray-800">8</p></div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-800">Stok Bahan</h3>
              <button className="text-xs text-blue-800 font-semibold hover:text-blue-600">Perbarui</button>
            </div>
            <div className="space-y-3">
              {suppliesData.map((supply) => (
                <div key={supply.name}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-medium text-gray-600">{supply.name}</span>
                      {supply.low && <AlertTriangle size={12} className="text-red-500" title="Stok Menipis!" />}
                    </div>
                    <span className="text-xs text-gray-400">Sisa {supply.amount} {supply.unit}</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-500 ${supply.color}`} style={{ width: `${supply.progress}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-800">Data Pelanggan</h3>
              <button className="text-xs text-blue-800 font-semibold flex items-center gap-1">Bulan Ini <ChevronDown size={12} /></button>
            </div>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width={180} height={160}>
                <PieChart>
                  <Pie data={customerData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={2} dataKey="value">
                    {customerData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 text-center">
              <p className="text-xs text-gray-600 font-medium">{customerData[0].value} Pelanggan Tetap</p>
              <p className="text-xs text-gray-500 font-medium">{customerData[1].value} Pelanggan Baru</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}