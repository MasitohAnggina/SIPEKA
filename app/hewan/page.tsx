"use client";

import { useState, useEffect, useRef } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { useRouter } from "next/navigation";
import { Camera, X } from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────

interface Pet {
  id: string;
  name: string;
  breed: string;
  age: number;
  weight: number;
  type: string;
  emoji: string;
  photo?: string; // base64 foto hewan (opsional)
}

// ── Constants ─────────────────────────────────────────────────────────────────

const G = "#2e7d32";
const STORAGE_KEY = "sipeka_pets";
const JENIS_OPTIONS = ["Anjing", "Kucing", "Kelinci", "Hamster", "Burung", "Lainnya"];
const EMOJI_MAP: Record<string, string> = {
  Anjing: "🐕", Kucing: "🐈", Kelinci: "🐇", Hamster: "🐹", Burung: "🐦", Lainnya: "🐾",
};

const DEFAULT_PETS: Pet[] = [
  { id: "max",   name: "Max",   breed: "Golden Retriever", age: 2, weight: 25, type: "Anjing", emoji: "🐕" },
  { id: "simba", name: "Simba", breed: "Buldog",           age: 1, weight: 10, type: "Anjing", emoji: "🐶" },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function loadPets(): Pet[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_PETS;
  } catch { return DEFAULT_PETS; }
}

function savePets(pets: Pet[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(pets));
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ── Form Modal ────────────────────────────────────────────────────────────────

interface FormData {
  name: string;
  breed: string;
  age: string;
  weight: string;
  type: string;
  photo: string;
}

const emptyForm: FormData = { name: "", breed: "", age: "", weight: "", type: "", photo: "" };

function PetForm({ initial, onSave, onCancel }: {
  initial?: Pet | null;
  onSave(data: FormData): void;
  onCancel(): void;
}) {
  const [form, setForm] = useState<FormData>(
    initial
      ? {
          name: initial.name,
          breed: initial.breed,
          age: String(initial.age),
          weight: String(initial.weight),
          type: initial.type,
          photo: initial.photo ?? "",
        }
      : emptyForm
  );
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const set = (k: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm(f => ({ ...f, [k]: e.target.value }));

  const handleFile = async (file: File | null | undefined) => {
    if (!file || !file.type.startsWith("image/")) return;
    const b64 = await fileToBase64(file);
    setForm(f => ({ ...f, photo: b64 }));
  };

  const valid = form.name && form.breed && form.age && form.weight && form.type;

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "10px 12px", borderRadius: 8,
    border: "1.5px solid #e0e0e0", fontSize: 14, fontFamily: "inherit",
    outline: "none", boxSizing: "border-box",
  };
  const labelStyle: React.CSSProperties = {
    fontWeight: 600, fontSize: 14, display: "block", marginBottom: 6,
  };

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999,
    }}>
      <div style={{
        background: "#fff", borderRadius: 16, padding: "28px 32px",
        width: 480, maxHeight: "90vh", overflowY: "auto",
        boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
      }}>
        <h2 style={{ fontWeight: 700, fontSize: 18, marginBottom: 20 }}>
          {initial ? "Edit Data Hewan" : "Tambah Hewan Baru"}
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

          {/* ── Upload Foto ── */}
          <div>
            <label style={labelStyle}>
              Foto Hewan{" "}
              <span style={{ fontWeight: 400, color: "#999", fontSize: 12 }}>(opsional)</span>
            </label>

            {/* Drop zone / preview — fixed height, always centered */}
            <div
              onClick={() => fileRef.current?.click()}
              onDragOver={e => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={e => {
                e.preventDefault();
                setDragging(false);
                handleFile(e.dataTransfer.files[0]);
              }}
              style={{
                position: "relative",
                width: "100%",
                height: 160,
                borderRadius: 12,
                border: `2px dashed ${dragging ? G : form.photo ? G : "#d0d0d0"}`,
                background: dragging ? "#f0faf2" : form.photo ? "#000" : "#fafafa",
                cursor: "pointer",
                overflow: "hidden",
                transition: "border-color 0.2s, background 0.2s",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {form.photo ? (
                <>
                  {/* Foto mengisi kotak secara proporsional */}
                  <img
                    src={form.photo}
                    alt="preview"
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                  {/* Overlay gelap tipis */}
                  <div style={{
                    position: "absolute", inset: 0,
                    background: "rgba(0,0,0,0.25)",
                  }} />
                  {/* Teks di tengah */}
                  <div style={{
                    position: "relative", zIndex: 1,
                    display: "flex", flexDirection: "column",
                    alignItems: "center", gap: 6,
                  }}>
                    <Camera size={22} color="#fff" />
                    <span style={{ fontSize: 12, color: "#fff", fontWeight: 600, textShadow: "0 1px 3px rgba(0,0,0,0.6)" }}>
                      Klik untuk ganti foto
                    </span>
                  </div>
                  {/* Tombol hapus pojok kanan atas */}
                  <button
                    onClick={e => { e.stopPropagation(); setForm(f => ({ ...f, photo: "" })); }}
                    style={{
                      position: "absolute", top: 8, right: 8, zIndex: 2,
                      background: "rgba(0,0,0,0.6)", border: "none",
                      borderRadius: "50%", width: 28, height: 28,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      cursor: "pointer",
                    }}
                  >
                    <X size={13} color="#fff" />
                  </button>
                </>
              ) : (
                <div style={{
                  display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center",
                  gap: 8, color: "#aaa", userSelect: "none",
                }}>
                  <Camera size={32} color="#a5d6a7" />
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#666" }}>
                    Klik atau seret foto ke sini
                  </div>
                  <div style={{ fontSize: 11, color: "#bbb" }}>PNG, JPG, JPEG</div>
                </div>
              )}
            </div>

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={e => handleFile(e.target.files?.[0])}
            />
          </div>

          {/* ── Fields ── */}
          <div>
            <label style={labelStyle}>Nama</label>
            <input style={inputStyle} value={form.name} onChange={set("name")} placeholder="Nama hewan" />
          </div>
          <div>
            <label style={labelStyle}>Ras</label>
            <input style={inputStyle} value={form.breed} onChange={set("breed")} placeholder="Ras hewan" />
          </div>
          <div>
            <label style={labelStyle}>Usia (Tahun)</label>
            <input style={inputStyle} type="number" min={0} value={form.age} onChange={set("age")} placeholder="Usia" />
          </div>
          <div>
            <label style={labelStyle}>Berat (Kg)</label>
            <input style={inputStyle} type="number" min={0} value={form.weight} onChange={set("weight")} placeholder="Berat" />
          </div>
          <div>
            <label style={labelStyle}>Jenis Hewan</label>
            <select style={inputStyle} value={form.type} onChange={set("type")}>
              <option value="">-- Pilih Jenis --</option>
              {JENIS_OPTIONS.map(j => <option key={j} value={j}>{j}</option>)}
            </select>
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 24 }}>
          <button onClick={onCancel} style={{
            padding: "10px 26px", borderRadius: 8, border: `1.5px solid ${G}`,
            background: "#fff", color: G, fontWeight: 700, fontSize: 14, cursor: "pointer",
          }}>
            Batal
          </button>
          <button
            onClick={() => valid && onSave(form)}
            disabled={!valid}
            style={{
              padding: "10px 26px", borderRadius: 8, border: "none",
              background: valid ? G : "#a5d6a7", color: "#fff",
              fontWeight: 700, fontSize: 14, cursor: valid ? "pointer" : "not-allowed",
            }}
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Pet Card ──────────────────────────────────────────────────────────────────

function PetCard({ pet, onEdit, onBooking, onDelete }: {
  pet: Pet;
  onEdit(): void;
  onBooking(): void;
  onDelete(): void;
}) {
  const [confirm, setConfirm] = useState(false);

  return (
    <div style={{
      borderRadius: 14, overflow: "hidden",
      border: "1.5px solid #e0e0e0", width: 240,
      background: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
    }}>
      {/* ── Foto / Emoji area ── */}
      <div style={{
        width: "100%",
        height: 160,
        background: pet.photo ? "#f7f7f7" : G,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        position: "relative",
      }}>
        {pet.photo ? (
          <img
            src={pet.photo}
            alt={pet.name}
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              width: "auto",
              height: "auto",
              objectFit: "contain",
              display: "block",
            }}
          />
        ) : (
          <div style={{ fontSize: 60 }}>{pet.emoji}</div>
        )}
      </div>

      {/* ── Nama & jenis — strip hijau terpisah ── */}
      <div style={{
        background: G,
        textAlign: "center",
        padding: "10px 12px",
      }}>
        <div style={{ fontWeight: 700, fontSize: 16, color: "#fff" }}>
          {pet.name}
        </div>
        <div style={{ fontSize: 12, color: "#c8e6c9", marginTop: 2 }}>
          {pet.type} · {pet.breed}
        </div>
      </div>

      {/* Stats */}
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr",
        gap: 1, background: "#f0f0f0", borderTop: "1px solid #e0e0e0",
      }}>
        {[["Usia", `${pet.age} Tahun`], ["Berat", `${pet.weight} Kg`]].map(([label, val]) => (
          <div key={label} style={{ background: "#fafafa", padding: "10px 12px", textAlign: "center" }}>
            <div style={{ fontSize: 11, color: "#888" }}>{label}</div>
            <div style={{ fontWeight: 700, fontSize: 14 }}>{val}</div>
          </div>
        ))}
      </div>

      {/* Buttons */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, padding: "12px" }}>
        <button onClick={onEdit} style={{
          padding: "8px 0", borderRadius: 8,
          border: `1.5px solid ${G}`, background: "#fff",
          color: G, fontWeight: 700, fontSize: 13, cursor: "pointer",
        }}>
          Edit
        </button>
        <button onClick={onBooking} style={{
          padding: "8px 0", borderRadius: 8, border: "none",
          background: G, color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer",
        }}>
          Booking
        </button>
      </div>

      {/* Delete */}
      <div style={{ padding: "0 12px 12px" }}>
        {!confirm
          ? (
            <button onClick={() => setConfirm(true)} style={{
              width: "100%", padding: "7px 0", borderRadius: 8,
              border: "1.5px solid #e53935", background: "#fff",
              color: "#e53935", fontWeight: 600, fontSize: 13, cursor: "pointer",
            }}>
              Hapus
            </button>
          ) : (
            <div style={{ display: "flex", gap: 6 }}>
              <button onClick={() => setConfirm(false)} style={{
                flex: 1, padding: "7px 0", borderRadius: 8,
                border: "1.5px solid #e0e0e0", background: "#fff",
                color: "#555", fontWeight: 600, fontSize: 13, cursor: "pointer",
              }}>Batal</button>
              <button onClick={onDelete} style={{
                flex: 1, padding: "7px 0", borderRadius: 8, border: "none",
                background: "#e53935", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer",
              }}>Hapus!</button>
            </div>
          )
        }
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function HewanPage() {
  const router = useRouter();
  const [pets, setPets]         = useState<Pet[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editPet, setEditPet]   = useState<Pet | null>(null);

  useEffect(() => { setPets(loadPets()); }, []);
  useEffect(() => { if (pets.length > 0) savePets(pets); }, [pets]);

  const openAdd   = () => { setEditPet(null); setShowForm(true); };
  const openEdit  = (pet: Pet) => { setEditPet(pet); setShowForm(true); };
  const closeForm = () => { setShowForm(false); setEditPet(null); };

  const handleSave = (form: FormData) => {
    const emoji = EMOJI_MAP[form.type] ?? "🐾";
    if (editPet) {
      setPets(ps => ps.map(p =>
        p.id === editPet.id
          ? {
              ...p,
              name: form.name, breed: form.breed,
              age: Number(form.age), weight: Number(form.weight),
              type: form.type, emoji,
              photo: form.photo || undefined,
            }
          : p
      ));
    } else {
      const newPet: Pet = {
        id: Date.now().toString(),
        name: form.name, breed: form.breed,
        age: Number(form.age), weight: Number(form.weight),
        type: form.type, emoji,
        photo: form.photo || undefined,
      };
      setPets(ps => [...ps, newPet]);
    }
    closeForm();
  };

  const handleDelete = (id: string) => setPets(ps => ps.filter(p => p.id !== id));

  const handleBooking = (pet: Pet) => {
    localStorage.setItem("sipeka_booking_pet", pet.id);
    router.push("/layanan/booking");
  };

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <Sidebar activePage="hewan" />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "auto", background: "#f9f9f9" }}>
        <Header title="Data Hewan" subtitle="Kelola data hewan peliharaan Anda" />

        <div style={{ padding: "24px 28px" }}>
          <button onClick={openAdd} style={{
            padding: "10px 20px", borderRadius: 8,
            border: `2px solid ${G}`, background: "#fff",
            color: G, fontWeight: 700, fontSize: 14, cursor: "pointer", marginBottom: 24,
          }}>
            + Tambah Hewan
          </button>

          {pets.length === 0 && (
            <div style={{ textAlign: "center", padding: "60px 0", color: "#999" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🐾</div>
              <div style={{ fontSize: 16, fontWeight: 600 }}>Belum ada hewan</div>
              <div style={{ fontSize: 13, marginTop: 4 }}>
                Klik "+ Tambah Hewan" untuk menambahkan hewan peliharaan
              </div>
            </div>
          )}

          <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
            {pets.map(pet => (
              <PetCard
                key={pet.id}
                pet={pet}
                onEdit={() => openEdit(pet)}
                onBooking={() => handleBooking(pet)}
                onDelete={() => handleDelete(pet.id)}
              />
            ))}
          </div>
        </div>
      </div>

      {showForm && (
        <PetForm
          initial={editPet}
          onSave={handleSave}
          onCancel={closeForm}
        />
      )}
    </div>
  );
}