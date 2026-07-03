"use client";

import { useState } from "react";
import HomestayForm from "@/components/HomestayForm";
import HomestayList from "@/components/HomestayList";

export default function Dashboard() {
  const [showForm, setShowForm] = useState(false);

  const homestays = [];

  function handleEdit(id: string) {
    alert("Edit: " + id);
  }

  function handleDelete(id: string) {
    alert("Delete: " + id);
  }

  return (
    <main style={{ padding: "30px", maxWidth: "900px", margin: "auto" }}>
      <h1>GooNortheast Admin</h1>

      <hr />

      <button
        onClick={() => setShowForm(!showForm)}
        style={{
          padding: "12px 20px",
          marginBottom: "20px",
        }}
      >
        {showForm ? "Close Form" : "➕ Add Homestay"}
      </button>

      {showForm && <HomestayForm />}

      <hr />

      <HomestayList
        homestays={homestays}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </main>
  );
}
