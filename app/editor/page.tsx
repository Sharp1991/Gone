"use client";

import Link from "next/link";

export default function EditorPage() {
  return (
    <main
      style={{
        maxWidth: "700px",
        margin: "60px auto",
        padding: "40px",
        fontFamily:
          "system-ui, -apple-system, 'Segoe UI', sans-serif",
        background: "#ffffff",
        borderRadius: "16px",
        border: "1px solid #e5e7eb",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
      }}
    >
      <h1
        style={{
          margin: 0,
          fontSize: "24px",
          fontWeight: 700,
          color: "#111827",
        }}
      >
        GooNortheast Editor
      </h1>

      <p
        style={{
          margin: "8px 0 0",
          fontSize: "15px",
          color: "#6b7280",
        }}
      >
        Manage homestays and website content.
      </p>

      <hr
        style={{
          margin: "28px 0",
          border: "none",
          borderTop: "1px solid #e5e7eb",
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "14px",
        }}
      >
        <Link href="/editor/add-homestay" style={{ textDecoration: "none" }}>
          <button
            style={{
              width: "100%",
              padding: "14px 16px",
              fontSize: "15px",
              fontWeight: 500,
              color: "#ffffff",
              background: "#2563eb",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
              transition: "background 0.15s ease",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.background = "#1d4ed8")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.background = "#2563eb")
            }
          >
            ➕ Add Homestay
          </button>
        </Link>

        <Link href="/editor/dashboard" style={{ textDecoration: "none" }}>
          <button
            style={{
              width: "100%",
              padding: "14px 16px",
              fontSize: "15px",
              fontWeight: 500,
              color: "#111827",
              background: "#f3f4f6",
              border: "1px solid #e5e7eb",
              borderRadius: "10px",
              cursor: "pointer",
              transition: "background 0.15s ease",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.background = "#e5e7eb")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.background = "#f3f4f6")
            }
          >
            📊 Go to Dashboard
          </button>
        </Link>
      </div>
    </main>
  );
}
