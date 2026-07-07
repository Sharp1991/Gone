"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import AdminNav from "@/components/AdminNav";

type Destination = {
  id: string;
  slug: string;
  name: string;
  distance_from_capital: string | null;
};

export default function DestinationsAdmin() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchDestinations();
  }, []);

  async function fetchDestinations() {
    setLoading(true);

    const { data, error } = await supabase
      .from("destinations")
      .select("id, slug, name, distance_from_capital")
      .order("name", { ascending: true });

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    setDestinations(data || []);
    setLoading(false);
  }

  async function handleDelete(id: string, name: string) {
    const confirmed = window.confirm(
      `Delete "${name}"? This will also remove its attractions, activities, and restaurants. This cannot be undone.`
    );
    if (!confirmed) return;

    setDeletingId(id);

    // destination_places rows are removed automatically via
    // "on delete cascade" if set up that way in Supabase; otherwise
    // delete them explicitly first.
    await supabase.from("destination_places").delete().eq("destination_id", id);

    const { error } = await supabase.from("destinations").delete().eq("id", id);

    setDeletingId(null);

    if (error) {
      alert(error.message);
      return;
    }

    setDestinations((prev) => prev.filter((d) => d.id !== id));
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
          GooNortheast Admin
        </h1>

        <Link href="/editor/add-destination" style={{ textDecoration: "none" }}>
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
            + Add Destination
          </button>
        </Link>
      </header>

      <AdminNav />

      <main style={{ maxWidth: "1000px", margin: "30px auto", padding: "0 16px" }}>
        <section
          style={{
            background: "white",
            padding: "18px",
            borderRadius: "12px",
            border: "1px solid #e5e7eb",
            marginBottom: "20px",
          }}
        >
          <h2 style={{ margin: 0, fontSize: "16px" }}>Destinations Overview</h2>
          <p style={{ margin: "6px 0 0", color: "#6b7280" }}>
            {loading
              ? "Loading destinations..."
              : `${destinations.length} destination${destinations.length === 1 ? "" : "s"} added`}
          </p>
        </section>

        <section
          style={{
            background: "#ffffff",
            padding: "18px",
            borderRadius: "12px",
            border: "1px solid #e5e7eb",
          }}
        >
          {loading && <p style={{ color: "#6b7280", margin: 0 }}>Loading...</p>}

          {!loading && destinations.length === 0 && (
            <p style={{ color: "#6b7280", margin: 0 }}>
              No destinations yet. Click "+ Add Destination" to create one.
            </p>
          )}

          {!loading &&
            destinations.map((dest) => (
              <div
                key={dest.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "16px 0",
                  borderBottom: "1px solid #f0f1f3",
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: "15px" }}>{dest.name}</div>
                  <div style={{ fontSize: "13px", color: "#6b7280", marginTop: "2px" }}>
                    /destinations/{dest.slug}
                  </div>
                  {dest.distance_from_capital && (
                    <div style={{ fontSize: "13px", color: "#9ca3af", marginTop: "2px" }}>
                      {dest.distance_from_capital}
                    </div>
                  )}
                </div>

                <div style={{ display: "flex", gap: "8px" }}>
                  <Link href={`/destinations/${dest.slug}`} style={{ textDecoration: "none" }}>
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
                      View
                    </button>
                  </Link>

                  <button
                    onClick={() => handleDelete(dest.id, dest.name)}
                    disabled={deletingId === dest.id}
                    style={{
                      background: "#fef2f2",
                      color: "#dc2626",
                      border: "1px solid #fecaca",
                      padding: "8px 14px",
                      borderRadius: "8px",
                      cursor: deletingId === dest.id ? "not-allowed" : "pointer",
                      fontSize: "13px",
                      fontWeight: 500,
                    }}
                  >
                    {deletingId === dest.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            ))}
        </section>
      </main>
    </div>
  );
}
