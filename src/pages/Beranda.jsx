import { useState } from "react";
import { Eye, EyeOff, ChevronDown, Plus, AlertTriangle, Clock, CheckCircle2 } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

// 1️⃣ IMPORT KOMPONEN REUSABLE YANG SUDAH KITA BUAT
import PageHeader from "../components/PageHeader";
import Card from "../components/Card";
import Badge from "../components/Badge";
import SupplyProgress from "../components/SupplyProgress";
import StatCard from "../components/StatCard";

// Data dummy (tetap sama)
const orderData = [
  { id: "#FL-0012", date: "1 Mei 2026", customer: "Budi Santoso", service: "Cuci Komplit (Kilat)", price: "Rp 35.000", status: "Diproses" },
  { id: "#FL-0011", date: "1 Mei 2026", customer: "Siti Aminah", service: "Setrika Saja", price: "Rp 15.000", status: "Diproses" },
  { id: "#FL-0010", date: "30 Apr 2026", customer: "Andi Pratama", service: "Cuci Karpet", price: "Rp 120.000", status: "Menunggu" },
];

const suppliesData = [
  { name: "Pewangi (Softener)", amount: 2, unit: "jerigen", color: "bg-orange-400", progress: 15 },
  { name: "Deterjen Cair", amount: 7, unit: "liter", color: "bg-orange-400", progress: 25 },
  { name: "Plastik Kemasan", amount: 24, unit: "roll", color: "bg-orange-400", progress: 40 },
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

  const today = new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <main className="flex-1 overflow-y-auto px-8 pb-8 animate-fade-in pt-4">
      
      {/* 2️⃣ MENGGUNAKAN KOMPONEN PAGE HEADER */}
      <PageHeader 
        title="Beranda" 
        subtitle={`Selamat datang kembali, Admin! Berikut ringkasan outlet hari ini. (${today})`} 
      />

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
            // 3️⃣ MENGGUNAKAN KOMPONEN CARD
            <Card key={order.id} className="p-4 hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-gray-400">{order.id}</span>
                {/* 4️⃣ MENGGUNAKAN KOMPONEN BADGE */}
                <Badge status={order.status} />
              </div>
              <p className="text-xs text-gray-400 mb-1">{order.date}</p>
              <p className="text-sm font-bold text-gray-800">{order.customer}</p>
              <p className="text-xs text-gray-400 mb-3">{order.service}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-gray-700">{order.price}</span>
                <button className="text-xs text-blue-800 font-semibold hover:text-blue-600 transition-colors">Perbarui</button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Bottom Section Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (Tetap menggunakan div kustom karena desainnya spesifik/unik) */}
        <div className="space-y-4">
          <div className="bg-blue-800 rounded-2xl p-5 text-white relative overflow-hidden">
             {/* ... (Isi balance card tetap sama seperti sebelumnya) ... */}
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
          
          <Card className="p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-500">Tagihan Belum Lunas</span>
            </div>
            <div className="flex items-center gap-3">
              <p className="text-3xl font-bold text-gray-800">{unpaidVisible ? "Rp 155.000" : "••••••••"}</p>
              <button onClick={() => setUnpaidVisible(!unpaidVisible)} className="p-1 hover:bg-gray-100 rounded-lg text-gray-400">
                {unpaidVisible ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </Card>
        </div>

        {/* 5️⃣ MENGGUNAKAN KOMPONEN STATCARD UNTUK KOLOM TENGAH */}
        <div className="space-y-4">
          <StatCard title="Antrean Masuk" value="5" icon={AlertTriangle} colorClass="bg-red-100 text-red-600" />
          <StatCard title="Sedang Dicuci/Setrika" value="12" icon={Clock} colorClass="bg-orange-100 text-orange-500" />
          <StatCard title="Selesai (Siap Ambil)" value="8" icon={CheckCircle2} colorClass="bg-green-100 text-green-600" />
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-800">Stok Bahan</h3>
            </div>
            <div className="space-y-3">
              {/* 6️⃣ MENGGUNAKAN KOMPONEN SUPPLYPROGRESS */}
              {suppliesData.map((supply) => (
                <SupplyProgress 
                  key={supply.name}
                  name={supply.name}
                  amount={supply.amount}
                  unit={supply.unit}
                  progress={supply.progress}
                  color={supply.color}
                />
              ))}
            </div>
          </Card>

          <Card className="p-5 bg-gray-50">
            <h3 className="text-sm font-bold text-gray-800 mb-4">Data Pelanggan</h3>
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
          </Card>
        </div>
        
      </div>
    </main>
  );
}