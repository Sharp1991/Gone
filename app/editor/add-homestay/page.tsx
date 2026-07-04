"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

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

const textareaStyle: React.CSSProperties = {
  ...inputStyle,
  resize: "vertical",
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

export default function AddHomestay() {
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [destination, setDestination] = useState("");
  const [location, setLocation] = useState("");

  const [description, setDescription] = useState("");
  const [aboutHost, setAboutHost] = useState("");
  const [aboutArea, setAboutArea] = useState("");
  const [nearbyAttractions, setNearbyAttractions] = useState("");
  const [guestExperiences, setGuestExperiences] = useState("");

  const [hostName, setHostName] = useState("");
  const [contact, setContact] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [googleMaps, setGoogleMaps] = useState("");

  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [gallery, setGallery] = useState<File[]>([]);

  async function saveHomestay() {
    setLoading(true);

    const { error } = await supabase.from("properties").insert([
      {
        title,
        destination,
        location,
        description,
        about_host: aboutHost,
        about_area: aboutArea,
        nearby_attractions: nearbyAttractions,
        guest_experiences: guestExperiences,
        host_name: hostName,
        contact,
        whatsapp,
        google_maps: googleMaps,
      },
    ]);

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Homestay added successfully!");
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f4f6f8",
        fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif",
        color: "#111827",
        padding: "40px 16px",
      }}
    >
      <main style={{ maxWidth: "700px", margin: "0 auto" }}>
        <h1
          style={{
            fontSize: "24px",
            fontWeight: 700,
            margin: "0 0 4px",
          }}
        >
          Add Homestay
        </h1>
        <p style={{ margin: "0 0 24px", color: "#6b7280", fontSize: "14px" }}>
          Fill in the details below to list a new property.
        </p>

        {/* BASIC INFO */}
        <section style={sectionStyle}>
          <h2 style={{ margin: "0 0 16px", fontSize: "16px", fontWeight: 600 }}>
            Basic Information
          </h2>

          <label style={labelStyle}>Homestay Name</label>
          <input
            type="text"
            placeholder="e.g. Riverside Cottage"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={inputStyle}
          />

          <label style={labelStyle}>Destination</label>
          <input
            type="text"
            placeholder="e.g. Shillong"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            style={inputStyle}
          />

          <label style={labelStyle}>Locality</label>
          <input
            type="text"
            placeholder="e.g. Laitumkhrah"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            style={inputStyle}
          />

          <label style={labelStyle}>Google Maps Link</label>
          <input
            type="text"
            placeholder="https://maps.google.com/..."
            value={googleMaps}
            onChange={(e) => setGoogleMaps(e.target.value)}
            style={{ ...inputStyle, marginBottom: 0 }}
          />
        </section>

        {/* ABOUT */}
        <section style={sectionStyle}>
          <h2 style={{ margin: "0 0 16px", fontSize: "16px", fontWeight: 600 }}>
            About
          </h2>

          <label style={labelStyle}>About the Homestay</label>
          <textarea
            placeholder="Describe the property..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            style={textareaStyle}
          />

          <label style={labelStyle}>About the Host</label>
          <textarea
            placeholder="Tell guests about the host..."
            value={aboutHost}
            onChange={(e) => setAboutHost(e.target.value)}
            rows={4}
            style={textareaStyle}
          />

          <label style={labelStyle}>About the Area</label>
          <textarea
            placeholder="Describe the surrounding area..."
            value={aboutArea}
            onChange={(e) => setAboutArea(e.target.value)}
            rows={4}
            style={textareaStyle}
          />

          <label style={labelStyle}>Nearby Attractions</label>
          <textarea
            placeholder="List nearby places worth visiting..."
            value={nearbyAttractions}
            onChange={(e) => setNearbyAttractions(e.target.value)}
            rows={3}
            style={textareaStyle}
          />

          <label style={labelStyle}>Guest Experiences</label>
          <textarea
            placeholder="Share past guest experiences..."
            value={guestExperiences}
            onChange={(e) => setGuestExperiences(e.target.value)}
            rows={3}
            style={{ ...textareaStyle, marginBottom: 0 }}
          />
        </section>

        {/* CONTACT */}
        <section style={sectionStyle}>
          <h2 style={{ margin: "0 0 16px", fontSize: "16px", fontWeight: 600 }}>
            Contact
          </h2>

          <label style={labelStyle}>Host Name</label>
          <input
            type="text"
            placeholder="Full name"
            value={hostName}
            onChange={(e) => setHostName(e.target.value)}
            style={inputStyle}
          />

          <label style={labelStyle}>Phone Number</label>
          <input
            type="text"
            placeholder="+91..."
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            style={inputStyle}
          />

          <label style={labelStyle}>WhatsApp Number</label>
          <input
            type="text"
            placeholder="+91..."
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            style={{ ...inputStyle, marginBottom: 0 }}
          />
        </section>

        {/* PHOTOS */}
        <section style={sectionStyle}>
          <h2 style={{ margin: "0 0 16px", fontSize: "16px", fontWeight: 600 }}>
            Photos
          </h2>

          <label style={labelStyle}>Thumbnail Photo</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                setThumbnail(e.target.files[0]);
              }
            }}
            style={{ marginBottom: "8px" }}
          />
          {thumbnail && (
            <p style={{ fontSize: "13px", color: "#374151", margin: "0 0 16px" }}>
              Selected: <strong>{thumbnail.name}</strong>
            </p>
          )}

          <hr style={{ border: "none", borderTop: "1px solid #e5e7eb", margin: "16px 0" }} />

          <label style={labelStyle}>Gallery Photos</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => {
              if (e.target.files) {
                setGallery(Array.from(e.target.files));
              }
            }}
            style={{ marginBottom: "8px" }}
          />
          {gallery.length > 0 && (
            <div style={{ fontSize: "13px", color: "#374151" }}>
              <strong>{gallery.length} photo(s) selected</strong>
              <ul style={{ margin: "6px 0 0", paddingLeft: "18px" }}>
                {gallery.map((photo, index) => (
                  <li key={index}>{photo.name}</li>
                ))}
              </ul>
            </div>
          )}
        </section>

        <button
          onClick={saveHomestay}
          disabled={loading}
          style={{
            width: "100%",
            padding: "15px",
            fontSize: "15px",
            fontWeight: 600,
            color: "#ffffff",
            background: loading ? "#93c5fd" : "#2563eb",
            border: "none",
            borderRadius: "10px",
            cursor: loading ? "not-allowed" : "pointer",
            transition: "background 0.15s ease",
          }}
        >
          {loading ? "Saving..." : "Save Homestay"}
        </button>
      </main>
    </div>
  );
}
