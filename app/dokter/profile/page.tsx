"use client";

import { useState, ChangeEvent } from "react";
import Sidebar from "@/components/Sidebar_dokter";
import Header from "@/components/Header";

interface FormData {
  namaLengkap: string;
  email: string;
  noTelepon: string;
  spesialisasi: string;
  institusiPendidikan: string;
  tahunLulus: string;
  pengalaman: string;
  provinsi: string;
  kotaKabupaten: string;
  kecamatan: string;
  kodePos: string;
  alamatLengkap: string;
}

const G = "#2e7d32";

const cardStyle: React.CSSProperties = {
  background: "#fff",
  borderRadius: 12,
  border: "1px solid #f0f0f0",
  padding: "20px 24px",
  marginBottom: 18,
};

const sectionTitleStyle: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 700,
  color: G,
  marginBottom: 16,
  marginTop: 0,
  paddingBottom: 10,
  borderBottom: "1.5px solid #e8f5e9",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 12,
  fontWeight: 600,
  color: "#666",
  marginBottom: 5,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  border: "1.5px solid #e0e0e0",
  borderRadius: 8,
  padding: "9px 12px",
  fontSize: 13,
  color: "#1a1a1a",
  outline: "none",
  boxSizing: "border-box",
  fontFamily: "inherit",
  background: "#fff",
  transition: "border-color .15s",
};

interface InputFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
}

function InputField({ label, name, value, onChange, type = "text", placeholder = "" }: InputFieldProps) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <input
        type={type} name={name} value={value} onChange={onChange} placeholder={placeholder}
        style={inputStyle}
        onFocus={e => e.currentTarget.style.borderColor = G}
        onBlur={e  => e.currentTarget.style.borderColor = "#e0e0e0"}
      />
    </div>
  );
}

export default function ProfileDokterPage() {
  const [formData, setFormData] = useState<FormData>({
    namaLengkap:         "drh. Shinta Permata",
    email:               "shinta.permata@sipeka.com",
    noTelepon:           "0812-9988-7766",
    spesialisasi:        "Hewan Kecil & Eksotis",
    institusiPendidikan: "Universitas Airlangga",
    tahunLulus:          "2019",
    pengalaman:          "5",
    provinsi:            "Kepulauan Riau",
    kotaKabupaten:       "Batam",
    kecamatan:           "Sekupang",
    kodePos:             "29422",
    alamatLengkap:       "Jl. Raya No. 10, Batam",
  });

  const [saved, setSaved] = useState(false);

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setSaved(false);
  }

  function handleSubmit() {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", fontFamily: "'Poppins', sans-serif", background: "#f9f9f9" }}>
      <Sidebar activePage="profile" />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "auto" }}>
        <Header title="Profil Saya" subtitle="Kelola informasi profil dan data profesional Anda" />

        <main style={{ flex: 1, padding: "22px 28px" }}>

          {/* ── Avatar Card ── */}
          <div style={{ ...cardStyle, display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ position: "relative", flexShrink: 0 }}>
              <img
                src="https://api.dicebear.com/7.x/adventurer/svg?seed=ShintaPermata"
                alt="Avatar"
                style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover", background: "#e8f5e9", border: `2.5px solid ${G}` }}
              />
              <button style={{ position: "absolute", bottom: 0, right: 0, background: "#fff", border: "1.5px solid #e0e0e0", borderRadius: "50%", width: 26, height: 26, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 1px 4px rgba(0,0,0,.1)" }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth={2}>
                  <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
              </button>
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 17, color: "#1a1a1a" }}>{formData.namaLengkap}</div>
              <div style={{ fontSize: 13, color: "#888", marginTop: 3 }}>Dokter Hewan · {formData.spesialisasi}</div>
              <div style={{ fontSize: 12, color: "#aaa", marginTop: 4 }}>📍 {formData.kotaKabupaten}, {formData.provinsi}</div>
            </div>
          </div>

          {/* ── Informasi Akun ── */}
          <div style={cardStyle}>
            <h2 style={sectionTitleStyle}>👤 Informasi Akun</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <InputField label="Nama Lengkap" name="namaLengkap" value={formData.namaLengkap} onChange={handleChange} />
              <InputField label="Email"        name="email"        value={formData.email}        onChange={handleChange} type="email" />
              <InputField label="No. Telepon"  name="noTelepon"    value={formData.noTelepon}    onChange={handleChange} />
              <InputField label="Spesialisasi" name="spesialisasi" value={formData.spesialisasi} onChange={handleChange} placeholder="cth. Hewan Kecil & Eksotis" />
            </div>
          </div>

          {/* ── Data Profesional ── */}
          <div style={cardStyle}>
            <h2 style={sectionTitleStyle}>🏥 Data Profesional</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <InputField label="Institusi Pendidikan"  name="institusiPendidikan" value={formData.institusiPendidikan} onChange={handleChange} placeholder="cth. Universitas Airlangga" />
              <InputField label="Tahun Lulus"           name="tahunLulus"          value={formData.tahunLulus}          onChange={handleChange} placeholder="cth. 2019" />
              <InputField label="Pengalaman (tahun)"    name="pengalaman"          value={formData.pengalaman}          onChange={handleChange} placeholder="cth. 5" />
            </div>
          </div>

          {/* ── Alamat ── */}
          <div style={cardStyle}>
            <h2 style={sectionTitleStyle}>📍 Alamat</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <InputField label="Provinsi"       name="provinsi"      value={formData.provinsi}      onChange={handleChange} />
              <InputField label="Kota/Kabupaten" name="kotaKabupaten" value={formData.kotaKabupaten} onChange={handleChange} />
              <InputField label="Kecamatan"      name="kecamatan"     value={formData.kecamatan}     onChange={handleChange} />
              <InputField label="Kode Pos"       name="kodePos"       value={formData.kodePos}       onChange={handleChange} />
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={labelStyle}>Alamat Lengkap</label>
                <textarea
                  name="alamatLengkap" value={formData.alamatLengkap} onChange={handleChange} rows={3}
                  style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }}
                  onFocus={e => e.currentTarget.style.borderColor = G}
                  onBlur={e  => e.currentTarget.style.borderColor = "#e0e0e0"}
                />
              </div>
            </div>
          </div>

          {/* ── Tombol ── */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, paddingBottom: 24 }}>
            <button
              style={{ padding: "10px 22px", borderRadius: 9, border: `1.5px solid ${G}`, background: "#fff", color: G, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}
              onMouseEnter={e => e.currentTarget.style.background = "#e8f5e9"}
              onMouseLeave={e => e.currentTarget.style.background = "#fff"}
            >
              Batalkan
            </button>
            <button onClick={handleSubmit}
              style={{ padding: "10px 26px", borderRadius: 9, border: "none", background: saved ? "#4caf50" : G, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 7, transition: "background .2s" }}
              onMouseEnter={e => { if (!saved) e.currentTarget.style.background = "#1b5e20"; }}
              onMouseLeave={e => { if (!saved) e.currentTarget.style.background = saved ? "#4caf50" : G; }}
            >
              {saved ? <>✓ Tersimpan!</> : <>💾 Simpan Perubahan</>}
            </button>
          </div>

        </main>
      </div>
    </div>
  );
}