import axios from 'axios';

const API_URL = "https://impjljpcvddyhfzeuafn.supabase.co/rest/v1/users";
const API_KEY = "sb_publishable_RqqwWKzw8YLmUv6qPPtUyQ_Ma85wMbJ";

const headers = {
    apikey: API_KEY,
    Authorization: `Bearer ${API_KEY}`,
    "Content-Type": "application/json",
};

export const authAPI = {
    async getUsers() {
        const response = await axios.get(API_URL, { headers });
        return response.data;
    },

    async registerUser(userData) {
        // Cek dulu apakah email sudah terdaftar
        const checkEmail = await axios.get(`${API_URL}?email=eq.${userData.email}`, { headers });
        if (checkEmail.data.length > 0) {
            throw new Error("Email sudah terdaftar!");
        }

        // Jika belum, masukkan data baru (role otomatis akan menjadi 'Staf' dari Supabase)
        const response = await axios.post(API_URL, userData, { headers });
        return response.data;
    },

    // Fungsi untuk Login
    async loginUser(email, password) {
        // Cari user berdasarkan email dan password
        const response = await axios.get(`${API_URL}?email=eq.${email}&password=eq.${password}`, { headers });
        
        if (response.data.length === 0) {
            throw new Error("Email atau Password salah!");
        }
        
        return response.data[0]; // Kembalikan data user yang berhasil login
    },

    // Fungsi untuk Update User (Ubah Role / Nama)
    async updateUser(id, updatedData) {
        const response = await axios.patch(`${API_URL}?id=eq.${id}`, updatedData, { headers });
        return response.data;
    },

    // Fungsi untuk Hapus User (Hanya Admin yang bisa nanti)
    async deleteUser(id) {
        await axios.delete(`${API_URL}?id=eq.${id}`, { headers });
    }
};