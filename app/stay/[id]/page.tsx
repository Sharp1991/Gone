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

export default function HomestayDetails() {
  const { id } = useParams<{ id: string }>();

  const [property, setProperty] = useState<Property | null>(null);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

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
          style={{
            marginTop: "16px",
            borderRadius: "18px",
            overflow: "hidden",
            boxShadow: "0 16px 40px rgba(27, 43, 34, 0.15)",
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
              {gallery.map((image) => (
                <img
                  key={image.id}
                  src={image.url}
                  alt={property.title}
                  style={{
                    width: "100%",
                    height: "110px",
                    objectFit: "cover",
                    borderRadius: "10px",
                    display: "block",
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
    </div>
  );
}
