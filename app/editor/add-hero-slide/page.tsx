"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import AdminNav from "@/components/AdminNav";

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  marginBottom: "14px",
  fontSize: "14px",
  borderRadius: "10px",
  border: "1px solid #d1d5db",
  outline: "none",
  boxSizing: "border-box",
  fontFamily: "inherit",
};

const sectionStyle: React.CSSProperties = {
  background: "#ffffff",
  border: "1px solid #e5e7eb",
  borderRadius: "14px",
  padding: "24px",
  marginBottom: "20px",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "13px",
  fontWeight: 600,
  color: "#374151",
  marginBottom: "6px",
};

function uniqueFileName(file: File) {
  const ext = file.name.split(".").pop();
  const random = Math.random().toString(36).slice(2);
  return `${Date.now()}-${random}.${ext}`;
}

export default function AddHeroSlide() {
  const [saving, setSaving] = useState(false);
  const [caption, setCaption] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [sortOrder, setSortOrder] = useState("0");
  const [imageFile, setImageFile] = useState<File | null>(null);

  async function saveSlide() {
    if (!imageFile) {
      alert("Please select a photo for this slide.");
      return;
    }

    setSaving(true);

    try {
      const fileName = uniqueFileName(imageFile);

      const { error: uploadError } = await supabase.storage
        .from("Homestay")
        .upload(fileName, imageFile);

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from("Homestay")
        .getPublicUrl(fileName);

      const { error: insertError } = await supabase.from("hero_slides").insert([
        {
          image_url: publicUrlData.publicUrl,
          caption,
          link_url: linkUrl || null,
          sort_order: parseInt(sortOrder) || 0,
        },
      ]);

      if (insertError) throw insertError;

      alert("Slide added successfully!");
      setCaption("");
      setLinkUrl("");
      setSortOrder("0");
      setImageFile(null);
    } catch (err: any) {
      alert(err.message || "Something went wrong while saving.");
    } finally {
      setSaving(false);
    }
  }

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
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <h1 style={{ margin: 0, fontSize: "18px", fontWeight: 600 }}>
          GooNortheast Admin
        </h1>
      </header>

      <AdminNav />

      <main style={{ maxWidth: "700px", margin: "0 auto", padding: "40px 16px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: 700, margin: "0 0 4px" }}>
          Add Hero Slide
        </h1>
        <p style={{ margin: "0 0 24px", color: "#6b7280", fontSize: "14px" }}>
          Adds a new photo to the home page's swipeable banner.
        </p>

        <section style={sectionStyle}>
          <label style={labelStyle}>Photo</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                setImageFile(e.target.files[0]);
              }
            }}
            style={{ marginBottom: "16px" }}
          />
          {imageFile && (
            <p style={{ fontSize: "13px", color: "#2563eb", margin: "0 0 16px" }}>
              Selected: <strong>{imageFile.name}</strong>
            </p>
          )}

          <label style={labelStyle}>Caption</label>
          <input
            type="text"
            placeholder="e.g. Homestays run by real families"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            style={inputStyle}
          />

          <label style={labelStyle}>Link (optional — where tapping the slide's button goes)</label>
          <input
            type="text"
            placeholder="/destinations"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            style={inputStyle}
          />

          <label style={labelStyle}>Order (lower numbers show first)</label>
          <input
            type="number"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            style={{ ...inputStyle, marginBottom: 0 }}
          />
        </section>

        <button
          onClick={saveSlide}
          disabled={saving}
          style={{
            width: "100%",
            padding: "15px",
            fontSize: "15px",
            fontWeight: 600,
            color: "#ffffff",
            background: saving ? "#93c5fd" : "#2563eb",
            border: "none",
            borderRadius: "10px",
            cursor: saving ? "not-allowed" : "pointer",
          }}
        >
          {saving ? "Saving..." : "Save Slide"}
        </button>
      </main>
    </div>
  );
}
