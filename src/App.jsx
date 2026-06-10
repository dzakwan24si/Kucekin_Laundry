import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
const Karyawan = React.lazy(() => import("./pages/Karyawan"));
const Register = React.lazy(() => import("./pages/auth/Register"));
const Pelanggan = React.lazy(() => import("./pages/Pelanggan"));
const DetailPesanan = React.lazy(() => import("./pages/DetailPesanan"));
const MainLayout = React.lazy(() => import("./layouts/MainLayout"));
const Loading = React.lazy(() => import("./components/Loading"));
const AuthLayout = React.lazy(() => import("./layouts/AuthLayout"));
const Pesanan = React.lazy(() => import("./pages/Pesanan"));
const Layanan = React.lazy(() => import("./pages/Layanan"));
const Login = React.lazy(() => import("./pages/auth/Login"));
const Beranda = React.lazy(() => import("./pages/Beranda"));
const CekStatus = React.lazy(() => import("./pages/CekStatus"));
const Components = React.lazy(() => import("./pages/Components"));

export default function App() {
    return (
        <Suspense fallback={<Loading />}>
            <Routes>
                <Route element={<AuthLayout />}>
                <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                </Route>

                <Route element={<MainLayout />}>
                    <Route path="/" element={<Beranda />} />
                    <Route path="/status" element={<CekStatus />} />
                    <Route path="/pesanan" element={<Pesanan />} />
                    <Route path="/pesanan/:id" element={<DetailPesanan />} />
                    <Route path="/layanan" element={<Layanan />} />
                    <Route path="/components" element={<Components />} />
                    <Route path="/pelanggan" element={<Pelanggan />} />
                    <Route path="/karyawan" element={<Karyawan />} />
                </Route>
            </Routes>
        </Suspense>
    );
}
