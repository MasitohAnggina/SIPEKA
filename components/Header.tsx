"use client";
<<<<<<< HEAD
import { Bell, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";

const G = "#2e7d32";

const NOTIF_DATA = [
  {
    id: 1,
    type: "rincian",
    icon: "🏥",
    title: "Rincian Layanan Baru",
    desc: "Max — Gastroenteritis (Diare & Muntah)",
    sub: "drh. Shinta Permata · Rp 410.000",
    tanggal: "05 Feb 2026",
    unread: true,
  },
  {
    id: 2,
    type: "rincian",
    icon: "🏥",
    title: "Rincian Layanan Baru",
    desc: "Luna — ISPA (Flu Kucing)",
    sub: "drh. Budi Santoso · Rp 330.000",
    tanggal: "18 Mar 2026",
    unread: true,
  },
  {
    id: 3,
    type: "layanan",
    icon: "✂️",
    title: "Grooming Selesai",
    desc: "Luna — Mandi, Potong Kuku & Bersihkan Telinga",
    sub: "Selesai",
    tanggal: "20 Mar 2026",
    unread: false,
  },
];
=======

import { Bell } from "lucide-react";
>>>>>>> b8a024d46fb2353846bcc88041422a5031e99580

interface HeaderProps {
  title: string;
  subtitle?: string;
<<<<<<< HEAD
}

export default function Header({ title, subtitle }: HeaderProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [notifs, setNotifs] = useState(NOTIF_DATA);
  const ref = useRef<HTMLDivElement>(null);

  const unreadCount = notifs.filter(n => n.unread).length;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNotifClick = (id: number, type: string) => {
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
    setOpen(false);
    if (type === "rincian") {
      router.push("/layanan/riwayat?tab=rincian");
    } else {
      router.push("/layanan/riwayat?tab=layanan");
    }
  };

  const handleMarkAllRead = () => {
    setNotifs(prev => prev.map(n => ({ ...n, unread: false })));
  };

  return (
    <header
      style={{ backgroundColor: G, position: "relative", zIndex: 50 }}
      className="text-white flex items-center justify-between px-8 py-4"
    >
      <div>
        <h1 className="text-xl font-bold leading-tight">{title}</h1>
        {subtitle && (
          <p className="text-sm mt-0.5" style={{ color: "#c6e6cb" }}>
=======
  notifCount?: number;
}

export default function Header({ title, subtitle, notifCount = 0 }: HeaderProps) {
  return (
    <header
      style={{
        backgroundColor: "#2e7d32",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "20px 28px",
        flexShrink: 0,
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div>
        <h1 style={{ fontSize: "18px", fontWeight: 700, color: "#fff", margin: 0, lineHeight: 1.3 }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{ fontSize: "13px", color: "#c6e6cb", margin: "3px 0 0" }}>
>>>>>>> b8a024d46fb2353846bcc88041422a5031e99580
            {subtitle}
          </p>
        )}
      </div>

<<<<<<< HEAD
      {/* Bell + Dropdown */}
      <div ref={ref} style={{ position: "relative" }}>
        <button
          onClick={() => setOpen(o => !o)}
          className="relative p-2 rounded-full transition"
          style={{ backgroundColor: open ? "#3d8f4a" : "transparent" }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#3d8f4a")}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = open ? "#3d8f4a" : "transparent")}
        >
          <Bell className="w-5 h-5 text-white" />
          {unreadCount > 0 && (
            <span style={{
              position: "absolute", top: 4, right: 4,
              minWidth: 16, height: 16, borderRadius: 99,
              background: "#facc15", color: "#1a1a1a",
              fontSize: 10, fontWeight: 800,
              display: "flex", alignItems: "center", justifyContent: "center",
              padding: "0 3px",
            }}>
              {unreadCount}
            </span>
          )}
        </button>

        {/* Dropdown */}
        {open && (
          <div style={{
            position: "absolute", top: "calc(100% + 10px)", right: 0,
            width: 320, background: "#fff", borderRadius: 14,
            boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
            overflow: "hidden", zIndex: 100,
          }}>
            {/* Header dropdown */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "12px 16px", borderBottom: "1px solid #f0f0f0",
            }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: "#1a1a1a" }}>
                🔔 Notifikasi
                {unreadCount > 0 && (
                  <span style={{
                    marginLeft: 6, fontSize: 11, fontWeight: 700,
                    background: "#e8f5e9", color: G,
                    padding: "1px 7px", borderRadius: 10,
                  }}>
                    {unreadCount} baru
                  </span>
                )}
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {unreadCount > 0 && (
                  <button onClick={handleMarkAllRead} style={{
                    fontSize: 11, color: G, fontWeight: 600,
                    background: "none", border: "none", cursor: "pointer",
                  }}>
                    Tandai semua dibaca
                  </button>
                )}
                <button onClick={() => setOpen(false)} style={{
                  background: "none", border: "none", cursor: "pointer", color: "#888",
                }}>
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* List notif */}
            <div style={{ maxHeight: 320, overflowY: "auto" }}>
              {notifs.length === 0 ? (
                <div style={{ padding: "30px 0", textAlign: "center", color: "#aaa", fontSize: 13 }}>
                  Tidak ada notifikasi
                </div>
              ) : (
                notifs.map(n => (
                  <div key={n.id} onClick={() => handleNotifClick(n.id, n.type)}
                    style={{
                      display: "flex", alignItems: "flex-start", gap: 10,
                      padding: "12px 16px", cursor: "pointer",
                      background: n.unread ? "#f6fef7" : "#fff",
                      borderBottom: "1px solid #f5f5f5",
                      transition: "background .15s",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = "#f0faf2")}
                    onMouseLeave={e => (e.currentTarget.style.background = n.unread ? "#f6fef7" : "#fff")}
                  >
                    <div style={{
                      width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                      background: "#e8f5e9", display: "flex", alignItems: "center",
                      justifyContent: "center", fontSize: 18,
                    }}>
                      {n.icon}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: "#1a1a1a" }}>{n.title}</span>
                        {n.unread && (
                          <span style={{
                            width: 7, height: 7, borderRadius: "50%",
                            background: G, flexShrink: 0,
                          }} />
                        )}
                      </div>
                      <p style={{ margin: "2px 0 1px", fontSize: 12, color: "#333", fontWeight: 500 }}>{n.desc}</p>
                      <p style={{ margin: 0, fontSize: 11, color: "#888" }}>{n.sub}</p>
                      <p style={{ margin: "3px 0 0", fontSize: 10, color: "#bbb" }}>{n.tanggal}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div style={{ padding: "10px 16px", borderTop: "1px solid #f0f0f0", textAlign: "center" }}>
              <button onClick={() => { setOpen(false); router.push("/layanan/riwayat"); }}
                style={{
                  fontSize: 13, fontWeight: 700, color: G,
                  background: "none", border: "none", cursor: "pointer",
                }}>
                Lihat Semua Riwayat →
              </button>
            </div>
          </div>
        )}
      </div>
=======
      <button
        style={{
          position: "relative",
          width: "36px",
          height: "36px",
          borderRadius: "50%",
          border: "none",
          backgroundColor: "rgba(255,255,255,0.15)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "background .15s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.25)")}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.15)")}
      >
        <Bell style={{ width: "17px", height: "17px", color: "#fff" }} />
        {notifCount > 0 && (
          <span
            style={{
              position: "absolute",
              top: "7px",
              right: "7px",
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              backgroundColor: "#facc15",
              border: "1.5px solid #2e7d32",
              display: "block",
            }}
          />
        )}
      </button>
>>>>>>> b8a024d46fb2353846bcc88041422a5031e99580
    </header>
  );
}