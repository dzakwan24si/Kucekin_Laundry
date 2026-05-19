export default function Badge({ status }) {
    const styles = {
      "Menunggu": "bg-red-100 text-red-600 border-red-200",
      "Diproses": "bg-amber-100 text-amber-600 border-amber-200",
      "Selesai": "bg-green-100 text-green-600 border-green-200",
      "Diambil": "bg-blue-100 text-blue-600 border-blue-200",
    };
    return (
      <span className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${styles[status] || "bg-gray-100 text-gray-600"}`}>
        {status}
      </span>
    );
  }