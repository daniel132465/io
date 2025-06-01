"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ResumenPage() {
  const searchParams = useSearchParams();
  const compra_id = searchParams.get("compra_id");
  const [detalles, setDetalles] = useState<any[]>([]);

  useEffect(() => {
    if (!compra_id) return;

    fetch(`/api/compra?compra_id=${compra_id}`)
      .then((res) => res.json())
      .then((data) => setDetalles(data));
  }, [compra_id]);

  return (
    <main style={{ padding: "2rem" }}>
      <h1>✅ Resumen de tu compra</h1>
      {detalles.length === 0 ? (
        <p>Cargando detalles...</p>
      ) : (
        <ul>
          {detalles.map((item, i) => (
            <li key={i}>
              {item.nombre} x{item.cantidad} - {item.precio} Bs
            </li>
          ))}
        </ul>
      )}
      <button
        style={{
          marginTop: "1rem",
          padding: "0.7rem 1.5rem",
          background: "#16a34a",
          color: "white",
          border: "none",
          borderRadius: "10px",
          fontWeight: "bold",
          cursor: "pointer",
        }}
        onClick={() => alert("✅ ¡Pago confirmado (simulado)!")}
      >
        Comprar ahora
      </button>
    </main>
  );
}
