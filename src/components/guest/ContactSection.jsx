import { useState } from 'react';
import { motion } from 'framer-motion';

const ContactSection = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', message: '' });

  return (
    <section id="kontak" className="py-20 px-6 bg-slate-50 text-center overflow-hidden">
      
      {/* Header Animasi Meluncur Ke Atas */}
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6 }}
        className="text-3xl md:text-4xl font-bold text-slate-900 mb-12"
      >
        Mari <span className="text-orange-500">Berbicara</span> Dengan Kami
      </motion.h2>
      
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8">
        
        {/* Info Kontak (Kiri) - Meluncur dari Kiri */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="lg:col-span-2 bg-slate-900 rounded-2xl p-8 text-left text-white relative overflow-hidden shadow-lg"
        >
          <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-orange-500/20 blur-2xl" />
          
          <h3 className="text-xl font-bold mb-2 relative z-10">Informasi Kontak</h3>
          <p className="text-sm text-slate-300 mb-8 leading-relaxed relative z-10">
            Isi formulir dan tim Kucekin akan menghubungi Anda kembali dalam waktu 24 jam.
          </p>
          
          <div className="flex flex-col gap-6 relative z-10">
            <div className="flex items-center gap-4 group">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-orange-500 transition-colors">📞</div>
              <span className="text-sm">+62 812 3456 7890</span>
            </div>
            <div className="flex items-center gap-4 group">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-orange-500 transition-colors">✉️</div>
              <span className="text-sm">hello@kucekin.com</span>
            </div>
            <div className="flex items-start gap-4 group">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0 group-hover:bg-orange-500 transition-colors">📍</div>
              <span className="text-sm leading-relaxed">
                Jl. Umban Sari No. 1, Rumbai,<br />
                Pekanbaru, Riau 28265
              </span>
            </div>
          </div>
        </motion.div>

        {/* Formulir (Kanan) - Meluncur dari Kanan */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="lg:col-span-3 text-left bg-white p-8 rounded-2xl shadow-sm border border-slate-100"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Nama Lengkap</label>
              <input type="text" placeholder="Masukkan nama Anda" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all text-sm" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
              <input type="email" placeholder="Masukkan email Anda" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all text-sm" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Nomor HP / WhatsApp</label>
              <input type="tel" placeholder="Contoh: 08123456789" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all text-sm" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Alamat Penjemputan</label>
              <input type="text" placeholder="Masukkan alamat lengkap" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all text-sm" />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Pesan Tambahan</label>
            <textarea rows="4" placeholder="Tuliskan detail pesanan atau pertanyaan Anda di sini..." className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all text-sm resize-y"></textarea>
          </div>
          
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-slate-900 hover:bg-slate-800 text-white rounded-full px-8 py-3.5 text-sm font-semibold transition-all shadow-md w-full md:w-auto"
          >
            Kirim Pesan
          </motion.button>
        </motion.div>

      </div>
    </section>
  );
};

export default ContactSection;