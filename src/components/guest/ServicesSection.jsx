import { motion } from 'framer-motion';

// Data statis layanan
const servicesData = [
  { title: 'Cuci & Lipat', desc: 'Lihat Detail', img: 'https://image.qwenlm.ai/public_source/ccc69bcd-f31d-4286-9fe8-970f55530d23/12e2a8507-49c5-4770-8e1c-d8a8ce4e7d6b.png', icon: 'img/LogoCuciLipat.png' },
  { title: 'Dry Cleaning', desc: 'Lihat Detail', img: 'https://image.qwenlm.ai/public_source/ccc69bcd-f31d-4286-9fe8-970f55530d23/1ac082507-a5d8-467f-a303-d03ad47e49c2.png', icon: 'img/LogoDryCleaning.png' },
  { title: 'Setrika Pakaian', desc: 'Lihat Detail', img: 'https://image.qwenlm.ai/public_source/ccc69bcd-f31d-4286-9fe8-970f55530d23/1fbd81a89-a5ee-4d5f-98a2-6defecd7aa81.png', icon: 'img/LogoSetrika.png' },
  { title: 'Cuci Sepatu', desc: 'Lihat Detail', img: 'img/laundry-sepatu.jpg', icon: 'img/LogoCuciSepatu.png' },
  { title: 'Cuci Karpet', desc: 'Lihat Detail', img: 'img/cuci-karpet.jpg', icon: 'img/LogoKarpet.png' },
  { title: 'Cuci Sprei & Selimut', desc: 'Lihat Detail', img: 'https://image.qwenlm.ai/public_source/ccc69bcd-f31d-4286-9fe8-970f55530d23/1c7d90c51-50dd-4985-8a18-691e09da92a1.png', icon: 'img/LogoCuciSprei.png' },
];
  
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 } 
  }
};
  
const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};
  
const ServicesSection = () => {
  return (
    <section id="layanan" className="py-20 px-6 bg-white text-center">
      <motion.h2 
        className="text-3xl md:text-4xl font-bold text-slate-900 mb-2"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }} 
        transition={{ duration: 0.6 }}
      >
        Kami hadir untuk membuat pelanggan<br />
        tersenyum dengan <span className="text-orange-500">layanan Kucekin</span>
      </motion.h2>
      
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mt-12"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
      >
        {servicesData.map((service, idx) => (
          <motion.div 
            key={idx} 
            variants={cardVariants}
            className="rounded-2xl overflow-hidden bg-white shadow-sm border border-slate-100 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 cursor-pointer group"
          >
            <div className="h-48 overflow-hidden">
              <img src={service.img} alt={service.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            {/* Perbaikan layout flex dan penambahan kembali deskripsi */}
            <div className="p-5 bg-gradient-to-br from-slate-50 to-gray-50 flex items-center justify-between border-t border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                  <img src={service.icon} className="w-6 h-6" alt="" />
                </div>
                <div className="text-left">
                  <div className="font-bold text-sm text-slate-900">{service.title}</div>
                  <div className="text-xs text-orange-500 font-medium flex items-center gap-1 mt-0.5">
                    {service.desc}
                    <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default ServicesSection;