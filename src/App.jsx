import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
const DetailPesanan = React.lazy(() => import("./pages/DetailPesanan"));
const MainLayout = React.lazy(() => import("./layouts/MainLayout"));
const Loading = React.lazy(() => import("./components/Loading"));
const AuthLayout = React.lazy(() => import("./layouts/AuthLayout"));
const Pesanan = React.lazy(() => import("./pages/Pesanan"));
const Layanan = React.lazy(() => import("./pages/Layanan"));
const Login = React.lazy(() => import("./pages/auth/Login"));
const Beranda = React.lazy(() => import("./pages/Beranda"));
const CekStatus = React.lazy(() => import("./pages/CekStatus"));

export default function App() {
    return (
        <Suspense fallback={<Loading />}>
            <Routes>
                <Route element={<AuthLayout />}>
                    <Route path="/login" element={<Login />} />
                </Route>

                <Route element={<MainLayout />}>
                    <Route path="/" element={<Beranda />} />
                    <Route path="/status" element={<CekStatus />} />
                    <Route path="/pesanan" element={<Pesanan />} />
                    <Route path="/pesanan/:id" element={<DetailPesanan />} />
                    <Route path="/layanan" element={<Layanan />} />
                </Route>
            </Routes>
        </Suspense>
    );
}
