import Link from "next/link";

const colors = {
  forest: "#2F4A3E",
  ink: "#1B2B22",
  mist: "#F1F4F1",
  sage: "#8B9A93",
  bamboo: "#B99A5B",
  river: "#4A7C82",
};

export default function HomePage() {
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
          zIndex: 10,
          background: "rgba(241, 244, 241, 0.92)",
          backdropFilter: "blur(6px)",
          borderBottom: `1px solid rgba(47, 74, 62, 0.12)`,
          padding: "16px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
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

        <Link href="/homestay" style={{ textDecoration: "none" }}>
          <button
            style={{
              background: colors.forest,
              color: colors.mist,
              border: "none",
              padding: "10px 18px",
              borderRadius: "999px",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
              letterSpacing: "0.02em",
            }}
          >
            Browse Homestays
          </button>
        </Link>
      </header>

      {/* HERO */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          padding: "100px 24px 90px",
          textAlign: "center",
        }}
      >
        {/* Topographic contour-line motif, evoking the hills */}
        <svg
          aria-hidden="true"
          viewBox="0 0 800 400"
          style={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "140%",
            maxWidth: "1200px",
            opacity: 0.16,
            pointerEvents: "none",
          }}
        >
          <path
            d="M0 320 Q 100 260 200 300 T 400 280 T 600 310 T 800 270"
            fill="none"
            stroke={colors.forest}
            strokeWidth="2"
          />
          <path
            d="M0 350 Q 100 300 200 335 T 400 320 T 600 345 T 800 310"
            fill="none"
            stroke={colors.forest}
            strokeWidth="2"
          />
          <path
            d="M0 380 Q 100 345 200 370 T 400 360 T 600 380 T 800 350"
            fill="none"
            stroke={colors.forest}
            strokeWidth="2"
          />
          <path
            d="M0 290 Q 100 220 200 265 T 400 240 T 600 275 T 800 225"
            fill="none"
            stroke={colors.bamboo}
            strokeWidth="2"
          />
        </svg>

        <p
          style={{
            position: "relative",
            fontSize: "13px",
            fontWeight: 600,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: colors.river,
            margin: "0 0 18px",
          }}
        >
          Northeast India, one homestay at a time
        </p>

        <h1
          style={{
            position: "relative",
            fontFamily: "Georgia, 'Iowan Old Style', serif",
            fontSize: "clamp(32px, 5vw, 52px)",
            lineHeight: 1.15,
            fontWeight: 700,
            margin: "0 auto 20px",
            maxWidth: "720px",
            color: colors.forest,
          }}
        >
          Homestays woven into the hills, mist, and villages of the Northeast
        </h1>

        <p
          style={{
            position: "relative",
            fontSize: "16px",
            lineHeight: 1.6,
            color: colors.ink,
            maxWidth: "560px",
            margin: "0 auto 34px",
            opacity: 0.85,
          }}
        >
          GooNortheast connects travelers with real homes and real hosts across
          Meghalaya and beyond — places you won't find in a hotel directory,
          run by families who know every trail, waterfall, and root bridge
          nearby.
        </p>

        <Link href="/homestay" style={{ textDecoration: "none" }}>
          <button
            style={{
              position: "relative",
              background: colors.forest,
              color: colors.mist,
              border: "none",
              padding: "14px 28px",
              borderRadius: "999px",
              fontSize: "15px",
              fontWeight: 600,
              cursor: "pointer",
              letterSpacing: "0.02em",
            }}
          >
            Explore Homestays →
          </button>
        </Link>
      </section>

      {/* AIM */}
      <section
        style={{
          maxWidth: "760px",
          margin: "0 auto",
          padding: "10px 24px 70px",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontFamily: "Georgia, 'Iowan Old Style', serif",
            fontSize: "26px",
            fontWeight: 700,
            color: colors.forest,
            margin: "0 0 14px",
          }}
        >
          Why we exist
        </h2>
        <p style={{ fontSize: "15px", lineHeight: 1.7, opacity: 0.85, margin: 0 }}>
          Too much of the Northeast's warmth lives in homes that never make it
          onto a map. We built GooNortheast to change that — a simple way to
          find homestays run by the people who actually live there, so your
          trip supports local families first, not just another booking
          platform.
        </p>
      </section>

      {/* HIGHLIGHTS */}
      <section
        style={{
          maxWidth: "980px",
          margin: "0 auto",
          padding: "0 24px 90px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "28px",
        }}
      >
        {[
          {
            title: "Real Hosts",
            body: "Every listing is run by a local family, not a management company.",
          },
          {
            title: "Hidden Corners",
            body: "From root bridges to quiet ridge villages, off the usual tourist trail.",
          },
          {
            title: "Living Culture",
            body: "Stay somewhere that shares food, stories, and daily life, not just a room.",
          },
        ].map((item) => (
          <div
            key={item.title}
            style={{
              background: "#ffffff",
              border: `1px solid rgba(47, 74, 62, 0.12)`,
              borderRadius: "16px",
              padding: "26px 22px",
              textAlign: "left",
            }}
          >
            <div
              style={{
                width: "34px",
                height: "3px",
                background: colors.bamboo,
                marginBottom: "14px",
              }}
            />
            <h3
              style={{
                fontSize: "16px",
                fontWeight: 700,
                color: colors.forest,
                margin: "0 0 8px",
              }}
            >
              {item.title}
            </h3>
            <p style={{ fontSize: "14px", lineHeight: 1.6, opacity: 0.8, margin: 0 }}>
              {item.body}
            </p>
          </div>
        ))}
      </section>

      {/* FOOTER */}
      <footer
        style={{
          borderTop: `1px solid rgba(47, 74, 62, 0.12)`,
          padding: "28px 24px",
          textAlign: "center",
          fontSize: "13px",
          color: colors.sage,
        }}
      >
        © {new Date().getFullYear()} GooNortheast. Made with care for the
        hills.
      </footer>
    </div>
  );
}
