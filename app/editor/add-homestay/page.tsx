export default function AddHomestay() {
  return (
    <main style={{ padding: "40px", maxWidth: "700px", margin: "auto" }}>
      <h1>Add New Homestay</h1>

      <p>Fill in the details below.</p>

      <input
        type="text"
        placeholder="Homestay Name"
        style={{ width: "100%", padding: "10px", marginBottom: "15px" }}
      />

      <input
        type="text"
        placeholder="Destination"
        style={{ width: "100%", padding: "10px", marginBottom: "15px" }}
      />

      <input
        type="text"
        placeholder="Locality"
        style={{ width: "100%", padding: "10px", marginBottom: "15px" }}
      />

      <textarea
        placeholder="About the Homestay"
        rows={5}
        style={{ width: "100%", padding: "10px", marginBottom: "15px" }}
      />

      <button
        style={{
          padding: "12px 20px",
          cursor: "pointer",
        }}
      >
        Save Homestay
      </button>
    </main>
  );
}
