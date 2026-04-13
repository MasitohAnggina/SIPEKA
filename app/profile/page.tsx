"use client";

import { useState, ChangeEvent } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

interface FormData {
  namaLengkap: string;
  email: string;
  noTelepon: string;
  kataSandi: string;
  provinsi: string;
  kotaKabupaten: string;
  kecamatan: string;
  kodePos: string;
  alamatLengkap: string;
}

export default function ProfilePage() {
  const [formData, setFormData] = useState<FormData>({
    namaLengkap: "Wijaya Jaya",
    email: "wijaya@example.com",
    noTelepon: "081234567890",
    kataSandi: "",
    provinsi: "Kepulauan Riau",
    kotaKabupaten: "Batam",
    kecamatan: "Sekupang",
    kodePos: "29422",
    alamatLengkap: "Jl. Raya No. 10, Batam",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    alert("Perubahan berhasil disimpan!");
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        backgroundColor: "#f5f5f5",
        fontFamily: "Segoe UI, sans-serif",
      }}
    >
      <Sidebar activePage="profile" />

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
        }}
      >
        <Header
          title="Profile saya"
          subtitle="Kelola Informasi profile Anda Sebagai Pemilik Hewan Peliharaan"
        />

        <main style={{ flex: 1, padding: "24px", overflowY: "auto" }}>
          {/* Avatar Card */}
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "16px",
              padding: "24px",
              marginBottom: "20px",
              boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <div
              style={{
                position: "relative",
                width: "80px",
                height: "80px",
                flexShrink: 0,
              }}
            >
              <img
                src="https://api.dicebear.com/7.x/adventurer/svg?seed=WijayaJaya"
                alt="Avatar"
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  backgroundColor: "#e5e7eb",
                }}
              />
              <button
                style={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  backgroundColor: "#fff",
                  border: "1px solid #d1d5db",
                  borderRadius: "50%",
                  padding: "4px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#555"
                  strokeWidth={2}
                >
                  <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
              </button>
            </div>
            <div style={{ marginLeft: "20px" }}>
              <p
                style={{
                  fontSize: "18px",
                  fontWeight: 700,
                  color: "#1a1a1a",
                  margin: 0,
                }}
              >
                {formData.namaLengkap}
              </p>
              <p style={{ fontSize: "14px", color: "#888", margin: "4px 0 0" }}>
                Pemilik Hewan
              </p>
            </div>
          </div>

          {/* Informasi Akun */}
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "16px",
              padding: "24px",
              marginBottom: "20px",
              boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
            }}
          >
            <h2
              style={{
                fontSize: "15px",
                fontWeight: 700,
                color: "#1a1a1a",
                marginBottom: "20px",
                marginTop: 0,
              }}
            >
              Informasi Akun
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
              }}
            >
              <InputField
                label="Nama Lengkap"
                name="namaLengkap"
                value={formData.namaLengkap}
                onChange={handleChange}
              />
              <InputField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
              <InputField
                label="No. Telepon"
                name="noTelepon"
                value={formData.noTelepon}
                onChange={handleChange}
              />
              <InputField
                label="Kata Sandi"
                name="kataSandi"
                type="password"
                value={formData.kataSandi}
                onChange={handleChange}
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Alamat */}
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "16px",
              padding: "24px",
              marginBottom: "20px",
              boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
            }}
          >
            <h2
              style={{
                fontSize: "15px",
                fontWeight: 700,
                color: "#1a1a1a",
                marginBottom: "20px",
                marginTop: 0,
              }}
            >
              Alamat
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
              }}
            >
              <InputField
                label="Provinsi"
                name="provinsi"
                value={formData.provinsi}
                onChange={handleChange}
              />
              <InputField
                label="Kota/Kabupaten"
                name="kotaKabupaten"
                value={formData.kotaKabupaten}
                onChange={handleChange}
              />
              <InputField
                label="Kecamatan"
                name="kecamatan"
                value={formData.kecamatan}
                onChange={handleChange}
              />
              <InputField
                label="Kode Pos"
                name="kodePos"
                value={formData.kodePos}
                onChange={handleChange}
              />
              <div style={{ gridColumn: "1 / -1" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    color: "#888",
                    marginBottom: "6px",
                  }}
                >
                  Alamat Lengkap
                </label>
                <textarea
                  name="alamatLengkap"
                  value={formData.alamatLengkap}
                  onChange={handleChange}
                  rows={3}
                  style={{
                    width: "100%",
                    border: "1px solid #d1d5db",
                    borderRadius: "12px",
                    padding: "10px 16px",
                    fontSize: "14px",
                    color: "#333",
                    outline: "none",
                    boxSizing: "border-box",
                    resize: "none",
                    fontFamily: "inherit",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "8px",
            }}
          >
            <button
              onClick={handleSubmit}
              style={{
                backgroundColor: "rgba(116, 249, 109, 0.4)",
                color: "#1a5c1a",
                boxShadow: "0 2px 8px rgba(116, 249, 109, 0.3)",
                fontSize: "14px",
                fontWeight: 600,
                padding: "10px 32px",
                borderRadius: "999px",
                border: "none",
                cursor: "pointer",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor =
                  "rgba(116, 249, 109, 0.6)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor =
                  "rgba(116, 249, 109, 0.4)")
              }
            >
              Simpan Perubahan
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}

// ─── Reusable Input ───────────────────────────────────────────────────────────

interface InputFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
}

function InputField({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder = "",
}: InputFieldProps) {
  return (
    <div>
      <label
        style={{
          display: "block",
          fontSize: "12px",
          color: "#888",
          marginBottom: "6px",
        }}
      >
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{
          width: "100%",
          border: "1px solid #d1d5db",
          borderRadius: "12px",
          padding: "10px 16px",
          fontSize: "14px",
          color: "#333",
          outline: "none",
          boxSizing: "border-box",
          fontFamily: "inherit",
        }}
        onFocus={(e) => (e.currentTarget.style.borderColor = "#2d7a3a")}
        onBlur={(e) => (e.currentTarget.style.borderColor = "#d1d5db")}
      />
    </div>
  );
}
