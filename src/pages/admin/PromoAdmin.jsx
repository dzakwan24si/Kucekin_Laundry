import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Ticket, Loader2, X, CheckCircle2, AlertCircle, Search } from "lucide-react";

import PageHeader from "../../components/PageHeader";
import Button from "../../components/Button";
import Table from "../../components/Table";

// Import API
import { transactionAPI } from "@/services/transactionAPI";

export default function PromoAdmin() {
  const [promos, setPromos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("Semua");
  const filters = ["Semua", "VIP", "Gold", "Silver", "Bronze"];
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    kode_promo: "",
    nama_promo: "",
    tipe_promo: "Persen",
    nilai_potongan: "",
    min_belanja: "",
    target_tier: "Semua",
    is_active: true
  });

  const fetchPromos = async () => {
    setIsLoading(true);
    try {
      const data = await transactionAPI.getAllPromos();
      setPromos(data);
    } catch (error) {
      console.error("Gagal menarik data promo:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPromos();
  }, []);

  const filteredPromos = promos.filter(p => {
    const nama = p.nama_promo || "";
    const kode = p.kode_promo || "";
    const matchesSearch = nama.toLowerCase().includes(searchTerm.toLowerCase()) || kode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === "Semua" || p.target_tier === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({ kode_promo: "", nama_promo: "", tipe_promo: "Persen", nilai_potongan: "", min_belanja: "", target_tier: "Semua", is_active: true });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingId(item.id);
    setFormData({ ...item });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingId) {
        await transactionAPI.updatePromo(editingId, formData);
        alert("Promo berhasil diperbarui!");
      } else {
        await transactionAPI.addPromo(formData);
        alert("Promo baru berhasil ditambahkan!");
      }
      setIsModalOpen(false);
      fetchPromos();
    } catch (error) {
      alert("Gagal menyimpan promo. Pastikan Kode Promo unik.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id, nama) => {
    if (window.confirm(`Yakin ingin menghapus promo "${nama}"?`)) {
      try {
        await transactionAPI.deletePromo(id);
        alert("Promo berhasil dihapus!");
        fetchPromos();
      } catch (error) {
        alert("Gagal menghapus promo.");
      }
    }
  };

  // Toggle Status Cepat (Aktif / Tidak Aktif)
  const handleToggleStatus = async (item) => {
    try {
        await transactionAPI.updatePromo(item.id, { is_active: !item.is_active });
        fetchPromos();
    } catch (error) {
        alert("Gagal mengubah status.");
    }
  };

  return (
    <div className="animate-fade-in font-poppins px-8 pb-8 pt-4 relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <PageHeader title="Manajemen Promo" subtitle="Kelola kode kupon, diskon, dan strategi marketing Kucekin." />
        <Button type="primary" onClick={handleOpenAdd} className="flex items-center gap-2">
          <Plus size={20} /> Buat Promo Baru
        </Button>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap gap-2 bg-gray-100/80 p-1 rounded-xl w-fit">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                activeFilter === filter
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Cari kode atau nama promo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 transition-colors text-gray-800"
          />
        </div>
        <div className="text-xs font-medium text-gray-400 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
          Total: <span className="text-gray-700 font-bold">{filteredPromos.length}</span> Promo
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <Table headers={["Kode", "Nama Promo", "Tipe & Nilai", "Syarat Belanja", "Target Tier", "Status", "Aksi"]}>
          {isLoading ? (
             <tr><td colSpan="7" className="p-8 text-center"><Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto" /></td></tr>
          ) : filteredPromos.length > 0 ? (
            filteredPromos.map((item) => (
              <tr key={item.id} className="border-b border-gray-50 hover:bg-blue-50/30 transition-colors">
                <td className="p-5 font-black text-blue-600 tracking-wider bg-blue-50/50">{item.kode_promo}</td>
                <td className="p-5 font-bold text-gray-800">{item.nama_promo}</td>
                <td className="p-5">
                  <span className="font-semibold text-gray-700">{item.tipe_promo}</span>
                  <div className="text-sm font-bold text-orange-500 mt-0.5">
                    {item.tipe_promo === 'Persen' ? `${item.nilai_potongan}%` : `Rp ${item.nilai_potongan.toLocaleString('id-ID')}`}
                  </div>
                </td>
                <td className="p-5 text-sm text-gray-600 font-medium">Min. Rp {item.min_belanja.toLocaleString('id-ID')}</td>
                <td className="p-5">
                    <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-lg text-xs font-bold">{item.target_tier}</span>
                </td>
                <td className="p-5">
                  <button onClick={() => handleToggleStatus(item)} className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 transition-colors ${item.is_active ? 'bg-green-100 text-green-700 hover:bg-red-100 hover:text-red-700' : 'bg-gray-100 text-gray-500 hover:bg-green-100 hover:text-green-700'}`}>
                    {item.is_active ? <><CheckCircle2 size={14}/> Aktif</> : <><AlertCircle size={14}/> Tidak Aktif</>}
                  </button>
                </td>
                <td className="p-5">
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleOpenEdit(item)} className="p-2 text-orange-500 hover:bg-orange-50 rounded-lg"><Edit size={18} /></button>
                    <button onClick={() => handleDelete(item.id, item.nama_promo)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="7" className="p-8 text-center text-gray-500">Belum ada promo yang terdaftar.</td></tr>
          )}
        </Table>
      </div>

      {/* MODAL FORM */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2"><Ticket className="text-blue-600" /> {editingId ? "Edit Promo" : "Buat Promo"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500"><X size={20} /></button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Kode Promo</label>
                <input type="text" required placeholder="Contoh: SULTAN20" value={formData.kode_promo} onChange={(e) => setFormData({...formData, kode_promo: e.target.value.toUpperCase()})} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:border-blue-500 text-sm font-black uppercase tracking-widest" />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Nama Promo</label>
                <input type="text" required placeholder="Contoh: Diskon Khusus Member VIP" value={formData.nama_promo} onChange={(e) => setFormData({...formData, nama_promo: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:border-blue-500 text-sm" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Tipe Diskon</label>
                  <select value={formData.tipe_promo} onChange={(e) => setFormData({...formData, tipe_promo: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:border-blue-500 text-sm font-bold cursor-pointer">
                    <option value="Persen">Persen (%)</option>
                    <option value="Nominal">Nominal (Rp)</option>
                    <option value="Gratis Ongkir">Gratis Ongkir</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Nilai Potongan</label>
                  <input type="number" required min="0" value={formData.nilai_potongan} onChange={(e) => setFormData({...formData, nilai_potongan: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:border-blue-500 text-sm font-bold" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Min. Belanja (Rp)</label>
                  <input type="number" required min="0" value={formData.min_belanja} onChange={(e) => setFormData({...formData, min_belanja: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:border-blue-500 text-sm font-bold" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Target Tier</label>
                  <select value={formData.target_tier} onChange={(e) => setFormData({...formData, target_tier: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:border-blue-500 text-sm font-bold cursor-pointer">
                    <option value="Semua">Semua Member</option>
                    <option value="Bronze">Bronze Saja</option>
                    <option value="Silver">Silver Saja</option>
                    <option value="Gold">Gold Saja</option>
                    <option value="VIP">VIP Saja</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 rounded-xl font-semibold text-gray-600 hover:bg-gray-100">Batal</button>
                <button type="submit" disabled={isSubmitting} className="px-6 py-2.5 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2">
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Simpan Promo"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}