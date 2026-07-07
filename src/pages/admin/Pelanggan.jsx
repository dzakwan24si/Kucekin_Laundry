import React, { useState, useEffect } from 'react';
import { Search, Edit, Star, MapPin, X, Loader2, Trash2, UserPlus } from "lucide-react";

import PageHeader from "../../components/PageHeader";
import Table from "../../components/Table";
import { authAPI } from "@/services/authAPI";
import Button from "../../components/Button";

export default function Pelanggan() {
  const [pelanggan, setPelanggan] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("Semua");
  
  const filters = ["Semua", "VIP", "Gold", "Silver", "Bronze"];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [poinTambahan, setPoinTambahan] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State untuk Tambah Pelanggan
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addFormData, setAddFormData] = useState({ fullname: '', email: '', password: '', whatsapp: '' });
  const [isAdding, setIsAdding] = useState(false);

  const fetchPelanggan = async () => {
    setIsLoading(true);
    try {
      const data = await authAPI.getAllMembers();
      setPelanggan(data);
    } catch (error) {
      console.error("Gagal menarik data CRM:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPelanggan();
  }, []);

  const filteredPelanggan = pelanggan.filter(p => {
    const nama = p.users?.fullname || "";
    const wa = p.whatsapp || "";
    const matchesSearch = nama.toLowerCase().includes(searchTerm.toLowerCase()) || wa.includes(searchTerm);
    const matchesFilter = activeFilter === "Semua" || p.tier === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const handleOpenEdit = (p) => {
    setEditData(p);
    setPoinTambahan("");
    setIsModalOpen(true);
  };

  const handleSimpanPoin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
        const added = parseInt(poinTambahan) || 0;
        await authAPI.adminUpdateCRM(editData.user_id, editData.poin || 0, added);
        alert(`Berhasil menambahkan ${added} Poin! Tingkat keanggotaan otomatis disesuaikan.`);
        setIsModalOpen(false);
        fetchPelanggan(); 
    } catch (error) {
        alert("Gagal memperbarui poin.");
    } finally {
        setIsSubmitting(false);
    }
  };

  // ==========================================
  // LOGIKA BARU: HAPUS AKUN PELANGGAN
  // ==========================================
  const handleDeletePelanggan = async (id, nama) => {
    const confirmDelete = window.confirm(`PERINGATAN!\n\nYakin ingin menghapus akun pelanggan "${nama}"?\nSeluruh data profil dan akses login pelanggan ini akan dihapus permanen dari sistem.`);
    
    if (confirmDelete) {
        try {
            // Kita gunakan authAPI.deleteUser yang sama dengan yang ada di halaman Karyawan
            await authAPI.deleteUser(id);
            alert(`Akun pelanggan ${nama} berhasil dihapus.`);
            fetchPelanggan(); // Refresh tabel
        } catch (error) {
            console.error("Gagal menghapus:", error);
            alert("Terjadi kesalahan saat menghapus akun pelanggan.");
        }
    }
  };

  const handleAddPelanggan = async (e) => {
    e.preventDefault();
    setIsAdding(true);
    try {
      await authAPI.registerMember({
        fullname: addFormData.fullname,
        email: addFormData.email,
        password: addFormData.password,
        whatsapp: addFormData.whatsapp
      });
      alert(`Pelanggan ${addFormData.fullname} berhasil ditambahkan!`);
      setIsAddModalOpen(false);
      setAddFormData({ fullname: '', email: '', password: '', whatsapp: '' });
      fetchPelanggan();
    } catch (error) {
      alert(error.message || "Gagal menambahkan pelanggan.");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="p-8 pb-24 font-poppins animate-fade-in relative">
      <PageHeader 
        title="Manajemen Pelanggan (CRM)" 
        subtitle="Analisis portofolio member, pantau poin loyalitas, dan berikan kompensasi manual." 
      />

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
        
        <Button 
          type="primary" 
          className="flex items-center gap-2 mt-4 md:mt-0"
          onClick={() => setIsAddModalOpen(true)}
        >
          <UserPlus size={18} /> Tambah Pelanggan
        </Button>
      </div>

      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Cari nama atau WhatsApp pelanggan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 transition-colors text-gray-800"
          />
        </div>
        <div className="text-xs font-medium text-gray-400 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
          Total: <span className="text-gray-700 font-bold">{filteredPelanggan.length}</span> Member
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <Table headers={["Nama Pelanggan", "Kontak", "Level Tier", "Total Poin", "Alamat Utama", "Aksi"]}>
          {isLoading ? (
             <tr><td colSpan="6" className="p-8 text-center"><Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto" /></td></tr>
          ) : filteredPelanggan.length > 0 ? (
            filteredPelanggan.map((p) => (
              <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                <td className="p-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                      {p.users?.fullname?.charAt(0) || "U"}
                    </div>
                    <span className="font-bold text-gray-800">{p.users?.fullname}</span>
                  </div>
                </td>
                <td className="p-5">
                  <div className="text-sm text-gray-800 font-bold">{p.whatsapp || "-"}</div>
                  <div className="text-xs text-gray-400">{p.users?.email}</div>
                </td>
                <td className="p-5">
                  <span className={`px-3 py-1.5 rounded-lg text-xs font-black tracking-wide flex items-center w-fit gap-1 ${
                    p.tier === 'VIP' ? 'bg-purple-100 text-purple-700 border border-purple-200' :
                    p.tier === 'Gold' ? 'bg-amber-100 text-amber-600' : 
                    p.tier === 'Silver' ? 'bg-slate-200 text-slate-600' : 
                    'bg-orange-50 text-orange-600'
                  }`}>
                    <Star size={12} className={p.tier === 'VIP' ? 'fill-purple-700' : p.tier === 'Gold' ? 'fill-amber-600' : ''} /> {p.tier}
                  </span>
                </td>
                <td className="p-5">
                    <div className="text-xl font-black text-slate-800 tracking-tighter">{p.poin || 0} <span className="text-xs font-semibold text-slate-400 tracking-normal">pt</span></div>
                </td>
                <td className="p-5 text-xs text-gray-500 max-w-[200px] truncate" title={p.alamat}>
                    <MapPin size={12} className="inline mr-1 -mt-0.5" /> {p.alamat || "Belum diatur"}
                </td>
                <td className="p-5">
                  <div className="flex items-center justify-center gap-2">
                    <button onClick={() => handleOpenEdit(p)} className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 text-orange-500 hover:bg-orange-50 rounded-lg transition-colors font-semibold text-xs" title="Edit Poin Kompensasi">
                      <Edit size={14} /> Kelola Poin
                    </button>
                    
                    {/* TOMBOL HAPUS AKUN PELANGGAN */}
                    <button onClick={() => handleDeletePelanggan(p.user_id, p.users?.fullname)} className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 text-red-500 hover:bg-red-50 rounded-lg transition-colors font-semibold text-xs" title="Hapus Akun Pelanggan">
                      <Trash2 size={14} /> Hapus
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="p-12 text-center text-gray-400 bg-gray-50/50">
                Data customer dengan tier <span className="font-semibold text-gray-700">"{activeFilter}"</span> tidak ditemukan.
              </td>
            </tr>
          )}
        </Table>
      </div>

      {/* MODAL EDIT POIN MANUAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
            <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">Kompensasi Poin</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500 transition-colors p-1 bg-white rounded-full hover:bg-red-50"><X size={20} /></button>
            </div>
            <form onSubmit={handleSimpanPoin} className="p-6">
                <div className="mb-4">
                    <p className="text-xs text-gray-500 font-semibold uppercase mb-1">Pelanggan</p>
                    <p className="font-bold text-gray-800">{editData?.users?.fullname}</p>
                </div>
                <div className="mb-6">
                    <p className="text-xs text-gray-500 font-semibold uppercase mb-1">Poin Saat Ini</p>
                    <p className="font-black text-3xl text-slate-900">{editData?.poin || 0} <span className="text-sm font-medium">pt ({editData?.tier})</span></p>
                </div>
                <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Tambahkan Poin Baru</label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500 font-bold">+</span>
                        <input type="number" required placeholder="Contoh: 100" value={poinTambahan} onChange={(e) => setPoinTambahan(e.target.value)} className="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:border-orange-500 text-lg font-black transition-colors" />
                    </div>
                </div>
                <button type="submit" disabled={isSubmitting} className="w-full py-3 rounded-xl font-bold text-white bg-slate-900 hover:bg-orange-500 transition-colors flex items-center justify-center gap-2">
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Suntikkan Poin"}
                </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL FORM TAMBAH PELANGGAN BARU */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-gray-100 transform transition-all flex flex-col max-h-[90vh]">
            
            <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50 shrink-0">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <UserPlus className="text-blue-600" />
                Tambah Pelanggan Baru
              </h2>
              <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-red-500 transition-colors p-1 bg-white rounded-full hover:bg-red-50">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddPelanggan} className="p-6 space-y-5 overflow-y-auto custom-scrollbar flex-1">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Lengkap</label>
                <input 
                  type="text" required 
                  placeholder="Contoh: Budi Santoso"
                  value={addFormData.fullname}
                  onChange={(e) => setAddFormData({...addFormData, fullname: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:border-blue-500 text-sm font-medium transition-colors" 
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Nomor WhatsApp</label>
                <input 
                  type="text" required 
                  placeholder="Contoh: 081234567890"
                  value={addFormData.whatsapp}
                  onChange={(e) => setAddFormData({...addFormData, whatsapp: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:border-blue-500 text-sm font-medium transition-colors" 
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                <input 
                  type="email" required 
                  placeholder="Contoh: budi@gmail.com"
                  value={addFormData.email}
                  onChange={(e) => setAddFormData({...addFormData, email: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:border-blue-500 text-sm font-medium transition-colors" 
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Password Akun</label>
                <input 
                  type="text" required 
                  placeholder="Masukkan password untuk member login"
                  value={addFormData.password}
                  onChange={(e) => setAddFormData({...addFormData, password: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:border-blue-500 text-sm font-medium transition-colors" 
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-5 py-2.5 text-sm font-bold text-gray-500 hover:text-gray-700 transition-colors">
                  Batal
                </button>
                <button type="submit" disabled={isAdding} className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-all shadow-md shadow-blue-500/30 flex items-center gap-2">
                  {isAdding ? <Loader2 size={16} className="animate-spin" /> : null}
                  Simpan Pelanggan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}