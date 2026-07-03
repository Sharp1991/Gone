export default function Editor() {
  return (
    <main style={{ padding: "40px", maxWidth: "400px", margin: "auto" }}>
      <h1>Editor Login</h1>

      <input
        type="email"
        placeholder="Email"
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "15px",
        }}
      />

      <input
        type="password"
        placeholder="Password"
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "15px",
        }}
      />

      <button
        style={{
          width: "100%",
          padding: "10px",
        }}
      >
        Login
      </button>
    </main>
  );
}
