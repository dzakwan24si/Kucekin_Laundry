export default function Checkbox({ label, id }) {
    return (
      <label htmlFor={id} className="flex items-center text-xs font-medium text-gray-500 cursor-pointer">
        <input type="checkbox" id={id} className="mr-2 rounded border-gray-300 text-blue-500 focus:ring-blue-500 w-3.5 h-3.5" />
        {label}
      </label>
    );
  }