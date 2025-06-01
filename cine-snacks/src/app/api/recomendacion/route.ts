import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const [transiciones] = await db.query(`
      SELECT a.snack_id AS origen, b.snack_id AS destino
      FROM detalle_compra a
      JOIN detalle_compra b ON a.compra_id = b.compra_id
      WHERE a.snack_id != b.snack_id
    `);

    const conteo: Record<number, Record<number, number>> = {};

    for (const row of transiciones as any[]) {
      const origen = row.origen;
      const destino = row.destino;
      if (!conteo[origen]) conteo[origen] = {};
      conteo[origen][destino] = (conteo[origen][destino] || 0) + 1;
    }

    const popularidad: Record<number, number> = {};

    for (const origen in conteo) {
      const destinos = conteo[origen];
      for (const destino in destinos) {
        popularidad[destino] = (popularidad[destino] || 0) + destinos[destino];
      }
    }

    const topIds = Object.entries(popularidad)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([id]) => parseInt(id));

    if (topIds.length === 0) return NextResponse.json([]);

    const [snacks] = await db.query("SELECT * FROM snack WHERE id IN (?)", [topIds]);
    return NextResponse.json(snacks);
  } catch (error) {
    console.error("Error en recomendacion:", error);
    return NextResponse.json([], { status: 500 });
  }
}
