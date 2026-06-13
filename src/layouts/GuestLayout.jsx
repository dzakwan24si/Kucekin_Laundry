import { Outlet } from "react-router-dom";
import Navbar from "../components/guest/Navbar";
import Footer from "../components/guest/Footer";

const GuestLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col justify-between">
      <Navbar />
      <main className="w-full flex-grow">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default GuestLayout;