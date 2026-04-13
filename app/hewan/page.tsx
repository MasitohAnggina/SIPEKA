"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { useRouter } from "next/navigation";

// ── Types ─────────────────────────────────────────────────────────────────────

interface Pet {
  id: string;
  name: string;
  breed: string;
  age: number;
  weight: number;
  type: string;
  emoji: string;
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

// ── Form Modal ────────────────────────────────────────────────────────────────

interface FormData {
  name: string;
  breed: string;
  age: string;
  weight: string;
  type: string;
}

const emptyForm: FormData = { name: "", breed: "", age: "", weight: "", type: "" };

function PetForm({ initial, onSave, onCancel }: {
  initial?: Pet | null;
  onSave(data: FormData): void;
  onCancel(): void;
}) {
  const [form, setForm] = useState<FormData>(
    initial
      ? { name: initial.name, breed: initial.breed, age: String(initial.age), weight: String(initial.weight), type: initial.type }
      : emptyForm
  );

  const set = (k: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const valid = form.name && form.breed && form.age && form.weight && form.type;

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "10px 12px", borderRadius: 8,
    border: "1.5px solid #e0e0e0", fontSize: 14, fontFamily: "inherit",
    outline: "none", boxSizing: "border-box",
  };
  const labelStyle: React.CSSProperties = { fontWeight: 600, fontSize: 14, display: "block", marginBottom: 6 };

  return (
    // Overlay
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999 }}>
      <div style={{ background: "#fff", borderRadius: 16, padding: "28px 32px", width: 460, boxShadow: "0 8px 32px rgba(0,0,0,0.18)" }}>
        <h2 style={{ fontWeight: 700, fontSize: 18, marginBottom: 20 }}>
          {initial ? "Edit Data Hewan" : "Tambah Hewan Baru"}
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
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
          <button onClick={onCancel} style={{ padding: "10px 26px", borderRadius: 8, border: `1.5px solid ${G}`, background: "#fff", color: G, fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
            Batal
          </button>
          <button onClick={() => valid && onSave(form)} disabled={!valid} style={{ padding: "10px 26px", borderRadius: 8, border: "none", background: valid ? G : "#a5d6a7", color: "#fff", fontWeight: 700, fontSize: 14, cursor: valid ? "pointer" : "not-allowed" }}>
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
    <div style={{ borderRadius: 14, overflow: "hidden", border: "1.5px solid #e0e0e0", width: 240, background: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
      {/* Card Header */}
      <div style={{ background: G, padding: "20px 16px", textAlign: "center" }}>
        <div style={{ fontSize: 52, marginBottom: 6 }}>{pet.emoji}</div>
        <div style={{ fontWeight: 700, fontSize: 17, color: "#fff" }}>{pet.name}</div>
        <div style={{ fontSize: 13, color: "#c8e6c9" }}>{pet.type} · {pet.breed}</div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, background: "#f0f0f0", borderTop: "1px solid #e0e0e0" }}>
        {[["Usia", `${pet.age} Tahun`], ["Berat", `${pet.weight} Kg`]].map(([label, val]) => (
          <div key={label} style={{ background: "#fafafa", padding: "10px 12px", textAlign: "center" }}>
            <div style={{ fontSize: 11, color: "#888" }}>{label}</div>
            <div style={{ fontWeight: 700, fontSize: 14 }}>{val}</div>
          </div>
        ))}
      </div>

      {/* Buttons */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, padding: "12px" }}>
        <button onClick={onEdit} style={{ padding: "8px 0", borderRadius: 8, border: `1.5px solid ${G}`, background: "#fff", color: G, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
          Edit
        </button>
        <button onClick={onBooking} style={{ padding: "8px 0", borderRadius: 8, border: "none", background: G, color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
          Booking
        </button>
      </div>

      {/* Delete */}
      <div style={{ padding: "0 12px 12px" }}>
        {!confirm
          ? <button onClick={() => setConfirm(true)} style={{ width: "100%", padding: "7px 0", borderRadius: 8, border: "1.5px solid #e53935", background: "#fff", color: "#e53935", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
              Hapus
            </button>
          : <div style={{ display: "flex", gap: 6 }}>
              <button onClick={() => setConfirm(false)} style={{ flex: 1, padding: "7px 0", borderRadius: 8, border: "1.5px solid #e0e0e0", background: "#fff", color: "#555", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>Batal</button>
              <button onClick={onDelete} style={{ flex: 1, padding: "7px 0", borderRadius: 8, border: "none", background: "#e53935", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Hapus!</button>
            </div>
        }
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function HewanPage() {
  const router = useRouter();
  const [pets, setPets]       = useState<Pet[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editPet, setEditPet]   = useState<Pet | null>(null);

  useEffect(() => {
    setPets(loadPets());
  }, []);

  useEffect(() => {
    if (pets.length > 0) savePets(pets);
  }, [pets]);

  const openAdd  = () => { setEditPet(null); setShowForm(true); };
  const openEdit = (pet: Pet) => { setEditPet(pet); setShowForm(true); };
  const closeForm = () => { setShowForm(false); setEditPet(null); };

  const handleSave = (form: FormData) => {
    const emoji = EMOJI_MAP[form.type] ?? "🐾";
    if (editPet) {
      // Update existing
      setPets(ps => ps.map(p => p.id === editPet.id
        ? { ...p, name: form.name, breed: form.breed, age: Number(form.age), weight: Number(form.weight), type: form.type, emoji }
        : p
      ));
    } else {
      // Add new
      const newPet: Pet = {
        id: Date.now().toString(),
        name: form.name, breed: form.breed,
        age: Number(form.age), weight: Number(form.weight),
        type: form.type, emoji,
      };
      setPets(ps => [...ps, newPet]);
    }
    closeForm();
  };

  const handleDelete = (id: string) => {
    setPets(ps => ps.filter(p => p.id !== id));
  };

  const handleBooking = (pet: Pet) => {
    // Simpan hewan yang dipilih ke localStorage agar booking page bisa membacanya
    localStorage.setItem("sipeka_booking_pet", pet.id);
    router.push("/layanan/booking");
  };

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <Sidebar activePage="hewan" />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "auto", background: "#f9f9f9" }}>
        <Header title="Data Hewan" subtitle="Kelola data hewan peliharaan Anda" />

        <div style={{ padding: "24px 28px" }}>
          {/* Tambah Button */}
          <button onClick={openAdd} style={{ padding: "10px 20px", borderRadius: 8, border: `2px solid ${G}`, background: "#fff", color: G, fontWeight: 700, fontSize: 14, cursor: "pointer", marginBottom: 24 }}>
            + Tambah Hewan
          </button>

          {/* Empty state */}
          {pets.length === 0 && (
            <div style={{ textAlign: "center", padding: "60px 0", color: "#999" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🐾</div>
              <div style={{ fontSize: 16, fontWeight: 600 }}>Belum ada hewan</div>
              <div style={{ fontSize: 13, marginTop: 4 }}>Klik "+ Tambah Hewan" untuk menambahkan hewan peliharaan</div>
            </div>
          )}

          {/* Pet Cards */}
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

      {/* Form Modal */}
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