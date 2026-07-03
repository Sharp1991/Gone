"use client";

import { useState } from "react";

export default function HomestayForm() {
  const [title, setTitle] = useState("");
  const [destination, setDestination] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [hostName, setHostName] = useState("");
  const [aboutHost, setAboutHost] = useState("");
  const [aboutArea, setAboutArea] = useState("");
  const [nearbyAttractions, setNearbyAttractions] = useState("");
  const [guestExperiences, setGuestExperiences] = useState("");
  const [googleMaps, setGoogleMaps] = useState("");
  const [contact, setContact] = useState("");
  const [whatsapp, setWhatsapp] = useState("");

  function handleSave() {
    alert("Next step: Save to Supabase");
  }

  return (
    <div>
      <h2>Add New Homestay</h2>

      <h3>Basic Information</h3>

      <input
        type="text"
        placeholder="Homestay Name"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <br /><br />

      <input
        type="text"
        placeholder="Destination"
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
      />

      <br /><br />

      <input
        type="text"
        placeholder="Locality"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />

      <br /><br />

      <input
        type="text"
        placeholder="Google Maps Link"
        value={googleMaps}
        onChange={(e) => setGoogleMaps(e.target.value)}
      />

      <br /><br />

      <h3>About</h3>

      <textarea
        placeholder="About the Homestay"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <br /><br />

      <textarea
        placeholder="About the Host"
        value={aboutHost}
        onChange={(e) => setAboutHost(e.target.value)}
      />

      <br /><br />

      <textarea
        placeholder="About the Area"
        value={aboutArea}
        onChange={(e) => setAboutArea(e.target.value)}
      />

      <br /><br />

      <textarea
        placeholder="Nearby Attractions"
        value={nearbyAttractions}
        onChange={(e) => setNearbyAttractions(e.target.value)}
      />

      <br /><br />

      <h3>Guest Experiences</h3>

      <textarea
        placeholder="What guests say"
        value={guestExperiences}
        onChange={(e) => setGuestExperiences(e.target.value)}
      />

      <br /><br />

      <h3>Contact</h3>

      <input
        type="text"
        placeholder="Owner Name"
        value={hostName}
        onChange={(e) => setHostName(e.target.value)}
      />

      <br /><br />

      <input
        type="text"
        placeholder="Phone Number"
        value={contact}
        onChange={(e) => setContact(e.target.value)}
      />

      <br /><br />

      <input
        type="text"
        placeholder="WhatsApp"
        value={whatsapp}
        onChange={(e) => setWhatsapp(e.target.value)}
      />

      <br /><br />

      <button onClick={handleSave}>
        Save Homestay
      </button>
    </div>
  );
}
