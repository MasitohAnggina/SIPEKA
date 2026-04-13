"use client";

import { Bell } from "lucide-react";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  return (
    <header
      style={{ backgroundColor: "#2E7D32" }}
      className="text-white flex items-center justify-between px-8 py-4"
    >
      <div>
        <h1 className="text-xl font-bold leading-tight">{title}</h1>
        {subtitle && (
          <p className="text-sm mt-0.5" style={{ color: "#c6e6cb" }}>
            {subtitle}
          </p>
        )}
      </div>
      <button
        className="relative p-2 rounded-full transition"
        style={{ backgroundColor: "transparent" }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.backgroundColor = "#3d8f4a")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.backgroundColor = "transparent")
        }
      >
        <Bell className="w-5 h-5 text-white" />
        <span
          className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
          style={{ backgroundColor: "#facc15" }}
        ></span>
      </button>
    </header>
  );
}