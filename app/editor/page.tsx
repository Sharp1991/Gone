"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import AdminNav from "@/components/AdminNav";

type Property = {
  id: string;
  title: string;
  destination: string;
  location: string;
  host_name: string;
  contact: string;
};

export default function Dashboard() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchProperties();
  }, []);

  async function fetchProperties() {
    setLoading(true);

    const { data, error } = await supabase
      .from("properties")
      .select("id, title, destination, location, host_name, contact")
      .order("created_at", { ascending: false });

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    setProperties(data || []);
    setLoading(false);
  }

  async function handleDelete(id: string) {
    const confirmed = window.confirm(
      "Delete this homestay? This cannot be undone."
    );
    if (!confirmed) return;

    setDeletingId(id);

    const { error } = await supabase.from("properties").delete().eq("id", id);

    setDeletingId(null);

    if (error) {
      alert(error.message);
      return;
    }

    setProperties((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f4f6f8",
        fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif",
        color: "#111827",
      }}
    >
      {/* TOP BAR */}
      <header
        style={{
          background: "#ffffff",
          borderBottom: "1px solid #e5e7eb",
          padding: "14px 22px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <h1 style={{ margin: 0, fontSize: "18px", fontWeight: 600 }}>
          GooNortheast Admin Panel
        </h1>

        <Link href="/editor/add-homestay" style={{ textDecoration: "none" }}>
          <button
            style={{
              background: "#2563eb",
              color: "white",
              border: "none",
              padding: "10px 14px",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: 500,
            }}
          >
            + Add Homestay
          </button>
        </Link>
      </header>

      <AdminNav />

      {/* CONTENT */}
      <main
        style={{
          maxWidth: "1000px",
          margin: "30px auto",
          padding: "0 16px",
        }}
      >
        <section
          style={{
            background: "white",
            padding: "18px",
            borderRadius: "12px",
            border: "1px solid #e5e7eb",
            marginBottom: "20px",
          }}
        >
          <h2 style={{ margin: 0, fontSize: "16px" }}>Dashboard Overview</h2>
          <p style={{ margin: "6px 0 0", color: "#6b7280" }}>
            {loading
              ? "Loading homestays..."
              : `${properties.length} homestay${
                  properties.length === 1 ? "" : "s"
                } listed`}
          </p>
        </section>

        {/* LIST */}
        <section
          style={{
            background: "#ffffff",
            padding: "18px",
            borderRadius: "12px",
            border: "1px solid #e5e7eb",
          }}
        >
          {loading && (
            <p style={{ color: "#6b7280", margin: 0 }}>Loading...</p>
          )}

          {!loading && properties.length === 0 && (
            <p style={{ color: "#6b7280", margin: 0 }}>
              No homestays yet. Click "+ Add Homestay" to create one.
            </p>
          )}

          {!loading &&
            properties.map((property) => (
              <div
                key={property.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "16px 0",
                  borderBottom: "1px solid #f0f1f3",
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: "15px" }}>
                    {property.title || "Untitled"}
                  </div>
                  <div
                    style={{
                      fontSize: "13px",
                      color: "#6b7280",
                      marginTop: "2px",
                    }}
                  >
                    {property.destination}
                    {property.location ? `, ${property.location}` : ""}
                  </div>
                  <div
                    style={{
                      fontSize: "13px",
                      color: "#9ca3af",
                      marginTop: "2px",
                    }}
                  >
                    Host: {property.host_name || "—"} · {property.contact || "—"}
                  </div>
                </div>

                <div style={{ display: "flex", gap: "8px" }}>
                  <Link
                    href={`/editor/edit-homestay/${property.id}`}
                    style={{ textDecoration: "none" }}
                  >
                    <button
                      style={{
                        background: "#f3f4f6",
                        color: "#111827",
                        border: "1px solid #e5e7eb",
                        padding: "8px 14px",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontSize: "13px",
                        fontWeight: 500,
                      }}
                    >
                      Edit
                    </button>
                  </Link>

                  <button
                    onClick={() => handleDelete(property.id)}
                    disabled={deletingId === property.id}
                    style={{
                      background: "#fef2f2",
                      color: "#dc2626",
                      border: "1px solid #fecaca",
                      padding: "8px 14px",
                      borderRadius: "8px",
                      cursor:
                        deletingId === property.id ? "not-allowed" : "pointer",
                      fontSize: "13px",
                      fontWeight: 500,
                    }}
                  >
                    {deletingId === property.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            ))}
        </section>
      </main>
    </div>
  );
}
