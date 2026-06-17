import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Tag, Loader2, X, Clock } from "lucide-react";

// Import Komponen Reusable (Sesuaikan dengan path di project Anda)
import PageHeader from "../components/PageHeader";
import Button from "../components/Button";
import Table from "../components/Table";

// Import API
import { transactionAPI } from "@/services/transactionAPI";

export default function Layanan() {
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // State untuk Modal Form (Pop-up)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State untuk membedakan Mode Tambah vs Mode Edit
  const [editingId, setEditingId] = useState(null);
  
  // Data Form
  const [formData, setFormData] = useState({
    nama_layanan: "",
    jenis: "Kiloan",
    harga: "",
    estimasi_waktu: ""
  });

  // 1. Tarik Data dari Supabase
  const fetchServices = async () => {
    setIsLoading(true);
    try {
      const data = await transactionAPI.getServices();
      setServices(data);
    } catch (error) {
      console.error("Gagal menarik data layanan:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // 2. Buka Modal untuk Tambah Baru
  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({ nama_layanan: "", jenis: "Kiloan", harga: "", estimasi_waktu: "" });
    setIsModalOpen(true);
  };

  // 3. Buka Modal untuk Edit (Isi form dengan data yang dipilih)
  const handleOpenEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      nama_layanan: item.nama_layanan,
      jenis: item.jenis,
      harga: item.harga,
      estimasi_waktu: item.estimasi_waktu
    });
    setIsModalOpen(true);
  };

  // 4. Proses Simpan (Tambah / Edit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingId) {
        await transactionAPI.updateService(editingId, formData);
        alert("Layanan berhasil diperbarui!");
      } else {
        await transactionAPI.addService(formData);
        alert("Layanan baru berhasil ditambahkan!");
      }
      setIsModalOpen(false);
      fetchServices(); // Refresh tabel
    } catch (error) {
      console.error("Gagal menyimpan:", error);
      alert("Terjadi kesalahan saat menyimpan data.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 5. Proses Hapus
  const handleDelete = async (id, nama) => {
    const isConfirmed = window.confirm(`Yakin ingin menghapus layanan "${nama}"?\nJika ada histori transaksi yang menggunakan layanan ini, penghapusan mungkin akan ditolak oleh sistem.`);
    if (isConfirmed) {
      try {
        await transactionAPI.deleteService(id);
        alert("Layanan berhasil dihapus!");
        fetchServices(); // Refresh tabel
      } catch (error) {
        console.error("Gagal menghapus:", error);
        alert("Gagal menghapus. Layanan ini mungkin sedang digunakan pada histori pesanan pelanggan.");
      }
    }
  };

  const tableHeaders = ["ID", "Nama Layanan", "Kategori", "Harga", "Estimasi Waktu", "Aksi"];

  return (
    <div className="animate-fade-in font-poppins px-8 pb-8 pt-4 relative">
      
      {/* HEADER HALAMAN */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <PageHeader title="Katalog Layanan" subtitle="Kelola harga, jenis, dan durasi pengerjaan cucian." />
        <Button type="primary" onClick={handleOpenAdd} className="flex items-center gap-2">
          <Plus size={20} /> Tambah Layanan Baru
        </Button>
      </div>

      {/* TABEL DATA */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <Table headers={tableHeaders}>
          {isLoading ? (
             <tr><td colSpan="6" className="p-8 text-center"><Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto" /></td></tr>
          ) : services.length > 0 ? (
            services.map((item, index) => (
              <tr key={item.id} className="border-b border-gray-50 hover:bg-blue-50/30 transition-colors">
                <td className="p-5 text-gray-500 text-sm">{index + 1}</td>
                <td className="p-5 font-bold text-gray-800">{item.nama_layanan}</td>
                <td className="p-5">
                  <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold border border-slate-200">
                    {item.jenis}
                  </span>
                </td>
                <td className="p-5 font-bold text-blue-600">
                  Rp {item.harga.toLocaleString('id-ID')} <span className="text-xs text-gray-400 font-normal">/ {item.jenis === 'Kiloan' ? 'kg' : 'pcs'}</span>
                </td>
                <td className="p-5 text-gray-600 font-medium flex items-center gap-2 mt-2.5">
                  <Clock size={16} className="text-gray-400" /> {item.estimasi_waktu} Jam
                </td>
                <td className="p-5">
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleOpenEdit(item)} className="p-2 text-orange-500 hover:bg-orange-50 rounded-lg transition-colors" title="Edit">
                      <Edit size={18} />
                    </button>
                    <button onClick={() => handleDelete(item.id, item.nama_layanan)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Hapus">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="6" className="p-8 text-center text-gray-500">Belum ada layanan yang terdaftar.</td></tr>
          )}
        </Table>
      </div>

      {/* MODAL FORM TAMBAH / EDIT */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-gray-100 transform transition-all">
            
            <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Tag className="text-blue-600" />
                {editingId ? "Edit Layanan" : "Tambah Layanan Baru"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500 transition-colors p-1 bg-white rounded-full hover:bg-red-50">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Layanan</label>
                <input 
                  type="text" required 
                  placeholder="Contoh: Cuci Karpet Premium"
                  value={formData.nama_layanan}
                  onChange={(e) => setFormData({...formData, nama_layanan: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:border-blue-500 text-sm font-medium transition-colors" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Kategori (Satuan)</label>
                  <select 
                    value={formData.jenis}
                    onChange={(e) => setFormData({...formData, jenis: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:border-blue-500 text-sm font-medium transition-colors cursor-pointer"
                  >
                    <option value="Kiloan">Kiloan</option>
                    <option value="Satuan">Satuan (Pcs)</option>
                    <option value="Meteran">Meteran</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Estimasi (Jam)</label>
                  <input 
                    type="number" required min="1"
                    placeholder="Contoh: 48"
                    value={formData.estimasi_waktu}
                    onChange={(e) => setFormData({...formData, estimasi_waktu: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:border-blue-500 text-sm font-medium transition-colors" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Harga (Rupiah)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-sm">Rp</span>
                  <input 
                    type="number" required min="0"
                    placeholder="15000"
                    value={formData.harga}
                    onChange={(e) => setFormData({...formData, harga: e.target.value})}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:border-blue-500 text-sm font-medium transition-colors" 
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 rounded-xl font-semibold text-gray-600 hover:bg-gray-100 transition-colors">
                  Batal
                </button>
                <button type="submit" disabled={isSubmitting} className="px-6 py-2.5 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Simpan Layanan"}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}