"use client";

import { useState } from "react";
import HomestayForm from "@/components/HomestayForm";
import HomestayList from "@/components/HomestayList";

export default function Dashboard() {
  const [showForm, setShowForm] = useState(false);

  const homestays = [] as any[];

  function handleEdit(id: string) {
    alert("Edit: " + id);
  }

  function handleDelete(id: string) {
    alert("Delete: " + id);
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f4f6f8",
        padding: "40px 20px",
        fontFamily: "sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          maxWidth: "900px",
          margin: "auto",
          marginBottom: "20px",
        }}
      >
        <h1 style={{ margin: 0, fontSize: "28px" }}>
          GooNortheast Admin Panel
        </h1>
        <p style={{ color: "#666", marginTop: "5px" }}>
          Manage your homestays efficiently
        </p>
      </div>

      {/* Card container */}
      <div
        style={{
          maxWidth: "900px",
          margin: "auto",
          background: "#fff",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        }}
      >
        {/* Button */}
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            padding: "12px 18px",
            background: showForm ? "#ff4d4f" : "#1677ff",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "14px",
            marginBottom: "20px",
          }}
        >
          {showForm ? "Close Form" : "➕ Add New Homestay"}
        </button>

        {/* Form */}
        {showForm && (
          <div
            style={{
              marginBottom: "20px",
              padding: "15px",
              border: "1px solid #eee",
              borderRadius: "10px",
              background: "#fafafa",
            }}
          >
            <HomestayForm />
          </div>
        )}

        {/* List */}
        <HomestayList
          homestays={homestays}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </main>
  );
}
