"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

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

    const { error } = await supabase
      .from("properties")
      .insert([
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
    <main
      style={{
        maxWidth: "700px",
        margin: "40px auto",
        padding: "20px",
      }}
    >
      <h1>Add Homestay</h1>
      <hr />

      <h2>Basic Information</h2>

      <input
        type="text"
        placeholder="Homestay Name"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
      />

      <input
        type="text"
        placeholder="Destination"
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
      />

      <input
        type="text"
        placeholder="Locality"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
      />

      <input
        type="text"
        placeholder="Google Maps Link"
        value={googleMaps}
        onChange={(e) => setGoogleMaps(e.target.value)}
        style={{ width: "100%", padding: "10px", marginBottom: "20px" }}
      />
      <hr />

      <h2>About</h2>

      <textarea
        placeholder="About the Homestay"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={5}
        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
      />

      <textarea
        placeholder="About the Host"
        value={aboutHost}
        onChange={(e) => setAboutHost(e.target.value)}
        rows={5}
        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
      />

      <textarea
        placeholder="About the Area"
        value={aboutArea}
        onChange={(e) => setAboutArea(e.target.value)}
        rows={5}
        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
      />

      <textarea
        placeholder="Nearby Attractions"
        value={nearbyAttractions}
        onChange={(e) => setNearbyAttractions(e.target.value)}
        rows={4}
        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
      />

      <textarea
        placeholder="Guest Experiences"
        value={guestExperiences}
        onChange={(e) => setGuestExperiences(e.target.value)}
        rows={4}
        style={{ width: "100%", padding: "10px", marginBottom: "20px" }}
      />
      <hr />

      <h2>Contact</h2>

      <input
        type="text"
        placeholder="Host Name"
        value={hostName}
        onChange={(e) => setHostName(e.target.value)}
        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
      />

      <input
        type="text"
        placeholder="Phone Number"
        value={contact}
        onChange={(e) => setContact(e.target.value)}
        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
      />

      <input
        type="text"
        placeholder="WhatsApp Number"
        value={whatsapp}
        onChange={(e) => setWhatsapp(e.target.value)}
        style={{ width: "100%", padding: "10px", marginBottom: "20px" }}
      />
<hr />

<h2>Photos</h2>

<h3>Thumbnail Photo</h3>

<input
  type="file"
  accept="image/*"
  onChange={(e) => {
    if (e.target.files && e.target.files.length > 0) {
      setThumbnail(e.target.files[0]);
    }
  }}
/>

<br />
<br />

{thumbnail && (
  <p>
    Selected: <strong>{thumbnail.name}</strong>
  </p>
)}

<hr />

<h3>Gallery Photos</h3>

<input
  type="file"
  accept="image/*"
  multiple
  onChange={(e) => {
    if (e.target.files) {
      setGallery(Array.from(e.target.files));
    }
  }}
/>

<br />
<br />

{gallery.length > 0 && (
  <div>
    <strong>{gallery.length} photo(s) selected</strong>

    <ul>
      {gallery.map((photo, index) => (
        <li key={index}>{photo.name}</li>
      ))}
    </ul>
  </div>
)}

<br />
 
     <button
        onClick={saveHomestay}
        disabled={loading}
        style={{
          width: "100%",
          padding: "15px",
          fontSize: "16px",
          cursor: "pointer",
        }}
      >
        {loading ? "Saving..." : "Save Homestay"}
      </button>

    </main>
  );
}
