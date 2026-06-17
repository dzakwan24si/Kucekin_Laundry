import { useState, useEffect } from "react";
import { Search, Plus, Edit, Trash2, Eye, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

// Import Komponen Reusable
import PageHeader from "../components/PageHeader";
import Button from "../components/Button";
import Badge from "../components/Badge";
import Table from "../components/Table";

// Import Komponen Shadcn
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Import API
import { transactionAPI } from "@/services/transactionAPI";

export default function Pesanan() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("Semua");
  const navigate = useNavigate();

  // State Data Database
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fungsi Tarik Data
  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const data = await transactionAPI.getAllTransactions();
      setOrders(data);
    } catch (error) {
      console.error("Gagal menarik data pesanan:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // ==========================================
  // LOGIKA HAPUS PESANAN
  // ==========================================
  const handleDelete = async (id) => {
    // Tampilkan peringatan sebelum menghapus
    const isConfirmed = window.confirm(
      `Apakah Anda yakin ingin menghapus pesanan dengan Resi: ${id}?\nData yang dihapus tidak dapat dikembalikan.`
    );

    if (isConfirmed) {
      try {
        await transactionAPI.deleteTransaction(id);

        // Update UI secara instan dengan membuang data yang dihapus dari state
        setOrders(orders.filter((order) => order.id !== id));
        alert("Pesanan berhasil dihapus!");
      } catch (error) {
        console.error("Gagal menghapus:", error);
        alert("Terjadi kesalahan saat menghapus pesanan.");
      }
    }
  };

  const tableHeaders = [
    "No. Resi",
    "Tanggal",
    "Pelanggan",
    "Layanan & Berat",
    "Status",
    "Total Tagihan",
    "Aksi",
  ];

  // Helper Format Tanggal
  const formatTanggal = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Helper Ambil Info Layanan
  const getLayananInfo = (order) => {
    const detail = order.transaction_details?.[0];
    if (!detail) return { nama: "-", berat: "-" };
    const jenis = detail.services?.jenis === "Kiloan" ? "kg" : "pcs";
    return {
      nama: detail.services?.nama_layanan || "-",
      berat: `${detail.qty} ${jenis}`,
    };
  };

  // Logika Filter Data (Search & Tabs)
  const filteredOrders = orders.filter((order) => {
    const customerName = order.users?.fullname || "";
    const matchSearch =
      customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchTab =
      activeTab === "Semua" || order.status_pesanan === activeTab;
    return matchSearch && matchTab;
  });

  return (
    <div className="animate-fade-in font-poppins px-8 pb-8 pt-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <PageHeader
          title="Manajemen Pesanan"
          subtitle="Kelola semua transaksi dan status cucian pelanggan."
        />
        <Button
          type="primary"
          onClick={() => navigate("/admin/pesanan/baru")}
          className="flex items-center gap-2"
        >
          <Plus size={20} /> Buat Pesanan Baru
        </Button>
      </div>

      <Tabs
        defaultValue="Semua"
        onValueChange={setActiveTab}
        className="w-full"
      >
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Cari no. resi atau nama pelanggan..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <TabsList className="bg-gray-100 p-1 rounded-xl h-auto flex-wrap md:flex-nowrap">
            <TabsTrigger value="Semua" className="rounded-lg px-3 py-2 text-sm data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm">Semua</TabsTrigger>
            <TabsTrigger value="Diterima" className="rounded-lg px-3 py-2 text-sm data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm">Diterima</TabsTrigger>
            <TabsTrigger value="Dijemput" className="rounded-lg px-3 py-2 text-sm data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm">Dijemput</TabsTrigger>
            <TabsTrigger value="Diproses" className="rounded-lg px-3 py-2 text-sm data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm">Diproses</TabsTrigger>
            <TabsTrigger value="Diantar" className="rounded-lg px-3 py-2 text-sm data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm">Diantar</TabsTrigger>
            <TabsTrigger value="Selesai" className="rounded-lg px-3 py-2 text-sm data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm">Selesai</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value={activeTab} className="mt-0 outline-none">
          <Table headers={tableHeaders}>
            {isLoading ? (
              <tr>
                <td colSpan="7" className="p-8 text-center">
                  <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto" />
                </td>
              </tr>
            ) : filteredOrders.length > 0 ? (
              filteredOrders.map((order, index) => {
                const info = getLayananInfo(order);
                return (
                  <tr
                    key={index}
                    className="border-b border-gray-50 hover:bg-blue-50/30 transition-colors"
                  >
                    <td className="p-5 font-bold text-blue-600">{order.id}</td>
                    <td className="p-5 text-gray-500">
                      {formatTanggal(order.created_at)}
                    </td>
                    <td className="p-5 font-semibold text-gray-800">
                      {order.users?.fullname}
                    </td>
                    <td className="p-5">
                      <p className="font-medium text-gray-800">{info.nama}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {info.berat}
                      </p>
                    </td>
                    <td className="p-5">
                      <Badge status={order.status_pesanan} />
                    </td>
                    <td className="p-5 font-bold text-gray-800">
                      Rp {order.total_harga.toLocaleString("id-ID")}
                    </td>
                    <td className="p-5">
                      <div className="flex items-center justify-center gap-2">
                        {/* Tombol View/Detail (Mode Baca) */}
                        <Link
                          to={`/admin/pesanan/${order.id}`}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center"
                          title="Detail"
                        >
                          <Eye size={18} />
                        </Link>

                        {/* Tombol Edit (Mode Edit) - PERHATIKAN TAMBAHAN ?mode=edit DI SINI */}
                        <Link
                          to={`/admin/pesanan/${order.id}?mode=edit`}
                          className="p-2 text-orange-500 hover:bg-orange-50 rounded-lg transition-colors"
                          title="Edit Status"
                        >
                          <Edit size={18} />
                        </Link>

                        {/* Tombol Hapus dengan onClick handler */}
                        <button
                          onClick={() => handleDelete(order.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Hapus"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="7" className="p-8 text-center text-gray-500">
                  Tidak ada pesanan dengan status <b>{activeTab}</b>.
                </td>
              </tr>
            )}
          </Table>
        </TabsContent>
      </Tabs>
    </div>
  );
}
