"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

const colors = {
  forest: "#2F4A3E",
  ink: "#1B2B22",
  mist: "#F1F4F1",
  sage: "#8B9A93",
  bamboo: "#B99A5B",
  river: "#4A7C82",
};

type Property = {
  id: string;
  title: string;
  destination: string;
  location: string;
  description: string;
  cover_photo: string | null;
};

// The areas we always show, in this order, even if a given area has
// no listings yet. Anything in the database that doesn't match one of
// these falls into "Other Areas" at the end.
const KNOWN_AREAS = ["Shillong", "Umiam", "Dawki", "Sohra", "Jowai", "Tura"];

// Generic, location-flavored placeholder used only when a listing has
// no cover_photo uploaded yet. Swap these seeds for your own licensed
// photos of each area whenever you have them.
const AREA_PLACEHOLDER_SEED: Record<string, string> = {
  shillong: "shillong-pines",
  umiam: "umiam-lake",
  dawki: "dawki-river",
  sohra: "sohra-rootbridge",
  jowai: "jowai-hills",
  tura: "tura-garohills",
};

function placeholderImageFor(destination: string) {
  const key = destination.trim().toLowerCase();
  const seed = AREA_PLACEHOLDER_SEED[key] || "northeast-india-hills";
  return `https://picsum.photos/seed/${seed}/500/360`;
}

function normalize(name: string) {
  return name.trim().toLowerCase();
}

function groupByDestination(properties: Property[]) {
  const groups: Record<string, { label: string; items: Property[] }> = {};

  // Seed every known area first, even if empty, so it always appears.
  for (const area of KNOWN_AREAS) {
    groups[normalize(area)] = { label: area, items: [] };
  }

  for (const property of properties) {
    const raw = property.destination?.trim();
    const key = raw ? normalize(raw) : "other areas";

    if (!groups[key]) {
      groups[key] = { label: raw || "Other Areas", items: [] };
    }
    groups[key].items.push(property);
  }

  const knownKeys = KNOWN_AREAS.map(normalize);

  const knownGroups = knownKeys.map((k) => groups[k]);
  const extraGroups = Object.entries(groups)
    .filter(([k]) => !knownKeys.includes(k))
    .map(([, v]) => v)
    .sort((a, b) => a.label.localeCompare(b.label));

  return [...knownGroups, ...extraGroups];
}

export default function Homestay() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedAreas, setExpandedAreas] = useState<Record<string, boolean>>(
    {}
  );

  const INITIAL_VISIBLE = 4;

  useEffect(() => {
    fetchProperties();
  }, []);

  async function fetchProperties() {
    setLoading(true);

    const { data, error } = await supabase
      .from("properties")
      .select("id, title, destination, location, description, cover_photo")
      .order("created_at", { ascending: false });

    if (!error) {
      setProperties(data || []);
    }

    setLoading(false);
  }

  function toggleExpanded(label: string) {
    setExpandedAreas((prev) => ({ ...prev, [label]: !prev[label] }));
  }

  const groups = groupByDestination(properties);

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
          zIndex: 10,
          background: "rgba(241, 244, 241, 0.92)",
          backdropFilter: "blur(6px)",
          borderBottom: `1px solid rgba(47, 74, 62, 0.12)`,
          padding: "16px 24px",
        }}
      >
        <Link href="/" style={{ textDecoration: "none" }}>
          <span
            style={{
              fontSize: "17px",
              fontWeight: 700,
              letterSpacing: "0.02em",
              color: colors.forest,
            }}
          >
            GooNortheast
          </span>
        </Link>
      </header>

      {/* HEADER */}
      <section
        style={{
          maxWidth: "760px",
          margin: "0 auto",
          padding: "56px 24px 30px",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontFamily: "Georgia, 'Iowan Old Style', serif",
            fontSize: "clamp(28px, 4vw, 40px)",
            fontWeight: 700,
            color: colors.forest,
            margin: "0 0 12px",
          }}
        >
          Homestays
        </h1>
        <p style={{ fontSize: "15px", lineHeight: 1.6, opacity: 0.8, margin: 0 }}>
          Read the story, meet the host, and discover the area behind each
          stay.
        </p>
      </section>

      {loading && (
        <p style={{ textAlign: "center", color: colors.sage }}>
          Loading homestays...
        </p>
      )}

      {!loading && (
        <>
          {/* AREA JUMP NAV */}
          <div
            style={{
              maxWidth: "1000px",
              margin: "0 auto",
              padding: "0 24px 30px",
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {groups.map((group) => (
              <a
                key={group.label}
                href={`#${group.label}`}
                style={{
                  textDecoration: "none",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: colors.forest,
                  background: "#ffffff",
                  border: `1px solid rgba(47, 74, 62, 0.2)`,
                  borderRadius: "999px",
                  padding: "6px 14px",
                }}
              >
                {group.label}
              </a>
            ))}
          </div>

          {/* LIST */}
          <section
            style={{
              maxWidth: "1000px",
              margin: "0 auto",
              padding: "0 24px 90px",
            }}
          >
            {groups.map((group) => (
              <div
                key={group.label}
                id={group.label}
                style={{ marginBottom: "48px", scrollMarginTop: "80px" }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: "10px",
                    marginBottom: "18px",
                    paddingBottom: "10px",
                    borderBottom: `1px solid rgba(47, 74, 62, 0.15)`,
                  }}
                >
                  <h2
                    style={{
                      fontFamily: "Georgia, 'Iowan Old Style', serif",
                      fontSize: "22px",
                      fontWeight: 700,
                      color: colors.forest,
                      margin: 0,
                    }}
                  >
                    {group.label}
                  </h2>
                  <span style={{ fontSize: "13px", color: colors.sage }}>
                    {group.items.length} homestay
                    {group.items.length === 1 ? "" : "s"}
                  </span>
                </div>

                {group.items.length === 0 ? (
                  <p style={{ fontSize: "14px", color: colors.sage, margin: 0 }}>
                    No homestays listed here yet. Check back soon.
                  </p>
                ) : (
                  <>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fit, minmax(260px, 1fr))",
                        gap: "24px",
                      }}
                    >
                      {(expandedAreas[group.label]
                        ? group.items
                        : group.items.slice(0, INITIAL_VISIBLE)
                      ).map((property) => (
                        <Link
                          key={property.id}
                          href={`/homestay/${property.id}`}
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
                            <img
                              src={
                                property.cover_photo ||
                                placeholderImageFor(
                                  property.destination || group.label
                                )
                              }
                              alt={property.title}
                              style={{
                                width: "100%",
                                height: "170px",
                                objectFit: "cover",
                                display: "block",
                              }}
                            />

                            <div style={{ padding: "18px 20px", flex: 1 }}>
                              <h3
                                style={{
                                  fontSize: "16px",
                                  fontWeight: 700,
                                  color: colors.forest,
                                  margin: "0 0 6px",
                                }}
                              >
                                {property.title || "Untitled Homestay"}
                              </h3>
                              <p
                                style={{
                                  fontSize: "13px",
                                  color: colors.river,
                                  margin: "0 0 10px",
                                  fontWeight: 600,
                                }}
                              >
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
                    </div>

                    {group.items.length > INITIAL_VISIBLE && (
                      <button
                        onClick={() => toggleExpanded(group.label)}
                        style={{
                          marginTop: "18px",
                          background: "transparent",
                          border: `1px solid rgba(47, 74, 62, 0.3)`,
                          color: colors.forest,
                          borderRadius: "999px",
                          padding: "9px 18px",
                          fontSize: "13px",
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        {expandedAreas[group.label]
                          ? "Show less"
                          : `Show ${
                              group.items.length - INITIAL_VISIBLE
                            } more in ${group.label}`}
                      </button>
                    )}
                  </>
                )}
              </div>
            ))}
          </section>
        </>
      )}
    </div>
  );
}
