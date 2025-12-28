import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// This endpoint allows a user to become a teacher
// In a production app, you might want to add more verification
export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await req.json();
    const { role } = body;

    if (role !== "TEACHER" && role !== "STUDENT") {
      return NextResponse.json({ error: "Role inválido" }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { role },
    });

    return NextResponse.json({ success: true, role: updatedUser.role });
  } catch (error) {
    console.error("Error updating role:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
