"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

const colors = {
  forest: "#2F4A3E",
  ink: "#1B2B22",
  mist: "#F1F4F1",
  sage: "#8B9A93",
  river: "#4A7C82",
  bamboo: "#B99A5B",
};

type Destination = {
  id: string;
  slug: string;
  name: string;
  distance_from_capital: string | null;
  description: string | null;
  cover_photo: string | null;
};

// Placeholder stock photo, used only until a real cover_photo is uploaded
function placeholderImageFor(slug: string) {
  return `https://picsum.photos/seed/${slug}-destination/600/400`;
}

export default function DestinationsOverview() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    fetchDestinations();
  }, []);

  async function fetchDestinations() {
    setLoading(true);

    const { data, error } = await supabase
      .from("destinations")
      .select("id, slug, name, distance_from_capital, description, cover_photo")
      .order("name", { ascending: true });

    if (!error) {
      setDestinations(data || []);
    }

    setLoading(false);
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif",
        color: colors.ink,
        background: colors.mist,
      }}
    >
      {/* NAV */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 20,
          background: "rgba(241, 244, 241, 0.95)",
          backdropFilter: "blur(6px)",
          borderBottom: `1px solid rgba(47, 74, 62, 0.12)`,
          padding: "16px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Link href="/" style={{ textDecoration: "none" }}>
          <span style={{ fontSize: "17px", fontWeight: 700, letterSpacing: "0.02em", color: colors.forest }}>
            GooNortheast
          </span>
        </Link>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: "6px",
            display: "flex",
            flexDirection: "column",
            gap: "4px",
          }}
        >
          <span style={{ width: "22px", height: "2px", background: colors.forest, display: "block" }} />
          <span style={{ width: "22px", height: "2px", background: colors.forest, display: "block" }} />
          <span style={{ width: "22px", height: "2px", background: colors.forest, display: "block" }} />
        </button>
      </header>

      {menuOpen && (
        <div
          style={{
            position: "sticky",
            top: "57px",
            zIndex: 19,
            background: "#ffffff",
            borderBottom: `1px solid rgba(47, 74, 62, 0.12)`,
            display: "flex",
            flexDirection: "column",
            padding: "10px 24px",
          }}
        >
          <Link
            href="/destinations"
            onClick={() => setMenuOpen(false)}
            style={{ textDecoration: "none", color: colors.forest, fontSize: "14px", fontWeight: 600, padding: "12px 0", borderBottom: "1px solid rgba(47,74,62,0.08)" }}
          >
            Browse Homestays
          </Link>
          <Link
            href="/about"
            onClick={() => setMenuOpen(false)}
            style={{ textDecoration: "none", color: colors.forest, fontSize: "14px", fontWeight: 600, padding: "12px 0", borderBottom: "1px solid rgba(47,74,62,0.08)" }}
          >
            About
          </Link>
          <Link
            href="/contact"
            onClick={() => setMenuOpen(false)}
            style={{ textDecoration: "none", color: colors.forest, fontSize: "14px", fontWeight: 600, padding: "12px 0" }}
          >
            Contact
          </Link>
        </div>
      )}

      <section
        style={{
          maxWidth: "760px",
          margin: "0 auto",
          padding: "50px 24px 20px",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontFamily: "Georgia, 'Iowan Old Style', serif",
            fontSize: "clamp(28px, 4vw, 38px)",
            fontWeight: 700,
            color: colors.forest,
            margin: "0 0 12px",
          }}
        >
          Where would you like to go?
        </h1>
        <p style={{ fontSize: "15px", lineHeight: 1.6, opacity: 0.8, margin: 0 }}>
          Pick a destination to see what's there and the homestays nearby.
        </p>
      </section>

      {loading && (
        <p style={{ textAlign: "center", color: colors.sage }}>Loading destinations...</p>
      )}

      {!loading && destinations.length === 0 && (
        <p style={{ textAlign: "center", color: colors.sage }}>No destinations added yet.</p>
      )}

      {!loading && destinations.length > 0 && (
        <main
          style={{
            maxWidth: "1000px",
            margin: "0 auto",
            padding: "20px 24px 90px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "24px",
          }}
        >
          {destinations.map((dest) => (
            <Link
              key={dest.id}
              href={`/destinations/${dest.slug}`}
              className="destination-card"
              style={{
                textDecoration: "none",
                color: "inherit",
                background: "#ffffff",
                border: `1px solid rgba(47, 74, 62, 0.12)`,
                borderRadius: "18px",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                transition: "transform 0.25s ease, box-shadow 0.25s ease",
              }}
            >
              <img
                src={dest.cover_photo || placeholderImageFor(dest.slug)}
                alt={dest.name}
                style={{ width: "100%", height: "170px", objectFit: "cover", display: "block" }}
              />

              <div style={{ padding: "18px 20px" }}>
                <h2 style={{ fontSize: "17px", fontWeight: 700, color: colors.forest, margin: "0 0 4px" }}>
                  {dest.name}
                </h2>
                {dest.distance_from_capital && (
                  <p style={{ fontSize: "12px", fontWeight: 600, color: colors.bamboo, margin: "0 0 10px" }}>
                    🚗 {dest.distance_from_capital}
                  </p>
                )}
                {dest.description && (
                  <p
                    style={{
                      fontSize: "13px",
                      lineHeight: 1.6,
                      opacity: 0.75,
                      margin: 0,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {dest.description}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </main>
      )}

      <style>{`
        .destination-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 32px rgba(47, 74, 62, 0.15);
        }
      `}</style>
    </div>
  );
}
