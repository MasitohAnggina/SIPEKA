"use client";

import { useState, useEffect, useRef } from "react";
import { Check, ChevronRight, ChevronLeft, Info, Download, X, ImagePlus } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { useBookingPDF, type BookingPDFData } from "./useBookingPDF";

// ── Types ─────────────────────────────────────────────────────────────────────

type Pet = {
  id: string;
  name: string;
  type: string;
  breed: string;
  age: string;
  weight: string;
  emoji: string;
  photo?: string;
};

type ConditionPhoto = {
  id: string;
  dataUrl: string;
  label: "before" | "after";
  caption: string;
};

// ── Static Data ───────────────────────────────────────────────────────────────

const PETS_DEFAULT: Pet[] = [
  { id: "max",   name: "Max",   type: "Anjing", breed: "Golden Retriever", age: "2 Tahun", weight: "25 Kg", emoji: "🐕" },
  { id: "simba", name: "Simba", type: "Anjing", breed: "Buldog",           age: "1 Tahun", weight: "10 Kg", emoji: "🐶" },
];

const SERVICES = [
  { id: "periksa",  name: "Pemeriksaan Kesehatan", icon: "🩺" },
  { id: "grooming", name: "Grooming",               icon: "✂️" },
  { id: "hotel",    name: "Hotel Hewan",             icon: "🏠" },
];

const TIMES   = ["08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00"];
const STEPS   = ["Pilih Hewan","Pilih Layanan","Foto Kondisi","Jadwal","Persetujuan","Konfirmasi"];
const CONSENTS = [
  "Saya menyetujui bahwa tindakan medis yang diperlukan dapat dilakukan oleh dokter/paramedis yang bertugas.",
  "Saya memahami bahwa hasil pemeriksaan akan dicatat dalam rekam medis hewan peliharaan saya.",
  "Saya bertanggung jawab atas keakuratan informasi yang saya berikan terkait kondisi hewan peliharaan saya.",
  "Saya menyetujui penggunaan data hewan untuk keperluan layanan di klinik.",
];

// ── Helpers ───────────────────────────────────────────────────────────────────

const G = "#2e7d32";
const cardStyle = (active: boolean): React.CSSProperties => ({
  borderRadius: 10, padding: "13px 15px", cursor: "pointer", transition: "all .15s",
  border: active ? `2px solid ${G}` : "1.5px solid #e0e0e0",
  background: active ? "#f1f8f1" : "#fff",
});
const fmtDate = (d: string) =>
  d ? new Date(d).toLocaleDateString("id-ID", { year: "numeric", month: "2-digit", day: "2-digit" }).replace(/\//g, "-") : "–";

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ── Shared: Avatar hewan ──────────────────────────────────────────────────────

function PetAvatar({ pet, size = 42 }: { pet: Pet; size?: number }) {
  if (pet.photo) {
    return (
      <div style={{
        width: size, height: size, borderRadius: 8,
        background: "#f5f5f5", border: "1.5px solid #e0e0e0",
        display: "flex", alignItems: "center", justifyContent: "center",
        overflow: "hidden", flexShrink: 0,
      }}>
        <img src={pet.photo} alt={pet.name} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", display: "block" }} />
      </div>
    );
  }
  return <span style={{ fontSize: size * 0.6, flexShrink: 0 }}>{pet.emoji}</span>;
}

// ── Storage ───────────────────────────────────────────────────────────────────

const STORAGE_KEY      = "sipeka_booking";
const PETS_STORAGE_KEY = "sipeka_pets";

function loadState() {
  try { const raw = localStorage.getItem(STORAGE_KEY); return raw ? JSON.parse(raw) : null; }
  catch { return null; }
}
function loadPets(): Pet[] {
  try {
    const raw = localStorage.getItem(PETS_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : PETS_DEFAULT;
  } catch { return PETS_DEFAULT; }
}

// ── Step Indicator ────────────────────────────────────────────────────────────

function StepBar({ current }: { current: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "18px 24px 12px", overflowX: "auto" }}>
      {STEPS.map((label, i) => {
        const n = i + 1; const done = n < current; const active = n === current;
        return (
          <div key={n} style={{ display: "flex", alignItems: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <div style={{
                width: 38, height: 38, borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: 700, fontSize: 14,
                background: done ? "#4caf50" : active ? G : "#c8e6c9", color: "#fff",
              }}>
                {done ? <Check size={16} /> : n}
              </div>
              <span style={{ fontSize: 10, whiteSpace: "nowrap", fontWeight: active ? 700 : 400, color: active ? G : done ? "#4caf50" : "#9e9e9e" }}>{label}</span>
            </div>
            {i < STEPS.length - 1 && <div style={{ width: 48, height: 2, marginBottom: 18, background: done ? "#4caf50" : "#c8e6c9" }} />}
          </div>
        );
      })}
    </div>
  );
}

// ── Nav Buttons ───────────────────────────────────────────────────────────────

const TOTAL_STEPS = STEPS.length;

function NavBtns({ step, onBack, onNext, onConfirm, disabled }: {
  step: number; onBack(): void; onNext(): void; onConfirm(): void; disabled: boolean;
}) {
  const base: React.CSSProperties = {
    padding: "10px 22px", borderRadius: 8, fontWeight: 600, fontSize: 14,
    cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
  };
  return (
    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 26 }}>
      <button onClick={onBack} style={{ ...base, border: `1.5px solid ${G}`, background: "#fff", color: G }}>
        <ChevronLeft size={15} /> Kembali
      </button>
      {step < TOTAL_STEPS ? (
        <button onClick={onNext} disabled={disabled} style={{
          ...base, border: "none",
          background: disabled ? "#a5d6a7" : G,
          color: "#fff", cursor: disabled ? "not-allowed" : "pointer",
        }}>
          Selanjutnya <ChevronRight size={15} />
        </button>
      ) : (
        <button onClick={onConfirm} style={{ ...base, border: "none", background: G, color: "#fff" }}>
          Konfirmasi Booking ›
        </button>
      )}
    </div>
  );
}

// ── Step 1: Pilih Hewan ───────────────────────────────────────────────────────

function Step1({ pets, sel, toggle }: { pets: Pet[]; sel: string[]; toggle(id: string): void }) {
  if (pets.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "40px 0", color: "#888" }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>🐾</div>
        <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 6 }}>Belum ada data hewan</div>
        <div style={{ fontSize: 13 }}>Tambahkan hewan di menu <strong>Data Hewan</strong> terlebih dahulu.</div>
      </div>
    );
  }
  return (
    <div>
      <h2 style={{ color: G, fontSize: 17, fontWeight: 700, marginBottom: 4 }}>Pilih Hewan Peliharaan</h2>
      <p style={{ fontSize: 13, color: "#666", marginBottom: 18 }}>Klik hewan untuk memilih/membatalkan.</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
        {pets.map(p => {
          const on = sel.includes(p.id);
          return (
            <div key={p.id} onClick={() => toggle(p.id)} style={{ ...cardStyle(on), width: 168, textAlign: "center", position: "relative" }}>
              {on && (
                <div style={{ position: "absolute", top: 8, right: 8, background: G, borderRadius: "50%", width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Check size={12} color="#fff" strokeWidth={3} />
                </div>
              )}
              <div style={{
                width: 80, height: 80, margin: "6px auto 8px", borderRadius: 12,
                background: p.photo ? "#f5f5f5" : "transparent",
                border: p.photo ? `2px solid ${on ? G : "#e0e0e0"}` : "none",
                display: "flex", alignItems: "center", justifyContent: "center",
                overflow: "hidden", transition: "border-color 0.15s",
              }}>
                {p.photo
                  ? <img src={p.photo} alt={p.name} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", display: "block" }} />
                  : <div style={{ fontSize: 52 }}>{p.emoji}</div>
                }
              </div>
              <div style={{ fontWeight: 700 }}>{p.name}</div>
              <div style={{ fontSize: 12, color: "#666" }}>{p.type} · {p.breed}</div>
              <div style={{ fontSize: 12, color: "#888", marginTop: 3 }}>{p.age} · {p.weight}</div>
            </div>
          );
        })}
      </div>
      {sel.length > 0 && (
        <div style={{ marginTop: 16, padding: "9px 14px", background: "#e8f5e9", borderRadius: 8, fontSize: 13, color: G, fontWeight: 500 }}>
          🐾 {sel.length} hewan dipilih: {sel.map(id => pets.find(p => p.id === id)?.name).join(", ")}
        </div>
      )}
    </div>
  );
}

// ── Step 2: Pilih Layanan ─────────────────────────────────────────────────────

function Step2({ pets, sel, svc, notes, onSvc, onNote }: {
  pets: Pet[]; sel: string[]; svc: Record<string,string>; notes: Record<string,string>;
  onSvc(p: string, s: string): void; onNote(p: string, n: string): void;
}) {
  const [tab, setTab] = useState(sel[0]);
  const pet = pets.find(p => p.id === tab)!;
  return (
    <div>
      <div style={{ padding: "9px 13px", background: "#e3f2fd", borderRadius: 8, fontSize: 13, color: "#1565c0", display: "flex", gap: 8, marginBottom: 14 }}>
        <Info size={15} style={{ flexShrink: 0, marginTop: 1 }} />
        Pilih layanan untuk setiap hewan. Jadwal diatur di langkah berikutnya.
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        {sel.map(id => {
          const p = pets.find(x => x.id === id)!;
          return (
            <button key={id} onClick={() => setTab(id)} style={{
              padding: "5px 14px", borderRadius: 20, border: "none", cursor: "pointer",
              fontWeight: 600, fontSize: 13,
              background: tab === id ? G : "#e8f5e9", color: tab === id ? "#fff" : G,
              display: "flex", alignItems: "center", gap: 6,
            }}>
              {p.photo
                ? <img src={p.photo} alt={p.name} style={{ width: 20, height: 20, borderRadius: 4, objectFit: "contain", background: "#f5f5f5", border: "1px solid #e0e0e0" }} />
                : <span style={{ fontSize: 16 }}>{p.emoji}</span>
              }
              {p.name}
            </button>
          );
        })}
      </div>
      <div style={{ padding: "9px 13px", background: "#f5f5f5", borderRadius: 8, display: "flex", gap: 12, alignItems: "center", marginBottom: 16 }}>
        <PetAvatar pet={pet} size={44} />
        <div>
          <div style={{ fontWeight: 600 }}>{pet.name}</div>
          <div style={{ fontSize: 12, color: "#666" }}>{pet.type} · {pet.breed} · {pet.age} · {pet.weight}</div>
        </div>
      </div>
      <div style={{ fontWeight: 600, color: G, marginBottom: 8, fontSize: 14 }}>Pilih Layanan untuk {pet.name}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
        {SERVICES.map(s => {
          const on = svc[tab] === s.id;
          return (
            <div key={s.id} onClick={() => onSvc(tab, s.id)} style={{ ...cardStyle(on), display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 20 }}>{s.icon}</span>
              <div style={{ flex: 1, fontWeight: 600, fontSize: 14 }}>{s.name}</div>
              {on && <Check size={14} color={G} />}
            </div>
          );
        })}
      </div>
      <div>
        <label style={{ fontWeight: 600, fontSize: 14, display: "block", marginBottom: 5 }}>Catatan untuk {pet.name} (opsional)</label>
        <textarea
          value={notes[tab] || ""}
          onChange={e => onNote(tab, e.target.value)}
          rows={3}
          placeholder="Tulis catatan khusus..."
          style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1.5px solid #e0e0e0", fontSize: 14, fontFamily: "inherit", resize: "vertical" }}
        />
      </div>
    </div>
  );
}

// ── Step 3: Foto Kondisi — 1 foto per section, tanpa keterangan ───────────────

function Step3FotoKondisi({ pets, sel, condPhotos, setCondPhotos }: {
  pets: Pet[];
  sel: string[];
  condPhotos: Record<string, ConditionPhoto[]>;
  setCondPhotos: React.Dispatch<React.SetStateAction<Record<string, ConditionPhoto[]>>>;
}) {
  const [tab, setTab] = useState(sel[0]);
  const beforeRef = useRef<HTMLInputElement>(null);
  const afterRef  = useRef<HTMLInputElement>(null);

  const pet    = pets.find(p => p.id === tab)!;
  const photos = condPhotos[tab] ?? [];

  const handleFile = async (file: File | null, label: "before" | "after") => {
    if (!file || !file.type.startsWith("image/")) return;
    const dataUrl = await fileToBase64(file);
    const newPhoto: ConditionPhoto = {
      id: Date.now() + Math.random() + "",
      dataUrl,
      label,
      caption: "",
    };
    setCondPhotos(prev => ({
      ...prev,
      // Ganti foto lama dengan yang baru — hanya 1 foto per label
      [tab]: [...(prev[tab] ?? []).filter(p => p.label !== label), newPhoto],
    }));
  };

  const removePhoto = (label: "before" | "after") => {
    setCondPhotos(prev => ({
      ...prev,
      [tab]: (prev[tab] ?? []).filter(p => p.label !== label),
    }));
  };

  const beforePhoto = photos.find(p => p.label === "before") ?? null;
  const afterPhoto  = photos.find(p => p.label === "after")  ?? null;

  const PhotoSlot = ({
    photo,
    label,
    inputRef,
    badgeColor,
    badgeText,
    addText,
  }: {
    photo: ConditionPhoto | null;
    label: "before" | "after";
    inputRef: React.RefObject<HTMLInputElement>;
    badgeColor: string;
    badgeText: string;
    addText: string;
  }) => (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
      {/* Hidden input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onClick={e => { (e.target as HTMLInputElement).value = ""; }}
        onChange={e => handleFile(e.target.files?.[0] ?? null, label)}
      />

      {photo ? (
        /* Foto sudah ada */
        <div style={{ position: "relative", width: 120, height: 100, flexShrink: 0 }}>
          <img
            src={photo.dataUrl}
            alt=""
            style={{ width: 120, height: 100, objectFit: "cover", borderRadius: 8, border: "1.5px solid #e0e0e0", display: "block" }}
          />
          {/* Badge */}
          <div style={{
            position: "absolute", top: 5, left: 5,
            background: badgeColor, color: "#fff",
            fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 20,
          }}>
            {badgeText}
          </div>
          {/* Tombol hapus */}
          <button
            onClick={() => removePhoto(label)}
            style={{
              position: "absolute", top: 5, right: 5,
              background: "rgba(0,0,0,0.5)", border: "none",
              borderRadius: "50%", width: 22, height: 22,
              display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
            }}
          >
            <X size={11} color="#fff" />
          </button>
          {/* Tombol ganti */}
          <button
            onClick={() => inputRef.current?.click()}
            style={{
              position: "absolute", bottom: 5, right: 5,
              background: "rgba(0,0,0,0.45)", border: "none",
              borderRadius: 6, padding: "3px 7px",
              color: "#fff", fontSize: 10, fontWeight: 600, cursor: "pointer",
            }}
          >
            Ganti
          </button>
        </div>
      ) : (
        /* Slot kosong — tombol upload */
        <div
          onClick={() => inputRef.current?.click()}
          style={{
            width: 120, height: 100, borderRadius: 8,
            border: "2px dashed #c8e6c9", background: "#f0faf2",
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            cursor: "pointer", color: "#888", gap: 4, flexShrink: 0,
          }}
        >
          <ImagePlus size={22} color="#a5d6a7" />
          <span style={{ fontSize: 11, textAlign: "center", padding: "0 6px" }}>{addText}</span>
        </div>
      )}
    </div>
  );

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ color: G, fontSize: 17, fontWeight: 700, marginBottom: 4 }}>Foto Kondisi Hewan</h2>
        <div style={{ padding: "9px 13px", background: "#fff9c4", borderRadius: 8, fontSize: 13, color: "#795548", display: "flex", gap: 8 }}>
          <Info size={15} style={{ flexShrink: 0, marginTop: 1 }} />
          <span><strong>Opsional.</strong> Upload foto kondisi hewan — foto <strong>sebelum sakit</strong> (kondisi normal/sehat) dan foto <strong>saat sakit</strong> (kondisi terkini). Membantu dokter menilai perkembangan kondisi hewan.</span>
        </div>
      </div>

      {/* Tab hewan */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {sel.map(id => {
          const p     = pets.find(x => x.id === id)!;
          const count = (condPhotos[id] ?? []).length;
          return (
            <button key={id} onClick={() => setTab(id)} style={{
              padding: "6px 14px", borderRadius: 20, border: "none",
              cursor: "pointer", fontWeight: 600, fontSize: 13,
              background: tab === id ? G : "#e8f5e9",
              color: tab === id ? "#fff" : G,
              display: "flex", alignItems: "center", gap: 6,
            }}>
              {p.photo
                ? <img src={p.photo} alt={p.name} style={{ width: 20, height: 20, borderRadius: 4, objectFit: "contain", background: "#f5f5f5", border: "1px solid #e0e0e0" }} />
                : <span style={{ fontSize: 16 }}>{p.emoji}</span>
              }
              {p.name}
              {count > 0 && (
                <span style={{
                  background: tab === id ? "#fff" : G, color: tab === id ? G : "#fff",
                  borderRadius: "50%", width: 18, height: 18,
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  fontSize: 10, fontWeight: 800,
                }}>{count}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Info hewan aktif */}
      <div style={{ padding: "9px 13px", background: "#f5f5f5", borderRadius: 8, display: "flex", gap: 12, alignItems: "center", marginBottom: 20 }}>
        <PetAvatar pet={pet} size={44} />
        <div>
          <div style={{ fontWeight: 600 }}>{pet.name}</div>
          <div style={{ fontSize: 12, color: "#666" }}>{pet.type} · {pet.breed}</div>
        </div>
        {photos.length > 0 && (
          <div style={{ marginLeft: "auto", fontSize: 12, color: G, fontWeight: 600 }}>
            📷 {photos.length} foto terupload
          </div>
        )}
      </div>

      {/* Sebelum Sakit */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#43a047" }} />
          <span style={{ fontWeight: 700, fontSize: 14, color: "#1b5e20" }}>Sebelum Sakit</span>
          <span style={{ fontSize: 12, color: "#888" }}>— foto hewan saat kondisi normal / sehat</span>
        </div>
        <PhotoSlot
          photo={beforePhoto}
          label="before"
          inputRef={beforeRef}
          badgeColor="#43a047"
          badgeText="SEHAT"
          addText="Upload Foto Sebelum Sakit"
        />
      </div>

      {/* Saat Sakit */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ef5350" }} />
          <span style={{ fontWeight: 700, fontSize: 14, color: "#c62828" }}>Saat Sakit</span>
          <span style={{ fontSize: 12, color: "#888" }}>— foto hewan kondisi terkini yang perlu ditangani</span>
        </div>
        <PhotoSlot
          photo={afterPhoto}
          label="after"
          inputRef={afterRef}
          badgeColor="#ef5350"
          badgeText="SAKIT"
          addText="Upload Foto Saat Sakit"
        />
      </div>
    </div>
  );
}

// ── Step 4: Jadwal ────────────────────────────────────────────────────────────

function Step4Jadwal({ pets, date, time, sel, svc, setDate, setTime }: {
  pets: Pet[]; date: string; time: string; sel: string[]; svc: Record<string,string>;
  setDate(d: string): void; setTime(t: string): void;
}) {
  return (
    <div>
      <h2 style={{ color: G, fontSize: 17, fontWeight: 700, marginBottom: 16 }}>Pilih Tanggal &amp; Jam</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>
        <div>
          <label style={{ fontWeight: 600, fontSize: 14, display: "block", marginBottom: 6 }}>Tanggal Kunjungan</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1.5px solid #e0e0e0", fontSize: 14 }} />
        </div>
        <div>
          <label style={{ fontWeight: 600, fontSize: 14, display: "block", marginBottom: 6 }}>Jam Mulai</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {TIMES.map(t => (
              <button key={t} onClick={() => setTime(t)} style={{
                padding: "7px 12px", borderRadius: 8, cursor: "pointer", fontSize: 13,
                border: time === t ? `2px solid ${G}` : "1.5px solid #e0e0e0",
                background: time === t ? "#e8f5e9" : "#fff",
                color: time === t ? G : "#333",
                fontWeight: time === t ? 700 : 400,
              }}>{t}</button>
            ))}
          </div>
        </div>
      </div>
      <h3 style={{ color: G, fontWeight: 700, fontSize: 15, marginBottom: 10 }}>Ringkasan Layanan</h3>
      <div style={{ borderRadius: 10, overflow: "hidden", border: "1.5px solid #e0e0e0" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", background: G, color: "#fff", padding: "11px 16px", fontWeight: 700, fontSize: 13 }}>
          {["Hewan", "Layanan"].map(h => <span key={h}>{h}</span>)}
        </div>
        {sel.map(id => {
          const p = pets.find(x => x.id === id)!;
          const s = SERVICES.find(x => x.id === svc[id]);
          return (
            <div key={id} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", padding: "12px 16px", borderTop: "1px solid #f0f0f0", fontSize: 13, alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <PetAvatar pet={p} size={32} />
                <div>
                  <div style={{ fontWeight: 600 }}>{p.name}</div>
                  <div style={{ color: "#888", fontSize: 12 }}>{p.breed}</div>
                </div>
              </div>
              <div>{s ? <>{s.icon} {s.name}</> : "–"}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Step 5: Persetujuan ───────────────────────────────────────────────────────

function Step5Persetujuan({ pets, sel }: { pets: Pet[]; sel: string[] }) {
  const names = sel.map(id => pets.find(p => p.id === id)?.name).join(", ");
  return (
    <div>
      <div style={{ padding: 14, background: "#fff9c4", borderRadius: 10, display: "flex", gap: 12, marginBottom: 20 }}>
        <Info size={16} color="#f57f17" style={{ flexShrink: 0, marginTop: 1 }} />
        <div>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 2 }}>Persetujuan Umum – Berlaku untuk Semua Hewan</div>
          <div style={{ fontSize: 13, color: "#555" }}>Mencakup semua hewan ({names}).</div>
        </div>
      </div>
      <h3 style={{ color: G, fontWeight: 700, fontSize: 15, marginBottom: 12 }}>Pernyataan Persetujuan Umum</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {CONSENTS.map((c, i) => (
          <div key={i} style={{ padding: "12px 15px", borderRadius: 10, background: "#f1f8f1", border: "1.5px solid #a5d6a7", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 24, height: 24, borderRadius: "50%", background: G, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Check size={13} color="#fff" strokeWidth={3} />
            </div>
            <span style={{ fontSize: 14, color: "#333" }}>{c}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Step 6: Konfirmasi ────────────────────────────────────────────────────────

function Step6Konfirmasi({ pets, date, time, sel, svc, condPhotos }: {
  pets: Pet[]; date: string; time: string; sel: string[];
  svc: Record<string,string>; condPhotos: Record<string, ConditionPhoto[]>;
}) {
  return (
    <div>
      <h2 style={{ color: G, fontSize: 17, fontWeight: 700, marginBottom: 16 }}>Ringkasan Booking</h2>
      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        {[["📅", "Tanggal", fmtDate(date)], ["⏰", "Jam", time ? `${time} WIB` : "–"]].map(([icon, label, val]) => (
          <div key={label} style={{ flex: 1, padding: "12px 15px", borderRadius: 10, border: "1.5px solid #e0e0e0", display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 22 }}>{icon}</span>
            <div>
              <div style={{ fontSize: 12, color: "#888" }}>{label}</div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>{val}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 10 }}>Detail per Hewan ({sel.length} hewan)</div>
      {sel.map(id => {
        const p    = pets.find(x => x.id === id)!;
        const s    = SERVICES.find(x => x.id === svc[id]);
        const cphs = condPhotos[id] ?? [];
        return (
          <div key={id} style={{ borderRadius: 10, border: "1.5px solid #e0e0e0", overflow: "hidden", marginBottom: 10 }}>
            <div style={{ padding: "11px 15px", display: "flex", alignItems: "center", gap: 10 }}>
              <PetAvatar pet={p} size={40} />
              <div>
                <div style={{ fontWeight: 700 }}>{p.name}</div>
                <div style={{ fontSize: 12, color: "#888" }}>{p.type} · {p.breed}</div>
              </div>
            </div>
            <div style={{ background: "#fafafa", padding: "9px 15px", borderTop: "1px solid #f0f0f0" }}>
              <div style={{ fontSize: 12, color: "#888" }}>Layanan</div>
              <div style={{ fontSize: 13, fontWeight: 500 }}>{s ? `${s.icon} ${s.name}` : "–"}</div>
            </div>
            {cphs.length > 0 && (
              <div style={{ padding: "9px 15px", borderTop: "1px solid #f0f0f0" }}>
                <div style={{ fontSize: 12, color: "#888", marginBottom: 6 }}>📷 Foto Kondisi ({cphs.length} foto)</div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {cphs.map(ph => (
                    <div key={ph.id} style={{ position: "relative" }}>
                      <img src={ph.dataUrl} alt="" style={{ width: 56, height: 48, objectFit: "cover", borderRadius: 6 }} />
                      <div style={{
                        position: "absolute", top: 2, left: 2,
                        background: ph.label === "before" ? "#43a047" : "#ef5350",
                        color: "#fff", fontSize: 8, fontWeight: 700,
                        padding: "1px 4px", borderRadius: 10,
                      }}>{ph.label === "before" ? "S" : "K"}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Success Screen ────────────────────────────────────────────────────────────

function Success({ pets, bk, queue, date, time, sel, svc, onReset, onDownload }: {
  pets: Pet[]; bk: string; queue: number; date: string; time: string; sel: string[];
  svc: Record<string,string>; onReset(): void; onDownload(): void;
}) {
  return (
    <div style={{ textAlign: "center", padding: "34px 0" }}>
      <div style={{ width: 66, height: 66, background: G, borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
        <Check size={32} color="#fff" strokeWidth={2.5} />
      </div>
      <h2 style={{ color: G, fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Booking Berhasil!</h2>
      <p style={{ fontSize: 15, marginBottom: 12 }}>No. Booking: <strong style={{ color: G }}>#{bk}</strong></p>
      <div style={{ display: "inline-flex", background: "#e8f5e9", border: `2px solid ${G}`, borderRadius: 12, padding: "10px 32px", marginBottom: 22 }}>
        <div style={{ textAlign: "left" }}>
          <div style={{ fontSize: 11, color: "#666", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>Nomor Antrian</div>
          <div style={{ fontSize: 42, fontWeight: 800, color: G, lineHeight: 1 }}>{String(queue).padStart(3, "0")}</div>
          <div style={{ fontSize: 11, color: "#888" }}>Tunjukkan ke petugas klinik</div>
        </div>
      </div>
      {sel.map(id => {
        const p = pets.find(x => x.id === id)!;
        const s = SERVICES.find(x => x.id === svc[id]);
        return (
          <div key={id} style={{ padding: 14, borderRadius: 12, border: "1.5px solid #e0e0e0", textAlign: "left", display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
            <PetAvatar pet={p} size={44} />
            <div>
              <div style={{ fontWeight: 700 }}>{p.name}</div>
              <div style={{ fontSize: 13, color: "#555" }}>{s?.icon} {s?.name ?? "–"}</div>
              <div style={{ fontSize: 12, color: "#888" }}>📅 {fmtDate(date)} · ⏰ {time} WIB</div>
            </div>
          </div>
        );
      })}
      <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
        <button onClick={onDownload} style={{
          padding: "11px 22px", borderRadius: 10, border: `2px solid ${G}`,
          background: "#fff", color: G, fontWeight: 700, fontSize: 14,
          cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
        }}>
          <Download size={15} /> Download Tiket PDF
        </button>
        <button onClick={onReset} style={{ padding: "11px 22px", borderRadius: 10, border: "none", background: G, color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
          Buat Booking Baru
        </button>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function BookingPage() {
  const [pets,       setPets]       = useState<Pet[]>([]);
  const [step,       setStep]       = useState<number>(1);
  const [done,       setDone]       = useState<boolean>(false);
  const [bk,         setBk]         = useState<string>("");
  const [queue,      setQueue]      = useState<number>(0);
  const [sel,        setSel]        = useState<string[]>([]);
  const [svc,        setSvc]        = useState<Record<string,string>>({});
  const [notes,      setNotes]      = useState<Record<string,string>>({});
  const [condPhotos, setCondPhotos] = useState<Record<string, ConditionPhoto[]>>({});
  const [date,       setDate]       = useState<string>("2026-04-07");
  const [time,       setTime]       = useState<string>("14:00");

  const { downloadPDF } = useBookingPDF();

  useEffect(() => {
    setPets(loadPets());
    const saved = loadState();
    if (!saved) return;
    setStep(saved.step   ?? 1);
    setDone(saved.done   ?? false);
    setBk(saved.bk       ?? "");
    setQueue(saved.queue ?? 0);
    setSel(saved.sel     ?? []);
    setSvc(saved.svc     ?? {});
    setNotes(saved.notes ?? {});
    setDate(saved.date   ?? "2026-04-07");
    setTime(saved.time   ?? "14:00");
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ step, done, bk, queue, sel, svc, notes, date, time }));
  }, [step, done, bk, queue, sel, svc, notes, date, time]);

  const toggle = (id: string) => setSel(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

  const disabled =
    (step === 1 && sel.length === 0) ||
    (step === 2 && sel.some(id => !svc[id])) ||
    (step === 4 && (!date || !time));

  const confirm = () => {
    setBk("BK" + String(Math.floor(Math.random() * 9000) + 1000).padStart(4, "0"));
    setQueue(Math.floor(Math.random() * 30) + 1);
    setDone(true);
  };

  const download = () => {
    const data: BookingPDFData = {
      bookingNumber: bk, date, time, queueNumber: queue,
      pets: sel.map(id => {
        const p = pets.find(x => x.id === id)!;
        const s = SERVICES.find(x => x.id === svc[id])!;
        return { name: p.name, breed: p.breed, type: p.type, serviceName: s?.name ?? "–", servicePrice: "", doctorName: "", doctorRole: "", note: notes[id] ?? "" };
      }),
    };
    downloadPDF(data);
  };

  const reset = () => {
    localStorage.removeItem(STORAGE_KEY);
    setStep(1); setDone(false); setSel([]); setSvc({});
    setNotes({}); setCondPhotos({}); setDate("2026-04-07"); setTime("14:00"); setBk(""); setQueue(0);
  };

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <Sidebar activePage="booking" />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "auto", background: "#f9f9f9" }}>
        <Header title="Booking Layanan" subtitle="Booking Layanan Untuk Hewan Kesayangan Anda" />
        {!done && <StepBar current={step} />}
        <div style={{ padding: "0 28px 28px" }}>
          <div style={{ background: "#fff", borderRadius: 12, padding: "22px 26px", border: "1px solid #f0f0f0" }}>
            {done ? (
              <Success pets={pets} bk={bk} queue={queue} date={date} time={time} sel={sel} svc={svc} onReset={reset} onDownload={download} />
            ) : (
              <>
                {step === 1 && <Step1 pets={pets} sel={sel} toggle={toggle} />}
                {step === 2 && <Step2 pets={pets} sel={sel} svc={svc} notes={notes} onSvc={(p, s) => setSvc(v => ({ ...v, [p]: s }))} onNote={(p, n) => setNotes(v => ({ ...v, [p]: n }))} />}
                {step === 3 && <Step3FotoKondisi pets={pets} sel={sel} condPhotos={condPhotos} setCondPhotos={setCondPhotos} />}
                {step === 4 && <Step4Jadwal pets={pets} date={date} time={time} sel={sel} svc={svc} setDate={setDate} setTime={setTime} />}
                {step === 5 && <Step5Persetujuan pets={pets} sel={sel} />}
                {step === 6 && <Step6Konfirmasi pets={pets} date={date} time={time} sel={sel} svc={svc} condPhotos={condPhotos} />}
                <NavBtns
                  step={step}
                  onBack={() => setStep(s => Math.max(1, s - 1))}
                  onNext={() => setStep(s => Math.min(TOTAL_STEPS, s + 1))}
                  onConfirm={confirm}
                  disabled={disabled}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}