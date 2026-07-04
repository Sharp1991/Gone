"use client";

import Link from "next/link";

export default function EditorPage() {
  return (
    <main
      style={{
        maxWidth: "700px",
        margin: "50px auto",
        padding: "20px",
        fontFamily: "sans-serif",
      }}
    >
      <h1>GooNortheast Editor</h1>

      <p>Manage homestays and website content.</p>

      <hr style={{ margin: "20px 0" }} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "15px",
        }}
      >
        <Link href="/editor/add-homestay">
          <button
            style={{
              width: "100%",
              padding: "15px",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            ➕ Add Homestay
          </button>
        </Link>

        <Link href="/editor/dashboard">
          <button
            style={{
              width: "100%",
              padding: "15px",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            📋 Manage Homestays
          </button>
        </Link>

        <button
          style={{
            width: "100%",
            padding: "15px",
            fontSize: "16px",
            cursor: "pointer",
          }}
          onClick={() => alert("Logout will be added later")}
        >
          🚪 Logout
        </button>
      </div>
    </main>
  );
}
