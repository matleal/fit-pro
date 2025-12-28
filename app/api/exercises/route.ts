import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== 'TEACHER') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const body = await req.json();
    const { dayId, name, youtubeUrl, notes, sets, reps, rest } = body;

    if (!dayId || !name) {
      return NextResponse.json(
        { error: 'Dados obrigatórios faltando' },
        { status: 400 }
      );
    }

    // Verify the day belongs to a course owned by this teacher
    const day = await prisma.day.findUnique({
      where: { id: dayId },
      include: {
        week: {
          include: {
            course: true,
          },
        },
      },
    });

    if (!day || day.week.course.teacherId !== session.user.id) {
      return NextResponse.json(
        { error: 'Dia não encontrado' },
        { status: 404 }
      );
    }

    // Get the highest order index for this day
    const lastExercise = await prisma.exercise.findFirst({
      where: { dayId },
      orderBy: { orderIndex: 'desc' },
      select: { orderIndex: true },
    });

    const exercise = await prisma.exercise.create({
      data: {
        dayId,
        name,
        youtubeUrl: youtubeUrl || null,
        notes: notes || null,
        sets: sets || null,
        reps: reps || null,
        rest: rest || null,
        orderIndex: (lastExercise?.orderIndex ?? -1) + 1,
      },
    });

    return NextResponse.json(exercise);
  } catch (error) {
    console.error('Error creating exercise:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
