import { useParams, Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react"; 
import { ArrowLeft, User, Phone, Receipt, CheckCircle2, Printer } from "lucide-react";
import ordersDetail from "../data/ordersDetail.json";

import Card from "../components/Card";
import Badge from "../components/Badge";
import Button from "../components/Button";
import LoadingSpinner from "../components/LoadingSpinner";

export default function DetailPesanan() {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    
    // 2️⃣ Inisialisasi useRef untuk komponen cetak nota
    const notaRef = useRef(null);

    useEffect(() => {
        setTimeout(() => {
            const foundOrder = ordersDetail.find(item => item.id === id);
            setOrder(foundOrder);
            setLoading(false);
        }, 500); 
    }, [id]);

    // 3️⃣ Fungsi untuk mencetak nota menggunakan useRef
    const handleCetakNota = () => {
        // Mengambil isi HTML dari elemen yang direferensikan oleh notaRef
        const printContent = notaRef.current.innerHTML;
        const originalContent = document.body.innerHTML;

        // Mengganti seluruh isi halaman web sementara dengan isi nota saja
        document.body.innerHTML = `
            <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 400px; margin: auto;">
                <h2 style="text-align: center; margin-bottom: 20px;">Nota FreshLaundry</h2>
                ${printContent}
                <hr style="margin-top: 20px; border-top: 1px dashed #ccc;" />
                <p style="text-align: center; font-size: 12px; color: #666;">Terima kasih telah mencuci di FreshLaundry!</p>
            </div>
        `;

        // Membuka jendela print bawaan browser
        window.print();

        // Mengembalikan tampilan web ke kondisi semula setelah jendela print ditutup
        document.body.innerHTML = originalContent;
        // Reload diperlukan agar React meng-attach ulang event listener (karena kita me-replace body HTML)
        window.location.reload(); 
    };

    if (loading) return <div className="mt-20"><LoadingSpinner /></div>;
    
    if (!order) return (
        <div className="p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-800">Pesanan Tidak Ditemukan</h2>
            <p className="text-red-500 mt-2">ID Resi: {id} tidak ada dalam database.</p>
            <Link to="/pesanan" className="mt-4 inline-block text-blue-600 hover:underline">Kembali ke Daftar Pesanan</Link>
        </div>
    );

    return (
        <div className="animate-fade-in font-poppins px-8 pb-8 pt-4">
            <div className="flex items-center gap-4 mb-8">
                <Link to="/admin/pesanan" className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all text-gray-500">
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                        Detail Pesanan <span className="text-blue-600 bg-blue-50 px-3 py-1 rounded-lg text-xl">{order.id}</span>
                    </h1>
                    <p className="text-sm text-gray-400 mt-1">Diterima pada {order.date}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Informasi Pelanggan</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-start gap-3">
                                <User className="text-gray-400 mt-1" size={20} />
                                <div>
                                    <p className="text-xs text-gray-400 font-semibold">Nama Pelanggan</p>
                                    <p className="text-gray-800 font-bold">{order.customer}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Phone className="text-gray-400 mt-1" size={20} />
                                <div>
                                    <p className="text-xs text-gray-400 font-semibold">Nomor HP</p>
                                    <p className="text-gray-800 font-bold">{order.phone}</p>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card>
                        <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Rincian Cucian</h2>
                        <ul className="space-y-2 mb-4">
                            {order.items.map((item, index) => (
                                <li key={index} className="flex items-center gap-2 text-gray-600">
                                    <CheckCircle2 size={16} className="text-green-500" /> {item}
                                </li>
                            ))}
                        </ul>
                        <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                            <p className="text-xs font-bold text-orange-800 uppercase mb-1">Catatan Khusus:</p>
                            <p className="text-sm text-orange-600">{order.notes}</p>
                        </div>
                    </Card>
                </div>

                <div className="h-fit sticky top-6">
                    {/* 4️⃣ Hubungkan ref ke dalam Card pembungkus konten tagihan yang ingin dicetak */}
                    <div ref={notaRef} className="bg-white p-6 rounded-t-2xl border border-b-0 border-gray-100 shadow-sm">
                        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <Receipt size={20} className="text-blue-600" /> Ringkasan Tagihan
                        </h2>
                        
                        <div className="space-y-3 text-sm text-gray-600 mb-6 border-b pb-4">
                            <div className="flex justify-between">
                                <span>No. Resi</span>
                                <span className="font-semibold text-gray-800">{order.id}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Layanan</span>
                                <span className="font-semibold text-gray-800">{order.service}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Berat/Jumlah</span>
                                <span className="font-semibold text-gray-800">{order.weight}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span>Status</span>
                                <Badge status={order.status} />
                            </div>
                        </div>
                        <div className="flex justify-between items-end">
                            <span className="text-gray-500 font-semibold">Total Bayar</span>
                            <span className="text-3xl font-black text-blue-600">{order.total}</span>
                        </div>
                    </div>
                    
                    {/* Tombol pemicu ditaruh di luar notaRef agar tombolnya sendiri tidak ikut tercetak */}
                    <div className="bg-white p-6 rounded-b-2xl border border-t-0 border-gray-100 shadow-sm pt-0">
                        <Button type="primary" onClick={handleCetakNota} className="w-full flex items-center justify-center gap-2">
                            <Printer size={18} /> Cetak Nota
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}