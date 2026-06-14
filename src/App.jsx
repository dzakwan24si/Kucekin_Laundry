import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";

// Layouts
const AuthLayout = React.lazy(() => import("./layouts/AuthLayout"));
const MainLayout = React.lazy(() => import("./layouts/MainLayout"));
const GuestLayout = React.lazy(() => import("./layouts/GuestLayout"));

// Components
const Loading = React.lazy(() => import("./components/Loading"));

// Guest / Public Pages (Akses Tanpa Login)
const LandingPage = React.lazy(() => import("./pages/LandingPage"));
const Pemesanan = React.lazy(() => import("./pages/guest/Pemesanan")); // Halaman booking baru
const CekStatus = React.lazy(() => import("./pages/guest/CekStatus"));

// Admin / Private Pages (Akses Internal Dashboard)
const Beranda = React.lazy(() => import("./pages/Beranda"));
const Pesanan = React.lazy(() => import("./pages/Pesanan"));
const DetailPesanan = React.lazy(() => import("./pages/DetailPesanan"));
const Layanan = React.lazy(() => import("./pages/Layanan"));
const Pelanggan = React.lazy(() => import("./pages/Pelanggan"));
const Components = React.lazy(() => import("./pages/Components"));
const Login = React.lazy(() => import("./pages/auth/Login"));

export default function App() {
    return (
        <Suspense fallback={<Loading />}>
            <Routes>
                
                {/* ========================================================
                    1. AREA AUTENTIKASI (Login)
                   ======================================================== */}
                <Route element={<AuthLayout />}>
                    <Route path="/login" element={<Login />} />
                </Route>

                {/* ========================================================
                    2. AREA PUBLIK / GUEST (Menggunakan GuestLayout)
                    Semua halaman di bawah ini akan otomatis memiliki Navbar & Footer Guest
                   ======================================================== */}
                <Route path="/" element={<GuestLayout />}>
                    <Route index element={<LandingPage />} />            
                    <Route path="pesan" element={<Pemesanan />} />         
                    <Route path="status" element={<CekStatus />} />       
                </Route>

                {/* ========================================================
                    3. AREA PRIVATE / ADMIN (Menggunakan MainLayout)
                    Semua halaman di bawah ini otomatis memiliki Sidebar & Header Admin
                   ======================================================== */}
                <Route path="/admin" element={<MainLayout />}>
                    <Route index element={<Beranda />} />                 
                    <Route path="pesanan" element={<Pesanan />} />         
                    <Route path="pesanan/:id" element={<DetailPesanan />} /> 
                    <Route path="layanan" element={<Layanan />} />         
                    <Route path="pelanggan" element={<Pelanggan />} />     
                    <Route path="components" element={<Components />} />   
                </Route>

            </Routes>
        </Suspense>
    );
}