"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

// ── Types ─────────────────────────────────────────────────────────────────────

interface Pet {
  id: string;
  name: string;
  breed: string;
  age: number;
  weight: number;
  type: string;
  emoji: string;
  photo?: string;
}

interface BookingState {
  bk: string;
  queue: number;
  date: string;
  time: string;
  sel: string[];
  svc: Record<string, string>;
  done: boolean;
  step: number;
}

interface RiwayatItem {
  tanggal: string;
  bulan: string;
  hewanNama: string;
  layananUtama: string;
  layananDetail: string;
}

// ── Static / Dummy Data ───────────────────────────────────────────────────────

const DUMMY_RIWAYAT: RiwayatItem[] = [
  { tanggal: "20", bulan: "Mar 2026", hewanNama: "Luna",  layananUtama: "Grooming",        layananDetail: "Mandi, potong kuku & telinga" },
  { tanggal: "18", bulan: "Mar 2026", hewanNama: "Luna",  layananUtama: "Perawatan Medis", layananDetail: "ISPA / Flu Kucing" },
  { tanggal: "05", bulan: "Feb 2026", hewanNama: "Max",   layananUtama: "Perawatan Medis", layananDetail: "Diare & muntah" },
];

const SERVICES: Record<string, string> = {
  periksa:  "Pemeriksaan Kesehatan",
  grooming: "Grooming",
  hotel:    "Hotel Hewan",
  vaksin:   "Vaksinasi",
};

const G = "#2e7d32";

// ── Helpers ───────────────────────────────────────────────────────────────────

const PETS_KEY    = "sipeka_pets";
const BOOKING_KEY = "sipeka_booking";

const DEFAULT_PETS: Pet[] = [
  { id: "max",   name: "Max",   breed: "Golden Retriever", age: 2, weight: 25, type: "Anjing", emoji: "🐕" },
  { id: "simba", name: "Simba", breed: "Buldog",           age: 1, weight: 10, type: "Anjing", emoji: "🐶" },
];

function loadPets(): Pet[] {
  try {
    const raw = localStorage.getItem(PETS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_PETS;
  } catch { return DEFAULT_PETS; }
}

function loadBooking(): BookingState | null {
  try {
    const raw = localStorage.getItem(BOOKING_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function fmtDate(d: string) {
  if (!d) return "–";
  return new Date(d).toLocaleDateString("id-ID", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

function todayStr() {
  return new Date().toLocaleDateString("id-ID", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
}

// ── Sub-components ────────────────────────────────────────────────────────────

function Badge({ children, variant = "green" }: { children: React.ReactNode; variant?: "green" | "blue" | "amber" | "red" }) {
  const map: Record<string, React.CSSProperties> = {
    green: { background: "#e8f5e9", color: "#2e7d32" },
    blue:  { background: "#e3f2fd", color: "#1565c0" },
    amber: { background: "#fff8e1", color: "#a16207" },
    red:   { background: "#fce4ec", color: "#c62828" },
  };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      padding: "2px 9px", borderRadius: 20,
      fontSize: 11, fontWeight: 600,
      ...map[variant],
    }}>
      {children}
    </span>
  );
}

function StatCard({ label, value, sub, subColor }: {
  label: string; value: string; sub?: string; subColor?: string;
}) {
  return (
    <div style={{
      background: "#ffffff", borderRadius: 10, padding: "12px 14px", // ← diubah dari #f9f9f9
      border: "1px solid #f0f0f0",
    }}>
      <div style={{ fontSize: 11, color: "#888", marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 700, color: "#1a1a1a", lineHeight: 1.1 }}
        dangerouslySetInnerHTML={{ __html: value }} />
      {sub && (
        <div style={{ fontSize: 11, color: subColor ?? "#888", marginTop: 2 }}>{sub}</div>
      )}
    </div>
  );
}

// ── Pet Card ──────────────────────────────────────────────────────────────────

function PetCard({ pet, onDetail, onBooking }: {
  pet: Pet; onDetail(): void; onBooking(): void;
}) {
  return (
    <div style={{ borderRadius: 12, overflow: "hidden", border: "1.5px solid #e0e0e0", background: "#fff" }}>
      {/* Header hijau */}
      <div style={{ background: G, padding: "14px", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 52, height: 52, borderRadius: 10,
          background: "rgba(255,255,255,0.15)",
          display: "flex", alignItems: "center", justifyContent: "center",
          overflow: "hidden", flexShrink: 0,
        }}>
          {pet.photo
            ? <img src={pet.photo} alt={pet.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            : <span style={{ fontSize: 28 }}>{pet.emoji}</span>
          }
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>{pet.name}</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.75)" }}>{pet.type} · {pet.breed}</div>
          <span style={{
            display: "inline-block", marginTop: 4, fontSize: 10, fontWeight: 600,
            background: "rgba(255,255,255,0.2)", color: "#fff",
            padding: "1px 8px", borderRadius: 10,
          }}>Sehat</span>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "12px 14px" }}>
        {[
          ["Usia",    `${pet.age} Tahun`],
          ["Berat",   `${pet.weight} Kg`],
          ["Jenis",   pet.type],
        ].map(([label, val], i, arr) => (
          <div key={label} style={{
            display: "flex", justifyContent: "space-between", fontSize: 12,
            padding: "5px 0",
            borderBottom: i < arr.length - 1 ? "1px solid #f0f0f0" : "none",
          }}>
            <span style={{ color: "#888" }}>{label}</span>
            <span style={{ fontWeight: 600, color: "#1a1a1a" }}>{val}</span>
          </div>
        ))}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 10 }}>
          <button onClick={onDetail} style={{
            padding: "7px 0", borderRadius: 8,
            border: `1.5px solid ${G}`, background: "#fff",
            color: G, fontWeight: 700, fontSize: 12, cursor: "pointer",
          }}>
            Detail
          </button>
          <button onClick={onBooking} style={{
            padding: "7px 0", borderRadius: 8, border: "none",
            background: G, color: "#fff", fontWeight: 700, fontSize: 12, cursor: "pointer",
          }}>
            Booking
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const router = useRouter();
  const [pets,    setPets]    = useState<Pet[]>([]);
  const [booking, setBooking] = useState<BookingState | null>(null);

  useEffect(() => {
    setPets(loadPets());
    setBooking(loadBooking());
  }, []);

  const activeBooking = booking?.done ? booking : null;
  const totalKunjungan = DUMMY_RIWAYAT.length;

  const handleBooking = (petId?: string) => {
    if (petId) localStorage.setItem("sipeka_booking_pet", petId);
    router.push("/layanan/booking");
  };

  const handleDetail = (petId: string) => {
    router.push(`/hewan?id=${petId}`);
  };

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <Sidebar activePage="dashboard" />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "auto", background: "#f9f9f9" }}>
        <Header title="Dashboard" subtitle="Selamat datang di SIPEKA" />

        <div style={{ padding: "20px 28px 32px" }}>

          {/* ── Greeting ── */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            marginBottom: 20, flexWrap: "wrap", gap: 10,
          }}>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#1a1a1a" }}>
                Halo! Angel 👋
              </div>
              <div style={{ fontSize: 13, color: "#888", marginTop: 2 }}>{todayStr()}</div>
            </div>
            <button onClick={() => handleBooking()} style={{
              padding: "10px 20px", borderRadius: 8, border: "none",
              background: G, color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer",
            }}>
              + Booking Baru
            </button>
          </div>

          {/* ── Quick Stats ── */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 24 }}>
            <StatCard
              label="Hewan Saya"
              value={`${pets.length} <span style="font-size:13px;font-weight:400;color:#888;">ekor</span>`}
              sub={pets.map(p => p.name).join(" & ")}
            />
            <StatCard
              label="Booking Aktif"
              value={activeBooking
                ? `1 <span style="font-size:13px;font-weight:400;color:#888;">jadwal</span>`
                : `0 <span style="font-size:13px;font-weight:400;color:#888;">jadwal</span>`}
              sub={activeBooking ? `${fmtDate(activeBooking.date)} · ${activeBooking.time}` : "Belum ada booking"}
              subColor={activeBooking ? "#1565c0" : "#aaa"}
            />
            <StatCard
              label="Total Kunjungan"
              value={`${totalKunjungan} <span style="font-size:13px;font-weight:400;color:#888;">kali</span>`}
              sub="Sejak Jan 2026"
            />
          </div>

          {/* ── Hewan Saya ── */}
          <div style={{ marginBottom: 24 }}>
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12,
            }}>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: G }}>Hewan Saya</h2>
              <button onClick={() => router.push("/hewan")} style={{
                fontSize: 12, padding: "5px 14px", borderRadius: 8,
                border: `1.5px solid ${G}`, background: "#fff", color: G,
                fontWeight: 600, cursor: "pointer",
              }}>
                Kelola Hewan
              </button>
            </div>

            {pets.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 0", color: "#aaa" }}>
                <div style={{ fontSize: 40, marginBottom: 10 }}>🐾</div>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Belum ada hewan</div>
                <div style={{ fontSize: 13 }}>Tambahkan hewan di menu Data Hewan</div>
              </div>
            ) : (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
                {pets.map(pet => (
                  <div key={pet.id} style={{ width: 220 }}>
                    <PetCard
                      pet={pet}
                      onDetail={() => handleDetail(pet.id)}
                      onBooking={() => handleBooking(pet.id)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Booking & Riwayat ── */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

            {/* Booking Mendatang */}
            <div style={{ background: "#fff", borderRadius: 12, padding: "16px 18px", border: "1px solid #f0f0f0" }}>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: G, marginBottom: 12 }}>Booking Mendatang</h2>

              {activeBooking ? (
                <div style={{
                  padding: "12px 14px", borderRadius: 10,
                  border: "1.5px solid #c8e6c9", background: "#f1f8f1", marginBottom: 10,
                }}>
                  <div style={{
                    fontSize: 11, fontWeight: 600, color: G,
                    background: "#e8f5e9", display: "inline-block",
                    padding: "2px 9px", borderRadius: 10, marginBottom: 8,
                  }}>
                    {fmtDate(activeBooking.date)} · {activeBooking.time} WIB
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#1a1a1a", marginBottom: 2 }}>
                    {activeBooking.sel.map(id => pets.find(p => p.id === id)?.name).join(", ")}
                  </div>
                  <div style={{ fontSize: 12, color: "#666", marginBottom: 6 }}>
                    {activeBooking.sel.map(id => SERVICES[activeBooking.svc[id]] ?? "–").join(", ")}
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <Badge variant="blue">Terkonfirmasi</Badge>
                    <span style={{ fontSize: 11, color: "#888" }}>
                      No. #{activeBooking.bk} · Antrian {String(activeBooking.queue).padStart(3, "0")}
                    </span>
                  </div>
                </div>
              ) : (
                <div style={{
                  padding: "20px", textAlign: "center", color: "#aaa",
                  background: "#fafafa", borderRadius: 10, marginBottom: 10,
                }}>
                  <div style={{ fontSize: 28, marginBottom: 6 }}>📅</div>
                  <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 3 }}>Belum ada booking</div>
                  <div style={{ fontSize: 12 }}>Buat booking untuk hewan kesayanganmu</div>
                </div>
              )}

              <button onClick={() => handleBooking()} style={{
                width: "100%", padding: "9px 0", borderRadius: 8, border: "none",
                background: G, color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer",
              }}>
                + Buat Booking Baru
              </button>
            </div>

            {/* Riwayat Terakhir */}
            <div style={{ background: "#fff", borderRadius: 12, padding: "16px 18px", border: "1px solid #f0f0f0" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <h2 style={{ fontSize: 15, fontWeight: 700, color: G }}>Riwayat Terakhir</h2>
                <button onClick={() => router.push("/layanan/riwayat")} style={{
                  fontSize: 12, padding: "4px 12px", borderRadius: 8,
                  border: `1.5px solid ${G}`, background: "#fff", color: G,
                  fontWeight: 600, cursor: "pointer",
                }}>
                  Lihat Semua
                </button>
              </div>

              {DUMMY_RIWAYAT.length === 0 ? (
                <div style={{ textAlign: "center", padding: "30px 0", color: "#aaa", fontSize: 13 }}>
                  Belum ada riwayat layanan
                </div>
              ) : (
                <div>
                  {DUMMY_RIWAYAT.map((item, i) => (
                    <div key={i} style={{
                      display: "flex", alignItems: "flex-start", gap: 10,
                      padding: "9px 0",
                      borderBottom: i < DUMMY_RIWAYAT.length - 1 ? "1px solid #f0f0f0" : "none",
                    }}>
                      {/* Tanggal */}
                      <div style={{
                        minWidth: 36, textAlign: "center",
                        background: "#f5f5f5", borderRadius: 8, padding: "4px 6px", flexShrink: 0,
                      }}>
                        <div style={{ fontSize: 15, fontWeight: 700, color: "#1a1a1a" }}>{item.tanggal}</div>
                        <div style={{ fontSize: 10, color: "#888" }}>{item.bulan.slice(0, 3)}</div>
                      </div>
                      {/* Info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>
                          {item.layananUtama} — {item.hewanNama}
                        </div>
                        <div style={{ fontSize: 11, color: "#888", marginTop: 1 }}>{item.layananDetail}</div>
                        <Badge variant="green">Selesai</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}