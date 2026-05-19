export default function Button({ children, type = "primary", onClick, className = "" }) {
    const styles = {
      primary: "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/30",
      secondary: "bg-gray-100 hover:bg-gray-200 text-gray-700",
      danger: "bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/30",
    };
    return (
      <button onClick={onClick} className={`px-5 py-2.5 rounded-xl font-bold transition-all ${styles[type]} ${className}`}>
        {children}
      </button>
    );
  }