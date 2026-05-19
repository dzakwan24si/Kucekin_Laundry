export default function Logo({ size = "text-xl" }) {
    return (
      <div className={`font-black tracking-tight text-gray-800 ${size}`}>
        Fresh<span className="text-blue-500">Laundry.</span>
      </div>
    );
  }