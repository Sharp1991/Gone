"use client";

import { useEffect, useState } from "react";
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

const smallButtonStyle: React.CSSProperties = {
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  padding: "6px 12px",
  cursor: "pointer",
  fontSize: "12px",
  fontWeight: 600,
  background: "#f9fafb",
  color: "#111827",
};

type Destination = {
  id: string;
  slug: string;
  name: string;
  distance_from_capital: string | null;
  description: string | null;
};

type ExistingPlace = {
  id: string;
  category: "attraction" | "activity" | "restaurant";
  name: string;
  description: string | null;
  maps_link: string | null;
  image_url: string | null;
};

type NewPlaceEntry = {
  name: string;
  maps_link: string;
  description: string;
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

async function uploadPlaceImage(file: File): Promise<string> {
  const fileName = uniqueFileName(file);
  const { error } = await supabase.storage.from("Homestay").upload(fileName, file);
  if (error) throw error;
  const { data } = supabase.storage.from("Homestay").getPublicUrl(fileName);
  return data.publicUrl;
}

// ---------- Existing place row (view + inline edit) ----------

function ExistingPlaceRow({
  place,
  onSaved,
  onDeleted,
}: {
  place: ExistingPlace;
  onSaved: (updated: ExistingPlace) => void;
  onDeleted: (id: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState(place.name);
  const [description, setDescription] = useState(place.description || "");
  const [mapsLink, setMapsLink] = useState(place.maps_link || "");
  const [imageFile, setImageFile] = useState<File | null>(null);

  function cancelEdit() {
    setName(place.name);
    setDescription(place.description || "");
    setMapsLink(place.maps_link || "");
    setImageFile(null);
    setEditing(false);
  }

  async function saveEdit() {
    setSaving(true);
    try {
      let imageUrl = place.image_url;
      if (imageFile) {
        imageUrl = await uploadPlaceImage(imageFile);
      }

      const { error } = await supabase
        .from("destination_places")
        .update({
          name,
          description: description || null,
          maps_link: mapsLink || null,
          image_url: imageUrl,
        })
        .eq("id", place.id);

      if (error) throw error;

      onSaved({ ...place, name, description: description || null, maps_link: mapsLink || null, image_url: imageUrl });
      setEditing(false);
    } catch (err: any) {
      alert(err.message || "Couldn't save that change.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm(`Remove "${place.name}"?`)) return;
    const { error } = await supabase.from("destination_places").delete().eq("id", place.id);
    if (error) {
      alert(error.message);
      return;
    }
    onDeleted(place.id);
  }

  if (!editing) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          border: "1px solid #e5e7eb",
          borderRadius: "10px",
          padding: "10px 12px",
          marginBottom: "8px",
        }}
      >
        <div
          style={{
            width: "44px",
            height: "44px",
            borderRadius: "8px",
            overflow: "hidden",
            flexShrink: 0,
            background: "#f3f4f6",
          }}
        >
          {place.image_url && (
            <img src={place.image_url} alt={place.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          )}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ margin: 0, fontSize: "13px", fontWeight: 600, color: "#111827" }}>{place.name}</p>
          <p
            style={{
              margin: 0,
              fontSize: "12px",
              color: place.description ? "#6b7280" : "#d97706",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {place.description || "No description yet"}
          </p>
        </div>
        <button onClick={() => setEditing(true)} style={smallButtonStyle}>
          Edit
        </button>
        <button
          onClick={handleDelete}
          style={{ ...smallButtonStyle, background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca" }}
        >
          Delete
        </button>
      </div>
    );
  }

  return (
    <div style={{ border: "1px solid #93c5fd", borderRadius: "10px", padding: "12px", marginBottom: "8px", background: "#eff6ff" }}>
      <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          style={{ ...inputStyle, marginBottom: 0, flex: 1 }}
        />
        <input
          type="text"
          value={mapsLink}
          onChange={(e) => setMapsLink(e.target.value)}
          placeholder="Google Maps link"
          style={{ ...inputStyle, marginBottom: 0, flex: 1 }}
        />
      </div>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Short description (1-2 sentences)"
        rows={2}
        style={{ ...textareaStyle, marginBottom: "8px", fontSize: "13px" }}
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => e.target.files?.[0] && setImageFile(e.target.files[0])}
        style={{ fontSize: "12px", marginBottom: "10px", display: "block" }}
      />
      {imageFile && <p style={{ fontSize: "12px", color: "#2563eb", margin: "0 0 10px" }}>New photo selected: {imageFile.name}</p>}

      <div style={{ display: "flex", gap: "8px" }}>
        <button
          onClick={saveEdit}
          disabled={saving}
          style={{ ...smallButtonStyle, background: "#2563eb", color: "#ffffff", border: "none" }}
        >
          {saving ? "Saving..." : "Save"}
        </button>
        <button onClick={cancelEdit} disabled={saving} style={smallButtonStyle}>
          Cancel
        </button>
      </div>
    </div>
  );
}

// ---------- New place entry form (for adding places) ----------

function NewPlaceEntryList({
  title,
  entries,
  setEntries,
}: {
  title: string;
  entries: NewPlaceEntry[];
  setEntries: (entries: NewPlaceEntry[]) => void;
}) {
  function updateEntry(index: number, field: keyof NewPlaceEntry, value: any) {
    const updated = [...entries];
    updated[index] = { ...updated[index], [field]: value };
    setEntries(updated);
  }

  function addEntry() {
    setEntries([...entries, { name: "", maps_link: "", description: "", imageFile: null }]);
  }

  function removeEntry(index: number) {
    setEntries(entries.filter((_, i) => i !== index));
  }

  return (
    <div style={{ marginBottom: "20px" }}>
      <label style={labelStyle}>{title}</label>

      {entries.map((entry, index) => (
        <div key={index} style={{ border: "1px solid #e5e7eb", borderRadius: "10px", padding: "12px", marginBottom: "10px" }}>
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
              style={{ background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca", borderRadius: "8px", padding: "10px 12px", cursor: "pointer", fontSize: "13px" }}
            >
              ✕
            </button>
          </div>

          <textarea
            placeholder="Short description (1-2 sentences)"
            value={entry.description}
            onChange={(e) => updateEntry(index, "description", e.target.value)}
            rows={2}
            style={{ ...textareaStyle, marginBottom: "8px", fontSize: "13px" }}
          />

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
          {entry.imageFile && <p style={{ fontSize: "12px", color: "#2563eb", margin: "6px 0 0" }}>Selected: {entry.imageFile.name}</p>}
        </div>
      ))}

      <button
        onClick={addEntry}
        style={{ background: "#f3f4f6", color: "#111827", border: "1px solid #e5e7eb", borderRadius: "8px", padding: "8px 14px", cursor: "pointer", fontSize: "13px", fontWeight: 600 }}
      >
        + Add {title.slice(0, -1)}
      </button>
    </div>
  );
}

// ---------- Main page ----------

export default function ManageDestinations() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null); // null = creating new

  const [name, setName] = useState("");
  const [distanceFromCapital, setDistanceFromCapital] = useState("");
  const [description, setDescription] = useState("");

  const [existingPlaces, setExistingPlaces] = useState<ExistingPlace[]>([]);
  const [loadingPlaces, setLoadingPlaces] = useState(false);

  const [newAttractions, setNewAttractions] = useState<NewPlaceEntry[]>([]);
  const [newActivities, setNewActivities] = useState<NewPlaceEntry[]>([]);
  const [newRestaurants, setNewRestaurants] = useState<NewPlaceEntry[]>([]);

  const [saving, setSaving] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");

  useEffect(() => {
    fetchDestinations();
  }, []);

  async function fetchDestinations() {
    const { data } = await supabase
      .from("destinations")
      .select("id, slug, name, distance_from_capital, description")
      .order("name", { ascending: true });
    setDestinations(data || []);
  }

  async function fetchPlaces(destinationId: string) {
    setLoadingPlaces(true);
    const { data } = await supabase
      .from("destination_places")
      .select("id, category, name, description, maps_link, image_url")
      .eq("destination_id", destinationId)
      .order("category", { ascending: true });
    setExistingPlaces(data || []);
    setLoadingPlaces(false);
  }

  function startNewDestination() {
    setSelectedId(null);
    setName("");
    setDistanceFromCapital("");
    setDescription("");
    setExistingPlaces([]);
    setNewAttractions([]);
    setNewActivities([]);
    setNewRestaurants([]);
  }

  function startEditDestination(dest: Destination) {
    setSelectedId(dest.id);
    setName(dest.name);
    setDistanceFromCapital(dest.distance_from_capital || "");
    setDescription(dest.description || "");
    setNewAttractions([]);
    setNewActivities([]);
    setNewRestaurants([]);
    fetchPlaces(dest.id);
  }

  async function deleteDestination(dest: Destination) {
    if (!confirm(`Delete "${dest.name}" and everything listed under it? This can't be undone.`)) return;

    const { error: placesError } = await supabase.from("destination_places").delete().eq("destination_id", dest.id);
    if (placesError) {
      alert(placesError.message);
      return;
    }

    const { error: destError } = await supabase.from("destinations").delete().eq("id", dest.id);
    if (destError) {
      alert(destError.message);
      return;
    }

    if (selectedId === dest.id) startNewDestination();
    fetchDestinations();
  }

  async function saveDestination() {
    if (!name.trim()) {
      alert("Destination name is required.");
      return;
    }

    setSaving(true);

    try {
      let destinationId = selectedId;

      if (destinationId) {
        const { error } = await supabase
          .from("destinations")
          .update({ name, distance_from_capital: distanceFromCapital, description })
          .eq("id", destinationId);
        if (error) throw error;
      } else {
        const slug = slugify(name);
        const { data, error } = await supabase
          .from("destinations")
          .insert([{ slug, name, distance_from_capital: distanceFromCapital, description }])
          .select()
          .single();
        if (error) throw error;
        destinationId = data.id;
      }

      const allNew = [
        ...newAttractions.filter((p) => p.name.trim()).map((p) => ({ ...p, category: "attraction" })),
        ...newActivities.filter((p) => p.name.trim()).map((p) => ({ ...p, category: "activity" })),
        ...newRestaurants.filter((p) => p.name.trim()).map((p) => ({ ...p, category: "restaurant" })),
      ];

      if (allNew.length > 0) {
        setUploadStatus(`Uploading ${allNew.length} place photo(s)...`);

        const placesToInsert = [];
        for (const p of allNew) {
          let imageUrl: string | null = null;
          if (p.imageFile) {
            imageUrl = await uploadPlaceImage(p.imageFile);
          }
          placesToInsert.push({
            destination_id: destinationId,
            category: p.category,
            name: p.name,
            description: p.description || null,
            maps_link: p.maps_link,
            image_url: imageUrl,
          });
        }

        const { error: placesError } = await supabase.from("destination_places").insert(placesToInsert);
        if (placesError) throw placesError;
      }

      alert(selectedId ? "Destination updated!" : "Destination added!");

      const savedId = destinationId as string;
      await fetchDestinations();
      startEditDestination({ id: savedId, slug: "", name, distance_from_capital: distanceFromCapital, description });
    } catch (err: any) {
      alert(err.message || "Something went wrong while saving.");
    } finally {
      setSaving(false);
      setUploadStatus("");
    }
  }

  const attractions = existingPlaces.filter((p) => p.category === "attraction");
  const activities = existingPlaces.filter((p) => p.category === "activity");
  const restaurants = existingPlaces.filter((p) => p.category === "restaurant");

  function updatePlaceInList(updated: ExistingPlace) {
    setExistingPlaces((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  }

  function removePlaceFromList(id: string) {
    setExistingPlaces((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f4f6f8", fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif", color: "#111827" }}>
      <header style={{ background: "#ffffff", borderBottom: "1px solid #e5e7eb", padding: "14px 22px", position: "sticky", top: 0, zIndex: 10 }}>
        <h1 style={{ margin: 0, fontSize: "18px", fontWeight: 600 }}>GooNortheast Admin</h1>
      </header>

      <AdminNav />

      <main style={{ maxWidth: "700px", margin: "0 auto", padding: "40px 16px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: 700, margin: "0 0 4px" }}>Manage Destinations</h1>
        <p style={{ margin: "0 0 24px", color: "#6b7280", fontSize: "14px" }}>
          Add new destinations, or edit an existing one and its attractions, activities, and restaurants.
        </p>

        <section style={sectionStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
            <h2 style={{ margin: 0, fontSize: "16px", fontWeight: 600 }}>Existing Destinations</h2>
            <button
              onClick={startNewDestination}
              style={{ background: "#2563eb", color: "#ffffff", border: "none", borderRadius: "8px", padding: "8px 14px", cursor: "pointer", fontSize: "13px", fontWeight: 600 }}
            >
              + Add New Destination
            </button>
          </div>

          {destinations.length === 0 && <p style={{ fontSize: "13px", color: "#9ca3af" }}>No destinations yet.</p>}

          {destinations.map((dest) => (
            <div
              key={dest.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                border: `1px solid ${selectedId === dest.id ? "#93c5fd" : "#e5e7eb"}`,
                background: selectedId === dest.id ? "#eff6ff" : "#ffffff",
                borderRadius: "10px",
                padding: "10px 12px",
                marginBottom: "8px",
              }}
            >
              <span style={{ fontSize: "14px", fontWeight: 600 }}>{dest.name}</span>
              <div style={{ display: "flex", gap: "8px" }}>
                <button onClick={() => startEditDestination(dest)} style={smallButtonStyle}>
                  Edit
                </button>
                <button
                  onClick={() => deleteDestination(dest)}
                  style={{ ...smallButtonStyle, background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca" }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </section>

        <section style={sectionStyle}>
          <h2 style={{ margin: "0 0 16px", fontSize: "16px", fontWeight: 600 }}>
            {selectedId ? `Editing: ${name || "..."}` : "New Destination"}
          </h2>

          <label style={labelStyle}>Destination Name</label>
          <input type="text" placeholder="e.g. Shillong" value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} />

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

        {selectedId && (
          <section style={sectionStyle}>
            <h2 style={{ margin: "0 0 12px", fontSize: "16px", fontWeight: 600 }}>Currently Listed</h2>

            {loadingPlaces ? (
              <p style={{ fontSize: "13px", color: "#9ca3af" }}>Loading...</p>
            ) : (
              <>
                <label style={{ ...labelStyle, marginTop: "8px" }}>Attractions</label>
                {attractions.length === 0 && <p style={{ fontSize: "13px", color: "#9ca3af", marginBottom: "12px" }}>None yet.</p>}
                {attractions.map((p) => (
                  <ExistingPlaceRow key={p.id} place={p} onSaved={updatePlaceInList} onDeleted={removePlaceFromList} />
                ))}

                <label style={{ ...labelStyle, marginTop: "16px" }}>Activities</label>
                {activities.length === 0 && <p style={{ fontSize: "13px", color: "#9ca3af", marginBottom: "12px" }}>None yet.</p>}
                {activities.map((p) => (
                  <ExistingPlaceRow key={p.id} place={p} onSaved={updatePlaceInList} onDeleted={removePlaceFromList} />
                ))}

                <label style={{ ...labelStyle, marginTop: "16px" }}>Restaurants</label>
                {restaurants.length === 0 && <p style={{ fontSize: "13px", color: "#9ca3af", marginBottom: "12px" }}>None yet.</p>}
                {restaurants.map((p) => (
                  <ExistingPlaceRow key={p.id} place={p} onSaved={updatePlaceInList} onDeleted={removePlaceFromList} />
                ))}
              </>
            )}
          </section>
        )}

        <section style={sectionStyle}>
          <h2 style={{ margin: "0 0 16px", fontSize: "16px", fontWeight: 600 }}>
            {selectedId ? "Add More Places" : "Places (optional — leave blank to skip a category)"}
          </h2>

          <NewPlaceEntryList title="Attractions" entries={newAttractions} setEntries={setNewAttractions} />
          <NewPlaceEntryList title="Activities" entries={newActivities} setEntries={setNewActivities} />
          <NewPlaceEntryList title="Restaurants" entries={newRestaurants} setEntries={setNewRestaurants} />
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
          {saving ? uploadStatus || "Saving..." : selectedId ? "Save Changes" : "Save Destination"}
        </button>
      </main>
    </div>
  );
}
