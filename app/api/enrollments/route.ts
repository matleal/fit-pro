import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { decimalToNumber } from '@/lib/utils';

// GET - List user's enrollments
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const enrollments = await prisma.enrollment.findMany({
      where: { userId: session.user.id },
      include: {
        course: {
          include: {
            teacher: {
              select: { id: true, name: true, image: true },
            },
            _count: {
              select: { weeks: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(enrollments);
  } catch (error) {
    console.error('Error fetching enrollments:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

// POST - Enroll in a course
export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const body = await req.json();
    const { courseId } = body;

    if (!courseId) {
      return NextResponse.json(
        { error: 'ID do curso é obrigatório' },
        { status: 400 }
      );
    }

    // Check if course exists and is public
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: {
        id: true,
        isActive: true,
        isPublic: true,
        price: true,
        teacherId: true,
      },
    });

    if (!course) {
      return NextResponse.json(
        { error: 'Curso não encontrado' },
        { status: 404 }
      );
    }

    if (!course.isActive || !course.isPublic) {
      return NextResponse.json(
        { error: 'Curso não está disponível' },
        { status: 400 }
      );
    }

    // Don't allow teachers to enroll in their own courses
    if (course.teacherId === session.user.id) {
      return NextResponse.json(
        { error: 'Você não pode se inscrever no seu próprio curso' },
        { status: 400 }
      );
    }

    // Check if already enrolled
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        courseId_userId: {
          courseId,
          userId: session.user.id,
        },
      },
    });

    if (existingEnrollment) {
      return NextResponse.json(
        { error: 'Você já está inscrito neste curso' },
        { status: 400 }
      );
    }

    // For now, allow free enrollment (price = 0)
    // In the future, this will require payment verification
    const coursePrice = decimalToNumber(course.price);
    if (coursePrice > 0) {
      return NextResponse.json(
        {
          error:
            'Este curso é pago. Funcionalidade de pagamento ainda não implementada.',
          requiresPayment: true,
          price: coursePrice,
        },
        { status: 402 }
      ); // 402 = Payment Required
    }

    // Create enrollment
    const enrollment = await prisma.enrollment.create({
      data: {
        courseId,
        userId: session.user.id,
        isPaid: coursePrice === 0, // Free courses are automatically "paid"
      },
      include: {
        course: {
          include: {
            teacher: {
              select: { id: true, name: true },
            },
          },
        },
      },
    });

    return NextResponse.json(enrollment);
  } catch (error) {
    console.error('Error creating enrollment:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
