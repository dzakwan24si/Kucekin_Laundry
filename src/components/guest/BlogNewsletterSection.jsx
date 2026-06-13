import { motion } from 'framer-motion';

const blogPosts = [
  {
    date: 'Jumat, 15 Mar 2024', readTime: '2 Min Baca',
    img: 'https://image.qwenlm.ai/public_source/ccc69bcd-f31d-4286-9fe8-970f55530d23/178b5e9f2-cefb-4036-b349-23df9da0a95c.png',
    tag: 'Tips Laundry', title: 'Trik Laundry Esensial yang Wajib Diketahui Setiap Ibu Rumah Tangga',
  },
  {
    date: 'Selasa, 12 Mar 2024', readTime: '8 Min Baca',
    img: 'https://image.qwenlm.ai/public_source/ccc69bcd-f31d-4286-9fe8-970f55530d23/10f9cbbe9-d24a-41e7-8216-fe1d820ec19f.png',
    tag: 'Perawatan', title: 'Panduan Utama Menghilangkan Noda Membandel pada Pakaian Putih',
  },
  {
    date: 'Minggu, 10 Mar 2024', readTime: '6 Min Baca',
    img: 'https://image.qwenlm.ai/public_source/ccc69bcd-f31d-4286-9fe8-970f55530d23/1c84509be-76fc-417c-8c69-c89c55898edb.png',
    tag: 'Keluarga', title: 'Teknik Menyortir Cucian yang Efisien untuk Keluarga Sibuk',
  },
];

const BlogNewsletterSection = () => {
  return (
    <>
      {/* Blog Section */}
      <section id="blog" className="py-20 px-6 bg-white text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row justify-between items-center max-w-6xl mx-auto mb-10 gap-4"
        >
          <h2 className="text-3xl font-bold text-slate-900">
            Baca <span className="text-orange-500">Artikel Terbaru</span> Kami
          </h2>
          <button className="bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-full px-6 py-2.5 text-sm font-semibold transition-all">
            Lihat Semua Artikel
          </button>
        </motion.div>
        
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
            visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
            hidden: { opacity: 0 }
          }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto text-left"
        >
          {blogPosts.map((post, idx) => (
            <motion.div 
              key={idx} 
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
              }}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 cursor-pointer group"
            >
              <div className="h-48 overflow-hidden">
                <img src={post.img} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs text-slate-400 font-medium">{post.date}</span>
                  <span className="text-xs text-slate-400 font-medium">{post.readTime}</span>
                </div>
                <span className="inline-block bg-orange-50 text-orange-600 text-xs font-bold px-3 py-1 rounded-full mb-3">
                  {post.tag}
                </span>
                <h3 className="text-base font-bold text-slate-900 leading-snug group-hover:text-orange-500 transition-colors">
                  {post.title}
                </h3>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Newsletter Section (Diperbarui menjadi Card Banner) */}
      <section className="bg-white pb-20 px-6 relative overflow-hidden">
        <div className="max-w-5xl mx-auto">
          
          {/* Card Wadah Newsletter */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="bg-slate-900 rounded-[2.5rem] p-10 md:p-14 relative overflow-hidden shadow-2xl flex flex-col md:flex-row items-center gap-10 lg:gap-16 border border-slate-800"
          >
            {/* Dekorasi Background di Dalam Card */}
            <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-orange-500/20 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-slate-700/40 blur-3xl pointer-events-none" />

            {/* Gambar Newsletter - Lebar dikunci & disandarkan ke kiri */}
            <div className="w-full md:w-2/5 flex justify-center md:justify-start relative z-10 hidden md:block">
              <motion.img 
                whileHover={{ scale: 1.05, rotate: -2 }}
                transition={{ type: "spring", stiffness: 300 }}
                src="https://image.qwenlm.ai/public_source/ccc69bcd-f31d-4286-9fe8-970f55530d23/1af527ad6-f727-4247-ada4-3cd5605d02c1.png" 
                alt="Newsletter" 
                className="w-full max-w-[280px] object-contain drop-shadow-2xl mx-auto md:mx-0" 
              />
            </div>

            {/* Teks & Form Inline Modern */}
            <div className="w-full md:w-3/5 text-center md:text-left text-white relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
                Gabung ke <span className="text-orange-500">Newsletter</span>
              </h2>
              <p className="text-slate-300 text-sm md:text-base leading-relaxed mb-8">
                Berlangganan untuk mendapatkan berita, promo eksklusif, dan tips seputar perawatan pakaian langsung ke kotak masuk Anda.
              </p>
              
              {/* Form Input bergaya Kapsul/Pill menyatu dengan tombol */}
              <div className="flex flex-col sm:flex-row items-center bg-white/10 backdrop-blur-md p-1.5 rounded-3xl sm:rounded-full border border-white/20 shadow-inner max-w-md mx-auto md:mx-0">
                <input 
                  type="email" 
                  placeholder="Masukkan email Anda..." 
                  className="w-full sm:flex-1 bg-transparent px-5 py-3 text-sm text-white placeholder-slate-300 focus:outline-none" 
                />
                <button className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-full px-8 py-3 text-sm transition-all shadow-md mt-2 sm:mt-0">
                  Langganan
                </button>
              </div>

            </div>
          </motion.div>

        </div>
      </section>
    </>
  );
};

export default BlogNewsletterSection;