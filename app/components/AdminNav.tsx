"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { label: "Homestays", href: "/editor/dashboard" },
  { label: "Destinations", href: "/editor/destinations" },
  { label: "Hero Slides", href: "/editor/hero-slides" },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <div
      style={{
        background: "#ffffff",
        borderBottom: "1px solid #e5e7eb",
        padding: "0 22px",
        display: "flex",
        gap: "4px",
        overflowX: "auto",
        position: "sticky",
        top: "57px",
        zIndex: 9,
      }}
    >
      {tabs.map((tab) => {
        const isActive = pathname?.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            style={{
              textDecoration: "none",
              fontSize: "13px",
              fontWeight: 600,
              color: isActive ? "#2563eb" : "#6b7280",
              padding: "12px 14px",
              borderBottom: isActive ? "2px solid #2563eb" : "2px solid transparent",
              whiteSpace: "nowrap",
            }}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
