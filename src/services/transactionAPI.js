import axios from 'axios';
import { notificationAPI } from './notificationAPI';

// Gunakan URL dasar Supabase Anda
const BASE_URL = "https://impjljpcvddyhfzeuafn.supabase.co/rest/v1";
const API_KEY = "sb_publishable_RqqwWKzw8YLmUv6qPPtUyQ_Ma85wMbJ";

const headers = {
    apikey: API_KEY,
    Authorization: `Bearer ${API_KEY}`,
    "Content-Type": "application/json",
};

export const transactionAPI = {
    
    // 1. Ambil Katalog Layanan & Harga
    async getServices() {
        // Mengambil semua data dari tabel services dan mengurutkannya berdasarkan ID
        const response = await axios.get(`${BASE_URL}/services?select=*&order=id.asc`, { headers });
        return response.data;
    },

    // 2. Simpan Transaksi Baru (Master-Detail)
    async createTransaction(orderData, cartItems) {
        // A. Simpan ke tabel Induk (transactions)
        // Kita gunakan header "Prefer: return=representation" untuk memastikan data tersimpan
        const response = await axios.post(`${BASE_URL}/transactions`, orderData, { 
            headers: { ...headers, "Prefer": "return=representation" } 
        });

        const newTransaction = response.data[0];

        // B. Siapkan data keranjang untuk tabel Detail (transaction_details)
        // Kita looping array cartItems dan tambahkan transaksi_id yang baru saja dibuat
        const detailsPayload = cartItems.map(item => ({
            transaksi_id: newTransaction.id,
            layanan_id: item.layanan_id,
            qty: item.qty,
            harga_satuan: item.harga_satuan,
            subtotal: item.subtotal
        }));

        // C. Simpan secara massal (bulk insert) ke tabel transaction_details
        await axios.post(`${BASE_URL}/transaction_details`, detailsPayload, { headers });

        // Tembak Notifikasi ke Admin (Pesanan Baru)
        try {
            await notificationAPI.sendNotification({
                recipient_type: 'admin',
                title: 'Pesanan Baru Masuk!',
                message: `Pesanan baru (Resi: ${newTransaction.id}) telah dibuat oleh Member.`,
                type: 'new_order'
            });
        } catch (err) {
            console.error("Gagal kirim notif:", err);
        }

        return newTransaction;
    },

    // 3. Ambil Riwayat Transaksi Milik User Tertentu (DENGAN JOIN TABEL)
    async getUserTransactions(userId) {
        // Menggunakan sintaks select Supabase untuk nge-JOIN tabel transaction_details dan services
        const query = 'select=*,transaction_details(qty,services(nama_layanan,jenis))';
        const response = await axios.get(`${BASE_URL}/transactions?user_id=eq.${userId}&${query}&order=created_at.desc`, { headers });
        return response.data;
    },

    // 4. (ADMIN) Ambil SEMUA Transaksi 
    async getAllTransactions() {
        const query = 'select=*,users(fullname),transaction_details(qty,services(nama_layanan,jenis))';
        const response = await axios.get(`${BASE_URL}/transactions?${query}&order=created_at.desc`, { headers });
        return response.data;
    },

    // 5. (ADMIN) Ambil Detail Satu Transaksi berdasarkan ID Resi
    async getTransactionById(id) {
        const query = 'select=*,users(fullname),transaction_details(qty,harga_satuan,subtotal,services(nama_layanan,jenis))';
        const response = await axios.get(`${BASE_URL}/transactions?id=eq.${id}&${query}`, { headers });
        if (response.data.length === 0) throw new Error("Pesanan tidak ditemukan");
        return response.data[0];
    },

    // 6. (ADMIN) Ubah Status Pesanan
    async updateTransactionStatus(id, newStatus, userId = null) {
        const response = await axios.patch(`${BASE_URL}/transactions?id=eq.${id}`, { status_pesanan: newStatus }, { 
            headers: { ...headers, "Prefer": "return=representation" } 
        });
        
        // Tembak Notifikasi ke Member (Status Berubah)
        if (userId) {
            try {
                await notificationAPI.sendNotification({
                    user_id: userId,
                    recipient_type: 'member',
                    title: 'Status Pesanan Diperbarui',
                    message: `Pesanan Anda (Resi: ${id}) sekarang berstatus: ${newStatus}.`,
                    type: 'order_update'
                });
            } catch (err) {
                console.error("Gagal kirim notif:", err);
            }
        }
        
        return response.data[0];
    },

    // 7. (ADMIN) Hapus Transaksi
    async deleteTransaction(id) {
        const response = await axios.delete(`${BASE_URL}/transactions?id=eq.${id}`, { headers });
        return response.data;
    },

    // 8. Tambah Layanan Baru
    async addService(serviceData) {
        const response = await axios.post(`${BASE_URL}/services`, serviceData, { 
            headers: { ...headers, "Prefer": "return=representation" } 
        });
        
        // Tembak Notifikasi ke Semua Member (Broadcast Layanan Baru)
        try {
            await notificationAPI.sendNotification({
                recipient_type: 'broadcast',
                title: 'Layanan Baru Tersedia!',
                message: `Kami punya layanan baru: ${serviceData.nama_layanan}. Ayo cek sekarang!`,
                type: 'new_service'
            });
        } catch (err) {
            console.error("Gagal kirim notif broadcast:", err);
        }
        
        return response.data[0];
    },

    // 9. Edit Layanan
    async updateService(id, updatedData) {
        const response = await axios.patch(`${BASE_URL}/services?id=eq.${id}`, updatedData, { 
            headers: { ...headers, "Prefer": "return=representation" } 
        });
        return response.data[0];
    },

    // 10. Hapus Layanan
    async deleteService(id) {
        // PERHATIAN: Pastikan tidak ada transaksi aktif yang memakai layanan ini sebelum dihapus,
        // atau Supabase akan menolak karena aturan 'ON DELETE RESTRICT' yang kita buat sebelumnya.
        const response = await axios.delete(`${BASE_URL}/services?id=eq.${id}`, { headers });
        return response.data;
    },

    // ==========================================
    // FUNGSI KHUSUS PROMO (ADMIN & PELANGGAN)
    // ==========================================

    // 11. (ADMIN) Ambil semua promo
    async getAllPromos() {
        const response = await axios.get(`${BASE_URL}/promos?order=created_at.desc`, { headers });
        return response.data;
    },

    // 12. (ADMIN) Tambah Promo
    async addPromo(promoData) {
        // Ubah kode promo jadi huruf besar semua (Uppercase) sebelum disimpan
        promoData.kode_promo = promoData.kode_promo.toUpperCase();
        const response = await axios.post(`${BASE_URL}/promos`, promoData, { 
            headers: { ...headers, "Prefer": "return=representation" } 
        });
        return response.data[0];
    },

    // 13. (ADMIN) Edit Promo
    async updatePromo(id, updatedData) {
        if (updatedData.kode_promo) {
             updatedData.kode_promo = updatedData.kode_promo.toUpperCase();
        }
        const response = await axios.patch(`${BASE_URL}/promos?id=eq.${id}`, updatedData, { 
            headers: { ...headers, "Prefer": "return=representation" } 
        });
        return response.data[0];
    },

    // 14. (ADMIN) Hapus Promo
    async deletePromo(id) {
        const response = await axios.delete(`${BASE_URL}/promos?id=eq.${id}`, { headers });
        return response.data;
    },

    // 15. (PELANGGAN) Cek Validasi Kode Promo
    async cekKodePromo(kode) {
        // Cari promo yang is_active = true dan kodenya cocok
        const kodeUpper = kode.toUpperCase();
        const response = await axios.get(`${BASE_URL}/promos?kode_promo=eq.${kodeUpper}&is_active=eq.true`, { headers });
        
        if (response.data.length === 0) {
            throw new Error("Kode promo tidak valid atau sudah kadaluarsa.");
        }
        return response.data[0];
    },

    // ==========================================
    // FUNGSI KHUSUS REVIEWS / TESTIMONI (CRM)
    // ==========================================

    // 16. (MEMBER) Kirim Ulasan Baru
    async submitReview(reviewData) {
        const response = await axios.post(`${BASE_URL}/reviews`, reviewData, { 
            headers: { ...headers, "Prefer": "return=representation" } 
        });
        return response.data[0];
    },

    // 17. (MEMBER) Cek apakah transaksi tertentu sudah pernah diulas
    async getReviewByTransactionId(transactionId) {
        const response = await axios.get(`${BASE_URL}/reviews?transaction_id=eq.${transactionId}`, { headers });
        return response.data[0] || null;
    },

    // 18. (ADMIN) Ambil semua ulasan dari seluruh pelanggan (Dengan Join nama)
    async getAllReviews() {
        const response = await axios.get(`${BASE_URL}/reviews?select=*,users(fullname)&order=created_at.desc`, { headers });
        return response.data;
    },

    // 19. (ADMIN) Sakelar Kurasi Tampilkan/Sembunyikan di Landing Page
    async toggleReviewFeatured(id, statusFeatured) {
        const response = await axios.patch(`${BASE_URL}/reviews?id=eq.${id}`, { is_featured: statusFeatured }, { 
            headers: { ...headers, "Prefer": "return=representation" } 
        });
        return response.data[0];
    },

    // 20. (GUEST) Ambil ulasan bintang pilihan untuk Landing Page
    async getFeaturedReviews() {
        // PERHATIAN: Kita tambahkan ',member_profiles(tier)' agar sistem ikut menarik data level tier
        const query = 'select=*,users(fullname,member_profiles(tier))';
        const response = await axios.get(`${BASE_URL}/reviews?${query}&is_featured=eq.true&order=created_at.desc`, { headers });
        return response.data;
    }
};