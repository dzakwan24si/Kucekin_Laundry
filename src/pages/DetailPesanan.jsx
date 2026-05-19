import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowLeft, User, Phone, Receipt, CheckCircle2 } from "lucide-react";
import ordersDetail from "../data/ordersDetail.json";

// Import Komponen Reusable
import Card from "../components/Card";
import Badge from "../components/Badge";
import Button from "../components/Button";
import LoadingSpinner from "../components/LoadingSpinner";

export default function DetailPesanan() {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            const foundOrder = ordersDetail.find(item => item.id === id);
            setOrder(foundOrder);
            setLoading(false);
        }, 500); 
    }, [id]);

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
            {/* Header Detail */}
            <div className="flex items-center gap-4 mb-8">
                <Link to="/pesanan" className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all text-gray-500">
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
                {/* Info Pelanggan & Status */}
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

                {/* Ringkasan Biaya */}
                <Card className="h-fit sticky top-6">
                    <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Receipt size={20} className="text-blue-600" /> Ringkasan Tagihan
                    </h2>
                    <div className="space-y-3 text-sm text-gray-600 mb-6 border-b pb-4">
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
                    <Button type="primary" className="w-full mt-6">
                        Cetak Nota
                    </Button>
                </Card>
            </div>
        </div>
    );
}