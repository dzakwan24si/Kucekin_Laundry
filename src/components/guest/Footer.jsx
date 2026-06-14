const Footer = () => {
  return (
    <footer className="bg-gray-50 pt-20 pb-8 px-6 md:px-12 border-t border-gray-200">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Brand */}
        <div className="md:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <img
              src="/img/LogoKucekinVertical.png"
              alt="Logo Kucekin"
              className="h-10 w-auto object-contain"
            />
          </div>
          <p className="text-sm text-slate-500 leading-relaxed mb-6">
            Solusi laundry profesional untuk membantu Anda merawat pakaian
            dengan kualitas terbaik dan tepat waktu.
          </p>
        </div>

        {/* Company Links */}
        <div>
          <h4 className="text-sm font-bold text-slate-900 mb-4">Perusahaan</h4>
          <div className="flex flex-col gap-3">
            {["Tentang Kami", "Kontak", "Layanan", "Karir"].map((item) => (
              <a
                key={item}
                href="#"
                className="text-sm text-slate-500 hover:text-slate-900 transition-colors"
              >
                {item}
              </a>
            ))}
          </div>
        </div>

        {/* Bantuan */}
        <div>
          <h4 className="text-sm font-bold text-slate-900 mb-4">Bantuan</h4>
          <div className="flex flex-col gap-3">
            {["Syarat & Ketentuan", "Kebijakan Privasi", "FAQ"].map((item) => (
              <a
                key={item}
                href="#"
                className="text-sm text-slate-500 hover:text-slate-900 transition-colors"
              >
                {item}
              </a>
            ))}
          </div>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-sm font-bold text-slate-900 mb-4">Info Kontak</h4>
          <div className="flex flex-col gap-3 text-sm text-slate-500">
            <p>📍 Jl. Umban Sari, Rumbai, Pekanbaru</p>
            <p>📞 +62 812 3456 7890</p>
            <p>✉️ hello@kucekin.com</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto border-t border-gray-200 mt-16 pt-8 text-center text-sm text-slate-400">
        Copyright © 2026 Kucekin. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
