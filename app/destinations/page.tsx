import { useState } from "react";

const colors = {
  forest: "#2F4A3E",
  ink: "#1B2B22",
  mist: "#F1F4F1",
  sage: "#8B9A93",
  river: "#4A7C82",
  bamboo: "#B99A5B",
};

const sampleDestinations = [
  { id: "1", slug: "shillong", name: "Shillong", distance_from_capital: "3 hrs from Guwahati Airport", description: "Meghalaya's capital — pine forests, waterfalls, and lively local culture.", cover_photo: null },
  { id: "2", slug: "umiam", name: "Umiam", distance_from_capital: "40 min from Shillong", description: "A vast lake ringed by hills, popular for boating and quiet lakeside stays.", cover_photo: null },
  { id: "3", slug: "dawki", name: "Dawki", distance_from_capital: "5 hrs from Guwahati Airport", description: "Home to the crystal-clear Umngot river, boats seem to float on air.", cover_photo: null },
  { id: "4", slug: "sohra", name: "Sohra", distance_from_capital: "1.5 hrs from Shillong", description: "Root bridges, waterfalls, and some of the wettest hills on Earth.", cover_photo: null },
];

function placeholderImageFor(slug) {
  return `https://picsum.photos/seed/${slug}-destination/600/400`;
}

export default function DestinationsOverviewPreview() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div style={{ minHeight: "100vh", fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif", color: colors.ink, background: colors.mist }}>
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
        <span style={{ fontSize: "17px", fontWeight: 700, letterSpacing: "0.02em", color: colors.forest }}>
          GooNortheast
        </span>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
          style={{ background: "transparent", border: "none", cursor: "pointer", padding: "6px", display: "flex", flexDirection: "column", gap: "4px" }}
        >
          <span style={{ width: "22px", height: "2px", background: colors.forest, display: "block" }} />
          <span style={{ width: "22px", height: "2px", background: colors.forest, display: "block" }} />
          <span style={{ width: "22px", height: "2px", background: colors.forest, display: "block" }} />
        </button>
      </header>

      {menuOpen && (
        <div style={{ position: "sticky", top: "57px", zIndex: 19, background: "#ffffff", borderBottom: `1px solid rgba(47, 74, 62, 0.12)`, display: "flex", flexDirection: "column", padding: "10px 24px" }}>
          {["Browse Homestays", "About", "Contact"].map((item) => (
            <a key={item} href="#" style={{ textDecoration: "none", color: colors.forest, fontSize: "14px", fontWeight: 600, padding: "12px 0", borderBottom: "1px solid rgba(47,74,62,0.08)" }}>
              {item}
            </a>
          ))}
        </div>
      )}

      <section style={{ maxWidth: "760px", margin: "0 auto", padding: "50px 24px 20px", textAlign: "center" }}>
        <h1 style={{ fontFamily: "Georgia, 'Iowan Old Style', serif", fontSize: "clamp(28px, 4vw, 38px)", fontWeight: 700, color: colors.forest, margin: "0 0 12px" }}>
          Where would you like to go?
        </h1>
        <p style={{ fontSize: "15px", lineHeight: 1.6, opacity: 0.8, margin: 0 }}>
          Pick a destination to see what's there and the homestays nearby.
        </p>
      </section>

      <main style={{ maxWidth: "1000px", margin: "0 auto", padding: "20px 24px 90px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "24px" }}>
        {sampleDestinations.map((dest) => (
          <a
            key={dest.id}
            href="#"
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
            <img src={placeholderImageFor(dest.slug)} alt={dest.name} style={{ width: "100%", height: "170px", objectFit: "cover", display: "block" }} />
            <div style={{ padding: "18px 20px" }}>
              <h2 style={{ fontSize: "17px", fontWeight: 700, color: colors.forest, margin: "0 0 4px" }}>{dest.name}</h2>
              <p style={{ fontSize: "12px", fontWeight: 600, color: colors.bamboo, margin: "0 0 10px" }}>🚗 {dest.distance_from_capital}</p>
              <p style={{ fontSize: "13px", lineHeight: 1.6, opacity: 0.75, margin: 0, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                {dest.description}
              </p>
            </div>
          </a>
        ))}
      </main>

      <style>{`
        .destination-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 32px rgba(47, 74, 62, 0.15);
        }
      `}</style>
    </div>
  );
}
