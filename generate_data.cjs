const fs = require('fs');

const firstNames = ["Faqih", "Salsabilla", "Andi", "Dewi", "Reza", "Ayu", "Fajar", "Dina", "Rizky", "Putri"];
const lastNames = ["Hidayah", "Dheawan", "Pratama", "Sari", "Kusuma", "Hidayat", "Lestari", "Nugroho"];
const streets = ["Jl. Sudirman", "Jl. Paus", "Jl. Nangka", "Jl. Riau", "Jl. HR Soebrantas", "Jl. Garuda", "Jl. Hangtuah", "Jl. Arifin Ahmad", "Jl. Umban Sari", "Jl. Pepaya", "Jl. Nenas", "Jl. Melati", "Jl. Rambutan", "Jl. Adi Sucipto"];
const payments = ["QRIS", "Tunai", "Transfer Bank", "ShopeePay"];
const members = ["Bronze", "Silver", "Gold", "VIP"];

let csvContent = "ID_Customer,Nama_Lengkap,Jenis_Kelamin,Nomor_HP,Alamat,Kota,Tanggal_Daftar,Status_Member,Feedback_Rating,Total_Transaksi_Rp,Metode_Pembayaran,Tanggal_Transaksi_Terakhir\n";

for (let i = 1; i <= 800; i++) {
    const id = `LND-${String(i).padStart(4, '0')}`;
    const name = `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
    const gender = Math.random() > 0.5 ? "Laki-laki" : "Perempuan";
    const phone = `08${Math.floor(Math.random() * 1000000000)}`;
    const address = `${streets[Math.floor(Math.random() * streets.length)]} No. ${Math.floor(Math.random() * 100)}`;
    const kota = "Pekanbaru";
    const tglDaftar = `2025-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`;
    const member = members[Math.floor(Math.random() * members.length)];
    const rating = Math.floor(Math.random() * 3) + 3; // Rating 3, 4, atau 5
    const total = (Math.floor(Math.random() * 50) + 5) * 1000;
    const payment = payments[Math.floor(Math.random() * payments.length)];
    const tglTransaksi = `2026-${String(Math.floor(Math.random() * 4) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`;

    csvContent += `${id},${name},${gender},${phone},${address},${kota},${tglDaftar},${member},${rating},${total},${payment},${tglTransaksi}\n`;
}

fs.writeFileSync('data_laundry.csv', csvContent);
console.log("File data_laundry.csv berhasil dibuat dengan 800 baris!");