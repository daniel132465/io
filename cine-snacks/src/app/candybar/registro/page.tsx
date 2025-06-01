"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegistroPage() {
  const [nombre, setNombre] = useState("");
  const router = useRouter();

  const registrar = async () => {
    if (!nombre) return alert("Ingresa tu nombre");

    const res = await fetch("/api/usuarios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre }),
    });

    const data = await res.json();
    if (data.success) {
      localStorage.setItem("usuario", data.usuario_id);
      alert("Usuario registrado correctamente");
      router.push("/candybar");
    } else {
      alert("Error al registrar");
    }
  };

  return (
    <main style={{ padding: "2rem", textAlign: "center" }}>
      <h1>📝 Registro</h1>
      <p>Ingresa tu nombre para continuar:</p>
      <input
        type="text"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        style={{ padding: "0.5rem", marginTop: "1rem", borderRadius: "8px" }}
      />
      <br />
      <button
        onClick={registrar}
        style={{
          marginTop: "1rem",
          padding: "0.5rem 1rem",
          borderRadius: "8px",
          background: "#00d4ff",
          border: "none",
          fontWeight: "bold",
          cursor: "pointer",
        }}
      >
        Registrar
      </button>
    </main>
  );
}
