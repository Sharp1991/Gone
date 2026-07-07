import Link from "next/link";

const sections = [
  {
    title: "Homestays",
    description: "View, add, edit, and delete homestay listings.",
    href: "/editor/dashboard",
    icon: "🏡",
  },
  {
    title: "Destinations",
    description: "Manage areas, attractions, activities, and restaurants.",
    href: "/editor/destinations",
    icon: "📍",
  },
  {
    title: "Hero Slides",
    description: "Manage the home page's swipeable banner photos.",
    href: "/editor/hero-slides",
    icon: "🖼️",
  },
];

export default function EditorHome() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f4f6f8",
        fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif",
        color: "#111827",
      }}
    >
      <header
        style={{
          background: "#ffffff",
          borderBottom: "1px solid #e5e7eb",
          padding: "14px 22px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <h1 style={{ margin: 0, fontSize: "18px", fontWeight: 600 }}>
          GooNortheast Admin
        </h1>
        <Link href="/" style={{ fontSize: "13px", color: "#6b7280", textDecoration: "none" }}>
          ← Back to site
        </Link>
      </header>

      <main style={{ maxWidth: "800px", margin: "30px auto", padding: "0 16px" }}>
        <p style={{ color: "#6b7280", fontSize: "14px", margin: "0 0 24px" }}>
          Choose what you'd like to manage.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {sections.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              style={{
                textDecoration: "none",
                color: "inherit",
                background: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: "14px",
                padding: "20px 22px",
                display: "flex",
                alignItems: "center",
                gap: "16px",
              }}
            >
              <span style={{ fontSize: "28px" }}>{section.icon}</span>
              <div>
                <div style={{ fontSize: "16px", fontWeight: 700 }}>{section.title}</div>
                <div style={{ fontSize: "13px", color: "#6b7280", marginTop: "2px" }}>
                  {section.description}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
