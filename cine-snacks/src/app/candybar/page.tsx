// Candy Bar Page (page.tsx): Catálogo, buscador, filtro, recomendaciones, carrito y confirmación de compra

"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./style.css";

type Producto = {
  id: number;
  nombre: string;
  precio: number;
  categoria: string;
};

type CarritoItem = {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
};

export default function CandyBarPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState("todos");
  const [carrito, setCarrito] = useState<CarritoItem[]>([]);
  const [recomendaciones, setRecomendaciones] = useState<Producto[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/productos")
      .then((res) => res.json())
      .then((data) => setProductos(data));

    fetch("/api/recomendacion")
      .then((res) => res.json())
      .then((data) => setRecomendaciones(data));
  }, []);

  const filtrados = productos.filter((p) => {
    const coincideNombre = p.nombre.toLowerCase().includes(busqueda.toLowerCase());
    const coincideCategoria = categoria === "todos" || p.categoria === categoria;
    return coincideNombre && coincideCategoria;
  });

  const agregarAlCarrito = (producto: Producto) => {
    setCarrito((prev) => {
      const existente = prev.find((item) => item.id === producto.id);
      if (existente) {
        return prev.map((item) =>
          item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
        );
      }
      return [...prev, { ...producto, cantidad: 1 }];
    });
  };

  const confirmarCompra = async () => {
    if (carrito.length === 0) return alert("Carrito vacío");

    const usuario = localStorage.getItem("usuario");
    if (!usuario) return router.push("/candybar/registro");

    const usuario_id = parseInt(usuario);
    const productosAComprar = carrito.map((item) => ({
      snack_id: item.id,
      cantidad: item.cantidad,
    }));

    const res = await fetch("/api/comprar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuario_id, productos: productosAComprar }),
    });

    const data = res.ok ? await res.json() : { success: false };
    if (data.success) {
      router.push(`/candybar/resumen?compra_id=${data.compra_id}`);
    } else {
      alert("Error al comprar");
    }
  };

  return (
    <main className="main">
      <h1 className="titulo">🎬 Candy Bar 🍿</h1>

      <div className="filtros">
        <input
          placeholder="Buscar producto..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
          <option value="todos">Todas</option>
          <option value="salado">Salado</option>
          <option value="dulce">Dulce</option>
          <option value="bebida">Bebida</option>
          <option value="comida rapida">Comida Rápida</option>
          <option value="juegos">Juegos</option>
        </select>
      </div>

      {recomendaciones.length > 0 && (
        <div className="recomendado">
          <h2>🎯 Recomendaciones para ti:</h2>
          <div className="grid">
            {recomendaciones.map((prod) => (
              <div className="card" key={prod.id}>
                <h3>{prod.nombre}</h3>
                <p>{prod.precio} Bs</p>
                <button onClick={() => agregarAlCarrito(prod)}>Añadir</button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid">
        {filtrados.map((prod) => (
          <div className="card" key={prod.id}>
            <h3>{prod.nombre}</h3>
            <p>{prod.precio} Bs</p>
            <button onClick={() => agregarAlCarrito(prod)}>Añadir</button>
          </div>
        ))}
      </div>

      <div className="carrito">
        <h2>🛒 Carrito</h2>
        {carrito.length === 0 ? (
          <p>No hay productos aún.</p>
        ) : (
          <ul>
            {carrito.map((item) => (
              <li key={item.id}>
                {item.nombre} x{item.cantidad} - {item.precio} Bs
              </li>
            ))}
          </ul>
        )}
        {carrito.length > 0 && (
          <button className="btn-confirmar" onClick={confirmarCompra}>Confirmar compra</button>
        )}
      </div>
    </main>
  );
}
