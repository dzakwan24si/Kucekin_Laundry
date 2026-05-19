export default function SupplyProgress({ name, amount, unit, progress, color }) {
    return (
      <div className="mb-3">
        <div className="flex justify-between mb-1.5">
          <span className="text-xs font-medium text-gray-600">{name}</span>
          <span className="text-xs text-gray-400">Sisa {amount} {unit}</span>
        </div>
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className={`h-full rounded-full ${color}`} style={{ width: `${progress}%` }} />
        </div>
      </div>
    );
  }