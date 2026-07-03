import { supabase } from "@/lib/supabase";

export default async function Home() {
  const { data, error } = await supabase
    .from("properties")
    .select("*");

  console.log("DATA:", data);
  console.log("ERROR:", error);

  return (
    <main style={{ padding: "20px" }}>
      <h1>GoNE 🏡</h1>

      {error && <p>Error: {error.message}</p>}

      {data?.map((property) => (
        <div
          key={property.id}
          style={{
            border: "1px solid #ccc",
            padding: "15px",
            marginTop: "15px",
            borderRadius: "8px",
          }}
        >
          <h2>{property.title}</h2>
          <p>{property.location}</p>
          <p>₹ {property.price}</p>
          <p>{property.description}</p>
        </div>
      ))}
    </main>
  );
}
