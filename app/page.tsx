"use client";

import { useState, useRef, useEffect } from "react";
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

// Used only if no slides have been added yet via the admin panel
const DEFAULT_SLIDES = [
  {
    caption: "Homestays run by real families, not management companies",
    image: "https://picsum.photos/seed/meghalaya-hills-1/1200/900",
    link_url: "/destinations",
  },
  {
    caption: "Discover hidden corners of the Northeast, off the usual trail",
    image: "https://picsum.photos/seed/northeast-waterfall/1200/900",
    link_url: "/destinations",
  },
  {
    caption: "Connect directly with your host — no middleman, ever",
    image: "https://picsum.photos/seed/village-homestay/1200/900",
    link_url: "/destinations",
  },
];

const steps = [
  {
    number: "01",
    title: "Pick a Destination",
    body: "Browse by area — Shillong, Dawki, Sohra, and more — and see what's actually there.",
  },
  {
    number: "02",
    title: "Explore Homestays",
    body: "Real listings run by real hosts, with photos, stories, and no management company in between.",
  },
  {
    number: "03",
    title: "Connect Directly",
    body: "Call, message on WhatsApp, or open the map — straight to your host, no middleman.",
  },
];

function HeroCarousel() {
  const [slides, setSlides] = useState(DEFAULT_SLIDES);
  const [index, setIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    fetchSlides();
  }, []);

  async function fetchSlides() {
    const { data } = await supabase
      .from("hero_slides")
      .select("image_url, caption, link_url")
      .order("sort_order", { ascending: true });

    if (data && data.length > 0) {
      setSlides(
        data.map((s) => ({
          image: s.image_url,
          caption: s.caption || "",
          link_url: s.link_url || "/destinations",
        }))
      );
    }
  }

  function next() {
    setIndex((i) => (i + 1) % slides.length);
  }
  function prev() {
    setIndex((i) => (i - 1 + slides.length) % slides.length);
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
        position: "relative",
        width: "100%",
        height: "88vh",
        minHeight: "560px",
        overflow: "hidden",
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <style>{`
        @keyframes kenburns {
          0% { transform: scale(1); }
          100% { transform: scale(1.08); }
        }
        .kb-slide-active {
          animation: kenburns 7s ease-out forwards;
        }
      `}</style>

      <div
        style={{
          display: "flex",
          width: `${slides.length * 100}%`,
          height: "100%",
          transform: `translateX(-${index * (100 / slides.length)}%)`,
          transition: "transform 0.7s cubic-bezier(0.65, 0, 0.35, 1)",
        }}
      >
        {slides.map((slide, i) => (
          <div
            key={i}
            style={{
              width: `${100 / slides.length}%`,
              height: "100%",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              className={i === index ? "kb-slide-active" : ""}
              style={{
                position: "absolute",
                inset: 0,
                background: `url(${slide.image}) center/cover no-repeat`,
              }}
            />

            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.5) 100%)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-end",
                padding: "0 24px 80px",
                gap: "22px",
              }}
            >
              <p
                style={{
                  fontFamily: "Georgia, 'Iowan Old Style', serif",
                  fontSize: "clamp(22px, 4.5vw, 34px)",
                  fontWeight: 700,
                  color: "#ffffff",
                  maxWidth: "540px",
                  margin: 0,
                  textAlign: "center",
                  lineHeight: 1.3,
                  textShadow: "0 2px 12px rgba(0,0,0,0.3)",
                }}
              >
                {slide.caption}
              </p>

              <Link href={slide.link_url || "/destinations"} style={{ textDecoration: "none" }}>
                <button
                  style={{
                    background: "#ffffff",
                    color: colors.forest,
                    border: "none",
                    padding: "14px 28px",
                    borderRadius: "999px",
                    fontSize: "14px",
                    fontWeight: 700,
                    cursor: "pointer",
                    letterSpacing: "0.02em",
                    boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
                  }}
                >
                  Browse Homestays →
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={prev}
        aria-label="Previous slide"
        style={{
          position: "absolute",
          left: "16px",
          top: "50%",
          transform: "translateY(-50%)",
          background: "rgba(255,255,255,0.2)",
          backdropFilter: "blur(4px)",
          border: "none",
          color: "#fff",
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          cursor: "pointer",
          fontSize: "18px",
        }}
      >
        ‹
      </button>
      <button
        onClick={next}
        aria-label="Next slide"
        style={{
          position: "absolute",
          right: "16px",
          top: "50%",
          transform: "translateY(-50%)",
          background: "rgba(255,255,255,0.2)",
          backdropFilter: "blur(4px)",
          border: "none",
          color: "#fff",
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          cursor: "pointer",
          fontSize: "18px",
        }}
      >
        ›
      </button>

      <div
        style={{
          position: "absolute",
          bottom: "24px",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: "8px",
        }}
      >
        {slides.map((_, i) => (
          <div
            key={i}
            onClick={() => setIndex(i)}
            style={{
              width: i === index ? "22px" : "7px",
              height: "7px",
              borderRadius: "999px",
              background: i === index ? "#fff" : "rgba(255,255,255,0.4)",
              cursor: "pointer",
              transition: "width 0.3s ease",
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div
      style={{
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
        <img
            src="/logo.png"
            alt="GoNortheast"
            style={{ height: "36px", width: "auto", display: "block" }}
          />

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
          <Link href="/destinations" onClick={() => setMenuOpen(false)} style={{ textDecoration: "none", color: colors.forest, fontSize: "14px", fontWeight: 600, padding: "12px 0", borderBottom: "1px solid rgba(47,74,62,0.08)" }}>
            Browse Homestays
          </Link>
          <Link href="/about" onClick={() => setMenuOpen(false)} style={{ textDecoration: "none", color: colors.forest, fontSize: "14px", fontWeight: 600, padding: "12px 0", borderBottom: "1px solid rgba(47,74,62,0.08)" }}>
            About
          </Link>
          <Link href="/contact" onClick={() => setMenuOpen(false)} style={{ textDecoration: "none", color: colors.forest, fontSize: "14px", fontWeight: 600, padding: "12px 0" }}>
            Contact
          </Link>
        </div>
      )}

      <HeroCarousel />

      {/* HOW IT WORKS */}
      <section style={{ maxWidth: "980px", margin: "0 auto", padding: "60px 24px 90px" }}>
        <h2
          style={{
            fontFamily: "Georgia, 'Iowan Old Style', serif",
            fontSize: "22px",
            fontWeight: 700,
            color: colors.forest,
            textAlign: "center",
            margin: "0 0 32px",
          }}
        >
          How It Works
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "28px",
          }}
        >
          {steps.map((step) => (
            <div key={step.number} style={{ textAlign: "left" }}>
              <div
                style={{
                  fontFamily: "Georgia, 'Iowan Old Style', serif",
                  fontSize: "34px",
                  fontWeight: 700,
                  color: colors.bamboo,
                  opacity: 0.6,
                  marginBottom: "10px",
                  lineHeight: 1,
                }}
              >
                {step.number}
              </div>
              <h3 style={{ fontSize: "16px", fontWeight: 700, color: colors.forest, margin: "0 0 8px" }}>
                {step.title}
              </h3>
              <p style={{ fontSize: "14px", lineHeight: 1.65, opacity: 0.8, margin: 0 }}>
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <footer
        style={{
          borderTop: `1px solid rgba(47, 74, 62, 0.12)`,
          padding: "28px 24px",
          textAlign: "center",
          fontSize: "13px",
          color: colors.sage,
        }}
      >
        © {new Date().getFullYear()} GooNortheast. Made with care for the hills.
      </footer>
    </div>
  );
}
