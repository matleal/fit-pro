import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { notFound, redirect } from 'next/navigation';
import { CourseEditor } from './course-editor';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CursoDetalhesPage({ params }: PageProps) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user || session.user.role !== 'TEACHER') {
    redirect('/login');
  }

  const course = await prisma.course.findUnique({
    where: {
      id,
      teacherId: session.user.id,
    },
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
      enrollments: {
        include: {
          user: {
            select: { id: true, name: true, email: true, image: true },
          },
        },
      },
    },
  });

  if (!course) {
    notFound();
  }

  return <CourseEditor course={course} />;
}
