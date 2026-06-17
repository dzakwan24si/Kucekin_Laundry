import axios from 'axios';

const API_URL = "https://impjljpcvddyhfzeuafn.supabase.co/rest/v1/users";
// URL untuk tabel profil member yang baru kita buat di Supabase
const PROFILE_URL = "https://impjljpcvddyhfzeuafn.supabase.co/rest/v1/member_profiles"; 
const API_KEY = "sb_publishable_RqqwWKzw8YLmUv6qPPtUyQ_Ma85wMbJ";

const headers = {
    apikey: API_KEY,
    Authorization: `Bearer ${API_KEY}`,
    "Content-Type": "application/json",
};

export const authAPI = {
    // ==========================================
    // FUNGSI ADMIN & STAF (EXISTING)
    // ==========================================
    async getUsers() {
        const response = await axios.get(API_URL, { headers });
        return response.data;
    },

    async registerUser(userData) {
        const checkEmail = await axios.get(`${API_URL}?email=eq.${userData.email}`, { headers });
        if (checkEmail.data.length > 0) {
            throw new Error("Email sudah terdaftar!");
        }

        const response = await axios.post(API_URL, userData, { headers });
        return response.data;
    },

    async loginUser(email, password) {
        const response = await axios.get(`${API_URL}?email=eq.${email}&password=eq.${password}`, { headers });
        
        if (response.data.length === 0) {
            throw new Error("Email atau Password salah!");
        }
        
        return response.data[0]; 
    },

    async updateUser(id, updatedData) {
        const response = await axios.patch(`${API_URL}?id=eq.${id}`, updatedData, { headers });
        return response.data;
    },

    async deleteUser(id) {
        await axios.delete(`${API_URL}?id=eq.${id}`, { headers });
    },

    // ==========================================
    // FUNGSI KHUSUS MEMBER (CUSTOMER PORTAL)
    // ==========================================
    
    // Fungsi Register Member (2 Tabel Sekaligus)
    async registerMember(userData) {
        // 1. Cek apakah email sudah terdaftar
        const checkEmail = await axios.get(`${API_URL}?email=eq.${userData.email}`, { headers });
        if (checkEmail.data.length > 0) {
            throw new Error("Email sudah terdaftar. Silakan gunakan email lain atau masuk ke akun Anda.");
        }

        // 2. Simpan ke tabel 'users' dengan Role 'Member'
        // Kita tambah header "Prefer: return=representation" agar Supabase mengembalikan data yang baru diinput (untuk ambil ID)
        const userPayload = {
            fullname: userData.fullname,
            email: userData.email,
            password: userData.password,
            role: 'Member'
        };
        
        const userResponse = await axios.post(API_URL, userPayload, { 
            headers: { ...headers, "Prefer": "return=representation" } 
        });

        const newUser = userResponse.data[0];

        // 3. Simpan data tambahan ke tabel 'member_profiles'
        const profilePayload = {
            user_id: newUser.id,
            whatsapp: userData.whatsapp,
            // poin, tier, alamat akan otomatis terisi nilai default dari database
        };

        await axios.post(PROFILE_URL, profilePayload, { headers });

        return newUser; // Kembalikan data user agar bisa langsung auto-login
    },

    // Fungsi Login Khusus Member
    async loginMember(email, password) {
        // Cari user di tabel users
        const response = await axios.get(`${API_URL}?email=eq.${email}&password=eq.${password}`, { headers });
        
        if (response.data.length === 0) {
            throw new Error("Email atau kata sandi tidak cocok!");
        }

        const user = response.data[0];

        // Validasi Ekstra: Blokir akses jika yang login ternyata Admin/Staf di halaman Member
        if (user.role !== 'Member') {
            throw new Error("Akses ditolak! Anda terdaftar sebagai Admin/Staf. Silakan gunakan portal khusus internal.");
        }
        
        return user;
    },

    // Ambil Data Profil Member (Untuk tarik sisa Poin & Tier)
    async getMemberProfile(userId) {
        const response = await axios.get(`${PROFILE_URL}?user_id=eq.${userId}&select=*`, { headers });
        if (response.data.length === 0) throw new Error("Profil tidak ditemukan");
        return response.data[0];
    },

    // Update Poin Member (Dipanggil saat Klaim Promo)
    async updateMemberPoints(userId, newPoints) {
        const response = await axios.patch(`${PROFILE_URL}?user_id=eq.${userId}`, { poin: newPoints }, { 
            headers: { ...headers, "Prefer": "return=representation" } 
        });
        return response.data[0];
    },

    // ==========================================
    // FUNGSI KHUSUS (MANAJEMEN PROFIL & CRM)
    // ==========================================

    // Update Profil Member (Nama, WhatsApp, Alamat)
    async updateMemberProfile(userId, newName, newProfileData) {
        const SUPABASE_URL = "https://impjljpcvddyhfzeuafn.supabase.co/rest/v1";
        const API_KEY = "sb_publishable_RqqwWKzw8YLmUv6qPPtUyQ_Ma85wMbJ";
        const headers = { apikey: API_KEY, Authorization: `Bearer ${API_KEY}`, "Content-Type": "application/json" };

        // Update nama lengkap di tabel 'users'
        await axios.patch(`${SUPABASE_URL}/users?id=eq.${userId}`, { fullname: newName }, { headers });
        // Update WhatsApp & Alamat di tabel 'member_profiles'
        await axios.patch(`${SUPABASE_URL}/member_profiles?user_id=eq.${userId}`, newProfileData, { headers });
        
        return true;
    },

    // Ambil Semua Data Member + Profil (DENGAN JOIN)
    async getAllMembers() {
        const SUPABASE_URL = "https://impjljpcvddyhfzeuafn.supabase.co/rest/v1";
        const API_KEY = "sb_publishable_RqqwWKzw8YLmUv6qPPtUyQ_Ma85wMbJ";
        const headers = { apikey: API_KEY, Authorization: `Bearer ${API_KEY}`, "Content-Type": "application/json" };

        const response = await axios.get(`${SUPABASE_URL}/member_profiles?select=*,users(fullname,email)&order=poin.desc`, { headers });
        return response.data;
    },

    // Update Poin & Tier Manual / Otomatis Sistem
    async adminUpdateCRM(userId, currentPoin, addedPoin) {
        const SUPABASE_URL = "https://impjljpcvddyhfzeuafn.supabase.co/rest/v1";
        const API_KEY = "sb_publishable_RqqwWKzw8YLmUv6qPPtUyQ_Ma85wMbJ";
        const config = {
            headers: { apikey: API_KEY, Authorization: `Bearer ${API_KEY}`, "Content-Type": "application/json", "Prefer": "return=representation" }
        };

        const totalPoin = currentPoin + addedPoin;
        
        // Logika Tiering (DENGAN TIER VIP)
        let newTier = 'Bronze';
        if (totalPoin >= 1000) newTier = 'VIP';
        else if (totalPoin >= 500) newTier = 'Gold';
        else if (totalPoin >= 200) newTier = 'Silver';

        const response = await axios.patch(`${SUPABASE_URL}/member_profiles?user_id=eq.${userId}`, { 
            poin: totalPoin,
            tier: newTier
        }, config);
        
        return response.data[0];
    }
};