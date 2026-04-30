"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar_admin";
import Header from "@/components/Header";

// ── Types & Data ───────────────────────────────────────────────────────────
interface Obat {
  id: number; nama: string; kategori: string; satuan: string;
  harga: number; stok: number; minStok: number; deskripsi: string;
}

const seedObat: Obat[] = [
  { id:1, nama:"Metronidazole 500mg",       kategori:"Antibiotik",   satuan:"tablet",      harga:5000,   stok:85, minStok:20, deskripsi:"Antibiotik kuat untuk gastroenteritis & infeksi bakteri anaerob" },
  { id:2, nama:"Probiotik FortiFlora",      kategori:"Suplemen",     satuan:"sachet",      harga:35000,  stok:40, minStok:10, deskripsi:"Suplemen probiotik untuk menjaga kesehatan pencernaan hewan" },
  { id:3, nama:"Cairan Infus RL",           kategori:"Infus",        satuan:"botol 500ml", harga:45000, stok:100, minStok:10, deskripsi:"Ringer Laktat untuk rehidrasi dan keseimbangan elektrolit" },
  { id:4, nama:"Drontal Tablet",            kategori:"Antiparasit",  satuan:"tablet",      harga:35000,  stok:50, minStok:20, deskripsi:"Obat cacing broad-spectrum efektif untuk kucing dan anjing" },
  { id:5, nama:"Ori-Vit A+D+D3+C",         kategori:"Vitamin",      satuan:"botol 30ml",  harga:75000,   stok:4, minStok:10, deskripsi:"Multivitamin lengkap untuk daya tahan dan pertumbuhan optimal" },
  { id:6, nama:"Antihistamin (Cetirizine)", kategori:"Antihistamin", satuan:"tablet",      harga:8000,   stok:12, minStok:15, deskripsi:"Meredakan reaksi alergi, gatal-gatal dan rhinitis pada hewan" },
  { id:7, nama:"Albendazole",               kategori:"Antiparasit",  satuan:"tablet",      harga:8000,    stok:3, minStok:10, deskripsi:"Antiparasit spektrum luas untuk cacing pita dan nematoda" },
  { id:8, nama:"Simparica Tablet",          kategori:"Antiparasit",  satuan:"tablet",      harga:125000,  stok:0,  minStok:5, deskripsi:"Perlindungan kutu & tungau bulanan untuk anjing dewasa" },
];

const ITEMS_PER_PAGE = 8;

function fmt(n: number) { return "Rp " + n.toLocaleString("id-ID"); }
function stokStatus(o: Obat) {
  if (o.stok === 0)        return "Habis";
  if (o.stok < o.minStok)  return "Kritis";
  return "Aman";
}
function stokColor(s: string) {
  if (s === "Habis")  return "#ef4444";
  if (s === "Kritis") return "#d97706";
  return "#2E7D32";
}

// ── Modal ──────────────────────────────────────────────────────────────────
const labelSt: React.CSSProperties = {
  display: "block", fontSize: "13px", fontWeight: 600,
  color: "#555", marginBottom: "5px",
};
const inputSt: React.CSSProperties = {
  width: "100%", padding: "8px 12px",
  border: "1px solid #d1d5db", borderRadius: "8px",
  fontSize: "13px", color: "#1a1a1a",
  fontFamily: "Segoe UI, sans-serif", outline: "none", background: "#fff",
};

function ObatModal({
  onClose, onSave, existing,
}: {
  onClose: () => void;
  onSave: (o: Omit<Obat, "id">) => void;
  existing?: Obat | null;
}) {
  const [f, setF] = useState<Omit<Obat, "id">>({
    nama:      existing?.nama      ?? "",
    kategori:  existing?.kategori  ?? "Antibiotik",
    satuan:    existing?.satuan    ?? "tablet",
    harga:     existing?.harga     ?? 0,
    stok:      existing?.stok      ?? 0,
    minStok:   existing?.minStok   ?? 10,
    deskripsi: existing?.deskripsi ?? "",
  });
  const s = (k: string, v: string | number) => setF(p => ({ ...p, [k]: v }));

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,.4)",
      zIndex: 200, display: "flex", alignItems: "center",
      justifyContent: "center", padding: "1rem",
    }}>
      <div style={{
        background: "#fff", borderRadius: "12px", width: "100%",
        maxWidth: "480px", boxShadow: "0 8px 32px rgba(0,0,0,.18)",
        fontFamily: "Segoe UI, sans-serif", maxHeight: "90vh",
        display: "flex", flexDirection: "column",
      }}>
        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 20px", borderBottom: "1px solid #f0f0f0",
        }}>
          <span style={{ fontWeight: 700, fontSize: "15px", color: "#1a1a1a" }}>
            {existing ? "Edit Obat" : "Tambah Obat"}
          </span>
          <button onClick={onClose} style={{
            background: "none", border: "none",
            fontSize: "18px", cursor: "pointer", color: "#888",
          }}>✕</button>
        </div>

        {/* Body */}
        <div style={{
          padding: "20px", overflow: "auto", flex: 1,
          display: "flex", flexDirection: "column", gap: "14px",
        }}>
          <div>
            <label style={labelSt}>Nama Obat</label>
            <input style={inputSt} value={f.nama}
              onChange={e => s("nama", e.target.value)} placeholder="Nama obat..." />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label style={labelSt}>Kategori</label>
              <select style={inputSt} value={f.kategori}
                onChange={e => s("kategori", e.target.value)}>
                {["Antibiotik","Suplemen","Infus","Antiparasit","Vitamin","Antihistamin","Analgesik","Lainnya"]
                  .map(k => <option key={k}>{k}</option>)}
              </select>
            </div>
            <div>
              <label style={labelSt}>Satuan</label>
              <input style={inputSt} value={f.satuan}
                onChange={e => s("satuan", e.target.value)} placeholder="tablet / sachet..." />
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label style={labelSt}>Harga / Satuan (Rp)</label>
              <input style={inputSt} type="number" value={f.harga}
                onChange={e => s("harga", +e.target.value)} />
            </div>
            <div>
              <label style={labelSt}>Stok</label>
              <input style={inputSt} type="number" value={f.stok}
                onChange={e => s("stok", +e.target.value)} />
            </div>
          </div>
          <div>
            <label style={labelSt}>Min. Stok (Kritis)</label>
            <input style={inputSt} type="number" value={f.minStok}
              onChange={e => s("minStok", +e.target.value)} />
          </div>
          <div>
            <label style={labelSt}>Deskripsi</label>
            <textarea
              style={{ ...inputSt, resize: "vertical" } as React.CSSProperties}
              value={f.deskripsi}
              onChange={e => s("deskripsi", e.target.value)}
              rows={2} placeholder="Deskripsi singkat..." />
          </div>
        </div>

        {/* Footer */}
        <div style={{
          display: "flex", justifyContent: "flex-end", gap: "8px",
          padding: "14px 20px", borderTop: "1px solid #f0f0f0",
        }}>
          <button onClick={onClose} style={{
            padding: "7px 18px", borderRadius: "8px",
            border: "1px solid #d1d5db", background: "#fff",
            color: "#555", fontSize: "13px", fontWeight: 600, cursor: "pointer",
            fontFamily: "Segoe UI, sans-serif",
          }}>Batal</button>
          <button
            onClick={() => { if (f.nama) { onSave(f); onClose(); } }}
            style={{
              padding: "7px 18px", borderRadius: "8px",
              border: "none", background: "#2E7D32",
              color: "#fff", fontSize: "13px", fontWeight: 600, cursor: "pointer",
              fontFamily: "Segoe UI, sans-serif",
            }}>Simpan</button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────
export default function StokObatPage() {
  const [obatList, setObatList]         = useState<Obat[]>(seedObat);
  const [showModal, setShowModal]       = useState(false);
  const [editTarget, setEditTarget]     = useState<Obat | null>(null);
  const [search, setSearch]             = useState("");
  const [filterKat, setFilterKat]       = useState("Semua");
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [page, setPage]                 = useState(1);

  const addObat    = (o: Omit<Obat, "id">) =>
    setObatList(prev => [...prev, { id: Date.now(), ...o }]);
  const updateObat = (o: Omit<Obat, "id">) =>
    setObatList(prev => prev.map(x => x.id === editTarget!.id ? { ...x, ...o } : x));
  const deleteObat = (id: number) =>
    setObatList(prev => prev.filter(o => o.id !== id));

  const openAdd  = () => { setEditTarget(null);  setShowModal(true); };
  const openEdit = (o: Obat) => { setEditTarget(o); setShowModal(true); };

  const kategoriList = Array.from(new Set(obatList.map(o => o.kategori)));

  const filtered = obatList.filter(o =>
    (!search || o.nama.toLowerCase().includes(search.toLowerCase()) ||
      o.kategori.toLowerCase().includes(search.toLowerCase())) &&
    (filterKat === "Semua" || o.kategori === filterKat) &&
    (filterStatus === "Semua" || stokStatus(o) === filterStatus)
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated  = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const totalJenis = obatList.length;
  const obatHabis  = obatList.filter(o => o.stok === 0).length;
  const stokKritis = obatList.filter(o => o.stok > 0 && o.stok < o.minStok).length;
  const stokAman   = obatList.filter(o => o.stok >= o.minStok).length;

  const stats = [
    { icon: "💊", label: "Total Jenis Obat",  value: totalJenis, key: "Semua" },
    { icon: "❌", label: "Obat Habis",         value: obatHabis,  key: "Habis" },
    { icon: "⚠️", label: "Stok Kritis",        value: stokKritis, key: "Kritis" },
    { icon: "✅", label: "Stok Aman",           value: stokAman,   key: "Aman" },
  ];

  const handleReset = () => {
    setSearch(""); setFilterKat("Semua");
    setFilterStatus("Semua"); setPage(1);
  };

  const selectSt: React.CSSProperties = {
    padding: "7px 12px", borderRadius: "8px",
    border: "1px solid #d1d5db", fontSize: "13px",
    color: "#333", backgroundColor: "#fff",
    cursor: "pointer", outline: "none",
    fontFamily: "Segoe UI, sans-serif",
  };

  return (
    <div style={{
      display: "flex", height: "100vh",
      backgroundColor: "#f5f5f5", fontFamily: "Segoe UI, sans-serif",
    }}>
      {/* ✅ FIX: activePage="obat" agar cocok dengan key di Sidebar_admin */}
      <Sidebar activePage="obat" />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflowY: "auto" }}>
        <Header
          title="Stok Obat"
          subtitle="Kelola daftar dan ketersediaan stok obat klinik"
        />

        <main style={{ flex: 1, padding: "24px" }}>

          {/* Stats Cards */}
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
            gap: "16px", marginBottom: "24px",
          }}>
            {stats.map((stat) => {
              const isActive = filterStatus === stat.key;
              return (
                <div
                  key={stat.key}
                  onClick={() => {
                    setFilterStatus(stat.key === "Semua" ? "Semua" : stat.key);
                    setPage(1);
                  }}
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
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.border = "1.5px solid #a7d7a9";
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.border = "1.5px solid transparent";
                  }}
                >
                  <span style={{ fontSize: "22px" }}>{stat.icon}</span>
                  <div>
                    <p style={{ margin: 0, fontSize: "13px", color: "#888" }}>{stat.label}</p>
                    <p style={{ margin: 0, fontSize: "20px", fontWeight: 700, color: "#1a1a1a" }}>
                      {stat.value}
                      <span style={{ fontSize: "13px", fontWeight: 400, color: "#888" }}> Jenis</span>
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

            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Cari nama atau kategori obat..."
              style={{ ...selectSt, flex: 1, minWidth: "200px", padding: "7px 12px" }}
            />

            <select
              value={filterKat}
              onChange={e => { setFilterKat(e.target.value); setPage(1); }}
              style={selectSt}
            >
              {["Semua", ...kategoriList].map(k => (
                <option key={k} value={k}>Kategori : {k}</option>
              ))}
            </select>

            <select
              value={filterStatus}
              onChange={e => { setFilterStatus(e.target.value); setPage(1); }}
              style={selectSt}
            >
              {["Semua", "Aman", "Kritis", "Habis"].map(s => (
                <option key={s} value={s}>Status : {s}</option>
              ))}
            </select>

            <button onClick={handleReset} style={{
              padding: "7px 18px", borderRadius: "8px", border: "none",
              backgroundColor: "#ef4444", color: "#fff",
              fontSize: "13px", fontWeight: 600, cursor: "pointer",
              fontFamily: "Segoe UI, sans-serif",
            }}>Reset</button>

            <button onClick={openAdd} style={{
              padding: "7px 18px", borderRadius: "8px", border: "none",
              backgroundColor: "#2E7D32", color: "#fff",
              fontSize: "13px", fontWeight: 600, cursor: "pointer",
              fontFamily: "Segoe UI, sans-serif",
            }}>+ Tambah Obat</button>
          </div>

          {/* Table */}
          <div style={{
            backgroundColor: "#ffffff", borderRadius: "12px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.07)", overflow: "hidden",
          }}>
            <div style={{
              display: "grid",
              gridTemplateColumns: "2fr 120px 120px 130px 70px 80px 100px 90px",
              padding: "12px 20px",
              backgroundColor: "#f9f9f9",
              borderBottom: "1px solid #f0f0f0",
            }}>
              {["Nama Obat", "Kategori", "Satuan", "Harga", "Stok", "Min. Stok", "Status", "Aksi"].map(h => (
                <span key={h} style={{ fontSize: "13px", fontWeight: 600, color: "#555" }}>{h}</span>
              ))}
            </div>

            {paginated.length === 0 ? (
              <div style={{ padding: "40px", textAlign: "center", color: "#aaa", fontSize: "14px" }}>
                Tidak ada data untuk filter ini.
              </div>
            ) : (
              paginated.map((item, i) => {
                const st = stokStatus(item);
                return (
                  <div key={item.id} style={{
                    display: "grid",
                    gridTemplateColumns: "2fr 120px 120px 130px 70px 80px 100px 90px",
                    padding: "14px 20px",
                    borderBottom: i < paginated.length - 1 ? "1px solid #f0f0f0" : "none",
                    alignItems: "center",
                  }}>
                    <div>
                      <p style={{ margin: 0, fontSize: "14px", fontWeight: 600, color: "#1a1a1a" }}>
                        {item.nama}
                      </p>
                      <p style={{ margin: 0, fontSize: "12px", color: "#888", marginTop: "2px" }}>
                        {item.deskripsi.length > 55 ? item.deskripsi.slice(0, 55) + "…" : item.deskripsi}
                      </p>
                    </div>

                    <p style={{ margin: 0, fontSize: "13px", color: "#555" }}>{item.kategori}</p>
                    <p style={{ margin: 0, fontSize: "13px", color: "#888" }}>{item.satuan}</p>
                    <p style={{ margin: 0, fontSize: "14px", fontWeight: 600, color: "#1a1a1a" }}>
                      {fmt(item.harga)}
                    </p>
                    <p style={{
                      margin: 0, fontSize: "14px", fontWeight: 700,
                      color: item.stok === 0 ? "#ef4444" : item.stok < item.minStok ? "#d97706" : "#1a1a1a",
                    }}>{item.stok}</p>
                    <p style={{ margin: 0, fontSize: "13px", color: "#888" }}>{item.minStok}</p>

                    <span style={{ fontSize: "13px", fontWeight: 600, color: stokColor(st) }}>{st}</span>

                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        onClick={() => openEdit(item)}
                        style={{
                          padding: "5px 10px", borderRadius: "7px",
                          border: "1px solid #d1d5db", backgroundColor: "#fff",
                          fontSize: "12px", fontWeight: 600, color: "#2E7D32",
                          cursor: "pointer", fontFamily: "Segoe UI, sans-serif",
                        }}>Edit</button>
                      <button
                        onClick={() => deleteObat(item.id)}
                        style={{
                          padding: "5px 10px", borderRadius: "7px",
                          border: "1px solid #fecaca", backgroundColor: "#fff",
                          fontSize: "12px", fontWeight: 600, color: "#ef4444",
                          cursor: "pointer", fontFamily: "Segoe UI, sans-serif",
                        }}>Hapus</button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{
              display: "flex", justifyContent: "flex-end",
              alignItems: "center", gap: "6px", marginTop: "16px",
            }}>
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                style={{
                  padding: "6px 14px", borderRadius: "8px",
                  border: "1px solid #d1d5db", backgroundColor: "#fff",
                  fontSize: "13px", cursor: page === 1 ? "not-allowed" : "pointer",
                  color: page === 1 ? "#aaa" : "#333",
                  fontFamily: "Segoe UI, sans-serif",
                }}>‹ Sebelumnya</button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  style={{
                    width: "32px", height: "32px", borderRadius: "8px",
                    border: "1px solid #d1d5db",
                    backgroundColor: page === p ? "#2E7D32" : "#fff",
                    color: page === p ? "#fff" : "#333",
                    fontSize: "13px", fontWeight: 600, cursor: "pointer",
                    fontFamily: "Segoe UI, sans-serif",
                  }}>{p}</button>
              ))}

              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                style={{
                  padding: "6px 14px", borderRadius: "8px",
                  border: "1px solid #d1d5db", backgroundColor: "#fff",
                  fontSize: "13px",
                  cursor: page === totalPages ? "not-allowed" : "pointer",
                  color: page === totalPages ? "#aaa" : "#333",
                  fontFamily: "Segoe UI, sans-serif",
                }}>Berikutnya ›</button>
            </div>
          )}

        </main>
      </div>

      {showModal && (
        <ObatModal
          onClose={() => setShowModal(false)}
          onSave={editTarget ? updateObat : addObat}
          existing={editTarget}
        />
      )}
    </div>
  );
}