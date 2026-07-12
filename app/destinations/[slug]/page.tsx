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
  description: string | null;
  maps_link: string | null;
  image_url: string | null;
};

// Used only when a place has no image_url in the database yet.
// This is a placeholder, not a real photo of the place — add a real
// image_url in the destination_places table to replace it.
function placeholderPlaceImage(name: string) {
  return `https://picsum.photos/seed/${encodeURIComponent(name)}/300/220`;
}

const INITIAL_VISIBLE_COUNT = 4;

function PlaceLightbox({ place, onClose }: { place: Place; onClose: () => void }) {
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        background: "rgba(10, 14, 12, 0.94)",
        overflowY: "auto",
        WebkitOverflowScrolling: "touch",
      }}
    >
      <button
        onClick={onClose}
        aria-label="Close"
        style={{
          position: "fixed",
          top: "18px",
          right: "18px",
          zIndex: 101,
          background: "rgba(255,255,255,0.15)",
          border: "none",
          color: "#ffffff",
          width: "38px",
          height: "38px",
          borderRadius: "50%",
          fontSize: "18px",
          cursor: "pointer",
        }}
      >
        ✕
      </button>

      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          margin: "0 auto",
          width: "100%",
          maxWidth: "480px",
          minHeight: "100vh",
        }}
      >
        <img
          src={place.image_url || placeholderPlaceImage(place.name)}
          alt={place.name}
          style={{ width: "100%", maxHeight: "60vh", objectFit: "cover", display: "block" }}
        />
        <div style={{ padding: "22px 20px 60px" }}>
          <h3
            style={{
              fontFamily: "Georgia, 'Iowan Old Style', serif",
              fontSize: "22px",
              fontWeight: 700,
              color: "#ffffff",
              margin: "0 0 10px",
            }}
          >
            {place.name}
          </h3>
          {place.description && (
            <p style={{ fontSize: "14px", lineHeight: 1.7, color: "rgba(255,255,255,0.85)", margin: "0 0 20px" }}>
              {place.description}
            </p>
          )}
          {place.maps_link && (
            <a
              href={place.maps_link}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-block",
                background: colors.bamboo,
                color: colors.ink,
                textDecoration: "none",
                fontSize: "14px",
                fontWeight: 700,
                padding: "13px 22px",
                borderRadius: "10px",
              }}
            >
              Open in Google Maps →
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function PlaceSlider({ title, places }: { title: string; places: Place[] }) {
  const [expanded, setExpanded] = useState(false);
  const [activePlace, setActivePlace] = useState<Place | null>(null);

  if (places.length === 0) return null;

  const visiblePlaces = expanded ? places : places.slice(0, INITIAL_VISIBLE_COUNT);
  const hasMore = places.length > INITIAL_VISIBLE_COUNT;

  return (
    <section style={{ marginBottom: "28px" }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
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
        {hasMore && (
          <button
            onClick={() => setExpanded(!expanded)}
            style={{
              background: "none",
              border: "none",
              color: colors.river,
              fontSize: "12.5px",
              fontWeight: 600,
              cursor: "pointer",
              padding: 0,
              marginBottom: "12px",
            }}
          >
            {expanded ? "Show less" : `See more (${places.length - INITIAL_VISIBLE_COUNT})`}
          </button>
        )}
      </div>

      <div
        style={
          expanded
            ? {
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                gap: "12px",
              }
            : {
                display: "flex",
                gap: "12px",
                overflowX: "auto",
                paddingBottom: "6px",
                WebkitOverflowScrolling: "touch",
                scrollSnapType: "x mandatory",
              }
        }
      >
        {visiblePlaces.map((place) => {
          const card = (
            <div
              className="place-card"
              style={{
                position: "relative",
                minWidth: expanded ? undefined : "230px",
                maxWidth: expanded ? undefined : "230px",
                height: "290px",
                scrollSnapAlign: "start",
                borderRadius: "16px",
                overflow: "hidden",
                flexShrink: 0,
              }}
            >
              <img
                src={place.image_url || placeholderPlaceImage(place.name)}
                alt={place.name}
                className="place-card-img"
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />

              <div
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: 0,
                  padding: "36px 14px 14px",
                  background: "linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.5) 55%, rgba(0,0,0,0) 100%)",
                }}
              >
                <p
                  style={{
                    fontSize: "15px",
                    fontWeight: 700,
                    color: "#ffffff",
                    margin: "0 0 4px",
                    lineHeight: 1.3,
                    textShadow: "0 1px 3px rgba(0,0,0,0.4)",
                  }}
                >
                  {place.name}
                </p>
                {place.description && (
                  <p
                    style={{
                      fontSize: "12px",
                      lineHeight: 1.5,
                      color: "rgba(255,255,255,0.9)",
                      margin: "0 0 6px",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {place.description}
                  </p>
                )}
                <p style={{ fontSize: "11px", fontWeight: 700, color: colors.bamboo, margin: 0 }}>
                  Tap to view →
                </p>
              </div>
            </div>
          );

          return (
            <button
              key={place.id}
              onClick={() => setActivePlace(place)}
              style={{
                all: "unset",
                cursor: "pointer",
                display: "block",
                scrollSnapAlign: "start",
              }}
            >
              {card}
            </button>
          );
        })}
      </div>

      {activePlace && <PlaceLightbox place={activePlace} onClose={() => setActivePlace(null)} />}
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
        .select("id, category, name, description, maps_link, image_url")
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
            {destination.distance_from_capital}
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

      <style>{`
        .place-card-img {
          transition: transform 0.5s ease;
        }
        .place-card:hover .place-card-img {
          transform: scale(1.08);
        }
        .place-card {
          transition: box-shadow 0.25s ease, transform 0.25s ease;
        }
        .place-card:hover {
          box-shadow: 0 10px 20px rgba(47, 74, 62, 0.15);
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
}
