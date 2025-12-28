import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();

    if (!session?.user || session.user.role !== "TEACHER") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const invite = await prisma.inviteCode.findUnique({
      where: { id },
      select: { teacherId: true },
    });

    if (!invite || invite.teacherId !== session.user.id) {
      return NextResponse.json({ error: "Convite não encontrado" }, { status: 404 });
    }

    await prisma.inviteCode.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting invite:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
