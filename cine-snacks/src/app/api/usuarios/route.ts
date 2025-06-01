import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { nombre } = await req.json();
    const [result] = await db.query("INSERT INTO usuario (nombre) VALUES (?)", [nombre]);
    return NextResponse.json({ success: true, usuario_id: (result as any).insertId });
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
