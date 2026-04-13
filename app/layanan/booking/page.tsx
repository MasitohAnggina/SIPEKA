"use client";

import { useState, useEffect } from "react";
import { Check, ChevronRight, ChevronLeft, Info, Download } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { useBookingPDF, type BookingPDFData } from "./useBookingPDF";

// ── Static Data ───────────────────────────────────────────────────────────────

const PETS = [
  { id: "max",   name: "Max",   type: "Anjing", breed: "Golden Retriever", age: "2 Tahun", weight: "25 Kg", emoji: "🐕" },
  { id: "simba", name: "Simba", type: "Anjing", breed: "Buldog",           age: "1 Tahun", weight: "10 Kg", emoji: "🐶" },
];
const SERVICES = [
  { id: "periksa",  name: "Pemeriksaan Kesehatan", price: "Rp 150.000 – 350.000", icon: "🩺" },
  { id: "grooming", name: "Grooming",               price: "Rp 100.000 – 250.000", icon: "✂️" },
  { id: "hotel",    name: "Hotel Hewan",             price: "Rp 150.000 / malam",  icon: "🏠" },
];
const DOCTORS = [
  { id: "shinta", name: "drh. Shinta Permata", role: "Dokter Hewan", available: true  },
  { id: "rani",   name: "Rani Kusuma",          role: "Paramedis",    available: false },
];
const TIMES   = ["08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00"];
const STEPS   = ["Pilih Hewan","Pilih Layanan","Jadwal & Dokter","Persetujuan Umum","Konfirmasi"];
const CONSENTS = [
  "Saya menyetujui bahwa tindakan medis yang diperlukan dapat dilakukan oleh dokter/paramedis yang bertugas.",
  "Saya memahami bahwa hasil pemeriksaan akan dicatat dalam rekam medis hewan peliharaan saya.",
  "Saya bertanggung jawab atas keakuratan informasi yang saya berikan terkait kondisi hewan peliharaan saya.",
  "Saya menyetujui penggunaan data hewan untuk keperluan layanan di klinik.",
];

// ── Helpers ───────────────────────────────────────────────────────────────────

const G = "#2e7d32";
const cardStyle = (active: boolean) => ({
  borderRadius: 10, padding: "13px 15px", cursor: "pointer", transition: "all .15s",
  border: active ? `2px solid ${G}` : "1.5px solid #e0e0e0",
  background: active ? "#f1f8f1" : "#fff",
});
const fmtDate = (d: string) =>
  d ? new Date(d).toLocaleDateString("id-ID", { year: "numeric", month: "2-digit", day: "2-digit" }).replace(/\//g, "-") : "–";

// ── Storage ───────────────────────────────────────────────────────────────────

const STORAGE_KEY = "sipeka_booking";

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

// ── Step Indicator ────────────────────────────────────────────────────────────

function StepBar({ current }: { current: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "18px 32px 12px" }}>
      {STEPS.map((label, i) => {
        const n = i + 1; const done = n < current; const active = n === current;
        return (
          <div key={n} style={{ display: "flex", alignItems: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 15, background: done ? "#4caf50" : active ? G : "#c8e6c9", color: "#fff" }}>
                {done ? <Check size={17} /> : n}
              </div>
              <span style={{ fontSize: 11, whiteSpace: "nowrap", fontWeight: active ? 700 : 400, color: active ? G : done ? "#4caf50" : "#9e9e9e" }}>{label}</span>
            </div>
            {i < 4 && <div style={{ width: 66, height: 2, marginBottom: 18, background: done ? "#4caf50" : "#c8e6c9" }} />}
          </div>
        );
      })}
    </div>
  );
}

// ── Nav Buttons ───────────────────────────────────────────────────────────────

function NavBtns({ step, onBack, onNext, onConfirm, disabled }: { step: number; onBack(): void; onNext(): void; onConfirm(): void; disabled: boolean }) {
  const base = { padding: "10px 22px", borderRadius: 8, fontWeight: 600, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 } as const;
  return (
    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 26 }}>
      <button onClick={onBack} style={{ ...base, border: `1.5px solid ${G}`, background: "#fff", color: G }}><ChevronLeft size={15} /> Kembali</button>
      {step < 5
        ? <button onClick={onNext} disabled={disabled} style={{ ...base, border: "none", background: disabled ? "#a5d6a7" : G, color: "#fff", cursor: disabled ? "not-allowed" : "pointer" }}>Selanjutnya <ChevronRight size={15} /></button>
        : <button onClick={onConfirm} style={{ ...base, border: "none", background: G, color: "#fff" }}>Konfirmasi Booking ›</button>
      }
    </div>
  );
}

// ── Step 1: Pilih Hewan ───────────────────────────────────────────────────────

function Step1({ sel, toggle }: { sel: string[]; toggle(id: string): void }) {
  return (
    <div>
      <h2 style={{ color: G, fontSize: 17, fontWeight: 700, marginBottom: 4 }}>Pilih Hewan Peliharaan</h2>
      <p style={{ fontSize: 13, color: "#666", marginBottom: 18 }}>Klik hewan untuk memilih/membatalkan. Hewan terpilih ditandai border hijau.</p>
      <div style={{ display: "flex", gap: 16 }}>
        {PETS.map(p => {
          const on = sel.includes(p.id);
          return (
            <div key={p.id} onClick={() => toggle(p.id)} style={{ ...cardStyle(on), width: 168, textAlign: "center", position: "relative" }}>
              {on && <div style={{ position: "absolute", top: 8, right: 8, background: G, borderRadius: "50%", width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center" }}><Check size={12} color="#fff" strokeWidth={3} /></div>}
              <div style={{ fontSize: 42, margin: "6px 0" }}>{p.emoji}</div>
              <div style={{ fontWeight: 700 }}>{p.name}</div>
              <div style={{ fontSize: 12, color: "#666" }}>{p.type} · {p.breed}</div>
              <div style={{ fontSize: 12, color: "#888", marginTop: 3 }}>{p.age} · {p.weight}</div>
            </div>
          );
        })}
      </div>
      {sel.length > 0 && (
        <div style={{ marginTop: 16, padding: "9px 14px", background: "#e8f5e9", borderRadius: 8, fontSize: 13, color: G, fontWeight: 500 }}>
          🐾 {sel.length} hewan dipilih: {sel.map(id => PETS.find(p => p.id === id)?.name).join(", ")}
        </div>
      )}
    </div>
  );
}

// ── Step 2: Pilih Layanan ─────────────────────────────────────────────────────

function Step2({ sel, svc, doc, notes, onSvc, onDoc, onNote }: {
  sel: string[]; svc: Record<string,string>; doc: Record<string,string>; notes: Record<string,string>;
  onSvc(p:string,s:string):void; onDoc(p:string,d:string):void; onNote(p:string,n:string):void;
}) {
  const [tab, setTab] = useState(sel[0]);
  const pet = PETS.find(p => p.id === tab)!;
  return (
    <div>
      <div style={{ padding: "9px 13px", background: "#e3f2fd", borderRadius: 8, fontSize: 13, color: "#1565c0", display: "flex", gap: 8, marginBottom: 14 }}>
        <Info size={15} style={{ flexShrink: 0, marginTop: 1 }} /> Atur layanan & dokter per hewan. Jadwal diatur di langkah berikutnya.
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        {sel.map(id => <button key={id} onClick={() => setTab(id)} style={{ padding: "5px 14px", borderRadius: 20, border: "none", cursor: "pointer", fontWeight: 600, fontSize: 13, background: tab===id ? G : "#e8f5e9", color: tab===id ? "#fff" : G }}>{PETS.find(p=>p.id===id)?.name}</button>)}
      </div>
      <div style={{ padding: "9px 13px", background: "#f5f5f5", borderRadius: 8, display: "flex", gap: 10, alignItems: "center", marginBottom: 16 }}>
        <span style={{ fontSize: 26 }}>{pet.emoji}</span>
        <div><div style={{ fontWeight: 600 }}>{pet.name}</div><div style={{ fontSize: 12, color: "#666" }}>{pet.type} · {pet.breed} · {pet.age} · {pet.weight}</div></div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
        <div>
          <div style={{ fontWeight: 600, color: G, marginBottom: 8, fontSize: 14 }}>Pilih Layanan untuk {pet.name}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {SERVICES.map(s => {
              const on = svc[tab] === s.id;
              return (
                <div key={s.id} onClick={() => onSvc(tab, s.id)} style={{ ...cardStyle(on), display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 17 }}>{s.icon}</span>
                  <div style={{ flex: 1 }}><div style={{ fontWeight: 600, fontSize: 14 }}>{s.name}</div><div style={{ fontSize: 12, color: "#666" }}>{s.price}</div></div>
                  {on && <Check size={14} color={G} />}
                </div>
              );
            })}
          </div>
        </div>
        <div>
          <div style={{ fontWeight: 600, color: G, marginBottom: 8, fontSize: 14 }}>Pilih Dokter / Paramedis untuk {pet.name}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {DOCTORS.map(d => {
              const on = doc[tab] === d.id;
              return (
                <div key={d.id} onClick={() => d.available && onDoc(tab, d.id)} style={{ ...cardStyle(on), display: "flex", alignItems: "center", gap: 10, opacity: d.available ? 1 : 0.7, cursor: d.available ? "pointer" : "not-allowed" }}>
                  <span style={{ fontSize: 20 }}>👩‍⚕️</span>
                  <div style={{ flex: 1 }}><div style={{ fontWeight: 600, fontSize: 14 }}>{d.name}</div><div style={{ fontSize: 12, color: "#666" }}>{d.role}</div></div>
                  <span style={{ padding: "3px 9px", borderRadius: 20, fontSize: 12, fontWeight: 600, background: d.available ? "#e8f5e9" : "#fce4ec", color: d.available ? G : "#c62828" }}>{d.available ? "Tersedia" : "Tidak Tersedia"}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div style={{ marginTop: 14 }}>
        <label style={{ fontWeight: 600, fontSize: 14, display: "block", marginBottom: 5 }}>Catatan untuk {pet.name} (opsional)</label>
        <textarea value={notes[tab]||""} onChange={e=>onNote(tab,e.target.value)} rows={3} placeholder="Tulis catatan khusus..." style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1.5px solid #e0e0e0", fontSize: 14, fontFamily: "inherit", resize: "vertical" }} />
      </div>
    </div>
  );
}

// ── Step 3: Jadwal ────────────────────────────────────────────────────────────

function Step3({ date, time, sel, svc, doc, setDate, setTime }: {
  date:string; time:string; sel:string[]; svc:Record<string,string>; doc:Record<string,string>;
  setDate(d:string):void; setTime(t:string):void;
}) {
  return (
    <div>
      <h2 style={{ color: G, fontSize: 17, fontWeight: 700, marginBottom: 16 }}>Pilih Tanggal &amp; Jam</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>
        <div>
          <label style={{ fontWeight: 600, fontSize: 14, display: "block", marginBottom: 6 }}>Tanggal Kunjungan</label>
          <input type="date" value={date} onChange={e=>setDate(e.target.value)} style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1.5px solid #e0e0e0", fontSize: 14 }} />
        </div>
        <div>
          <label style={{ fontWeight: 600, fontSize: 14, display: "block", marginBottom: 6 }}>Jam Mulai</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {TIMES.map(t => <button key={t} onClick={()=>setTime(t)} style={{ padding: "7px 12px", borderRadius: 8, cursor: "pointer", fontSize: 13, border: time===t?`2px solid ${G}`:"1.5px solid #e0e0e0", background: time===t?"#e8f5e9":"#fff", color: time===t?G:"#333", fontWeight: time===t?700:400 }}>{t}</button>)}
          </div>
        </div>
      </div>
      <h3 style={{ color: G, fontWeight: 700, fontSize: 15, marginBottom: 10 }}>Ringkasan Layanan</h3>
      <div style={{ borderRadius: 10, overflow: "hidden", border: "1.5px solid #e0e0e0" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", background: G, color: "#fff", padding: "11px 16px", fontWeight: 700, fontSize: 13 }}>
          {["Hewan","Layanan","Dokter / Paramedis","Estimasi Biaya"].map(h=><span key={h}>{h}</span>)}
        </div>
        {sel.map(id => {
          const p=PETS.find(x=>x.id===id)!; const s=SERVICES.find(x=>x.id===svc[id]); const d=DOCTORS.find(x=>x.id===doc[id]);
          return (
            <div key={id} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", padding: "12px 16px", borderTop: "1px solid #f0f0f0", fontSize: 13, alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}><span style={{ fontSize: 20 }}>{p.emoji}</span><div><div style={{ fontWeight: 600 }}>{p.name}</div><div style={{ color: "#888", fontSize: 12 }}>{p.breed}</div></div></div>
              <div>{s?<>{s.icon} {s.name}</>:"–"}</div>
              <div>{d?.name??"–"}</div>
              <div style={{ fontWeight: 600, color: G }}>{s?.price??"–"}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Step 4: Persetujuan ───────────────────────────────────────────────────────

function Step4({ sel }: { sel: string[] }) {
  const names = sel.map(id=>PETS.find(p=>p.id===id)?.name).join(", ");
  return (
    <div>
      <div style={{ padding: 14, background: "#fff9c4", borderRadius: 10, display: "flex", gap: 12, marginBottom: 20 }}>
        <Info size={16} color="#f57f17" style={{ flexShrink: 0, marginTop: 1 }} />
        <div><div style={{ fontWeight: 700, fontSize: 14, marginBottom: 2 }}>Persetujuan Umum – Berlaku untuk Semua Hewan</div>
        <div style={{ fontSize: 13, color: "#555" }}>Mencakup semua hewan ({names}). Tindakan mendadak memerlukan persetujuan terpisah.</div></div>
      </div>
      <h3 style={{ color: G, fontWeight: 700, fontSize: 15, marginBottom: 12 }}>Pernyataan Persetujuan Umum</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {CONSENTS.map((c,i) => (
          <div key={i} style={{ padding: "12px 15px", borderRadius: 10, background: "#f1f8f1", border: "1.5px solid #a5d6a7", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 24, height: 24, borderRadius: "50%", background: G, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Check size={13} color="#fff" strokeWidth={3} /></div>
            <span style={{ fontSize: 14, color: "#333" }}>{c}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Step 5: Konfirmasi ────────────────────────────────────────────────────────

function Step5({ date, time, sel, svc, doc }: { date:string; time:string; sel:string[]; svc:Record<string,string>; doc:Record<string,string> }) {
  return (
    <div>
      <h2 style={{ color: G, fontSize: 17, fontWeight: 700, marginBottom: 16 }}>Ringkasan Booking</h2>
      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        {[["📅","Tanggal",fmtDate(date)],["⏰","Jam",time?`${time} WIB`:"–"]].map(([icon,label,val])=>(
          <div key={label} style={{ flex:1, padding:"12px 15px", borderRadius:10, border:"1.5px solid #e0e0e0", display:"flex", alignItems:"center", gap:10 }}>
            <span style={{ fontSize:22 }}>{icon}</span>
            <div><div style={{ fontSize:12, color:"#888" }}>{label}</div><div style={{ fontWeight:700, fontSize:15 }}>{val}</div></div>
          </div>
        ))}
      </div>
      <div style={{ fontWeight:600, fontSize:14, marginBottom:10 }}>Detail per Hewan ({sel.length} hewan)</div>
      {sel.map(id=>{
        const p=PETS.find(x=>x.id===id)!; const s=SERVICES.find(x=>x.id===svc[id]); const d=DOCTORS.find(x=>x.id===doc[id]);
        return (
          <div key={id} style={{ borderRadius:10, border:"1.5px solid #e0e0e0", overflow:"hidden", marginBottom:10 }}>
            <div style={{ padding:"11px 15px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <span style={{ fontSize:24 }}>{p.emoji}</span>
                <div><div style={{ fontWeight:700 }}>{p.name}</div><div style={{ fontSize:12, color:"#888" }}>{p.type} · {p.breed}</div></div>
              </div>
              <span style={{ fontWeight:700, color:G }}>{s?.price??"–"}</span>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", background:"#fafafa", padding:"9px 15px", borderTop:"1px solid #f0f0f0", gap:8 }}>
              <div><div style={{ fontSize:12, color:"#888" }}>Layanan</div><div style={{ fontSize:13, fontWeight:500 }}>{s?`${s.icon} ${s.name}`:"–"}</div></div>
              <div><div style={{ fontSize:12, color:"#888" }}>Dokter</div><div style={{ fontSize:13, fontWeight:500 }}>{d?.name??"–"}</div></div>
            </div>
          </div>
        );
      })}
      <div style={{ padding:"12px 15px", background:"#e8f5e9", borderRadius:10, display:"flex", justifyContent:"space-between", margin:"4px 0 10px" }}>
        <span style={{ fontWeight:700 }}>Total Estimasi Biaya ({sel.length} hewan)</span>
        <span style={{ fontWeight:700, color:G }}>{sel.map(id=>SERVICES.find(s=>s.id===svc[id])?.price).filter(Boolean).join(" + ")}</span>
      </div>
      <div style={{ padding:"10px 14px", background:"#e3f2fd", borderRadius:10, fontSize:13, color:"#1565c0", display:"flex", gap:8 }}>
        ✅ Persetujuan umum tercatat. Tindakan mendadak memerlukan persetujuan terpisah via notifikasi.
      </div>
    </div>
  );
}

// ── Success Screen ────────────────────────────────────────────────────────────

function Success({ bk, queue, date, time, sel, svc, doc, notes, onReset, onDownload }: {
  bk:string; queue:number; date:string; time:string; sel:string[];
  svc:Record<string,string>; doc:Record<string,string>; notes:Record<string,string>;
  onReset():void; onDownload():void;
}) {
  return (
    <div style={{ textAlign:"center", padding:"34px 0" }}>
      <div style={{ width:66, height:66, background:G, borderRadius:16, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 12px" }}><Check size={32} color="#fff" strokeWidth={2.5} /></div>
      <h2 style={{ color:G, fontSize:20, fontWeight:700, marginBottom:4 }}>Booking Berhasil!</h2>
      <p style={{ fontSize:15, marginBottom:12 }}>No. Booking: <strong style={{ color:G }}>#{bk}</strong></p>
      <div style={{ display:"inline-flex", background:"#e8f5e9", border:`2px solid ${G}`, borderRadius:12, padding:"10px 32px", marginBottom:22 }}>
        <div style={{ textAlign:"left" }}>
          <div style={{ fontSize:11, color:"#666", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.5px" }}>Nomor Antrian</div>
          <div style={{ fontSize:42, fontWeight:800, color:G, lineHeight:1 }}>{String(queue).padStart(3,"0")}</div>
          <div style={{ fontSize:11, color:"#888" }}>Tunjukkan ke petugas klinik</div>
        </div>
      </div>
      {sel.map(id=>{
        const p=PETS.find(x=>x.id===id)!; const s=SERVICES.find(x=>x.id===svc[id]); const d=DOCTORS.find(x=>x.id===doc[id]);
        return (
          <div key={id} style={{ padding:14, borderRadius:12, border:"1.5px solid #e0e0e0", textAlign:"left", display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <span style={{ fontSize:24 }}>{p.emoji}</span>
              <div>
                <div style={{ fontWeight:700 }}>{p.name}</div>
                <div style={{ fontSize:13, color:"#555" }}>{s?.icon} {s?.name} · 👩‍⚕️ {d?.name}</div>
                <div style={{ fontSize:12, color:"#888" }}>📅 {fmtDate(date)} · ⏰ {time} WIB</div>
              </div>
            </div>
            <span style={{ fontWeight:700, color:G, fontSize:14 }}>{s?.price}</span>
          </div>
        );
      })}
      <div style={{ padding:"10px 14px", background:"#e3f2fd", borderRadius:10, fontSize:13, color:"#1565c0", textAlign:"left", display:"flex", gap:8, margin:"10px 0 22px" }}>
        <Info size={15} style={{ flexShrink:0, marginTop:1 }} /> Jika dokter menemukan kondisi mendadak, Anda menerima notifikasi di halaman <strong>&nbsp;Persetujuan Medis.</strong>
      </div>
      <div style={{ display:"flex", gap:12, justifyContent:"center" }}>
        <button onClick={onDownload} style={{ padding:"11px 22px", borderRadius:10, border:`2px solid ${G}`, background:"#fff", color:G, fontWeight:700, fontSize:14, cursor:"pointer", display:"flex", alignItems:"center", gap:8 }}>
          <Download size={15} /> Download Tiket PDF
        </button>
        <button onClick={onReset} style={{ padding:"11px 22px", borderRadius:10, border:"none", background:G, color:"#fff", fontWeight:700, fontSize:14, cursor:"pointer" }}>
          Buat Booking Baru
        </button>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function BookingPage() {
  const saved = loadState();

  const [step,  setStep]  = useState<number>(saved?.step   ?? 1);
  const [done,  setDone]  = useState<boolean>(saved?.done  ?? false);
  const [bk,    setBk]    = useState<string>(saved?.bk     ?? "");
  const [queue, setQueue] = useState<number>(saved?.queue  ?? 0);
  const [sel,   setSel]   = useState<string[]>(saved?.sel  ?? []);
  const [svc,   setSvc]   = useState<Record<string,string>>(saved?.svc   ?? {});
  const [doc,   setDoc]   = useState<Record<string,string>>(saved?.doc   ?? {});
  const [notes, setNotes] = useState<Record<string,string>>(saved?.notes ?? {});
  const [date,  setDate]  = useState<string>(saved?.date   ?? "2026-04-07");
  const [time,  setTime]  = useState<string>(saved?.time   ?? "14:00");

  const { downloadPDF } = useBookingPDF();

  // Simpan ke localStorage setiap kali state berubah
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ step, done, bk, queue, sel, svc, doc, notes, date, time }));
  }, [step, done, bk, queue, sel, svc, doc, notes, date, time]);

  const toggle = (id: string) => setSel(p => p.includes(id) ? p.filter(x=>x!==id) : [...p, id]);

  const disabled =
    (step===1 && sel.length===0) ||
    (step===2 && sel.some(id => !svc[id] || !doc[id])) ||
    (step===3 && (!date||!time));

  const confirm = () => {
    setBk("BK" + String(Math.floor(Math.random()*9000)+1000).padStart(4,"0"));
    setQueue(Math.floor(Math.random()*30)+1);
    setDone(true);
  };

  const download = () => {
    const data: BookingPDFData = {
      bookingNumber: bk, date, time, queueNumber: queue,
      pets: sel.map(id => {
        const p=PETS.find(x=>x.id===id)!;
        const s=SERVICES.find(x=>x.id===svc[id])!;
        const d=DOCTORS.find(x=>x.id===doc[id])!;
        return { name:p.name, breed:p.breed, type:p.type, serviceName:s?.name??"–", servicePrice:s?.price??"–", doctorName:d?.name??"–", doctorRole:d?.role??"–", note:notes[id]??"" };
      }),
    };
    downloadPDF(data);
  };

  // Reset = hapus localStorage juga
  const reset = () => {
    localStorage.removeItem(STORAGE_KEY);
    setStep(1); setDone(false); setSel([]); setSvc({}); setDoc({});
    setNotes({}); setDate("2026-04-07"); setTime("14:00"); setBk(""); setQueue(0);
  };

  return (
    <div style={{ display:"flex", height:"100vh", overflow:"hidden" }}>
      <Sidebar activePage="booking" />
      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"auto", background:"#f9f9f9" }}>
        <Header title="Booking Layanan" subtitle="Booking Layanan Untuk Hewan Kesayangan Anda" />
        {!done && <StepBar current={step} />}
        <div style={{ padding:"0 28px 28px" }}>
          <div style={{ background:"#fff", borderRadius:12, padding:"22px 26px", border:"1px solid #f0f0f0" }}>
            {done
              ? <Success bk={bk} queue={queue} date={date} time={time} sel={sel} svc={svc} doc={doc} notes={notes} onReset={reset} onDownload={download} />
              : <>
                  {step===1 && <Step1 sel={sel} toggle={toggle} />}
                  {step===2 && <Step2 sel={sel} svc={svc} doc={doc} notes={notes} onSvc={(p,s)=>setSvc(v=>({...v,[p]:s}))} onDoc={(p,d)=>setDoc(v=>({...v,[p]:d}))} onNote={(p,n)=>setNotes(v=>({...v,[p]:n}))} />}
                  {step===3 && <Step3 date={date} time={time} sel={sel} svc={svc} doc={doc} setDate={setDate} setTime={setTime} />}
                  {step===4 && <Step4 sel={sel} />}
                  {step===5 && <Step5 date={date} time={time} sel={sel} svc={svc} doc={doc} />}
                  <NavBtns step={step} onBack={()=>setStep(s=>Math.max(1,s-1))} onNext={()=>setStep(s=>Math.min(5,s+1))} onConfirm={confirm} disabled={disabled} />
                </>
            }
          </div>
        </div>
      </div>
    </div>
  );
}