export default function Alert({ type = "error", message }) {
    const styles = type === "error" ? "bg-red-50 text-red-500 border-red-100" : "bg-green-50 text-green-600 border-green-100";
    return (
      <div className={`p-3 rounded-xl text-xs flex items-center font-semibold border ${styles}`}>
        <span className="mr-2">{type === "error" ? "⚠️" : "✅"}</span> {message}
      </div>
    );
  }