"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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
  resize: "none",
  overflow: "hidden",
  lineHeight: 1.6,
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

// A textarea that grows to fit its content instead of scrolling internally.
function AutoTextarea({
  value,
  onChange,
  style,
}: {
  value: string;
  onChange: (v: string) => void;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.style.height = "auto";
      ref.current.style.height = `${ref.current.scrollHeight}px`;
    }
  }, [value]);

  return (
    <textarea
      ref={ref}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={3}
      style={{ ...textareaStyle, ...style }}
    />
  );
}

type GalleryImage = {
  id: string;
  url: string;
};

export default function EditHomestay() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");

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

  const [currentCoverPhoto, setCurrentCoverPhoto] = useState<string | null>(null);
  const [newThumbnail, setNewThumbnail] = useState<File | null>(null);

  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [newGalleryFiles, setNewGalleryFiles] = useState<File[]>([]);
  const [deletingImageId, setDeletingImageId] = useState<string | null>(null);

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
      setCurrentCoverPhoto(data.cover_photo || null);
    }

    const { data: images } = await supabase
      .from("property_images")
      .select("id, url")
      .eq("property_id", id);

    setGallery(images || []);
    setLoading(false);
  }

  async function handleDeleteGalleryImage(imageId: string) {
    const confirmed = window.confirm("Remove this photo from the gallery?");
    if (!confirmed) return;

    setDeletingImageId(imageId);

    const { error } = await supabase
      .from("property_images")
      .delete()
      .eq("id", imageId);

    setDeletingImageId(null);

    if (error) {
      alert(error.message);
      return;
    }

    setGallery((prev) => prev.filter((img) => img.id !== imageId));
  }

  async function updateHomestay() {
    setSaving(true);

    try {
      // 1. Upload new thumbnail if one was selected, replacing cover_photo
      let coverPhotoUrl = currentCoverPhoto;

      if (newThumbnail) {
        setUploadStatus("Uploading new thumbnail...");
        const fileName = uniqueFileName(newThumbnail);

        const { error: uploadError } = await supabase.storage
          .from("Homestay")
          .upload(fileName, newThumbnail);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from("Homestay")
          .getPublicUrl(fileName);

        coverPhotoUrl = publicUrlData.publicUrl;
      }

      // 2. Update the property row
      setUploadStatus("Saving details...");

      const { error: updateError } = await supabase
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
          cover_photo: coverPhotoUrl,
        })
        .eq("id", id);

      if (updateError) throw updateError;

      // 3. Upload any newly added gallery photos
      if (newGalleryFiles.length > 0) {
        setUploadStatus(`Uploading ${newGalleryFiles.length} new photo(s)...`);

        for (const file of newGalleryFiles) {
          const fileName = uniqueFileName(file);

          const { error: galleryUploadError } = await supabase.storage
            .from("Homestay")
            .upload(fileName, file);

          if (galleryUploadError) throw galleryUploadError;

          const { data: galleryUrlData } = supabase.storage
            .from("Homestay")
            .getPublicUrl(fileName);

          const { error: galleryInsertError } = await supabase
            .from("property_images")
            .insert([{ property_id: id, url: galleryUrlData.publicUrl }]);

          if (galleryInsertError) throw galleryInsertError;
        }
      }

      alert("Homestay updated successfully!");
      router.push("/editor/dashboard");
    } catch (err: any) {
      alert(err.message || "Something went wrong while saving.");
    } finally {
      setSaving(false);
      setUploadStatus("");
    }
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
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} style={inputStyle} />

          <label style={labelStyle}>Destination</label>
          <input type="text" value={destination} onChange={(e) => setDestination(e.target.value)} style={inputStyle} />

          <label style={labelStyle}>Locality</label>
          <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} style={inputStyle} />

          <label style={labelStyle}>Google Maps Link</label>
          <input type="text" value={googleMaps} onChange={(e) => setGoogleMaps(e.target.value)} style={inputStyle} />

          <label style={labelStyle}>YouTube Video Link (optional)</label>
          <input
            type="text"
            placeholder="https://youtube.com/watch?v=..."
            value={youtubeLink}
            onChange={(e) => setYoutubeLink(e.target.value)}
            style={{ ...inputStyle, marginBottom: 0 }}
          />
        </section>

        {/* ABOUT — now auto-expanding, no internal scroll */}
        <section style={sectionStyle}>
          <h2 style={{ margin: "0 0 16px", fontSize: "16px", fontWeight: 600 }}>
            About
          </h2>

          <label style={labelStyle}>About the Homestay</label>
          <AutoTextarea value={description} onChange={setDescription} />

          <label style={labelStyle}>About the Host</label>
          <AutoTextarea value={aboutHost} onChange={setAboutHost} />

          <label style={labelStyle}>About the Area</label>
          <AutoTextarea value={aboutArea} onChange={setAboutArea} />

          <label style={labelStyle}>Nearby Attractions</label>
          <AutoTextarea value={nearbyAttractions} onChange={setNearbyAttractions} />

          <label style={labelStyle}>Guest Experiences</label>
          <AutoTextarea value={guestExperiences} onChange={setGuestExperiences} style={{ marginBottom: 0 }} />
        </section>

        {/* CONTACT */}
        <section style={sectionStyle}>
          <h2 style={{ margin: "0 0 16px", fontSize: "16px", fontWeight: 600 }}>
            Contact
          </h2>

          <label style={labelStyle}>Host Name</label>
          <input type="text" value={hostName} onChange={(e) => setHostName(e.target.value)} style={inputStyle} />

          <label style={labelStyle}>Phone Number</label>
          <input type="text" value={contact} onChange={(e) => setContact(e.target.value)} style={inputStyle} />

          <label style={labelStyle}>WhatsApp Number</label>
          <input
            type="text"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            style={{ ...inputStyle, marginBottom: 0 }}
          />
        </section>

        {/* PHOTOS — new section */}
        <section style={sectionStyle}>
          <h2 style={{ margin: "0 0 16px", fontSize: "16px", fontWeight: 600 }}>
            Photos
          </h2>

          <label style={labelStyle}>Thumbnail Photo</label>
          {currentCoverPhoto && !newThumbnail && (
            <img
              src={currentCoverPhoto}
              alt="Current thumbnail"
              style={{
                width: "100%",
                maxWidth: "220px",
                height: "140px",
                objectFit: "cover",
                borderRadius: "10px",
                marginBottom: "10px",
                display: "block",
              }}
            />
          )}
          {newThumbnail && (
            <p style={{ fontSize: "13px", color: "#2563eb", margin: "0 0 10px" }}>
              New thumbnail selected: <strong>{newThumbnail.name}</strong> (will replace current one on save)
            </p>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                setNewThumbnail(e.target.files[0]);
              }
            }}
            style={{ marginBottom: "16px" }}
          />

          <hr style={{ border: "none", borderTop: "1px solid #e5e7eb", margin: "16px 0" }} />

          <label style={labelStyle}>Gallery Photos</label>

          {gallery.length > 0 && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
                gap: "10px",
                marginBottom: "14px",
              }}
            >
              {gallery.map((image) => (
                <div key={image.id} style={{ position: "relative" }}>
                  <img
                    src={image.url}
                    alt="Gallery photo"
                    style={{
                      width: "100%",
                      height: "90px",
                      objectFit: "cover",
                      borderRadius: "8px",
                      display: "block",
                    }}
                  />
                  <button
                    onClick={() => handleDeleteGalleryImage(image.id)}
                    disabled={deletingImageId === image.id}
                    style={{
                      position: "absolute",
                      top: "4px",
                      right: "4px",
                      background: "rgba(220, 38, 38, 0.9)",
                      color: "#fff",
                      border: "none",
                      borderRadius: "6px",
                      fontSize: "11px",
                      padding: "3px 6px",
                      cursor: "pointer",
                    }}
                  >
                    {deletingImageId === image.id ? "..." : "Remove"}
                  </button>
                </div>
              ))}
            </div>
          )}

          <label style={labelStyle}>Add More Gallery Photos</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => {
              if (e.target.files) {
                setNewGalleryFiles(Array.from(e.target.files));
              }
            }}
            style={{ marginBottom: "8px" }}
          />
          {newGalleryFiles.length > 0 && (
            <div style={{ fontSize: "13px", color: "#374151" }}>
              <strong>{newGalleryFiles.length} new photo(s) to add</strong>
              <ul style={{ margin: "6px 0 0", paddingLeft: "18px" }}>
                {newGalleryFiles.map((photo, index) => (
                  <li key={index}>{photo.name}</li>
                ))}
              </ul>
            </div>
          )}
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
            {saving ? uploadStatus || "Saving..." : "Save Changes"}
          </button>
        </div>
      </main>
    </div>
  );
}
