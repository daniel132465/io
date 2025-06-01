import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const compra_id = searchParams.get("compra_id");

  const [result] = await db.query(`
    SELECT s.nombre, s.precio, dc.cantidad
    FROM detalle_compra dc
    JOIN snack s ON s.id = dc.snack_id
    WHERE dc.compra_id = ?
  `, [compra_id]);

  return NextResponse.json(result);
}
