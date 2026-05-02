import { Plus, Edit, Trash2, Shirt, Zap, Wind, Package } from "lucide-react";

// Dummy Data Daftar Layanan/Pricelist
const servicesData = [
  { id: 1, name: "Cuci Komplit (Reguler)", desc: "Cuci bersih, jemur, dan setrika rapi. Pilihan hemat untuk harian.", price: "Rp 6.000", unit: "/ kg", duration: "2 Hari", icon: Shirt, color: "bg-blue-100 text-blue-600" },
  { id: 2, name: "Cuci Komplit (Kilat)", desc: "Prioritas utama. Selesai di hari yang sama tanpa antre.", price: "Rp 12.000", unit: "/ kg", duration: "12 Jam", icon: Zap, color: "bg-amber-100 text-amber-600" },
  { id: 3, name: "Setrika Saja", desc: "Pakaian kusut jadi rapi seketika. Langsung lipat plastik.", price: "Rp 4.000", unit: "/ kg", duration: "1 Hari", icon: Wind, color: "bg-cyan-100 text-cyan-600" },
  { id: 4, name: "Cuci Karpet / Selimut", desc: "Pembersihan mendalam untuk bahan tebal dan lebar.", price: "Rp 15.000", unit: "/ meter", duration: "3 Hari", icon: Package, color: "bg-purple-100 text-purple-600" },
];

export default function Layanan() {
  return (
    <div className="animate-fade-in font-poppins px-8 pb-8">
      {/* Header Halaman */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Layanan & Harga</h1>
          <p className="text-sm text-gray-400 mt-1">Atur daftar paket laundry beserta tarif dan estimasi waktu.</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-blue-600/30">
          <Plus size={20} /> Tambah Layanan
        </button>
      </div>

      {/* Grid Layanan */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {servicesData.map((service) => {
          const Icon = service.icon;
          return (
            <div key={service.id} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group">
              <div className="flex justify-between items-start mb-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${service.color} group-hover:scale-110 transition-transform`}>
                  <Icon size={28} />
                </div>
                {/* Tombol Aksi tersembunyi, muncul saat di-hover */}
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 bg-gray-50 hover:bg-blue-50 text-gray-400 hover:text-blue-600 rounded-lg transition-colors">
                    <Edit size={16} />
                  </button>
                  <button className="p-2 bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-gray-800 mb-2">{service.name}</h3>
              <p className="text-sm text-gray-500 mb-6 leading-relaxed line-clamp-2">
                {service.desc}
              </p>

              <div className="pt-4 border-t border-gray-100 flex items-end justify-between">
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Tarif</p>
                  <p className="text-2xl font-black text-blue-600">
                    {service.price} <span className="text-sm font-medium text-gray-500">{service.unit}</span>
                  </p>
                </div>
                <div className="bg-gray-50 px-3 py-1.5 rounded-lg">
                  <p className="text-xs font-bold text-gray-600">⏱ {service.duration}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}