import axios from 'axios';

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
    async updateTransactionStatus(id, newStatus) {
        const response = await axios.patch(`${BASE_URL}/transactions?id=eq.${id}`, { status_pesanan: newStatus }, { 
            headers: { ...headers, "Prefer": "return=representation" } 
        });
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

    // Update Profil Member (Nama, WhatsApp, Alamat)
    async updateMemberProfile(userId, newName, newProfileData) {
        // 1. Update nama lengkap di tabel 'users'
        await axios.patch(`${API_URL}?id=eq.${userId}`, { fullname: newName }, { headers });
        
        // 2. Update WhatsApp & Alamat di tabel 'member_profiles'
        await axios.patch(`${PROFILE_URL}?user_id=eq.${userId}`, newProfileData, { headers });
        
        return true;
    }
};