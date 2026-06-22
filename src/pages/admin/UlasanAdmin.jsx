import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Star, MessageSquare, CheckCircle2, XCircle, Loader2, Trash2, Eye } from "lucide-react";

// Import Komponen Reusable sesuai arsitektur project Anda
import PageHeader from "@/components/PageHeader";
import Table from "@/components/Table";

// Import API
import { transactionAPI } from "@/services/transactionAPI";

export default function UlasanAdmin() {
    const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("Semua");
  
  const filters = ["Semua", "Ditampilkan", "Disembunyikan", "Bintang 5"];

  // 1. Tarik Data Ulasan dari Supabase
  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      const data = await transactionAPI.getAllReviews();
      setReviews(data);
    } catch (error) {
      console.error("Gagal menarik data ulasan:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // 2. Logika Sakelar (Toggle) Tampilkan di Landing Page
  const handleToggleFeatured = async (item) => {
    const currentStatus = item.is_featured;
    try {
      // Panggil API untuk mengubah kolom is_featured di Supabase
      await transactionAPI.toggleReviewFeatured(item.id, !currentStatus);
      
      // Update state lokal secara instan agar UI terasa responsif
      setReviews(reviews.map(r => r.id === item.id ? { ...r, is_featured: !currentStatus } : r));
    } catch (error) {
      alert("Gagal mengubah status publikasi ulasan.");
    }
  };

  // 3. Penyaringan Data (Filter Tabs)
  const filteredReviews = reviews.filter(r => {
    if (activeFilter === "Ditampilkan") return r.is_featured === true;
    if (activeFilter === "Disembunyikan") return r.is_featured === false;
    if (activeFilter === "Bintang 5") return r.rating === 5;
    return true; // "Semua"
  });

  const tableHeaders = [
    "No", 
    "Pelanggan", 
    "No. Resi", 
    "Rating", 
    "Komentar Pelanggan", 
    "Tampilkan di Beranda", 
    "Aksi"
  ];

  return (
    <div className="animate-fade-in font-poppins px-8 pb-8 pt-4">
      
      {/* HEADER HALAMAN */}
      <PageHeader 
        title="Moderasi Ulasan & Feedback" 
        subtitle="Kurasi testimoni pelanggan untuk ditampilkan pada Landing Page depan." 
      />

      {/* FILTER TABS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 mt-4">
        <div className="flex flex-wrap gap-2 bg-gray-100/80 p-1 rounded-xl w-fit">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                activeFilter === filter
                  ? "bg-white text-blue-800 shadow-sm border border-gray-100"
                  : "text-gray-400 hover:text-gray-700"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
        <div className="text-xs font-bold text-gray-400 bg-gray-50 px-3 py-2 rounded-xl border border-gray-100 shadow-sm">
          Total Terfilter: <span className="text-blue-800 font-extrabold">{filteredReviews.length}</span> Ulasan
        </div>
      </div>

      {/* TABEL DATA MODERASI */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <Table headers={tableHeaders}>
          {isLoading ? (
            <tr>
              <td colSpan="7" className="p-12 text-center">
                <Loader2 className="w-8 h-8 text-blue-800 animate-spin mx-auto" />
              </td>
            </tr>
          ) : filteredReviews.length > 0 ? (
            filteredReviews.map((item, index) => (
              <tr key={item.id} className="border-b border-gray-50 hover:bg-blue-50/20 transition-colors">
                <td className="p-5 text-gray-400 text-sm font-medium">{index + 1}</td>
                
                {/* Info Pelanggan */}
                <td className="p-5">
                  <div className="font-bold text-gray-800">{item.users?.fullname || "Pelanggan Kucekin"}</div>
                </td>
                
                {/* ID Transaksi / Resi */}
                <td className="p-5 text-sm font-mono font-bold text-slate-500">{item.transaction_id}</td>
                
                {/* Rating Bintang Visual */}
                <td className="p-5">
                  <div className="flex items-center gap-0.5 text-amber-400">
                    {[...Array(5)].map((_, idx) => (
                      <Star 
                        key={idx} 
                        size={14} 
                        className={idx < item.rating ? "fill-amber-400" : "text-gray-200"} 
                      />
                    ))}
                  </div>
                </td>
                
                {/* Komentar Teks */}
                <td className="p-5 max-w-xs md:max-w-md">
                  <p className="text-sm text-gray-600 font-medium leading-relaxed italic">
                    "{item.komentar}"
                  </p>
                  <p className="text-[10px] text-gray-400 font-semibold mt-1">
                    Dikirim pada {new Date(item.created_at).toLocaleDateString('id-ID', { dateStyle: 'medium' })}
                  </p>
                </td>
                
                {/* KOLOM UTAMA: SAKELAR (TOGGLE) KURASI */}
                <td className="p-5">
                  <button
                    onClick={() => handleToggleFeatured(item)}
                    className={`px-4 py-2 rounded-xl text-xs font-black tracking-wide flex items-center gap-1.5 border transition-all ${
                      item.is_featured
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                        : "bg-gray-50 text-gray-400 border-gray-200 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200"
                    }`}
                  >
                    {item.is_featured ? (
                      <><CheckCircle2 size={14} /> TAYANG</>
                    ) : (
                      <><XCircle size={14} /> SEMBUNYI</>
                    )}
                  </button>
                </td>
                
                {/* Link Cepat ke Pesanan terkait */}
                <td className="p-5">
                  <button 
                    onClick={() => navigate(`/admin/pesanan/${item.transaction_id}`)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Lihat Detail Transaksi"
                  >
                    <Eye size={18} />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="p-12 text-center text-gray-400 font-medium bg-gray-50/50">
                Tidak ada data ulasan pada kategori <span className="font-bold text-gray-700">"{activeFilter}"</span>.
              </td>
            </tr>
          )}
        </Table>
      </div>

    </div>
  );
}