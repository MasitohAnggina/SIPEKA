"use client";

import Link from "next/link";
import { useState } from "react";
import {
  LucideIcon,
  LayoutDashboard,
  Cat,
  CalendarCheck,
  UserCircle,
  LogOut,
  ChevronDown,
} from "lucide-react";

interface ChildItem {
  label: string;
  href: string;
}

interface NavItem {
  label: string;
  href?: string;
  icon: LucideIcon;
  key: string;
  children?: ChildItem[];
}

interface SidebarProps {
  activePage: string;
  userName?: string;
  userRole?: string;
}

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    key: "dashboard",
  },
  {
    label: "Hewan",
    icon: Cat,
    key: "hewan",
    children: [{ label: "Data Hewan", href: "/hewan" }],
  },
  {
    label: "Layanan",
    icon: CalendarCheck,
    key: "layanan",
    children: [
      { label: "Booking Layanan", href: "/layanan/booking" },
      { label: "Riwayat Layanan", href: "/layanan/riwayat" },
    ],
  },
  {
    label: "Profile",
    href: "/profile",
    icon: UserCircle,
    key: "profile",
  },
];

export default function Sidebar({
  activePage,
  userName = "Angel",
  userRole = "Pemilik Hewan",
}: SidebarProps) {
  const [openMenus, setOpenMenus] = useState<string[]>([]);

  const toggleMenu = (key: string) => {
    setOpenMenus((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  };

  // Ambil inisial dari nama untuk avatar
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <aside
      style={{
        width: "220px",
        backgroundColor: "#ffffff",
        borderRight: "1px solid #f0f0f0",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        flexShrink: 0,
        position: "sticky",
        top: 0,
      }}
    >
      {/* Logo */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "20px 24px",
          borderBottom: "1px solid #f0f0f0",
        }}
      >
        <span style={{ fontSize: "24px" }}>🐾</span>
        <span
          style={{
            fontSize: "18px",
            fontWeight: 800,
            color: "#1a1a1a",
            letterSpacing: "0.5px",
          }}
        >
          SIPEKA
        </span>
      </div>

      {/* Nav — flex-grow supaya mendorong user info ke bawah */}
      <nav
        style={{
          padding: "16px 12px",
          display: "flex",
          flexDirection: "column",
          gap: "2px",
          flexGrow: 1,
          overflowY: "auto",
        }}
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.key;
          const isOpen = openMenus.includes(item.key);

          if (item.children) {
            return (
              <div key={item.key}>
                <button
                  onClick={() => toggleMenu(item.key)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: "12px",
                    border: "none",
                    background: "none",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#555",
                    textAlign: "left",
                    backgroundColor: isOpen ? "#f0faf2" : "transparent",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#f0faf2";
                    e.currentTarget.style.color = "#2d7a3a";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = isOpen
                      ? "#f0faf2"
                      : "transparent";
                    e.currentTarget.style.color = "#555";
                  }}
                >
                  <Icon style={{ width: "16px", height: "16px", flexShrink: 0 }} />
                  <span style={{ flex: 1 }}>{item.label}</span>
                  <ChevronDown
                    style={{
                      width: "14px",
                      height: "14px",
                      flexShrink: 0,
                      transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.2s ease",
                    }}
                  />
                </button>

                {isOpen && (
                  <div
                    style={{
                      marginLeft: "24px",
                      marginTop: "2px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "2px",
                    }}
                  >
                    {item.children.map((child) => {
                      const isChildActive =
                        activePage === child.href.split("/").pop();
                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            padding: "6px 12px",
                            borderRadius: "8px",
                            fontSize: "13px",
                            textDecoration: "none",
                            backgroundColor: isChildActive
                              ? "rgba(46, 125, 50, 0.8)"
                              : "transparent",
                            color: isChildActive ? "#ffffff" : "#666",
                            fontWeight: isChildActive ? 700 : 400,
                          }}
                          onMouseEnter={(e) => {
                            if (!isChildActive) {
                              e.currentTarget.style.backgroundColor = "#f0faf2";
                              e.currentTarget.style.color = "#2d7a3a";
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isChildActive) {
                              e.currentTarget.style.backgroundColor = "transparent";
                              e.currentTarget.style.color = "#666";
                            }
                          }}
                        >
                          <span style={{ color: isChildActive ? "#ffffff" : "#aaa" }}>
                            •
                          </span>{" "}
                          {child.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          return (
            <Link
              key={item.key}
              href={item.href!}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 12px",
                borderRadius: "12px",
                fontSize: "14px",
                fontWeight: 600,
                textDecoration: "none",
                backgroundColor: isActive
                  ? "rgba(46, 125, 50, 0.8)"
                  : "transparent",
                color: isActive ? "#ffffff" : "#555",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = "#f0faf2";
                  e.currentTarget.style.color = "#2d7a3a";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "#555";
                }
              }}
            >
              <Icon style={{ width: "16px", height: "16px" }} />
              {item.label}
            </Link>
          );
        })}

        {/* Logout */}
        <button
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            width: "100%",
            padding: "8px 12px",
            borderRadius: "12px",
            border: "none",
            background: "none",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: 600,
            color: "#555",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#fff5f5";
            e.currentTarget.style.color = "#dc2626";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.color = "#555";
          }}
        >
          <LogOut style={{ width: "16px", height: "16px" }} />
          Logout
        </button>
      </nav>

      {/* ── User Info — selalu nempel di kiri bawah ── */}
      <div
        style={{
          padding: "12px 16px",
          borderTop: "1px solid #f0f0f0",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        {/* Avatar lingkaran dengan inisial */}
        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            backgroundColor: "rgba(46, 125, 50, 0.15)",
            border: "2px solid rgba(46, 125, 50, 0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "13px",
            fontWeight: 700,
            color: "#2d7a3a",
            flexShrink: 0,
          }}
        >
          {initials}
        </div>

        {/* Nama & Role */}
        <div style={{ overflow: "hidden" }}>
          <p
            style={{
              margin: 0,
              fontSize: "13px",
              fontWeight: 700,
              color: "#1a1a1a",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {userName}
          </p>
          <p
            style={{
              margin: 0,
              fontSize: "11px",
              fontWeight: 400,
              color: "#888",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {userRole}
          </p>
        </div>
      </div>
    </aside>
  );
}