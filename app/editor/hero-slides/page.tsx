"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import AdminNav from "@/components/AdminNav";

type HeroSlide = {
  id: string;
  image_url: string;
  caption: string | null;
  link_url: string | null;
  sort_order: number;
};

export default function HeroSlidesAdmin() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchSlides();
  }, []);

  async function fetchSlides() {
    setLoading(true);

    const { data, error } = await supabase
      .from("hero_slides")
      .select("id, image_url, caption, link_url, sort_order")
      .order("sort_order", { ascending: true });

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    setSlides(data || []);
    setLoading(false);
  }

  async function handleDelete(id: string) {
    const confirmed = window.confirm("Delete this hero slide? This cannot be undone.");
    if (!confirmed) return;

    setDeletingId(id);

    const { error } = await supabase.from("hero_slides").delete().eq("id", id);

    setDeletingId(null);

    if (error) {
      alert(error.message);
      return;
    }

    setSlides((prev) => prev.filter((s) => s.id !== id));
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

        <Link href="/editor/add-hero-slide" style={{ textDecoration: "none" }}>
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
            + Add Slide
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
          <h2 style={{ margin: 0, fontSize: "16px" }}>Hero Slides Overview</h2>
          <p style={{ margin: "6px 0 0", color: "#6b7280" }}>
            {loading
              ? "Loading slides..."
              : `${slides.length} slide${slides.length === 1 ? "" : "s"} in the home page banner`}
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

          {!loading && slides.length === 0 && (
            <p style={{ color: "#6b7280", margin: 0 }}>
              No hero slides yet. Click "+ Add Slide" to create one.
            </p>
          )}

          {!loading &&
            slides.map((slide) => (
              <div
                key={slide.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "16px 0",
                  borderBottom: "1px solid #f0f1f3",
                  gap: "14px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "14px", flex: 1, minWidth: 0 }}>
                  <img
                    src={slide.image_url}
                    alt={slide.caption || "Hero slide"}
                    style={{
                      width: "70px",
                      height: "50px",
                      objectFit: "cover",
                      borderRadius: "8px",
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: "14px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {slide.caption || "No caption"}
                    </div>
                    <div style={{ fontSize: "12px", color: "#9ca3af", marginTop: "2px" }}>
                      Order: {slide.sort_order} · Links to: {slide.link_url || "/destinations"}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(slide.id)}
                  disabled={deletingId === slide.id}
                  style={{
                    background: "#fef2f2",
                    color: "#dc2626",
                    border: "1px solid #fecaca",
                    padding: "8px 14px",
                    borderRadius: "8px",
                    cursor: deletingId === slide.id ? "not-allowed" : "pointer",
                    fontSize: "13px",
                    fontWeight: 500,
                    flexShrink: 0,
                  }}
                >
                  {deletingId === slide.id ? "Deleting..." : "Delete"}
                </button>
              </div>
            ))}
        </section>
      </main>
    </div>
  );
}
