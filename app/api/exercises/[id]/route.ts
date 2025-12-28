import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();

    if (!session?.user || session.user.role !== 'TEACHER') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    // Verify the exercise belongs to a program owned by this teacher
    const exercise = await prisma.exercise.findUnique({
      where: { id },
      include: {
        day: {
          include: {
            week: {
              include: {
                course: true,
              },
            },
          },
        },
      },
    });

    if (!exercise || exercise.day.week.course.teacherId !== session.user.id) {
      return NextResponse.json(
        { error: 'Exercício não encontrado' },
        { status: 404 }
      );
    }

    const body = await req.json();
    const { name, youtubeUrl, notes, sets, reps, rest } = body;

    const updatedExercise = await prisma.exercise.update({
      where: { id },
      data: {
        name,
        youtubeUrl: youtubeUrl || null,
        notes: notes || null,
        sets: sets || null,
        reps: reps || null,
        rest: rest || null,
      },
    });

    return NextResponse.json(updatedExercise);
  } catch (error) {
    console.error('Error updating exercise:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();

    if (!session?.user || session.user.role !== 'TEACHER') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    // Verify the exercise belongs to a program owned by this teacher
    const exercise = await prisma.exercise.findUnique({
      where: { id },
      include: {
        day: {
          include: {
            week: {
              include: {
                course: true,
              },
            },
          },
        },
      },
    });

    if (!exercise || exercise.day.week.course.teacherId !== session.user.id) {
      return NextResponse.json(
        { error: 'Exercício não encontrado' },
        { status: 404 }
      );
    }

    await prisma.exercise.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting exercise:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
