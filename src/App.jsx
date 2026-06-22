import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";


const AuthMember = React.lazy(() => import("./pages/auth/AuthMember"));
const ProfilMember = React.lazy(() => import("./pages/member/ProfilMember"));
const PesananMember = React.lazy(() => import("./pages/member/PesananMember"));
const PromoMember = React.lazy(() => import("./pages/member/PromoMember"));

// === 1. IMPORTS LAYOUTS ===
const AuthLayout = React.lazy(() => import("./layouts/AuthLayout"));
const MainLayout = React.lazy(() => import("./layouts/MainLayout"));
const GuestLayout = React.lazy(() => import("./layouts/GuestLayout"));
const MemberLayout = React.lazy(() => import("./layouts/MemberLayout"));

// === 2. IMPORTS COMPONENTS ===
const Loading = React.lazy(() => import("./components/Loading"));

// === 3. IMPORTS GUEST / PUBLIC PAGES ===
const LandingPage = React.lazy(() => import("./pages/guest/LandingPage"));
const Pemesanan = React.lazy(() => import("./pages/member/Pemesanan"));
const CekStatus = React.lazy(() => import("./pages/guest/CekStatus"));

const DasborMember = React.lazy(() => import("./pages/member/DasborMember"));

// === 4. IMPORTS AUTH PAGES (Dari Master) ===
const Login = React.lazy(() => import("./pages/auth/Login"));
const Register = React.lazy(() => import("./pages/auth/Register"));

// === 5. IMPORTS ADMIN PAGES (Dari Master & GuestPage) ===
const Beranda = React.lazy(() => import("./pages/admin/Beranda"));
const Pesanan = React.lazy(() => import("./pages/admin/Pesanan"));
const DetailPesanan = React.lazy(() => import("./pages/admin/DetailPesanan"));
const Layanan = React.lazy(() => import("./pages/admin/Layanan"));
const Pelanggan = React.lazy(() => import("./pages/admin/Pelanggan"));
const Components = React.lazy(() => import("./pages/admin/Components"));
const Karyawan = React.lazy(() => import("./pages/admin/Karyawan"));
const PromoAdmin = React.lazy(() => import("./pages/admin/PromoAdmin"));
const UlasanAdmin = React.lazy(() => import("./pages/admin/UlasanAdmin"));

export default function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>

        {/* ========================================================
            AREA OTENTIKASI MEMBER
            ======================================================== */}
                <Route path="/login" element={<AuthMember />} />
                <Route path="/register" element={<AuthMember />} />

        {/* ========================================================
            AREA AUTENTIKASI (Login & Register)
        ======================================================== */}
        <Route element={<AuthLayout />}>
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin/register" element={<Register />} />
        </Route>

        {/* ========================================================
            AREA PUBLIK / GUEST (Menggunakan GuestLayout)
        ======================================================== */}
        <Route path="/" element={<GuestLayout />}>
          <Route index element={<LandingPage />} />
          <Route path="status" element={<CekStatus />} />
        </Route>

        {/* ========================================================
            AREA MEMBER / CUSTOMER PORTAL
        ======================================================== */}
        <Route path="/member" element={<MemberLayout />}>
          <Route index element={<DasborMember />} />
          <Route path="promo" element={<PromoMember />} />
          <Route path="pesanan" element={<PesananMember />} />
          <Route path="pesan" element={<Pemesanan />} />
          <Route path="profil" element={<ProfilMember />} />
        </Route>

        {/* ========================================================
            AREA PRIVATE / ADMIN (Menggunakan MainLayout)
            Semua admin route sekarang rapi di bawah /admin
        ======================================================== */}
        <Route path="/admin" element={<MainLayout />}>
          <Route index element={<Beranda />} />
          <Route path="pesanan" element={<Pesanan />} />
          <Route path="pesanan/:id" element={<DetailPesanan />} />
          <Route path="layanan" element={<Layanan />} />
          <Route path="pelanggan" element={<Pelanggan />} />
          <Route path="components" element={<Components />} />
          <Route path="karyawan" element={<Karyawan />} />
          <Route path="promo" element={<PromoAdmin />} />
          <Route path="/admin/ulasan" element={<UlasanAdmin />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
