"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
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

type Property = {
  id: string;
  title: string;
  destination: string;
  location: string;
  description: string;
  cover_photo: string | null;
};

function normalize(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

export default function HomestaysByArea() {
  const { area } = useParams<{ area: string }>();

  const [areaName, setAreaName] = useState("");
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (area) fetchData();
  }, [area]);

  async function fetchData() {
    setLoading(true);

    // Try to get the destination's proper display name, if it exists
    const { data: destinationData } = await supabase
      .from("destinations")
      .select("name")
      .eq("slug", area)
      .single();

    setAreaName(destinationData?.name || decodeURIComponent(area).replace(/-/g, " "));

    const { data, error } = await supabase
      .from("properties")
      .select("id, title, destination, location, description, cover_photo")
      .order("created_at", { ascending: false });

    if (!error && data) {
      const filtered = data.filter(
        (p) => p.destination && normalize(p.destination) === normalize(area)
      );
      setProperties(filtered);
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
          <span style={{ fontSize: "17px", fontWeight: 700, color: colors.forest }}>
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
        <Link
          href={`/destinations/${area}`}
          style={{ fontSize: "13px", fontWeight: 600, color: colors.river, textDecoration: "none" }}
        >
          ← Back to {areaName || "Destination"}
        </Link>

        <h1
          style={{
            fontFamily: "Georgia, 'Iowan Old Style', serif",
            fontSize: "clamp(28px, 4vw, 38px)",
            fontWeight: 700,
            color: colors.forest,
            margin: "14px 0 6px",
            textTransform: "capitalize",
          }}
        >
          Homestays in {areaName || "this area"}
        </h1>
        <p style={{ fontSize: "15px", lineHeight: 1.6, opacity: 0.8, margin: 0 }}>
          {loading ? "Loading..." : `${properties.length} homestay${properties.length === 1 ? "" : "s"} found`}
        </p>
      </section>

      {!loading && properties.length === 0 && (
        <p style={{ textAlign: "center", color: colors.sage, padding: "0 24px" }}>
          No homestays listed here yet. Check back soon.
        </p>
      )}

      {!loading && properties.length > 0 && (
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
          {properties.map((property) => (
            <Link
              key={property.id}
              href={`/stay/${property.id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div
                style={{
                  background: "#ffffff",
                  border: `1px solid rgba(47, 74, 62, 0.12)`,
                  borderRadius: "16px",
                  overflow: "hidden",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {property.cover_photo ? (
                  <img
                    src={property.cover_photo}
                    alt={property.title}
                    style={{ width: "100%", height: "170px", objectFit: "cover", display: "block" }}
                  />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "170px",
                      background: `linear-gradient(135deg, ${colors.forest}, ${colors.river})`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: colors.mist,
                      fontSize: "13px",
                      fontWeight: 600,
                      letterSpacing: "0.04em",
                      textTransform: "uppercase",
                    }}
                  >
                    Photo coming soon
                  </div>
                )}

                <div style={{ padding: "18px 20px", flex: 1 }}>
                  <h3 style={{ fontSize: "16px", fontWeight: 700, color: colors.forest, margin: "0 0 6px" }}>
                    {property.title || "Untitled Homestay"}
                  </h3>
                  <p style={{ fontSize: "13px", color: colors.river, margin: "0 0 10px", fontWeight: 600 }}>
                    {property.location || "—"}
                  </p>
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
                    {property.description || "No description yet."}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </main>
      )}
    </div>
  );
}
