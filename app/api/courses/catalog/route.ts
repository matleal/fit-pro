import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { decimalToNumber } from '@/lib/utils';

// GET - List all public courses for the catalog
export async function GET() {
  try {
    const session = await auth();

    const courses = await prisma.course.findMany({
      where: {
        isActive: true,
        isPublic: true,
      },
      orderBy: { createdAt: 'desc' },
      include: {
        teacher: {
          select: { id: true, name: true, image: true },
        },
        _count: {
          select: {
            enrollments: true,
            weeks: true,
          },
        },
        // Check if current user is enrolled (if logged in)
        enrollments: session?.user
          ? {
              where: { userId: session.user.id },
              select: { id: true },
            }
          : false,
      },
    });

    // Map to include isEnrolled flag
    const coursesWithEnrollment = courses.map((course) => ({
      id: course.id,
      name: course.name,
      description: course.description,
      thumbnail: course.thumbnail,
      price: decimalToNumber(course.price),
      teacher: course.teacher,
      enrollmentCount: course._count.enrollments,
      weeksCount: course._count.weeks,
      isEnrolled: session?.user ? course.enrollments.length > 0 : false,
      createdAt: course.createdAt,
    }));

    return NextResponse.json(coursesWithEnrollment);
  } catch (error) {
    console.error('Error fetching course catalog:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
