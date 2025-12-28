import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { randomBytes } from "crypto";

function generateInviteCode(): string {
  return randomBytes(4).toString("hex").toUpperCase();
}

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "TEACHER") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const invites = await prisma.inviteCode.findMany({
      where: { teacherId: session.user.id },
      orderBy: { createdAt: "desc" },
      include: {
        course: {
          select: { id: true, name: true },
        },
      },
    });

    return NextResponse.json(invites);
  } catch (error) {
    console.error("Error fetching invites:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "TEACHER") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { courseId } = body;

    // If courseId provided, verify it belongs to this teacher
    if (courseId) {
      const course = await prisma.course.findFirst({
        where: {
          id: courseId,
          teacherId: session.user.id,
        },
      });

      if (!course) {
        return NextResponse.json({ error: "Curso não encontrado" }, { status: 404 });
      }
    }

    // Generate a unique code
    let code = generateInviteCode();
    let attempts = 0;
    while (attempts < 10) {
      const existing = await prisma.inviteCode.findUnique({
        where: { code },
      });
      if (!existing) break;
      code = generateInviteCode();
      attempts++;
    }

    const invite = await prisma.inviteCode.create({
      data: {
        code,
        teacherId: session.user.id,
        courseId: courseId || null,
      },
      include: {
        course: {
          select: { id: true, name: true },
        },
      },
    });

    return NextResponse.json(invite);
  } catch (error) {
    console.error("Error creating invite:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
