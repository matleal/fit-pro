import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Dumbbell, ArrowRight, Library } from 'lucide-react';

export default async function AlunoDashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  // Get user's enrollments
  const enrollments = await prisma.enrollment.findMany({
    where: {
      userId: session.user.id,
      isActive: true,
    },
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
                include: {
                  _count: {
                    select: { exercises: true },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  type EnrollmentWithCourse = typeof enrollments[0];

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Olá, {session.user.name?.split(" ")[0]}!
          </h1>
          <p className="text-zinc-400 mt-1">
            Confira seus cursos e treinos
          </p>
        </div>
        <Link href="/aluno/catalogo">
          <Button className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600">
            <Library className="w-4 h-4 mr-2" />
            Ver Catálogo
          </Button>
        </Link>
      </div>

      {enrollments.length === 0 ? (
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="py-16 text-center">
            <Dumbbell className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">
              Você ainda não está inscrito em nenhum curso
            </h2>
            <p className="text-zinc-500 mb-6 max-w-md mx-auto">
              Explore o catálogo de cursos e encontre o treino ideal para você.
            </p>
            <Link href="/aluno/catalogo">
              <Button className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600">
                <Library className="w-4 h-4 mr-2" />
                Explorar Cursos
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {/* My Courses */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-white">Meus Cursos</h2>

            {enrollments.map((enrollment: EnrollmentWithCourse) => (
              <Card key={enrollment.id} className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={enrollment.course.teacher.image || ""} />
                        <AvatarFallback className="bg-emerald-500/20 text-emerald-400">
                          {enrollment.course.teacher.name?.charAt(0) || "P"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-white text-xl">
                          {enrollment.course.name}
                        </CardTitle>
                        <p className="text-sm text-zinc-500">
                          Por {enrollment.course.teacher.name}
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-emerald-500/20 text-emerald-400">
                      Inscrito
                    </Badge>
                  </div>
                  {enrollment.course.description && (
                    <CardDescription className="mt-2">
                      {enrollment.course.description}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {enrollment.course.weeks.map((week: EnrollmentWithCourse['course']['weeks'][0]) => (
                      <Link
                        key={week.id}
                        href={`/aluno/cursos/${enrollment.course.id}?semana=${week.weekNumber}`}
                        className="p-4 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 transition-colors group"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-semibold text-white group-hover:text-emerald-400 transition-colors">
                            Semana {week.weekNumber}
                          </h3>
                          <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-emerald-400 transition-colors" />
                        </div>
                        <div className="space-y-2">
                          {week.days.map((day: EnrollmentWithCourse['course']['weeks'][0]['days'][0]) => (
                            <div key={day.id} className="flex items-center justify-between text-sm">
                              <span className="text-zinc-400">{day.name}</span>
                              <span className="text-zinc-600">{day._count.exercises} exercícios</span>
                            </div>
                          ))}
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
