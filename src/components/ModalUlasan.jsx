import { useState } from "react";
import { motion } from "framer-motion";
import { Star, X, MessageSquare, Loader2 } from "lucide-react";
import { transactionAPI } from "@/services/transactionAPI";

export default function ModalUlasan({ isOpen, onClose, transactionId, userId, onReviewSuccess }) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [komentar, setKomentar] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!komentar.trim()) return alert("Mohon tuliskan komentar Anda.");
    
    setIsSubmitting(true);
    try {
      await transactionAPI.submitReview({
        transaction_id: transactionId,
        user_id: userId,
        rating: rating,
        komentar: komentar
      });
      
      alert("Terima kasih! Ulasan Anda sangat berharga bagi Kucekin.");
      onReviewSuccess(transactionId); // Beritahu halaman utama agar mengunci tombolnya
      onClose();
    } catch (error) {
      console.error(error);
      alert("Gagal mengirim ulasan. Anda mungkin sudah mengulas pesanan ini.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 font-poppins animate-fade-in">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden border border-slate-100"
      >
        {/* Header Modal */}
        <div className="flex justify-between items-center p-6 bg-slate-50 border-b border-slate-100">
          <h3 className="font-black text-slate-900 text-lg flex items-center gap-2">
            <MessageSquare className="text-orange-500" size={20} /> Beri Ulasan Pesanan
          </h3>
          <button onClick={onClose} className="p-1 bg-white border rounded-full hover:bg-red-50 hover:text-red-500 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Form Isi */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="text-center">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">No. Resi: {transactionId}</p>
            <p className="text-sm font-medium text-slate-600 mb-4">Bagaimana kualitas pencucian & layanan kurir kami?</p>
            
            {/* INTERAKTIF INTERFACES RATING BINTANG */}
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="transition-transform active:scale-90 p-1"
                >
                  <Star
                    size={36}
                    className={`transition-colors ${
                      star <= (hoverRating || rating)
                        ? "text-amber-400 fill-amber-400"
                        : "text-slate-200"
                    }`}
                  />
                </button>
              ))}
            </div>
            <span className="text-xs font-black text-amber-500 block mt-2">
              {rating === 5 ? "Sempurna! (Sangat Puas)" :
               rating === 4 ? "Bagus! (Puas)" :
               rating === 3 ? "Cukup Oke" :
               rating === 2 ? "Kurang Memuaskan" : "Buruk/Kecewa"}
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">Tulis Testimoni Anda</label>
            <textarea
              rows="4"
              required
              placeholder="Contoh: Pengerjaan cepat, baju wangi rapi, kurirnya ramah banget!..."
              value={komentar}
              onChange={(e) => setKomentar(e.target.value)}
              className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:border-slate-900 text-sm font-medium transition-all"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-slate-900 hover:bg-orange-500 text-white font-bold rounded-2xl transition-all shadow-md flex items-center justify-center gap-2"
          >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Kirim Ulasan"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}