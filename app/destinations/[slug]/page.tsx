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

type Destination = {
  id: string;
  slug: string;
  name: string;
  distance_from_capital: string | null;
  description: string | null;
  cover_photo: string | null;
};

type Place = {
  id: string;
  category: "attraction" | "activity" | "restaurant";
  name: string;
  maps_link: string | null;
  image_url: string | null;
};

function placeholderPlaceImage(name: string) {
  return `https://picsum.photos/seed/${encodeURIComponent(name)}/300/220`;
}

function PlaceSlider({ title, places }: { title: string; places: Place[] }) {
  if (places.length === 0) return null;

  return (
    <section style={{ marginBottom: "28px" }}>
      <h2
        style={{
          fontFamily: "Georgia, 'Iowan Old Style', serif",
          fontSize: "17px",
          fontWeight: 700,
          color: colors.forest,
          margin: "0 0 12px",
        }}
      >
        {title}
      </h2>

      <div
        style={{
          display: "flex",
          gap: "12px",
          overflowX: "auto",
          paddingBottom: "6px",
          WebkitOverflowScrolling: "touch",
          scrollSnapType: "x mandatory",
        }}
      >
        {places.map((place) => {
          const card = (
            <div
              style={{
                minWidth: "160px",
                maxWidth: "160px",
                scrollSnapAlign: "start",
                background: "#ffffff",
                border: `1px solid rgba(47, 74, 62, 0.12)`,
                borderRadius: "14px",
                overflow: "hidden",
                flexShrink: 0,
              }}
            >
              <img
                src={place.image_url || placeholderPlaceImage(place.name)}
                alt={place.name}
                style={{ width: "100%", height: "110px", objectFit: "cover", display: "block" }}
              />
              <div style={{ padding: "10px 12px" }}>
                <p
                  style={{
                    fontSize: "13px",
                    fontWeight: 700,
                    color: colors.ink,
                    margin: "0 0 4px",
                    lineHeight: 1.3,
                  }}
                >
                  {place.name}
                </p>
                {place.maps_link && (
                  <p style={{ fontSize: "11px", fontWeight: 600, color: colors.river, margin: 0 }}>
                    📍 View on Map
                  </p>
                )}
              </div>
            </div>
          );

          return place.maps_link ? (
            <a
              key={place.id}
              href={place.maps_link}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              {card}
            </a>
          ) : (
            <div key={place.id}>{card}</div>
          );
        })}
      </div>
    </section>
  );
}

function normalize(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

function placeholderImageFor(slug: string) {
  return `https://picsum.photos/seed/${slug}-destination/900/500`;
}

export default function DestinationDetails() {
  const { slug } = useParams<{ slug: string }>();

  const [destination, setDestination] = useState<Destination | null>(null);
  const [places, setPlaces] = useState<Place[]>([]);
  const [fallbackPhoto, setFallbackPhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (slug) fetchData();
  }, [slug]);

  async function fetchData() {
    setLoading(true);

    const { data: destinationData } = await supabase
      .from("destinations")
      .select("*")
      .eq("slug", slug)
      .single();

    if (destinationData) {
      const { data: placesData } = await supabase
        .from("destination_places")
        .select("id, category, name, maps_link, image_url")
        .eq("destination_id", destinationData.id);

      setPlaces(placesData || []);

      // If this destination has no cover photo of its own, try to find
      // a real photo from one of its homestays before falling back to a placeholder
      if (!destinationData.cover_photo) {
        const { data: properties } = await supabase
          .from("properties")
          .select("destination, cover_photo")
          .not("cover_photo", "is", null);

        const match = properties?.find(
          (p) =>
            p.destination &&
            (normalize(p.destination) === normalize(destinationData.slug) ||
              normalize(p.destination) === normalize(destinationData.name))
        );

        setFallbackPhoto(match?.cover_photo || null);
      }
    }

    setDestination(destinationData || null);
    setLoading(false);
  }

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif",
          color: colors.sage,
          background: colors.mist,
        }}
      >
        Loading...
      </div>
    );
  }

  if (!destination) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "12px",
          fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif",
          color: colors.ink,
          background: colors.mist,
        }}
      >
        <p>This destination couldn't be found.</p>
        <Link href="/destinations" style={{ color: colors.forest }}>
          ← Back to Destinations
        </Link>
      </div>
    );
  }

  const attractions = places.filter((p) => p.category === "attraction");
  const activities = places.filter((p) => p.category === "activity");
  const restaurants = places.filter((p) => p.category === "restaurant");

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
          <img
            src="/logo.png"
            alt="GoNortheast"
            style={{ height: "36px", width: "auto", display: "block" }}
          />
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

      <main style={{ maxWidth: "700px", margin: "0 auto", padding: "36px 20px 80px" }}>
        <Link
          href="/destinations"
          style={{ fontSize: "13px", fontWeight: 600, color: colors.river, textDecoration: "none" }}
        >
          ← Back to Destinations
        </Link>

        <div
          style={{
            marginTop: "16px",
            borderRadius: "16px",
            overflow: "hidden",
          }}
        >
          <img
            src={destination.cover_photo || fallbackPhoto || placeholderImageFor(destination.slug)}
            alt={destination.name}
            style={{ width: "100%", height: "220px", objectFit: "cover", display: "block" }}
          />
        </div>

        <h1
          style={{
            fontFamily: "Georgia, 'Iowan Old Style', serif",
            fontSize: "clamp(28px, 4vw, 38px)",
            fontWeight: 700,
            color: colors.forest,
            margin: "14px 0 6px",
          }}
        >
          {destination.name}
        </h1>

        {destination.distance_from_capital && (
          <p style={{ fontSize: "14px", color: colors.river, fontWeight: 600, margin: "0 0 20px" }}>
            🚗 {destination.distance_from_capital}
          </p>
        )}

        <Link href={`/homestay/${destination.slug}`} style={{ textDecoration: "none" }}>
          <button
            style={{
              width: "100%",
              marginBottom: "24px",
              background: colors.forest,
              color: colors.mist,
              border: "none",
              padding: "16px",
              borderRadius: "12px",
              fontSize: "15px",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Explore Homestays in {destination.name} →
          </button>
        </Link>

        {destination.description && (
          <p style={{ fontSize: "15px", lineHeight: 1.7, opacity: 0.85, marginBottom: "28px" }}>
            {destination.description}
          </p>
        )}

        <PlaceSlider title="Attractions" places={attractions} />
        <PlaceSlider title="Activities" places={activities} />
        <PlaceSlider title="Restaurants" places={restaurants} />
      </main>
    </div>
  );
}
