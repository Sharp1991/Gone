"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
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
  about_host: string;
  about_area: string;
  nearby_attractions: string;
  guest_experiences: string;
  host_name: string;
  contact: string;
  whatsapp: string;
  google_maps: string;
  youtube_link: string | null;
  cover_photo: string | null;
};

type GalleryImage = {
  id: string;
  url: string;
};

const sectionStyle: React.CSSProperties = {
  background: "#ffffff",
  border: `1px solid rgba(47, 74, 62, 0.12)`,
  borderRadius: "16px",
  padding: "24px",
  marginBottom: "20px",
};

const headingStyle: React.CSSProperties = {
  fontFamily: "Georgia, 'Iowan Old Style', serif",
  fontSize: "18px",
  fontWeight: 700,
  color: colors.forest,
  margin: "0 0 12px",
};

const bodyTextStyle: React.CSSProperties = {
  fontSize: "14px",
  lineHeight: 1.7,
  color: colors.ink,
  opacity: 0.85,
  margin: 0,
  whiteSpace: "pre-line",
};

function whatsappLink(number: string, homestayName: string) {
  const digits = number.replace(/[^0-9]/g, "");
  const message = encodeURIComponent(
    `Hi, I'm interested in ${homestayName}.`
  );
  return `https://wa.me/${digits}?text=${message}`;
}

function Lightbox({
  images,
  startIndex,
  onClose,
}: {
  images: string[];
  startIndex: number;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(startIndex);
  const touchStartX = useRef<number | null>(null);

  function next() {
    setIndex((i) => (i + 1) % images.length);
  }
  function prev() {
    setIndex((i) => (i - 1 + images.length) % images.length);
  }
  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }
  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (diff > 50) prev();
    else if (diff < -50) next();
    touchStartX.current = null;
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        background: "rgba(0,0,0,0.95)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <button
        onClick={onClose}
        aria-label="Close"
        style={{
          position: "absolute",
          top: "16px",
          right: "16px",
          background: "rgba(255,255,255,0.15)",
          border: "none",
          color: "#fff",
          width: "38px",
          height: "38px",
          borderRadius: "50%",
          fontSize: "18px",
          cursor: "pointer",
          zIndex: 2,
        }}
      >
        ✕
      </button>

      <div
        style={{
          position: "absolute",
          top: "18px",
          left: "20px",
          color: "#fff",
          fontSize: "13px",
          fontWeight: 600,
          opacity: 0.8,
        }}
      >
        {index + 1} / {images.length}
      </div>

      <img
        src={images[index]}
        alt=""
        style={{
          maxWidth: "94vw",
          maxHeight: "84vh",
          objectFit: "contain",
          userSelect: "none",
        }}
      />

      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Previous photo"
            style={{
              position: "absolute",
              left: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              background: "rgba(255,255,255,0.15)",
              border: "none",
              color: "#fff",
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              fontSize: "20px",
              cursor: "pointer",
            }}
          >
            ‹
          </button>
          <button
            onClick={next}
            aria-label="Next photo"
            style={{
              position: "absolute",
              right: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              background: "rgba(255,255,255,0.15)",
              border: "none",
              color: "#fff",
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              fontSize: "20px",
              cursor: "pointer",
            }}
          >
            ›
          </button>
        </>
      )}
    </div>
  );
}

export default function HomestayDetails() {
  const { id } = useParams<{ id: string }>();

  const [property, setProperty] = useState<Property | null>(null);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  function openLightbox(i: number) {
    window.history.pushState({ lightbox: true }, "");
    setLightboxIndex(i);
  }

  function closeLightbox() {
    // If we pushed a history entry for the lightbox, undo it so the
    // back button behaves correctly the next time it's pressed.
    if (window.history.state?.lightbox) {
      window.history.back();
    } else {
      setLightboxIndex(null);
    }
  }

  useEffect(() => {
    function handlePopState() {
      setLightboxIndex(null);
    }
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    if (id) fetchData();
  }, [id]);

  async function fetchData() {
    setLoading(true);

    const { data: propertyData } = await supabase
      .from("properties")
      .select("*")
      .eq("id", id)
      .single();

    const { data: galleryData } = await supabase
      .from("property_images")
      .select("id, url")
      .eq("property_id", id);

    setProperty(propertyData || null);
    setGallery(galleryData || []);
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

  if (!property) {
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
        <p>This homestay couldn't be found.</p>
        <Link href="/homestay" style={{ color: colors.forest }}>
          ← Back to Homestays
        </Link>
      </div>
    );
  }

  const allPhotos = [
    ...(property.cover_photo ? [property.cover_photo] : []),
    ...gallery.map((g) => g.url),
  ];

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

      <main style={{ maxWidth: "760px", margin: "0 auto", padding: "30px 16px 80px" }}>
        <Link
          href="/homestay"
          style={{
            fontSize: "13px",
            fontWeight: 600,
            color: colors.river,
            textDecoration: "none",
          }}
        >
          ← Back to {property.destination || "Homestays"}
        </Link>

        {/* COVER PHOTO */}
        <div
          onClick={() => property.cover_photo && openLightbox(0)}
          style={{
            marginTop: "16px",
            borderRadius: "18px",
            overflow: "hidden",
            boxShadow: "0 16px 40px rgba(27, 43, 34, 0.15)",
            cursor: property.cover_photo ? "pointer" : "default",
          }}
        >
          {property.cover_photo ? (
            <img
              src={property.cover_photo}
              alt={property.title}
              style={{ width: "100%", height: "320px", objectFit: "cover", display: "block" }}
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: "320px",
                background: `linear-gradient(135deg, ${colors.forest}, ${colors.river})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: colors.mist,
                fontWeight: 600,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                fontSize: "14px",
              }}
            >
              Photo coming soon
            </div>
          )}
        </div>

        {/* TITLE */}
        <h1
          style={{
            fontFamily: "Georgia, 'Iowan Old Style', serif",
            fontSize: "clamp(24px, 4vw, 32px)",
            fontWeight: 700,
            color: colors.forest,
            margin: "22px 0 4px",
          }}
        >
          {property.title || "Untitled Homestay"}
        </h1>
        <p style={{ fontSize: "14px", color: colors.river, fontWeight: 600, margin: "0 0 24px" }}>
          {property.destination}
          {property.location ? `, ${property.location}` : ""}
        </p>

        {/* GALLERY */}
        {gallery.length > 0 && (
          <section style={sectionStyle}>
            <h2 style={headingStyle}>Photo Gallery</h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                gap: "10px",
              }}
            >
              {gallery.map((image, i) => (
                <img
                  key={image.id}
                  src={image.url}
                  alt={property.title}
                  onClick={() =>
                    openLightbox((property.cover_photo ? 1 : 0) + i)
                  }
                  style={{
                    width: "100%",
                    height: "110px",
                    objectFit: "cover",
                    borderRadius: "10px",
                    display: "block",
                    cursor: "pointer",
                  }}
                />
              ))}
            </div>
          </section>
        )}

        {/* ABOUT */}
        {property.description && (
          <section style={sectionStyle}>
            <h2 style={headingStyle}>About the Homestay</h2>
            <p style={bodyTextStyle}>{property.description}</p>
          </section>
        )}

        {property.about_host && (
          <section style={sectionStyle}>
            <h2 style={headingStyle}>About the Host</h2>
            <p style={bodyTextStyle}>{property.about_host}</p>
          </section>
        )}

        {property.about_area && (
          <section style={sectionStyle}>
            <h2 style={headingStyle}>About the Area</h2>
            <p style={bodyTextStyle}>{property.about_area}</p>
          </section>
        )}

        {property.nearby_attractions && (
          <section style={sectionStyle}>
            <h2 style={headingStyle}>Nearby Attractions</h2>
            <p style={bodyTextStyle}>{property.nearby_attractions}</p>
          </section>
        )}

        {property.guest_experiences && (
          <section style={sectionStyle}>
            <h2 style={headingStyle}>Guest Experiences</h2>
            <p style={bodyTextStyle}>{property.guest_experiences}</p>
          </section>
        )}

        {/* CONTACT */}
        <section style={sectionStyle}>
          <h2 style={headingStyle}>Host & Contact</h2>
          <p style={{ ...bodyTextStyle, marginBottom: "16px" }}>
            {property.host_name && <>Hosted by <strong>{property.host_name}</strong></>}
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {property.contact && (
              <a
                href={`tel:${property.contact}`}
                style={{
                  textDecoration: "none",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: colors.forest,
                  background: colors.mist,
                  border: `1px solid rgba(47, 74, 62, 0.2)`,
                  borderRadius: "999px",
                  padding: "10px 18px",
                }}
              >
                Call {property.contact}
              </a>
            )}

            {property.whatsapp && (
              <a
                href={whatsappLink(property.whatsapp, property.title)}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  textDecoration: "none",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#ffffff",
                  background: "#25D366",
                  borderRadius: "999px",
                  padding: "10px 18px",
                }}
              >
                WhatsApp
              </a>
            )}

            {property.google_maps && (
              <a
                href={property.google_maps}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  textDecoration: "none",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#ffffff",
                  background: colors.river,
                  borderRadius: "999px",
                  padding: "10px 18px",
                }}
              >
                View on Map
              </a>
            )}

            {property.youtube_link && (
              <a
                href={property.youtube_link}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  textDecoration: "none",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#ffffff",
                  background: "#FF0000",
                  borderRadius: "999px",
                  padding: "10px 18px",
                }}
              >
                ▶ Watch on YouTube
              </a>
            )}
          </div>
        </section>
      </main>

      {lightboxIndex !== null && (
        <Lightbox
          images={allPhotos}
          startIndex={lightboxIndex}
          onClose={closeLightbox}
        />
      )}
    </div>
  );
}
