"use client";

type Homestay = {
  id: string;
  title: string;
  destination?: string;
};

type Props = {
  homestays: Homestay[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
};

export default function HomestayList({
  homestays,
  onEdit,
  onDelete,
}: Props) {
  if (homestays.length === 0) {
    return <p>No homestays added yet.</p>;
  }

  return (
    <div>
      <h2>Existing Homestays</h2>

      {homestays.map((homestay) => (
        <div
          key={homestay.id}
          style={{
            border: "1px solid #ccc",
            padding: "15px",
            marginBottom: "15px",
            borderRadius: "8px",
          }}
        >
          <h3>{homestay.title}</h3>

          <p>{homestay.destination}</p>

          <button onClick={() => onEdit(homestay.id)}>
            Edit
          </button>

          {" "}

          <button onClick={() => onDelete(homestay.id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
