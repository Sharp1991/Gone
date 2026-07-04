"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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

export default function EditHomestay() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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
  const [youtubeLink, setYoutubeLink] = useState("");

  useEffect(() => {
    if (id) fetchProperty();
  }, [id]);

  async function fetchProperty() {
    setLoading(true);

    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    if (data) {
      setTitle(data.title || "");
      setDestination(data.destination || "");
      setLocation(data.location || "");
      setDescription(data.description || "");
      setAboutHost(data.about_host || "");
      setAboutArea(data.about_area || "");
      setNearbyAttractions(data.nearby_attractions || "");
      setGuestExperiences(data.guest_experiences || "");
      setHostName(data.host_name || "");
      setContact(data.contact || "");
      setWhatsapp(data.whatsapp || "");
      setGoogleMaps(data.google_maps || "");
      setYoutubeLink(data.youtube_link || "");
    }

    setLoading(false);
  }

  async function updateHomestay() {
    setSaving(true);

    const { error } = await supabase
      .from("properties")
      .update({
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
        youtube_link: youtubeLink,
      })
      .eq("id", id);

    setSaving(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Homestay updated successfully!");
    router.push("/editor/dashboard");
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
          color: "#6b7280",
        }}
      >
        Loading homestay details...
      </div>
    );
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
        <h1 style={{ fontSize: "24px", fontWeight: 700, margin: "0 0 4px" }}>
          Edit Homestay
        </h1>
        <p style={{ margin: "0 0 24px", color: "#6b7280", fontSize: "14px" }}>
          Update the details below and save your changes.
        </p>

        {/* BASIC INFO */}
        <section style={sectionStyle}>
          <h2 style={{ margin: "0 0 16px", fontSize: "16px", fontWeight: 600 }}>
            Basic Information
          </h2>

          <label style={labelStyle}>Homestay Name</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={inputStyle}
          />

          <label style={labelStyle}>Destination</label>
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            style={inputStyle}
          />

          <label style={labelStyle}>Locality</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            style={inputStyle}
          />

          <label style={labelStyle}>Google Maps Link</label>
          <input
            type="text"
            value={googleMaps}
            onChange={(e) => setGoogleMaps(e.target.value)}
            style={inputStyle}
          />

          <label style={labelStyle}>YouTube Video Link (optional)</label>
          <input
            type="text"
            placeholder="https://youtube.com/watch?v=..."
            value={youtubeLink}
            onChange={(e) => setYoutubeLink(e.target.value)}
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
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            style={textareaStyle}
          />

          <label style={labelStyle}>About the Host</label>
          <textarea
            value={aboutHost}
            onChange={(e) => setAboutHost(e.target.value)}
            rows={4}
            style={textareaStyle}
          />

          <label style={labelStyle}>About the Area</label>
          <textarea
            value={aboutArea}
            onChange={(e) => setAboutArea(e.target.value)}
            rows={4}
            style={textareaStyle}
          />

          <label style={labelStyle}>Nearby Attractions</label>
          <textarea
            value={nearbyAttractions}
            onChange={(e) => setNearbyAttractions(e.target.value)}
            rows={3}
            style={textareaStyle}
          />

          <label style={labelStyle}>Guest Experiences</label>
          <textarea
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
            value={hostName}
            onChange={(e) => setHostName(e.target.value)}
            style={inputStyle}
          />

          <label style={labelStyle}>Phone Number</label>
          <input
            type="text"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            style={inputStyle}
          />

          <label style={labelStyle}>WhatsApp Number</label>
          <input
            type="text"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            style={{ ...inputStyle, marginBottom: 0 }}
          />
        </section>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={() => router.push("/editor/dashboard")}
            style={{
              flex: 1,
              padding: "15px",
              fontSize: "15px",
              fontWeight: 600,
              color: "#111827",
              background: "#f3f4f6",
              border: "1px solid #e5e7eb",
              borderRadius: "10px",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>

          <button
            onClick={updateHomestay}
            disabled={saving}
            style={{
              flex: 2,
              padding: "15px",
              fontSize: "15px",
              fontWeight: 600,
              color: "#ffffff",
              background: saving ? "#93c5fd" : "#2563eb",
              border: "none",
              borderRadius: "10px",
              cursor: saving ? "not-allowed" : "pointer",
              transition: "background 0.15s ease",
            }}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </main>
    </div>
  );
}
