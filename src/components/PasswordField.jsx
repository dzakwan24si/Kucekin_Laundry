import { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";
import InputField from "./InputField";

export default function PasswordField(props) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative w-full">
      <InputField type={show ? "text" : "password"} icon={Lock} {...props} />
      <button type="button" onClick={() => setShow(!show)} className="absolute right-4 top-1/2 -translate-y-1/2 mt-3 text-gray-400 hover:text-gray-700">
        {show ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  );
}