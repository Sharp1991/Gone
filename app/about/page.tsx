import Link from "next/link";

const colors = {
  forest: "#2F4A3E",
  ink: "#1B2B22",
  mist: "#F1F4F1",
  sage: "#8B9A93",
  river: "#4A7C82",
};

export default function About() {
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
            }}
          >
            Browse Homestays
          </button>
        </Link>
      </header>

      <main style={{ maxWidth: "700px", margin: "0 auto", padding: "56px 24px 80px" }}>
        <h1
          style={{
            fontFamily: "Georgia, 'Iowan Old Style', serif",
            fontSize: "clamp(28px, 4vw, 38px)",
            fontWeight: 700,
            color: colors.forest,
            margin: "0 0 20px",
          }}
        >
          About GooNortheast
        </h1>
        <p style={{ fontSize: "16px", lineHeight: 1.75, opacity: 0.85, margin: 0 }}>
          GooNortheast is a curated platform dedicated to uncovering the
          hidden homestays, stories, and experiences of Meghalaya.
        </p>
      </main>
    </div>
  );
}
