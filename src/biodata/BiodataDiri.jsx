import React from 'react';
import { createRoot } from 'react-dom/client';
import './custom.css'; 

// --- 1. CHILD COMPONENT: Foto Profil ---
function FotoProfil() {
    return <img src="/img/profile.jpg" alt="Foto Dzakwan" className="profile-img" />;
}

// --- 2. CHILD COMPONENT: Header Nama ---
function HeaderNama(props) {
    return (
        <div className="header-text">
            <h2>{props.nama}</h2>
            <p>{props.role}</p>
        </div>
    );
}

// --- 3. CHILD COMPONENT: Tentang Saya ---
function TentangSaya() {
    return (
        <p className="desc">
            Seorang mahasiswa Sistem Informasi yang antusias di bidang UI/UX Design dan Web Development. 
            Memiliki pengalaman merancang antarmuka aplikasi seperti TemanJasa dan selalu bersemangat 
            mengeksplorasi teknologi baru untuk menciptakan pengalaman pengguna yang intuitif.
        </p>
    );
}

// --- 4. CHILD COMPONENT: Pendidikan ---
function Pendidikan() {
    return (
        <div className="section">
            <h3>Pendidikan</h3>
            <p>Sistem Informasi - Politeknik Caltex Riau</p>
        </div>
    );
}

// --- 5. CHILD COMPONENT: Keahlian ---
function Keahlian() {
    const skills = ["UI/UX Design", "Laravel", "CodeIgniter", "React", "Figma", "HTML & CSS"];
    
    return (
        <div className="section">
            <h3>Keahlian</h3>
            <ul>
                {skills.map((skill, index) => (
                    <li key={index}>{skill}</li>
                ))}
            </ul>
        </div>
    );
}

// --- 6. CHILD COMPONENT: Sosial Media ---
function SosialMedia() {
    return (
        <div className="section">
            <h3>Terhubung Bersama Saya</h3>
            <a href="https://linkedin.com/in/mdzakwansyafiq29" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a href="https://github.com/dzakwan24si" target="_blank" rel="noopener noreferrer">GitHub</a>
            <a href="https://youtube.com/@dzakwansyafiq29" target="_blank" rel="noopener noreferrer">YouTube</a>
        </div>
    );
}

// --- PARENT COMPONENT: BiodataDiri ---
function BiodataDiri() {
    return (
        <div className="portfolio-card">
            <FotoProfil />
            <HeaderNama nama="Dzakwan" role="UI/UX Enthusiast & Frontend Developer" />
            <hr />
            <TentangSaya />
            <Pendidikan />
            <Keahlian />
            <SosialMedia />
        </div>
    );
}

export default BiodataDiri;