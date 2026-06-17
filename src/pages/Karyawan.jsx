import { useState, useEffect } from "react";
import { Trash2, Shield, User as UserIcon, Plus, X, Mail, Lock } from "lucide-react";
import { authAPI } from "../services/authAPI";
import AlertBox from "../components/AlertBox";
import LoadingSpinner from "../components/LoadingSpinner";

export default function Karyawan() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // State untuk Modal Tambah Karyawan
    const [showModal, setShowModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        fullname: "",
        email: "",
        password: "",
        role: "Staf"
    });

    // Read: Ambil data dari Supabase (Hanya untuk internal)
    const loadUsers = async () => {
        try {
            setLoading(true);
            const data = await authAPI.getUsers();
            
            // LOGIKA PEMISAHAN ROLE: Filter hanya untuk internal Kucekin
            const karyawanOnly = data.filter(user => 
                user.role === 'Admin' || user.role === 'Staf'
            );
            
            setUsers(karyawanOnly);
        } catch (err) {
            setError("Gagal memuat data karyawan.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    // Create: Tambah data karyawan baru dari dalam Dashboard Admin
    const handleAddSubmit = async (e) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            setError("");
            
            // Kita gunakan registerUser dari authAPI karena fungsinya sama (menambah ke Supabase)
            await authAPI.registerUser(formData);
            
            setSuccess(`Karyawan baru (${formData.fullname}) berhasil ditambahkan.`);
            setShowModal(false); // Tutup modal
            setFormData({ fullname: "", email: "", password: "", role: "Staf" }); // Reset form
            loadUsers(); // Refresh tabel
            
            setTimeout(() => setSuccess(""), 3000);
        } catch (err) {
            setError(err.message || "Gagal menambah karyawan.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Delete: Hapus data karyawan
    const handleDelete = async (id, name) => {
        const confirmDelete = window.confirm(`Yakin ingin menghapus akun ${name}?`);
        if (!confirmDelete) return;

        try {
            setError("");
            await authAPI.deleteUser(id);
            setSuccess(`Akun ${name} berhasil dihapus.`);
            loadUsers(); // Refresh tabel
            setTimeout(() => setSuccess(""), 3000);
        } catch (err) {
            setError("Gagal menghapus akun.");
        }
    };

    // Update: Ubah Role (Jadikan Admin / Staf)
    const handleToggleRole = async (id, currentRole, name) => {
        const newRole = currentRole === "Admin" ? "Staf" : "Admin";
        const confirmUpdate = window.confirm(`Ubah role ${name} menjadi ${newRole}?`);
        if (!confirmUpdate) return;

        try {
            setError("");
            await authAPI.updateUser(id, { role: newRole });
            setSuccess(`Role ${name} berhasil diperbarui menjadi ${newRole}.`);
            loadUsers(); // Refresh tabel
            setTimeout(() => setSuccess(""), 3000);
        } catch (err) {
            setError("Gagal memperbarui role.");
        }
    };

    return (
        <div className="animate-fade-in font-poppins px-8 pb-8 pt-4 relative">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Data Karyawan</h1>
                    <p className="text-sm text-gray-500 mt-1">Kelola hak akses dan akun staf Kucekin Management.</p>
                </div>
                {/* Tombol pemicu Modal Create */}
                <button 
                    onClick={() => setShowModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-md shadow-blue-600/20"
                >
                    <Plus size={18} /> Tambah Karyawan
                </button>
            </div>

            {error && <AlertBox type="error">{error}</AlertBox>}
            {success && <AlertBox type="success">{success}</AlertBox>}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="p-10"><LoadingSpinner text="Memuat data karyawan..." /></div>
                ) : (
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Nama & Email</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Role / Jabatan</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Tanggal Bergabung</th>
                                <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {users.map((u) => (
                                <tr key={u.id} className="hover:bg-blue-50/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                                {u.fullname.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-800">{u.fullname}</p>
                                                <p className="text-xs text-gray-500">{u.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold flex w-fit items-center gap-1 ${u.role === 'Admin' ? 'bg-purple-100 text-purple-700' : 'bg-emerald-100 text-emerald-700'}`}>
                                            {u.role === 'Admin' ? <Shield size={12} /> : <UserIcon size={12} />}
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {new Date(u.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <button 
                                                onClick={() => handleToggleRole(u.id, u.role, u.fullname)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-xs font-semibold"
                                                title="Ubah Role"
                                            >
                                                Ubah Role
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(u.id, u.fullname)}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Hapus Akun"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {users.length === 0 && (
                                <tr><td colSpan="4" className="p-8 text-center text-gray-500">Belum ada data karyawan.</td></tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {/* MODAL POP-UP CREATE KARYAWAN */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in">
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <h2 className="text-xl font-bold text-gray-800">Tambah Karyawan Baru</h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-red-500 transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        
                        <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-600">Nama Lengkap</label>
                                <div className="relative">
                                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                    <input type="text" name="fullname" value={formData.fullname} onChange={handleChange} required placeholder="Contoh: Budi Santoso" className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-600">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                    <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="budi@laundry.com" className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-600">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                    <input type="password" name="password" value={formData.password} onChange={handleChange} required placeholder="Minimal 6 karakter" className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-600">Role / Jabatan</label>
                                <div className="relative">
                                    <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                    <select name="role" value={formData.role} onChange={handleChange} className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none">
                                        <option value="Staf">Staf (Kasir)</option>
                                        <option value="Admin">Admin (Pemilik)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.5 border border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition-colors text-sm">
                                    Batal
                                </button>
                                <button type="submit" disabled={isSubmitting} className="flex-1 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors text-sm disabled:bg-blue-400">
                                    {isSubmitting ? "Menyimpan..." : "Simpan Karyawan"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}