import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CourseViewer } from "./course-viewer";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ semana?: string }>;
}

export default async function CursoPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { semana } = await searchParams;
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  // Verify user is enrolled in this course
  const enrollment = await prisma.enrollment.findUnique({
    where: {
      courseId_userId: {
        courseId: id,
        userId: session.user.id,
      },
    },
  });

  if (!enrollment) {
    // Check if course is public (allow viewing)
    const course = await prisma.course.findUnique({
      where: { id },
      select: { isPublic: true },
    });

    if (!course?.isPublic) {
      redirect("/aluno/catalogo");
    }
  }

  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      teacher: {
        select: { id: true, name: true, image: true },
      },
      weeks: {
        orderBy: { weekNumber: "asc" },
        include: {
          days: {
            orderBy: { dayNumber: "asc" },
            include: {
              exercises: {
                orderBy: { orderIndex: "asc" },
              },
            },
          },
        },
      },
    },
  });

  if (!course) {
    notFound();
  }

  const initialWeek = semana ? parseInt(semana) : 1;

  return <CourseViewer course={course} initialWeek={initialWeek} isEnrolled={!!enrollment} />;
}
