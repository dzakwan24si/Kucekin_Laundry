export default function InputField({ label, icon: Icon, type = "text", ...props }) {
    return (
      <div className="space-y-1.5 w-full">
        {label && <label className="block text-xs font-medium text-gray-600">{label}</label>}
        <div className="relative">
          {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />}
          <input type={type} className={`w-full py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-200 outline-none ${Icon ? 'pl-10 pr-4' : 'px-4'}`} {...props} />
        </div>
      </div>
    );
  }