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

type PlaceEntry = {
  name: string;
  maps_link: string;
  imageFile: File | null;
};

function slugify(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function uniqueFileName(file: File) {
  const ext = file.name.split(".").pop();
  const random = Math.random().toString(36).slice(2);
  return `${Date.now()}-${random}.${ext}`;
}

function PlaceEntryList({
  title,
  entries,
  setEntries,
}: {
  title: string;
  entries: PlaceEntry[];
  setEntries: (entries: PlaceEntry[]) => void;
}) {
  function updateEntry(index: number, field: keyof PlaceEntry, value: any) {
    const updated = [...entries];
    updated[index] = { ...updated[index], [field]: value };
    setEntries(updated);
  }

  function addEntry() {
    setEntries([...entries, { name: "", maps_link: "", imageFile: null }]);
  }

  function removeEntry(index: number) {
    setEntries(entries.filter((_, i) => i !== index));
  }

  return (
    <div style={{ marginBottom: "20px" }}>
      <label style={labelStyle}>{title}</label>

      {entries.map((entry, index) => (
        <div
          key={index}
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: "10px",
            padding: "12px",
            marginBottom: "10px",
          }}
        >
          <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
            <input
              type="text"
              placeholder="Name (e.g. Elephant Falls)"
              value={entry.name}
              onChange={(e) => updateEntry(index, "name", e.target.value)}
              style={{ ...inputStyle, marginBottom: 0, flex: 1 }}
            />
            <input
              type="text"
              placeholder="Google Maps link"
              value={entry.maps_link}
              onChange={(e) => updateEntry(index, "maps_link", e.target.value)}
              style={{ ...inputStyle, marginBottom: 0, flex: 1 }}
            />
            <button
              onClick={() => removeEntry(index)}
              style={{
                background: "#fef2f2",
                color: "#dc2626",
                border: "1px solid #fecaca",
                borderRadius: "8px",
                padding: "10px 12px",
                cursor: "pointer",
                fontSize: "13px",
              }}
            >
              ✕
            </button>
          </div>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                updateEntry(index, "imageFile", e.target.files[0]);
              }
            }}
            style={{ fontSize: "12px" }}
          />
          {entry.imageFile && (
            <p style={{ fontSize: "12px", color: "#2563eb", margin: "6px 0 0" }}>
              Selected: {entry.imageFile.name}
            </p>
          )}
        </div>
      ))}

      <button
        onClick={addEntry}
        style={{
          background: "#f3f4f6",
          color: "#111827",
          border: "1px solid #e5e7eb",
          borderRadius: "8px",
          padding: "8px 14px",
          cursor: "pointer",
          fontSize: "13px",
          fontWeight: 600,
        }}
      >
        + Add {title.slice(0, -1)}
      </button>
    </div>
  );
}

export default function AddDestination() {
  const [saving, setSaving] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");

  const [name, setName] = useState("");
  const [distanceFromCapital, setDistanceFromCapital] = useState("");
  const [description, setDescription] = useState("");

  const [attractions, setAttractions] = useState<PlaceEntry[]>([]);
  const [activities, setActivities] = useState<PlaceEntry[]>([]);
  const [restaurants, setRestaurants] = useState<PlaceEntry[]>([]);

  async function saveDestination() {
    if (!name.trim()) {
      alert("Destination name is required.");
      return;
    }

    setSaving(true);

    try {
      const slug = slugify(name);

      const { data: destination, error: destinationError } = await supabase
        .from("destinations")
        .insert([
          {
            slug,
            name,
            distance_from_capital: distanceFromCapital,
            description,
          },
        ])
        .select()
        .single();

      if (destinationError) throw destinationError;

      const destinationId = destination.id;

      const allPlaces = [
        ...attractions
          .filter((p) => p.name.trim())
          .map((p) => ({ ...p, category: "attraction" })),
        ...activities
          .filter((p) => p.name.trim())
          .map((p) => ({ ...p, category: "activity" })),
        ...restaurants
          .filter((p) => p.name.trim())
          .map((p) => ({ ...p, category: "restaurant" })),
      ];

      if (allPlaces.length > 0) {
        setUploadStatus(`Uploading ${allPlaces.length} place photo(s)...`);

        const placesToInsert = [];

        for (const p of allPlaces) {
          let imageUrl: string | null = null;

          if (p.imageFile) {
            const fileName = uniqueFileName(p.imageFile);

            const { error: uploadError } = await supabase.storage
              .from("Homestay")
              .upload(fileName, p.imageFile);

            if (uploadError) throw uploadError;

            const { data: publicUrlData } = supabase.storage
              .from("Homestay")
              .getPublicUrl(fileName);

            imageUrl = publicUrlData.publicUrl;
          }

          placesToInsert.push({
            destination_id: destinationId,
            category: p.category,
            name: p.name,
            maps_link: p.maps_link,
            image_url: imageUrl,
          });
        }

        const { error: placesError } = await supabase
          .from("destination_places")
          .insert(placesToInsert);

        if (placesError) throw placesError;
      }

      alert("Destination added successfully!");

      setName("");
      setDistanceFromCapital("");
      setDescription("");
      setAttractions([]);
      setActivities([]);
      setRestaurants([]);
    } catch (err: any) {
      alert(err.message || "Something went wrong while saving.");
    } finally {
      setSaving(false);
      setUploadStatus("");
    }
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
          Add Destination
        </h1>
        <p style={{ margin: "0 0 24px", color: "#6b7280", fontSize: "14px" }}>
          Add general info about an area, shared by all its homestays.
        </p>

        <section style={sectionStyle}>
          <h2 style={{ margin: "0 0 16px", fontSize: "16px", fontWeight: 600 }}>
            Basic Information
          </h2>

          <label style={labelStyle}>Destination Name</label>
          <input
            type="text"
            placeholder="e.g. Shillong"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={inputStyle}
          />

          <label style={labelStyle}>Distance from Capital</label>
          <input
            type="text"
            placeholder="e.g. 3 hrs from Guwahati Airport"
            value={distanceFromCapital}
            onChange={(e) => setDistanceFromCapital(e.target.value)}
            style={inputStyle}
          />

          <label style={labelStyle}>Description</label>
          <textarea
            placeholder="General intro about this destination..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            style={{ ...textareaStyle, marginBottom: 0 }}
          />
        </section>

        <section style={sectionStyle}>
          <h2 style={{ margin: "0 0 16px", fontSize: "16px", fontWeight: 600 }}>
            Places (optional — leave blank to skip a category)
          </h2>

          <PlaceEntryList
            title="Attractions"
            entries={attractions}
            setEntries={setAttractions}
          />
          <PlaceEntryList
            title="Activities"
            entries={activities}
            setEntries={setActivities}
          />
          <PlaceEntryList
            title="Restaurants"
            entries={restaurants}
            setEntries={setRestaurants}
          />
        </section>

        <button
          onClick={saveDestination}
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
          {saving ? uploadStatus || "Saving..." : "Save Destination"}
        </button>
      </main>
    </div>
  );
}
