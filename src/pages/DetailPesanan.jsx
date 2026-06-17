import { useParams, Link, useSearchParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react"; 
import { ArrowLeft, User, MapPin, Receipt, CheckCircle2, Printer, Check } from "lucide-react";

import Card from "../components/Card";
import Badge from "../components/Badge";
import Button from "../components/Button";
import LoadingSpinner from "../components/LoadingSpinner";

// Import API
import { transactionAPI } from "@/services/transactionAPI";
import { authAPI } from "@/services/authAPI"; // TAMBAHAN: Import authAPI untuk CRM

export default function DetailPesanan() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [searchParams] = useSearchParams();
    const isEditMode = searchParams.get("mode") === "edit";

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    
    const notaRef = useRef(null);

    const fetchDetail = async () => {
        try {
            const data = await transactionAPI.getTransactionById(id);
            setOrder(data);
        } catch (error) {
            console.error("Data tidak ditemukan");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDetail();
    }, [id]);

    const handleCetakNota = () => {
        const printContent = notaRef.current.innerHTML;
        const originalContent = document.body.innerHTML;

        document.body.innerHTML = `
            <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 400px; margin: auto;">
                <h2 style="text-align: center; margin-bottom: 20px;">Nota Kucekin Laundry</h2>
                ${printContent}
                <hr style="margin-top: 20px; border-top: 1px dashed #ccc;" />
                <p style="text-align: center; font-size: 12px; color: #666;">Terima kasih telah mencuci di Kucekin!</p>
            </div>
        `;
        window.print();
        document.body.innerHTML = originalContent;
        window.location.reload(); 
    };

    // ==========================================
    // LOGIKA OTOMATISASI POIN CRM KUCEKIN
    // ==========================================
    const handleUpdateStatus = async (newStatus) => {
        if (!confirm(`Ubah status menjadi ${newStatus}?`)) return;
        setIsUpdating(true);
        try {
            // 1. Update status pesanan di database transaksi
            await transactionAPI.updateTransactionStatus(id, newStatus);
            
            // 2. Jika statusnya "Selesai", jalankan injeksi Poin Loyalitas
            if (newStatus === "Selesai") {
                // Konversi: Setiap Rp 1.000 = 1 Poin (Contoh: Rp 35.000 = 35 Poin)
                const poinBonus = Math.floor(order.total_harga / 1000); 
                
                try {
                    // Cari sisa poin pelanggan saat ini
                    const profile = await authAPI.getMemberProfile(order.user_id);
                    const currentPoin = profile.poin || 0;
                    
                    // Suntikkan poin ke database member (Otomatis hitung tier)
                    await authAPI.adminUpdateCRM(order.user_id, currentPoin, poinBonus);
                    alert(`Pesanan selesai! Pelanggan mendapatkan bonus +${poinBonus} Poin Kucekin.`);
                } catch (crmError) {
                    console.error("Gagal menambah poin otomatis:", crmError);
                    alert("Pesanan selesai, namun terjadi kendala saat menambahkan poin CRM.");
                }
            } else {
                alert("Status berhasil diperbarui!");
            }

            fetchDetail(); // Refresh antarmuka
        } catch (error) {
            alert("Gagal memperbarui status.");
        } finally {
            setIsUpdating(false);
        }
    };

    if (loading) return <div className="mt-20"><LoadingSpinner /></div>;
    if (!order) return (
        <div className="p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-800">Pesanan Tidak Ditemukan</h2>
            <Link to="/admin/pesanan" className="mt-4 inline-block text-blue-600 hover:underline">Kembali</Link>
        </div>
    );

    const customerName = order.users?.fullname || "Pelanggan";
    const detailCucian = order.transaction_details?.[0];
    const layananNama = detailCucian?.services?.nama_layanan || "-";
    const satuan = detailCucian?.services?.jenis === 'Kiloan' ? 'kg' : 'pcs';
    const tanggalMasuk = new Date(order.created_at).toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' });

    return (
        <div className="animate-fade-in font-poppins px-8 pb-8 pt-4">
            {/* KODE UI SAMA PERSIS SEPERTI SEBELUMNYA */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all text-gray-500">
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                            {isEditMode ? "Edit Pesanan" : "Detail Pesanan"} 
                            <span className="text-blue-600 bg-blue-50 px-3 py-1 rounded-lg text-xl">{order.id}</span>
                        </h1>
                        <p className="text-sm text-gray-400 mt-1">Diterima pada {tanggalMasuk}</p>
                    </div>
                </div>
                
                {isEditMode ? (
                    <div className="flex items-center gap-2 bg-yellow-50 p-2.5 rounded-xl border border-yellow-200 shadow-sm">
                    <span className="text-sm font-semibold text-yellow-700 mr-2 ml-2">Ubah Status:</span>
                    <select 
                        value={order.status_pesanan}
                        onChange={(e) => handleUpdateStatus(e.target.value)}
                        disabled={isUpdating}
                        className="bg-white border border-yellow-300 text-gray-800 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 font-bold outline-none cursor-pointer shadow-sm"
                    >
                        <option value="Diterima">1. Diterima (Menunggu)</option>
                        <option value="Dijemput">2. Dijemput (Otw Laundry)</option>
                        <option value="Diproses">3. Diproses (Dicuci)</option>
                        <option value="Diantar">4. Diantar (Otw Pelanggan)</option>
                        <option value="Selesai">5. Selesai (Diterima Pelanggan)</option>
                    </select>
                </div>
                ) : (
                    <div className="mt-2 md:mt-0">
                        <Badge status={order.status_pesanan} />
                    </div>
                )}
            </div>

            <div className={`grid grid-cols-1 ${!isEditMode ? 'lg:grid-cols-3' : 'lg:grid-cols-2'} gap-6`}>
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Informasi Pelanggan</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-start gap-3">
                                <User className="text-gray-400 mt-1" size={20} />
                                <div>
                                    <p className="text-xs text-gray-400 font-semibold">Nama Pelanggan</p>
                                    <p className="text-gray-800 font-bold">{customerName}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <MapPin className="text-gray-400 mt-1" size={20} />
                                <div>
                                    <p className="text-xs text-gray-400 font-semibold">Alamat & Catatan Jemput</p>
                                    <p className="text-gray-800 font-bold text-sm leading-relaxed">{order.alamat_jemput}</p>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card>
                        <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Rincian Cucian</h2>
                        <ul className="space-y-3">
                            <li className="flex items-center justify-between gap-2 text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-100">
                                <div className="flex items-center gap-2 font-semibold">
                                   <CheckCircle2 size={18} className="text-green-500" /> {layananNama}
                                </div>
                                <span className="font-bold text-gray-800">{detailCucian?.qty} {satuan}</span>
                            </li>
                        </ul>
                    </Card>

                    {isEditMode && (
                        <div className="flex justify-end mt-6">
                            <Link to={`/admin/pesanan`} className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-md hover:bg-blue-700 transition-colors">
                                <Check size={18} /> Selesai Mengedit
                            </Link>
                        </div>
                    )}
                </div>

                {!isEditMode && (
                    <div className="h-fit sticky top-6">
                        <div ref={notaRef} className="bg-white p-6 rounded-t-2xl border border-b-0 border-gray-100 shadow-sm">
                            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <Receipt size={20} className="text-blue-600" /> Ringkasan Tagihan
                            </h2>
                            <div className="space-y-3 text-sm text-gray-600 mb-6 border-b pb-4">
                                <div className="flex justify-between">
                                    <span>No. Resi</span><span className="font-semibold text-gray-800">{order.id}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Layanan</span><span className="font-semibold text-gray-800">{layananNama}</span>
                                </div>
                                <div className="flex justify-between items-center mt-2">
                                    <span>Status</span>
                                    <span className="font-bold border border-gray-300 px-2 py-0.5 rounded text-xs">{order.status_pesanan}</span>
                                </div>
                            </div>
                            <div className="flex justify-between items-end">
                                <span className="text-gray-500 font-semibold">Total Bayar</span>
                                <span className="text-3xl font-black text-blue-600">Rp {order.total_harga.toLocaleString('id-ID')}</span>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-b-2xl border border-t-0 border-gray-100 shadow-sm pt-0">
                            <Button type="primary" onClick={handleCetakNota} className="w-full flex items-center justify-center gap-2">
                                <Printer size={18} /> Cetak Nota
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}