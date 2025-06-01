import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { usuario_id, productos } = await req.json();

    const [result] = await db.query("INSERT INTO compra (usuario_id) VALUES (?)", [usuario_id]);
    const compra_id = (result as any).insertId;

    for (const item of productos) {
      await db.query(
        "INSERT INTO detalle_compra (compra_id, snack_id, cantidad) VALUES (?, ?, ?)",
        [compra_id, item.snack_id, item.cantidad]
      );
    }

    return NextResponse.json({ success: true, compra_id });
  } catch (error) {
    console.error("❌ Error en /api/comprar:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
