"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

// ── Types ─────────────────────────────────────────────────────────────────────

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
  status: "Selesai" | "Proses" | "Dibatalkan";
  kategori: "Vaksinasi" | "Grooming" | "Perawatan Medis" | "Pemeriksaan" | "Hotel";
  hewanTipe: "Anjing" | "Kucing" | "Kelinci";
}

interface ObatItem {
  nama: string;
  dosis: string;
  frekuensi: string;
  harga: number;
}

interface LabItem {
  nama: string;
  hasil: string;
  status: "Normal" | "Abnormal" | "Perlu Tindak Lanjut";
  harga: number;
}

interface RincianLayanan {
  id: number;
  kategori: "Vaksinasi" | "Grooming" | "Perawatan Medis" | "Hotel";
  tanggal: string;
  hari: string;
  jam: string;
  bulan: string;
  hewanNama: string;
  hewanJenis: string;
  hewanUsia: string;
  hewanBerat: string;
  hewanFoto: string;
  hewanTipe: "Anjing" | "Kucing" | "Kelinci";
  petugas: string;
  petugasPeran: string;
  layananNama: string;
  layananDetail: string;
  catatan: string;
  hargaLayanan: number;
  obat: ObatItem[];
  hasilLab: LabItem[];
}

// ── Helper ────────────────────────────────────────────────────────────────────

const toRp = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

const FOTO_MAX  = "https://images.dog.ceo/breeds/retriever-golden/n02099601_1722.jpg";
const FOTO_LUNA = "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Cute_cat.jpg/320px-Cute_cat.jpg";

// ── Dummy Data ────────────────────────────────────────────────────────────────

const dummyLayanan: RiwayatItem[] = [
  { id: 1, tanggal: "08", bulan: "Jan 2026", jam: "09:30 WIB", hewanNama: "Max", hewanJenis: "Anjing Golden Retriever", hewanUsia: "2 Tahun", hewanBerat: "25 Kg", hewanFoto: FOTO_MAX, layananUtama: "Vaksinasi", layananDetail: "Vaksin DHPPiL Tahunan", status: "Selesai", kategori: "Vaksinasi", hewanTipe: "Anjing" },
  { id: 2, tanggal: "15", bulan: "Feb 2026", jam: "10:00 WIB", hewanNama: "Max", hewanJenis: "Anjing Golden Retriever", hewanUsia: "2 Tahun", hewanBerat: "25 Kg", hewanFoto: FOTO_MAX, layananUtama: "Vaksinasi", layananDetail: "Vaksin Rabies", status: "Selesai", kategori: "Vaksinasi", hewanTipe: "Anjing" },
  { id: 3, tanggal: "20", bulan: "Mar 2026", jam: "13:00 WIB", hewanNama: "Luna", hewanJenis: "Kucing Persia", hewanUsia: "1 Tahun", hewanBerat: "4 Kg", hewanFoto: FOTO_LUNA, layananUtama: "Grooming", layananDetail: "Mandi, Potong Kuku & Bersihkan Telinga", status: "Selesai", kategori: "Grooming", hewanTipe: "Kucing" },
  { id: 4, tanggal: "05", bulan: "Feb 2026", jam: "08:30 WIB", hewanNama: "Max", hewanJenis: "Anjing Golden Retriever", hewanUsia: "2 Tahun", hewanBerat: "25 Kg", hewanFoto: FOTO_MAX, layananUtama: "Perawatan Medis", layananDetail: "Diare & Muntah", status: "Selesai", kategori: "Perawatan Medis", hewanTipe: "Anjing" },
  { id: 5, tanggal: "18", bulan: "Mar 2026", jam: "10:30 WIB", hewanNama: "Luna", hewanJenis: "Kucing Persia", hewanUsia: "1 Tahun", hewanBerat: "4 Kg", hewanFoto: FOTO_LUNA, layananUtama: "Perawatan Medis", layananDetail: "Flu Kucing", status: "Selesai", kategori: "Perawatan Medis", hewanTipe: "Kucing" },
  { id: 6, tanggal: "01", bulan: "Apr 2026", jam: "07:00 WIB", hewanNama: "Max", hewanJenis: "Anjing Golden Retriever", hewanUsia: "2 Tahun", hewanBerat: "25 Kg", hewanFoto: FOTO_MAX, layananUtama: "Hotel Hewan", layananDetail: "Menginap 3 Malam (Kamar Standar)", status: "Selesai", kategori: "Hotel", hewanTipe: "Anjing" },
  { id: 7, tanggal: "10", bulan: "Apr 2026", jam: "09:00 WIB", hewanNama: "Luna", hewanJenis: "Kucing Persia", hewanUsia: "1 Tahun", hewanBerat: "4 Kg", hewanFoto: FOTO_LUNA, layananUtama: "Hotel Hewan", layananDetail: "Menginap 2 Malam (Kamar VIP)", status: "Proses", kategori: "Hotel", hewanTipe: "Kucing" },
  { id: 8, tanggal: "12", bulan: "Apr 2026", jam: "11:00 WIB", hewanNama: "Max", hewanJenis: "Anjing Golden Retriever", hewanUsia: "2 Tahun", hewanBerat: "25 Kg", hewanFoto: FOTO_MAX, layananUtama: "Grooming", layananDetail: "Full Grooming + Parfum", status: "Selesai", kategori: "Grooming", hewanTipe: "Anjing" },
];

const dummyRincianLayanan: RincianLayanan[] = [
  {
    id: 1, kategori: "Perawatan Medis",
    tanggal: "05", hari: "Kamis", jam: "08:30 WIB", bulan: "Feb 2026",
    hewanNama: "Max", hewanJenis: "Golden Retriever", hewanUsia: "2 Tahun", hewanBerat: "25 Kg",
    hewanFoto: FOTO_MAX, hewanTipe: "Anjing",
    petugas: "drh. Shinta Permata", petugasPeran: "Dokter Hewan",
    layananNama: "Perawatan Medis",
    layananDetail: "Gastroenteritis (Diare & Muntah)",
    catatan:
      "Max mengalami muntah dan diare sejak 2 hari lalu. Kemungkinan akibat perubahan pakan. " +
      "Diberikan cairan infus subkutan untuk mencegah dehidrasi. Beri makan lunak (nasi + ayam rebus tanpa bumbu) " +
      "selama 5 hari. Kembali kontrol jika kondisi tidak membaik dalam 3 hari.",
    hargaLayanan: 150000,
    obat: [
      { nama: "Metronidazole 250 mg", dosis: "1 tablet", frekuensi: "2x sehari selama 5 hari", harga: 35000 },
      { nama: "Omeprazole 20 mg",     dosis: "1 kapsul", frekuensi: "1x sehari (pagi)",        harga: 40000 },
      { nama: "Probiotik FortiFlora", dosis: "1 sachet", frekuensi: "1x sehari",               harga: 35000 },
    ],
    hasilLab: [
      { nama: "WBC (Sel Darah Putih)", hasil: "19.2 x10³/µL  [Normal: 6.0–17.0]", status: "Abnormal", harga: 95000 },
      { nama: "Pemeriksaan Feses",     hasil: "Negatif parasit, konsistensi encer", status: "Perlu Tindak Lanjut", harga: 55000 },
    ],
  },
  {
    id: 2, kategori: "Perawatan Medis",
    tanggal: "18", hari: "Selasa", jam: "10:30 WIB", bulan: "Mar 2026",
    hewanNama: "Luna", hewanJenis: "Kucing Persia", hewanUsia: "1 Tahun", hewanBerat: "4 Kg",
    hewanFoto: FOTO_LUNA, hewanTipe: "Kucing",
    petugas: "drh. Budi Santoso", petugasPeran: "Dokter Hewan",
    layananNama: "Perawatan Medis",
    layananDetail: "ISPA (Flu Kucing)",
    catatan:
      "Luna bersin-bersin dan keluar cairan dari hidung dan mata sejak 3 hari lalu. " +
      "Suhu tubuh sedikit meningkat (39.8°C). Nafsu makan menurun. " +
      "Bersihkan sekret hidung dan mata dengan kapas basah hangat 2–3x sehari. " +
      "Pastikan Luna tetap makan — jika nafsu makan hilang total lebih dari 24 jam, segera kembali.",
    hargaLayanan: 120000,
    obat: [
      { nama: "Doxycycline 25 mg",          dosis: "1 tablet",        frekuensi: "1x sehari selama 10 hari", harga: 55000 },
      { nama: "Tobramycin Tetes Mata 0.3%", dosis: "1–2 tetes mata", frekuensi: "3x sehari selama 7 hari",  harga: 65000 },
    ],
    hasilLab: [
      { nama: "WBC (Sel Darah Putih)", hasil: "4.1 x10³/µL  [Normal: 5.5–19.5] — Leukopenia", status: "Abnormal", harga: 90000 },
    ],
  },
  {
    id: 3, kategori: "Vaksinasi",
    tanggal: "08", hari: "Rabu", jam: "09:30 WIB", bulan: "Jan 2026",
    hewanNama: "Max", hewanJenis: "Golden Retriever", hewanUsia: "2 Tahun", hewanBerat: "25 Kg",
    hewanFoto: FOTO_MAX, hewanTipe: "Anjing",
    petugas: "drh. Shinta Permata", petugasPeran: "Dokter Hewan",
    layananNama: "Vaksinasi",
    layananDetail: "Vaksin DHPPiL Tahunan",
    catatan:
      "Max mendapatkan vaksin DHPPiL tahunan (Distemper, Hepatitis, Parvovirus, Parainfluenza, Leptospirosis). " +
      "Kondisi hewan sehat dan layak divaksin. Berat badan normal. Tidak ada reaksi alergi setelah vaksinasi. " +
      "Jadwal vaksin berikutnya 1 tahun lagi (Jan 2027).",
    hargaLayanan: 185000,
    obat: [],
    hasilLab: [],
  },
  {
    id: 4, kategori: "Grooming",
    tanggal: "20", hari: "Kamis", jam: "13:00 WIB", bulan: "Mar 2026",
    hewanNama: "Luna", hewanJenis: "Kucing Persia", hewanUsia: "1 Tahun", hewanBerat: "4 Kg",
    hewanFoto: FOTO_LUNA, hewanTipe: "Kucing",
    petugas: "Sari Dewi", petugasPeran: "Groomer Profesional",
    layananNama: "Grooming",
    layananDetail: "Mandi, Potong Kuku & Bersihkan Telinga",
    catatan:
      "Luna menjalani sesi grooming lengkap. Bulu disisir dan dibersihkan dari kusut sebelum mandi. " +
      "Kuku dipotong rapi, telinga dibersihkan dari kotoran. Bulu kering menggunakan hair dryer suhu rendah. " +
      "Kondisi kulit sehat, tidak ditemukan kutu atau jamur.",
    hargaLayanan: 120000,
    obat: [],
    hasilLab: [],
  },
  {
    id: 5, kategori: "Hotel",
    tanggal: "01", hari: "Rabu", jam: "07:00 WIB", bulan: "Apr 2026",
    hewanNama: "Max", hewanJenis: "Golden Retriever", hewanUsia: "2 Tahun", hewanBerat: "25 Kg",
    hewanFoto: FOTO_MAX, hewanTipe: "Anjing",
    petugas: "Rudi Santoso", petugasPeran: "Pet Hotel Staff",
    layananNama: "Hotel Hewan",
    layananDetail: "Menginap 3 Malam — Kamar Standar",
    catatan:
      "Max menginap selama 3 malam di kamar standar. Makan 2x sehari (pagi & sore) sesuai anjuran pemilik. " +
      "Aktivitas bermain di area outdoor 2x sehari. Kondisi hewan ceria dan nafsu makan baik selama menginap. " +
      "Check-in: 01 Apr 2026 · Check-out: 04 Apr 2026.",
    hargaLayanan: 450000,
    obat: [],
    hasilLab: [],
  },
  {
    id: 6, kategori: "Hotel",
    tanggal: "10", hari: "Jumat", jam: "09:00 WIB", bulan: "Apr 2026",
    hewanNama: "Luna", hewanJenis: "Kucing Persia", hewanUsia: "1 Tahun", hewanBerat: "4 Kg",
    hewanFoto: FOTO_LUNA, hewanTipe: "Kucing",
    petugas: "Rudi Santoso", petugasPeran: "Pet Hotel Staff",
    layananNama: "Hotel Hewan",
    layananDetail: "Menginap 2 Malam — Kamar VIP",
    catatan:
      "Luna menginap di kamar VIP dengan AC dan tempat tidur khusus kucing. Makan premium wet food 3x sehari. " +
      "Sesi bermain individual 1x sehari. Luna sempat kurang nafsu makan di hari pertama namun membaik di hari kedua. " +
      "Check-in: 10 Apr 2026 · Check-out: 12 Apr 2026.",
    hargaLayanan: 400000,
    obat: [],
    hasilLab: [],
  },
];

const ITEMS_PER_PAGE = 4;
const G = "#2e7d32";

function hitungTotal(item: RincianLayanan) {
  const totalObat = item.obat.reduce((s, o) => s + o.harga, 0);
  const totalLab  = item.hasilLab.reduce((s, l) => s + l.harga, 0);
  return { totalObat, totalLab, total: item.hargaLayanan + totalObat + totalLab };
}

// ── Status Badge ──────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const cfg: Record<string, { bg: string; color: string }> = {
    "Selesai":             { bg: "#e8f5e9", color: G },
    "Proses":              { bg: "#fff8e1", color: "#d97706" },
    "Dibatalkan":          { bg: "#fce4ec", color: "#c62828" },
    "Normal":              { bg: "#e8f5e9", color: G },
    "Abnormal":            { bg: "#fce4ec", color: "#c62828" },
    "Perlu Tindak Lanjut": { bg: "#fff8e1", color: "#d97706" },
  };
  const { bg, color } = cfg[status] ?? { bg: "#f5f5f5", color: "#888" };
  return (
    <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600, background: bg, color }}>
      {status}
    </span>
  );
}

// ── Tab Navigation ────────────────────────────────────────────────────────────

function TabNav({ active, onChange }: { active: "layanan" | "rincian"; onChange(t: "layanan" | "rincian"): void }) {
  return (
    <div style={{ display: "flex", gap: 0, background: "#fff", borderRadius: 12, padding: 4, boxShadow: "0 1px 4px rgba(0,0,0,0.07)", marginBottom: 20, width: "fit-content" }}>
      {(["layanan", "rincian"] as const).map(t => (
        <button key={t} onClick={() => onChange(t)} style={{
          padding: "9px 28px", borderRadius: 9, border: "none", cursor: "pointer",
          fontWeight: 700, fontSize: 14, transition: "all .15s",
          background: active === t ? G : "transparent",
          color: active === t ? "#fff" : "#888",
        }}>
          {t === "layanan" ? "📋 Riwayat Layanan" : "🏥 Rincian Layanan"}
        </button>
      ))}
    </div>
  );
}

// ── Riwayat Layanan ───────────────────────────────────────────────────────────

function RiwayatLayanan() {
  const [activeKategori, setActiveKategori] = useState("Semua");
  const [filterLayanan,  setFilterLayanan]  = useState("Semua");
  const [filterHewan,    setFilterHewan]    = useState("Semua Hewan");
  const [currentPage,    setCurrentPage]    = useState(1);

  const filtered = dummyLayanan.filter(d => {
    const matchLayanan = filterLayanan !== "Semua"
      ? d.kategori === filterLayanan
      : activeKategori === "Semua" || d.kategori === activeKategori;
    const matchHewan = filterHewan === "Semua Hewan" || d.hewanTipe === filterHewan;
    return matchLayanan && matchHewan;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated  = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const stats = [
    { icon: "📅", label: "Total Layanan",  value: dummyLayanan.length, key: "Semua" },
    { icon: "💉", label: "Vaksinasi",       value: dummyLayanan.filter(d => d.kategori === "Vaksinasi").length, key: "Vaksinasi" },
    { icon: "✂️", label: "Grooming",        value: dummyLayanan.filter(d => d.kategori === "Grooming").length, key: "Grooming" },
    { icon: "🏥", label: "Perawatan Medis", value: dummyLayanan.filter(d => d.kategori === "Perawatan Medis").length, key: "Perawatan Medis" },
    { icon: "🏨", label: "Hotel Hewan",     value: dummyLayanan.filter(d => d.kategori === "Hotel").length, key: "Hotel" },
  ];

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 14, marginBottom: 20 }}>
        {stats.map(stat => {
          const isActive = activeKategori === stat.key;
          return (
            <div key={stat.key} onClick={() => { setActiveKategori(stat.key); setFilterLayanan("Semua"); setCurrentPage(1); }}
              style={{ background: isActive ? "#f0faf2" : "#fff", borderRadius: 12, padding: "14px 18px", boxShadow: "0 1px 4px rgba(0,0,0,0.07)", display: "flex", alignItems: "center", gap: 12, border: isActive ? `1.5px solid ${G}` : "1.5px solid transparent", cursor: "pointer", transition: "all .15s" }}>
              <span style={{ fontSize: 22 }}>{stat.icon}</span>
              <div>
                <p style={{ margin: 0, fontSize: 12, color: "#888" }}>{stat.label}</p>
                <p style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#1a1a1a" }}>
                  {stat.value} <span style={{ fontSize: 12, fontWeight: 400, color: "#888" }}>Kali</span>
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ background: "#fff", borderRadius: 12, padding: "12px 18px", marginBottom: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.07)", display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#444", marginRight: 4 }}>🔍 Filter:</span>
        {[
          { label: "Jenis Layanan", value: filterLayanan, options: ["Semua", "Vaksinasi", "Grooming", "Perawatan Medis", "Hotel"], onChange: (v: string) => { setFilterLayanan(v); setActiveKategori("Semua"); setCurrentPage(1); } },
          { label: "Jenis Hewan",   value: filterHewan,   options: ["Semua Hewan", "Anjing", "Kucing", "Kelinci"],        onChange: (v: string) => { setFilterHewan(v); setCurrentPage(1); } },
        ].map(f => (
          <div key={f.label} style={{ display: "flex", alignItems: "center", gap: 6, background: "#f9f9f9", borderRadius: 8, padding: "2px 4px 2px 10px", border: "1px solid #e0e0e0" }}>
            <span style={{ fontSize: 12, color: "#666", fontWeight: 600, whiteSpace: "nowrap" }}>{f.label}</span>
            <select value={f.value} onChange={e => f.onChange(e.target.value)}
              style={{ padding: "6px 10px", border: "none", background: "transparent", fontSize: 13, color: "#333", cursor: "pointer", outline: "none", fontWeight: 500 }}>
              {f.options.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
        ))}
        <button onClick={() => { setActiveKategori("Semua"); setFilterLayanan("Semua"); setFilterHewan("Semua Hewan"); setCurrentPage(1); }}
          style={{ padding: "7px 16px", borderRadius: 8, border: "none", background: "#fce4ec", color: "#c62828", fontSize: 13, fontWeight: 700, cursor: "pointer", marginLeft: "auto" }}>
          ↺ Reset
        </button>
      </div>

      <div style={{ background: "#fff", borderRadius: 12, boxShadow: "0 1px 4px rgba(0,0,0,0.07)", overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "150px 1fr 1fr 80px", padding: "12px 20px", background: "#f9f9f9", borderBottom: "1px solid #f0f0f0" }}>
          {["Tanggal & Waktu", "Hewan", "Layanan", "Status"].map(h => (
            <span key={h} style={{ fontSize: 13, fontWeight: 700, color: "#555" }}>{h}</span>
          ))}
        </div>
        {paginated.length === 0
          ? <div style={{ padding: 40, textAlign: "center", color: "#aaa", fontSize: 14 }}>Tidak ada data untuk filter ini.</div>
          : paginated.map((item, i) => (
            <div key={item.id} style={{ display: "grid", gridTemplateColumns: "150px 1fr 1fr 80px", padding: "14px 20px", borderBottom: i < paginated.length - 1 ? "1px solid #f0f0f0" : "none", alignItems: "center" }}>
              <div>
                <p style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#1a1a1a" }}>{item.tanggal}</p>
                <p style={{ margin: 0, fontSize: 13, color: "#555" }}>{item.bulan}</p>
                <p style={{ margin: 0, fontSize: 12, color: "#888" }}>{item.jam}</p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <img src={item.hewanFoto} alt={item.hewanNama} style={{ width: 44, height: 44, borderRadius: 8, objectFit: "cover" }} />
                <div>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "#1a1a1a" }}>{item.hewanNama}</p>
                  <p style={{ margin: 0, fontSize: 12, color: "#888" }}>{item.hewanJenis}</p>
                  <p style={{ margin: 0, fontSize: 12, color: "#888" }}>{item.hewanUsia} · {item.hewanBerat}</p>
                </div>
              </div>
              <div>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#1a1a1a" }}>{item.layananUtama}</p>
                <p style={{ margin: 0, fontSize: 12, color: "#888" }}>{item.layananDetail}</p>
              </div>
              <StatusBadge status={item.status} />
            </div>
          ))
        }
      </div>

      {totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 6, marginTop: 16 }}>
          <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
            style={{ padding: "6px 14px", borderRadius: 8, border: "1px solid #d1d5db", background: "#fff", fontSize: 13, cursor: "pointer", color: "#333" }}>
            ‹ Sebelumnya
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button key={page} onClick={() => setCurrentPage(page)}
              style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid #d1d5db", background: currentPage === page ? G : "#fff", color: currentPage === page ? "#fff" : "#333", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
              {page}
            </button>
          ))}
          <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
            style={{ padding: "6px 14px", borderRadius: 8, border: "1px solid #d1d5db", background: "#fff", fontSize: 13, cursor: "pointer", color: "#333" }}>
            Berikutnya ›
          </button>
        </div>
      )}
    </div>
  );
}

// ── Rincian Layanan Page ──────────────────────────────────────────────────────

const KATEGORI_CFG = [
  { key: "Semua",           icon: "📋", label: "Total Rincian" },
  { key: "Vaksinasi",       icon: "💉", label: "Vaksinasi" },
  { key: "Grooming",        icon: "✂️", label: "Grooming" },
  { key: "Perawatan Medis", icon: "🏥", label: "Perawatan Medis" },
  { key: "Hotel",           icon: "🏨", label: "Hotel Hewan" },
];

function RincianLayananPage() {
  const [filterHewan,    setFilterHewan]    = useState("Semua Hewan");
  const [filterKategori, setFilterKategori] = useState("Semua");
  const [expanded,       setExpanded]       = useState<number | null>(null);

  const filtered = dummyRincianLayanan.filter(d => {
    const matchHewan    = filterHewan    === "Semua Hewan" || d.hewanTipe === filterHewan;
    const matchKategori = filterKategori === "Semua"       || d.kategori  === filterKategori;
    return matchHewan && matchKategori;
  });

  return (
    <div>
      {/* Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 14, marginBottom: 20 }}>
        {KATEGORI_CFG.map(k => {
          const count = k.key === "Semua"
            ? dummyRincianLayanan.length
            : dummyRincianLayanan.filter(d => d.kategori === k.key).length;
          const isActive = filterKategori === k.key;
          return (
            <div key={k.key}
              onClick={() => { setFilterKategori(k.key); setExpanded(null); }}
              style={{ background: isActive ? "#f0faf2" : "#fff", borderRadius: 12, padding: "14px 18px", boxShadow: "0 1px 4px rgba(0,0,0,0.07)", display: "flex", alignItems: "center", gap: 12, border: isActive ? `1.5px solid ${G}` : "1.5px solid transparent", cursor: "pointer", transition: "all .15s" }}>
              <span style={{ fontSize: 22 }}>{k.icon}</span>
              <div>
                <p style={{ margin: 0, fontSize: 12, color: "#888" }}>{k.label}</p>
                <p style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#1a1a1a" }}>
                  {count} <span style={{ fontSize: 12, fontWeight: 400, color: "#888" }}>Data</span>
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filter Bar */}
      <div style={{ background: "#fff", borderRadius: 12, padding: "12px 18px", marginBottom: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.07)", display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#444", marginRight: 4 }}>🔍 Filter:</span>
        {[
          { label: "Jenis Layanan", value: filterKategori, options: ["Semua", "Vaksinasi", "Grooming", "Perawatan Medis", "Hotel"], onChange: (v: string) => { setFilterKategori(v); setExpanded(null); } },
          { label: "Jenis Hewan",   value: filterHewan,    options: ["Semua Hewan", "Anjing", "Kucing", "Kelinci"],                 onChange: (v: string) => setFilterHewan(v) },
        ].map(f => (
          <div key={f.label} style={{ display: "flex", alignItems: "center", gap: 6, background: "#f9f9f9", borderRadius: 8, padding: "2px 4px 2px 10px", border: "1px solid #e0e0e0" }}>
            <span style={{ fontSize: 12, color: "#666", fontWeight: 600, whiteSpace: "nowrap" }}>{f.label}</span>
            <select value={f.value} onChange={e => f.onChange(e.target.value)}
              style={{ padding: "6px 10px", border: "none", background: "transparent", fontSize: 13, color: "#333", cursor: "pointer", outline: "none", fontWeight: 500 }}>
              {f.options.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
        ))}
        <button onClick={() => { setFilterKategori("Semua"); setFilterHewan("Semua Hewan"); setExpanded(null); }}
          style={{ padding: "7px 16px", borderRadius: 8, border: "none", background: "#fce4ec", color: "#c62828", fontSize: 13, fontWeight: 700, cursor: "pointer", marginLeft: "auto" }}>
          ↺ Reset
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {filtered.length === 0
          ? <div style={{ background: "#fff", borderRadius: 12, padding: 40, textAlign: "center", color: "#aaa", fontSize: 14 }}>Tidak ada data untuk filter ini.</div>
          : filtered.map(item => {
            const isOpen = expanded === item.id;
            const { totalObat, totalLab, total } = hitungTotal(item);
            const isMedis = item.kategori === "Perawatan Medis";

            // Warna badge kategori
            const badgeCfg: Record<string, { bg: string; color: string }> = {
              "Vaksinasi":       { bg: "#e3f2fd", color: "#1565c0" },
              "Grooming":        { bg: "#f3e5f5", color: "#6a1b9a" },
              "Perawatan Medis": { bg: "#fce4ec", color: "#c62828" },
              "Hotel":           { bg: "#e8f5e9", color: G },
            };
            const bc = badgeCfg[item.kategori] ?? { bg: "#f5f5f5", color: "#888" };

            return (
              <div key={item.id} style={{ background: "#fff", borderRadius: 12, boxShadow: "0 1px 4px rgba(0,0,0,0.07)", overflow: "hidden", border: isOpen ? `1.5px solid ${G}` : "1.5px solid transparent", transition: "border .15s" }}>

                {/* ── Header Row ── */}
                <div style={{ display: "grid", gridTemplateColumns: "130px 1fr 1fr 1fr auto", alignItems: "center", padding: "16px 20px", gap: 12, cursor: "pointer" }}
                  onClick={() => setExpanded(isOpen ? null : item.id)}>
                  <div>
                    <p style={{ margin: 0, fontSize: 11, color: "#888" }}>{item.hari}</p>
                    <p style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#1a1a1a" }}>{item.tanggal}</p>
                    <p style={{ margin: 0, fontSize: 12, color: "#555" }}>{item.bulan}</p>
                    <p style={{ margin: 0, fontSize: 11, color: "#888" }}>{item.jam}</p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <img src={item.hewanFoto} alt={item.hewanNama} style={{ width: 44, height: 44, borderRadius: 8, objectFit: "cover" }} />
                    <div>
                      <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#1a1a1a" }}>{item.hewanNama}</p>
                      <p style={{ margin: 0, fontSize: 12, color: "#888" }}>{item.hewanJenis}</p>
                      <p style={{ margin: 0, fontSize: 12, color: "#888" }}>{item.hewanUsia} · {item.hewanBerat}</p>
                    </div>
                  </div>
                  <div>
                    <span style={{ padding: "2px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: bc.bg, color: bc.color, display: "inline-block", marginBottom: 4 }}>
                      {item.kategori}
                    </span>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#1a1a1a" }}>{item.layananNama}</p>
                    <p style={{ margin: 0, fontSize: 12, color: "#888" }}>{item.layananDetail}</p>
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: 11, color: "#888", marginBottom: 3 }}>Petugas</p>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>{item.petugas}</p>
                    <p style={{ margin: 0, fontSize: 12, color: "#888" }}>{item.petugasPeran}</p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ margin: 0, fontSize: 11, color: "#888", marginBottom: 3 }}>Total Biaya</p>
                    <p style={{ margin: 0, fontSize: 15, fontWeight: 800, color: G }}>{toRp(total)}</p>
                    <span style={{ fontSize: 18, color: "#888", display: "block", marginTop: 4, transition: "transform .2s", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}>⌄</span>
                  </div>
                </div>

                {/* ── Expanded Detail ── */}
                {isOpen && (
                  <div style={{ borderTop: "1px solid #f0f0f0", padding: "18px 20px", background: "#fafafa", display: "flex", flexDirection: "column", gap: 18 }}>

                    {/* Catatan Petugas */}
                    <div>
                      <p style={{ margin: "0 0 8px", fontSize: 13, fontWeight: 700, color: G }}>📝 Catatan Petugas</p>
                      <div style={{ background: "#fff", borderRadius: 8, padding: "10px 14px", border: "1px solid #e0e0e0", fontSize: 13, color: "#333", lineHeight: 1.7 }}>
                        {item.catatan}
                      </div>
                    </div>

                    {/* 3 Kolom: Layanan | Obat | Hasil Lab */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, alignItems: "start" }}>

                      {/* Kolom 1 — Layanan */}
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        <p style={{ margin: "0 0 6px", fontSize: 13, fontWeight: 700, color: G }}>
                          {item.kategori === "Hotel" ? "🏨" : item.kategori === "Grooming" ? "✂️" : item.kategori === "Vaksinasi" ? "💉" : "🏥"} Layanan yang Dilakukan
                        </p>
                        <div style={{ background: "#fff", borderRadius: 8, padding: "12px 14px", border: "1px solid #e0e0e0", display: "flex", flexDirection: "column", gap: 10 }}>
                          <div>
                            <p style={{ margin: "0 0 3px", fontSize: 11, color: "#888" }}>Jenis Layanan</p>
                            <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#1a1a1a" }}>{item.layananNama}</p>
                            <p style={{ margin: "2px 0 0", fontSize: 12, color: "#888" }}>{item.layananDetail}</p>
                          </div>
                          <div style={{ borderTop: "1px dashed #e8e8e8", paddingTop: 10 }}>
                            <p style={{ margin: "0 0 3px", fontSize: 11, color: "#888" }}>Petugas</p>
                            <p style={{ margin: "0 0 2px", fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>{item.petugas}</p>
                            <p style={{ margin: 0, fontSize: 12, color: "#888" }}>{item.petugasPeran}</p>
                          </div>
                          <div style={{ borderTop: "1px dashed #e8e8e8", paddingTop: 10, background: "#f0faf2", borderRadius: 6, padding: "8px 10px" }}>
                            <p style={{ margin: "0 0 2px", fontSize: 11, color: G }}>Biaya Layanan</p>
                            <p style={{ margin: 0, fontSize: 15, fontWeight: 800, color: G }}>{toRp(item.hargaLayanan)}</p>
                          </div>
                        </div>
                      </div>

                      {/* Kolom 2 — Obat */}
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        <p style={{ margin: "0 0 6px", fontSize: 13, fontWeight: 700, color: G }}>💊 Obat yang Diresepkan</p>
                        {item.obat.length === 0 ? (
                          <div style={{ background: "#fff", borderRadius: 8, padding: "20px 14px", border: "1px solid #e0e0e0", textAlign: "center", color: "#bbb", fontSize: 13 }}>
                            Tidak ada obat
                          </div>
                        ) : (
                          <>
                            {item.obat.map((o, i) => (
                              <div key={i} style={{ background: "#fff", borderRadius: 8, padding: "10px 14px", border: "1px solid #e0e0e0", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                                <div style={{ flex: 1 }}>
                                  <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#1a1a1a" }}>{o.nama}</p>
                                  <p style={{ margin: 0, fontSize: 12, color: "#888" }}>{o.dosis} · {o.frekuensi}</p>
                                </div>
                                <span style={{ fontSize: 13, fontWeight: 700, color: G, whiteSpace: "nowrap" }}>{toRp(o.harga)}</span>
                              </div>
                            ))}
                            <div style={{ background: "#f0faf2", borderRadius: 8, padding: "8px 14px", display: "flex", justifyContent: "space-between", border: "1px solid #c8e6c9" }}>
                              <span style={{ fontSize: 12, fontWeight: 700, color: G }}>Subtotal Obat</span>
                              <span style={{ fontSize: 13, fontWeight: 800, color: G }}>{toRp(totalObat)}</span>
                            </div>
                          </>
                        )}
                      </div>

                      {/* Kolom 3 — Hasil Lab */}
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        <p style={{ margin: "0 0 6px", fontSize: 13, fontWeight: 700, color: G }}>🔬 Hasil Lab / Pemeriksaan</p>
                        {item.hasilLab.length === 0 ? (
                          <div style={{ background: "#fff", borderRadius: 8, padding: "20px 14px", border: "1px solid #e0e0e0", textAlign: "center", color: "#bbb", fontSize: 13 }}>
                            Tidak ada hasil lab
                          </div>
                        ) : (
                          <>
                            {item.hasilLab.map((l, i) => (
                              <div key={i} style={{ background: "#fff", borderRadius: 8, padding: "10px 14px", border: "1px solid #e0e0e0" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 4 }}>
                                  <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>{l.nama}</p>
                                  <StatusBadge status={l.status} />
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                  <p style={{ margin: 0, fontSize: 12, color: "#888" }}>{l.hasil}</p>
                                  <span style={{ fontSize: 12, fontWeight: 700, color: G, whiteSpace: "nowrap", marginLeft: 8 }}>{toRp(l.harga)}</span>
                                </div>
                              </div>
                            ))}
                            <div style={{ background: "#f0faf2", borderRadius: 8, padding: "8px 14px", display: "flex", justifyContent: "space-between", border: "1px solid #c8e6c9" }}>
                              <span style={{ fontSize: 12, fontWeight: 700, color: G }}>Subtotal Lab</span>
                              <span style={{ fontSize: 13, fontWeight: 800, color: G }}>{toRp(totalLab)}</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Total Keseluruhan */}
                    <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #e0e0e0", overflow: "hidden" }}>
                      <p style={{ margin: 0, padding: "10px 16px", fontSize: 13, fontWeight: 700, color: G, background: "#f0faf2", borderBottom: "1px solid #e0e0e0" }}>
                        💰 Rincian Total Biaya
                      </p>
                      <div style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <span style={{ fontSize: 13, color: "#555" }}>Biaya Layanan</span>
                          <span style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>{toRp(item.hargaLayanan)}</span>
                        </div>
                        {item.obat.length > 0 && (
                          <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span style={{ fontSize: 13, color: "#555" }}>💊 Biaya Obat ({item.obat.length} item)</span>
                            <span style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>{toRp(totalObat)}</span>
                          </div>
                        )}
                        {item.hasilLab.length > 0 && (
                          <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span style={{ fontSize: 13, color: "#555" }}>🔬 Biaya Lab ({item.hasilLab.length} item)</span>
                            <span style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>{toRp(totalLab)}</span>
                          </div>
                        )}
                        <div style={{ borderTop: "1px dashed #ccc", marginTop: 4, paddingTop: 10, display: "flex", justifyContent: "space-between" }}>
                          <span style={{ fontSize: 14, fontWeight: 700, color: G }}>Total Keseluruhan</span>
                          <span style={{ fontSize: 16, fontWeight: 800, color: G }}>{toRp(total)}</span>
                        </div>
                      </div>
                    </div>

                  </div>
                )}
              </div>
            );
          })
        }
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function RiwayatLayananPage() {
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<"layanan" | "rincian">("layanan");

  useEffect(() => {
    const t = searchParams.get("tab");
    if (t === "rincian" || t === "layanan") {
      setTab(t);
    }
  }, [searchParams]);

  return (
    <div style={{ display: "flex", height: "100vh", backgroundColor: "#f5f5f5", fontFamily: "Segoe UI, sans-serif" }}>
      <Sidebar activePage="riwayat" />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflowY: "auto" }}>
        <Header
          title="Riwayat Hewan"
          subtitle="Lihat riwayat layanan dan rincian layanan hewan peliharaan Anda"
        />
        <main style={{ flex: 1, padding: "20px 24px" }}>
          <TabNav active={tab} onChange={setTab} />
          {tab === "layanan" ? <RiwayatLayanan /> : <RincianLayananPage />}
        </main>
      </div>
    </div>
  );
}