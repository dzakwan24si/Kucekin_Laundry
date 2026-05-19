export default function Avatar({ src, name, size = "w-9 h-9" }) {
    return (
      <div className={`${size} rounded-full overflow-hidden bg-blue-100 border-2 border-white shadow-sm`}>
        {src ? <img src={src} alt={name} className="w-full h-full object-cover" /> : <span className="flex items-center justify-center h-full font-bold text-blue-600">{name.charAt(0)}</span>}
      </div>
    );
  }