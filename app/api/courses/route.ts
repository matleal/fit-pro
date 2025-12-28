import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { Decimal } from '@prisma/client/runtime/library';

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    // Teachers see their own courses
    if (session.user.role === 'TEACHER') {
      const courses = await prisma.course.findMany({
        where: { teacherId: session.user.id },
        orderBy: { updatedAt: 'desc' },
        include: {
          weeks: {
            orderBy: { weekNumber: 'asc' },
            include: {
              days: {
                orderBy: { dayNumber: 'asc' },
                include: {
                  exercises: {
                    orderBy: { orderIndex: 'asc' },
                  },
                },
              },
            },
          },
          _count: {
            select: { enrollments: true },
          },
        },
      });
      return NextResponse.json(courses);
    }

    // Students see courses they're enrolled in
    const enrollments = await prisma.enrollment.findMany({
      where: { userId: session.user.id, isActive: true },
      include: {
        course: {
          include: {
            teacher: {
              select: { id: true, name: true, image: true },
            },
            weeks: {
              orderBy: { weekNumber: 'asc' },
              include: {
                days: {
                  orderBy: { dayNumber: 'asc' },
                },
              },
            },
          },
        },
      },
    });

    const courses = enrollments.map((e: typeof enrollments[0]) => e.course);
    return NextResponse.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    if (session.user.role !== 'TEACHER') {
      return NextResponse.json(
        { error: 'Apenas professores podem criar cursos' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const {
      name,
      description,
      weeksCount = 4,
      isPublic = true,
      price = 0,
    } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Nome é obrigatório' },
        { status: 400 }
      );
    }

    // Create course with weeks
    const course = await prisma.course.create({
      data: {
        name,
        description,
        isPublic,
        price: new Decimal(price),
        teacherId: session.user.id,
        weeks: {
          create: Array.from({ length: weeksCount }, (_, i) => ({
            weekNumber: i + 1,
            name: `Semana ${i + 1}`,
            days: {
              create: [
                { dayNumber: 1, name: 'Treino A' },
                { dayNumber: 2, name: 'Treino B' },
                { dayNumber: 3, name: 'Treino C' },
              ],
            },
          })),
        },
      },
      include: {
        weeks: {
          orderBy: { weekNumber: 'asc' },
          include: {
            days: {
              orderBy: { dayNumber: 'asc' },
            },
          },
        },
      },
    });

    return NextResponse.json(course);
  } catch (error) {
    console.error('Error creating course:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
