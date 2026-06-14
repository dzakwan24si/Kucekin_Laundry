import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";

// === 1. IMPORTS LAYOUTS ===
const AuthLayout = React.lazy(() => import("./layouts/AuthLayout"));
const MainLayout = React.lazy(() => import("./layouts/MainLayout"));
const GuestLayout = React.lazy(() => import("./layouts/GuestLayout"));

// === 2. IMPORTS COMPONENTS ===
const Loading = React.lazy(() => import("./components/Loading"));

// === 3. IMPORTS GUEST / PUBLIC PAGES ===
const LandingPage = React.lazy(() => import("./pages/guest/LandingPage"));
const Pemesanan = React.lazy(() => import("./pages/guest/Pemesanan")); 
const CekStatus = React.lazy(() => import("./pages/guest/CekStatus"));

// === 4. IMPORTS AUTH PAGES (Dari Master) ===
const Login = React.lazy(() => import("./pages/auth/Login"));
const Register = React.lazy(() => import("./pages/auth/Register"));

// === 5. IMPORTS ADMIN PAGES (Dari Master & GuestPage) ===
const Beranda = React.lazy(() => import("./pages/Beranda"));
const Pesanan = React.lazy(() => import("./pages/Pesanan"));
const DetailPesanan = React.lazy(() => import("./pages/DetailPesanan"));
const Layanan = React.lazy(() => import("./pages/Layanan"));
const Pelanggan = React.lazy(() => import("./pages/Pelanggan"));
const Components = React.lazy(() => import("./pages/Components"));
const Karyawan = React.lazy(() => import("./pages/Karyawan")); 

export default function App() {
    return (
        <Suspense fallback={<Loading />}>
            <Routes>
                
                {/* ========================================================
                    AREA AUTENTIKASI (Login & Register)
                   ======================================================== */}
                <Route element={<AuthLayout />}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} /> {/* Tambahan dari master */}
                </Route>

                {/* ========================================================
                    AREA PUBLIK / GUEST (Menggunakan GuestLayout)
                   ======================================================== */}
                <Route path="/" element={<GuestLayout />}>
                    <Route index element={<LandingPage />} />            
                    <Route path="pesan" element={<Pemesanan />} />         
                    <Route path="status" element={<CekStatus />} />       
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
                    <Route path="karyawan" element={<Karyawan />} /> {/* Tambahan dari master */}
                </Route>

            </Routes>
        </Suspense>
    );
}