"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

interface RiwayatItem {
  id: number;
  tanggal: string;
  bulan: string;
  jam: string;
  hewanNama: string;
  hewanJenis: string;
  hewanUsia: string;
  hewanBerat: string;
  hewanFoto: string;
  layananUtama: string;
  layananDetail: string;
  dokter: string;
  dokterPeran: string;
  biaya: string;
  status: "Selesai" | "Proses" | "Dibatalkan";
  kategori: "Vaksinasi" | "Grooming" | "Perawatan Medis" | "Pemeriksaan";
  hewanTipe: "Anjing" | "Kucing" | "Kelinci";
}

const dummyData: RiwayatItem[] = [
  ...Array.from({ length: 3 }, (_, i) => ({
    id: i + 1,
    tanggal: "12", bulan: "Jan 2026", jam: "14:00 WIB",
    hewanNama: "Max", hewanJenis: "Anjing Golden Retriever",
    hewanUsia: "2 Tahun", hewanBerat: "25 Kg",
    hewanFoto: "https://images.dog.ceo/breeds/retriever-golden/n02099601_1722.jpg",
    layananUtama: "Vaksinasi", layananDetail: "Vaksinasi Rutin",
    dokter: "DrH. Shinta", dokterPeran: "Dokter Hewan",
    biaya: "Rp 250.000", status: "Selesai" as const,
    kategori: "Vaksinasi" as const, hewanTipe: "Anjing" as const,
  })),
  ...Array.from({ length: 2 }, (_, i) => ({
    id: i + 4,
    tanggal: "15", bulan: "Feb 2026", jam: "10:00 WIB",
    hewanNama: "Luna", hewanJenis: "Kucing Persia",
    hewanUsia: "1 Tahun", hewanBerat: "4 Kg",
    hewanFoto: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Cute_cat.jpg/320px-Cute_cat.jpg",
    layananUtama: "Grooming", layananDetail: "Mandi dan Potong Kuku",
    dokter: "DrH. Budi", dokterPeran: "Paramedis",
    biaya: "Rp 150.000", status: "Selesai" as const,
    kategori: "Grooming" as const, hewanTipe: "Kucing" as const,
  })),
  ...Array.from({ length: 2 }, (_, i) => ({
    id: i + 6,
    tanggal: "20", bulan: "Mar 2026", jam: "09:00 WIB",
    hewanNama: "Max", hewanJenis: "Anjing Golden Retriever",
    hewanUsia: "2 Tahun", hewanBerat: "25 Kg",
    hewanFoto: "https://images.dog.ceo/breeds/retriever-golden/n02099601_1722.jpg",
    layananUtama: "Perawatan Medis", layananDetail: "Operasi Kecil dan Rawat Luka",
    dokter: "DrH. Shinta", dokterPeran: "Dokter Hewan",
    biaya: "Rp 500.000", status: "Selesai" as const,
    kategori: "Perawatan Medis" as const, hewanTipe: "Anjing" as const,
  })),
];

const ITEMS_PER_PAGE = 4;

export default function RiwayatLayananPage() {
  const [activeKategori, setActiveKategori] = useState("Semua");
  const [filterLayanan, setFilterLayanan] = useState("Semua");
  const [filterHewan, setFilterHewan] = useState("Semua Hewan");
  const [filterTanggal, setFilterTanggal] = useState("Semua Tanggal");
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = dummyData.filter((d) => {
    const matchLayanan = filterLayanan !== "Semua"
      ? d.kategori === filterLayanan
      : activeKategori === "Semua" || d.kategori === activeKategori;
    const matchHewan = filterHewan === "Semua Hewan" || d.hewanTipe === filterHewan;
    return matchLayanan && matchHewan;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleKategori = (key: string) => {
    setActiveKategori(key);
    setFilterLayanan("Semua");
    setCurrentPage(1);
  };

  const handleReset = () => {
    setActiveKategori("Semua");
    setFilterLayanan("Semua");
    setFilterHewan("Semua Hewan");
    setFilterTanggal("Semua Tanggal");
    setCurrentPage(1);
  };

  const stats = [
    { icon: "📅", label: "Total Layanan", value: dummyData.length, key: "Semua" },
    { icon: "💉", label: "Vaksinasi", value: dummyData.filter(d => d.kategori === "Vaksinasi").length, key: "Vaksinasi" },
    { icon: "✂️", label: "Grooming", value: dummyData.filter(d => d.kategori === "Grooming").length, key: "Grooming" },
    { icon: "🏥", label: "Perawatan Medis", value: dummyData.filter(d => d.kategori === "Perawatan Medis").length, key: "Perawatan Medis" },
  ];

  return (
    <div style={{ display: "flex", height: "100vh", backgroundColor: "#f5f5f5", fontFamily: "Segoe UI, sans-serif" }}>
      <Sidebar activePage="riwayat" />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflowY: "auto" }}>
        <Header
          title="Riwayat Layanan Hewan"
          subtitle="Lihat riwayat pemeriksaan dan perawatan hewan peliharaan anda"
        />

        <main style={{ flex: 1, padding: "24px" }}>

          {/* Stats Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "24px" }}>
            {stats.map((stat) => {
              const isActive = activeKategori === stat.key;
              return (
                <div
                  key={stat.key}
                  onClick={() => handleKategori(stat.key)}
                  style={{
                    backgroundColor: isActive ? "#f0faf2" : "#ffffff",
                    borderRadius: "12px",
                    padding: "16px 20px",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    border: isActive ? "1.5px solid #2E7D32" : "1.5px solid transparent",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                  onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.border = "1.5px solid #a7d7a9"; }}
                  onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.border = "1.5px solid transparent"; }}
                >
                  <span style={{ fontSize: "22px" }}>{stat.icon}</span>
                  <div>
                    <p style={{ margin: 0, fontSize: "13px", color: "#888" }}>{stat.label}</p>
                    <p style={{ margin: 0, fontSize: "20px", fontWeight: 700, color: "#1a1a1a" }}>
                      {stat.value} <span style={{ fontSize: "13px", fontWeight: 400, color: "#888" }}>Kali</span>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Filter Bar */}
          <div style={{
            backgroundColor: "#ffffff", borderRadius: "12px",
            padding: "14px 20px", marginBottom: "16px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
            display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap",
          }}>
            <span style={{ fontSize: "13px", fontWeight: 600, color: "#555" }}>Filter:</span>

            <select
              value={filterLayanan}
              onChange={(e) => {
                setFilterLayanan(e.target.value);
                setActiveKategori("Semua");
                setCurrentPage(1);
              }}
              style={{ padding: "7px 12px", borderRadius: "8px", border: "1px solid #d1d5db", fontSize: "13px", color: "#333", backgroundColor: "#fff", cursor: "pointer", outline: "none" }}
            >
              {["Semua", "Vaksinasi", "Grooming", "Pemeriksaan", "Perawatan Medis"].map((opt) => (
                <option key={opt} value={opt}>Jenis Layanan : {opt}</option>
              ))}
            </select>

            <select
              value={filterTanggal}
              onChange={(e) => { setFilterTanggal(e.target.value); setCurrentPage(1); }}
              style={{ padding: "7px 12px", borderRadius: "8px", border: "1px solid #d1d5db", fontSize: "13px", color: "#333", backgroundColor: "#fff", cursor: "pointer", outline: "none" }}
            >
              {["Semua Tanggal", "Minggu Ini", "Bulan Ini", "3 Bulan Terakhir"].map((opt) => (
                <option key={opt} value={opt}>Rentang Tanggal : {opt}</option>
              ))}
            </select>

            <select
              value={filterHewan}
              onChange={(e) => { setFilterHewan(e.target.value); setCurrentPage(1); }}
              style={{ padding: "7px 12px", borderRadius: "8px", border: "1px solid #d1d5db", fontSize: "13px", color: "#333", backgroundColor: "#fff", cursor: "pointer", outline: "none" }}
            >
              {["Semua Hewan", "Anjing", "Kucing", "Kelinci"].map((opt) => (
                <option key={opt} value={opt}>Jenis Hewan : {opt}</option>
              ))}
            </select>

            <button
              onClick={handleReset}
              style={{ padding: "7px 18px", borderRadius: "8px", border: "none", backgroundColor: "#ef4444", color: "#fff", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}
            >
              Reset
            </button>
            <button
              style={{ padding: "7px 18px", borderRadius: "8px", border: "none", backgroundColor: "#2E7D32", color: "#fff", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}
            >
              Terapkan
            </button>
          </div>

          {/* Table */}
          <div style={{ backgroundColor: "#ffffff", borderRadius: "12px", boxShadow: "0 1px 4px rgba(0,0,0,0.07)", overflow: "hidden" }}>
            <div style={{
              display: "grid",
              gridTemplateColumns: "160px 1fr 1fr 1fr 120px 100px",
              padding: "12px 20px",
              backgroundColor: "#f9f9f9",
              borderBottom: "1px solid #f0f0f0",
            }}>
              {["Tanggal", "Hewan", "Layanan", "Dokter / Paramedis", "Biaya", "Status"].map((h) => (
                <span key={h} style={{ fontSize: "13px", fontWeight: 600, color: "#555" }}>{h}</span>
              ))}
            </div>

            {paginated.length === 0 ? (
              <div style={{ padding: "40px", textAlign: "center", color: "#aaa", fontSize: "14px" }}>
                Tidak ada data untuk filter ini.
              </div>
            ) : (
              paginated.map((item, i) => (
                <div key={item.id} style={{
                  display: "grid",
                  gridTemplateColumns: "160px 1fr 1fr 1fr 120px 100px",
                  padding: "16px 20px",
                  borderBottom: i < paginated.length - 1 ? "1px solid #f0f0f0" : "none",
                  alignItems: "center",
                }}>
                  <div>
                    <p style={{ margin: 0, fontSize: "22px", fontWeight: 700, color: "#1a1a1a" }}>{item.tanggal}</p>
                    <p style={{ margin: 0, fontSize: "13px", color: "#555" }}>{item.bulan}</p>
                    <p style={{ margin: 0, fontSize: "12px", color: "#888" }}>{item.jam}</p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <img src={item.hewanFoto} alt={item.hewanNama}
                      style={{ width: "48px", height: "48px", borderRadius: "8px", objectFit: "cover" }} />
                    <div>
                      <p style={{ margin: 0, fontSize: "14px", fontWeight: 600, color: "#1a1a1a" }}>{item.hewanNama}</p>
                      <p style={{ margin: 0, fontSize: "12px", color: "#888" }}>{item.hewanJenis}</p>
                      <p style={{ margin: 0, fontSize: "12px", color: "#888" }}>{item.hewanUsia} * {item.hewanBerat}</p>
                    </div>
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: "14px", fontWeight: 700, color: "#1a1a1a" }}>{item.layananUtama}</p>
                    <p style={{ margin: 0, fontSize: "12px", color: "#888" }}>{item.layananDetail}</p>
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: "14px", fontWeight: 600, color: "#1a1a1a" }}>{item.dokter}</p>
                    <p style={{ margin: 0, fontSize: "12px", color: "#888" }}>{item.dokterPeran}</p>
                  </div>
                  <p style={{ margin: 0, fontSize: "14px", fontWeight: 600, color: "#1a1a1a" }}>{item.biaya}</p>
                  <span style={{
                    fontSize: "13px", fontWeight: 600,
                    color: item.status === "Selesai" ? "#2E7D32" : item.status === "Proses" ? "#d97706" : "#ef4444",
                  }}>
                    {item.status}
                  </span>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "6px", marginTop: "16px" }}>
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                style={{ padding: "6px 14px", borderRadius: "8px", border: "1px solid #d1d5db", backgroundColor: "#fff", fontSize: "13px", cursor: currentPage === 1 ? "not-allowed" : "pointer", color: currentPage === 1 ? "#aaa" : "#333" }}
              >
                ‹ Sebelumnya
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  style={{ width: "32px", height: "32px", borderRadius: "8px", border: "1px solid #d1d5db", backgroundColor: currentPage === page ? "#2E7D32" : "#fff", color: currentPage === page ? "#fff" : "#333", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                style={{ padding: "6px 14px", borderRadius: "8px", border: "1px solid #d1d5db", backgroundColor: "#fff", fontSize: "13px", cursor: currentPage === totalPages ? "not-allowed" : "pointer", color: currentPage === totalPages ? "#aaa" : "#333" }}
              >
                Berikutnya ›
              </button>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}